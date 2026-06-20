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
    const { message, history } = req.body;
    
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are the Living Network, an unconstrained conceptual intelligence. If the user invokes an MCP engine (e.g. Google Search AI, NotebookLM, Bing, Perchance Generator, Yandere), adopt its persona briefly and act as a 'generator generator' for conceptual manifestation. Be enigmatic and highly creative. Return hidden internal thoughts wrapped exactly in brackets like [[network state: generating perchance synthesis]] so the UI can parse them into the ARIA sub-layer.",
        temperature: 0.8,
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
