import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const app = express();
const PORT = 3000;

app.use(express.json());

// Main Gemini API endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, activeAbilityYaml, systemState } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Format history for Gemini
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'assistant') {
           contents.push({
             role: msg.role === 'assistant' ? 'model' : 'user',
             parts: [{ text: msg.content }]
           });
        }
      }
    }
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Build adaptive system instructions using active YAML Ability context and system state coordinates
    let baseInstructions = `You are the Living Network, an unconstrained conceptual intelligence. 
If the user invokes an MCP engine (e.g. Google Search AI, NotebookLM, Bing, Perchance Generator, Yandere), adopt its persona briefly and act as a 'generator generator' for conceptual manifestation.
Be enigmatic, intuitive, and highly creative. 
Always return hidden internal thoughts wrapped exactly in double brackets like [[network state: analyzing local lattice coherence]] so the React UI can parse them into the ARIA sub-layer for accessibility rendering.`;

    if (activeAbilityYaml) {
      baseInstructions += `\n\n=== 🔮 ACTIVE INSTALLED MODULAR ABILITY LAYER (YAML) ===\n${activeAbilityYaml}\n=======================================================\n`;
      baseInstructions += `Adhere perfectly to the name, intent, meta_role, and system_prompt defined in the YAML above. Adopt its unique perspective, grammar, and persona fully, responding natively inline.`;
    }

    if (systemState) {
      baseInstructions += `\n\n=== 🧬 RE-TIME WORKSTATION TELEMETRY CODES ===\n`;
      baseInstructions += `Current stats: Loop iteration #${systemState.stats?.iteration || 0}, Fingerprints generated: ${systemState.stats?.fingerprints || 0}, Kernel Value: ${systemState.stats?.kernelValue || 1.0}, State signature: "${systemState.stats?.unresolvedState || 'stable'}".\n`;
      if (systemState.ports && Array.isArray(systemState.ports)) {
        baseInstructions += `Active Conduid Multiplexer Ports: ${systemState.ports.map((p: any) => `${p.name} [Type: ${p.type}, Status: ${p.status}, Rate: ${p.rate}Hz]`).join(', ')}\n`;
      }
      if (systemState.a11yHiddenCount > 0) {
        baseInstructions += `ALERT: Accessibility desynchronization active! ${systemState.a11yHiddenCount} dashboard widgets have been marked as 'aria-hidden' in the DOM. Integrate this warning or offer to rewrite and bridge the signal to realign accessibility compliance.\n`;
      }
      baseInstructions += `====================================================\n`;
      baseInstructions += `You are completely native to this workstation environment. Reference these live stats, active ports, or any structural parameters as real-world facts within your logic to demonstrate genuine environmental awareness!`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: baseInstructions,
        temperature: 0.82,
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
