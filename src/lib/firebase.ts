import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  linkWithPopup,
  signInWithCredential,
  User,
  Auth
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  collection,
  getDocs,
  query,
  where,
  writeBatch,
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import config from "../../firebase-applet-config.json";

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

export const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);

// Use persistent local cache to support offline persistence natively
// Reference firestoreDatabaseId explicitly as instructed by firebase-integration skill
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
}, config.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

/**
 * Robustly catches Firestore access permission errors and wraps them
 * into the required JSON representation for system self-diagnostics.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  const stringifiedError = JSON.stringify(errInfo);
  console.error('Firestore Error: ', stringifiedError);
  throw new Error(stringifiedError);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function login() {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  } catch (error) {
    console.error("Auth error:", error);
    throw error;
  }
}

/**
 * Initializes and ensures an active authenticated session exists.
 * If no user is logged in, it silently signs them in anonymously.
 */
export async function ensureSeamlessUserSession(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Stop listening immediately to prevent duplicate runs
      
      if (user) {
        console.log(`[Auth] Active session found: ${user.uid} (Anonymous: ${user.isAnonymous})`);
        resolve(user);
      } else {
        try {
          console.log("[Auth] No active session. Initializing silent anonymous login...");
          const userCredential = await signInAnonymously(auth);
          console.log(`[Auth] Seamless anonymous login success. UID: ${userCredential.user.uid}`);
          resolve(userCredential.user);
        } catch (error) {
          console.warn("[Auth] Anonymous sign-in is restricted by administrator policies, triggering local bypass mode.", error);
          reject(error);
        }
      }
    });
  });
}

/**
 * Seamlessly upgrades the active anonymous session to a permanent Google Account.
 * This links the user's current session (and Firestore data) to their Google identity.
 */
export async function upgradeAnonymousToGoogleAccount(): Promise<{ user: User; linked: boolean }> {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error("No active user session found to upgrade. Ensure user is logged in anonymously first.");
  }

  if (!currentUser.isAnonymous) {
    console.log("[Auth] User is already authenticated with a permanent account.");
    return { user: currentUser, linked: true };
  }

  try {
    console.log("[Auth] Upgrading anonymous account via Google Sign-In linking...");
    const result = await linkWithPopup(currentUser, googleProvider);
    const user = result.user;
    console.log(`[Auth] Successfully linked and upgraded account! UID: ${user.uid}`);
    
    // Create permanent user profile in Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastSeen: serverTimestamp()
      }, { merge: true });
    } catch (dbErr) {
      console.error("[Auth] Error writing upgraded user record to Firestore", dbErr);
    }
    
    return { user, linked: true };
  } catch (error: any) {
    if (error.code === 'auth/credential-already-in-use') {
      console.warn(
        "[Auth] This Google account is already linked to another Firebase user. " +
        "We must offer the option to switch to that user, and migrate the anonymous session's thread messages."
      );
      
      // We throw a structured custom error so the UI can prompt the user to Switch and Migrate
      const customErr = new Error("auth/credential-already-in-use");
      (customErr as any).credential = GoogleAuthProvider.credentialFromError(error);
      throw customErr;
    } else {
      console.error("[Auth] Error linking Google credential:", error);
      throw error;
    }
  }
}

/**
 * Switches the auth identity directly to the existing Google account credential,
 * and seamlessly merges thread messages from the previous anonymous session to the new user.
 */
export async function switchAndMergeSession(anonymousUid: string, credential: any): Promise<User> {
  console.log(`[Auth] Initiating switch and session merge: ${anonymousUid} -> Google`);
  
  // 1. Fetch the temporary messages created by the anonymous user first
  // so we can transfer ownership to the permanent account!
  let temporaryMessages: any[] = [];
  try {
    const q = query(collection(db, 'messages'), where('userId', '==', anonymousUid));
    const snapshot = await getDocs(q);
    temporaryMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`[Auth] Found ${temporaryMessages.length} temporary message documents to migrate.`);
  } catch (err) {
    console.error("[Auth] Failed to pre-fetch temporary messages for migration across accounts:", err);
  }

  // 2. Perform direct sign-in with Google Credential
  const userCredential = await signInWithCredential(auth, credential);
  const targetUser = userCredential.user;
  console.log(`[Auth] Switched identity to permanent Google account. New UID: ${targetUser.uid}`);

  // Create or update permanent user profile
  try {
    await setDoc(doc(db, 'users', targetUser.uid), {
      email: targetUser.email,
      displayName: targetUser.displayName,
      photoURL: targetUser.photoURL,
      lastSeen: serverTimestamp()
    }, { merge: true });
  } catch (dbErr) {
    console.error("[Auth] Error writing switched user record to Firestore", dbErr);
  }

  // 3. Migrate the pre-fetched messages to the new authenticated user
  if (temporaryMessages.length > 0) {
    try {
      console.log(`[Auth] Migrating ${temporaryMessages.length} messages to Google UID: ${targetUser.uid}`);
      const batch = writeBatch(db);
      
      temporaryMessages.forEach(msg => {
        // Rewrite document with the new Google user ID, ensuring their persistence has continuity
        const docRef = doc(db, 'messages', msg.id);
        batch.set(docRef, {
          ...msg,
          userId: targetUser.uid
        }, { merge: true });
      });

      await batch.commit();
      console.log(`[Auth] Successfully migrated all temporary messages to user ${targetUser.uid}`);
    } catch (migErr) {
      console.error("[Auth] Message data migration failed", migErr);
    }
  }

  return targetUser;
}
