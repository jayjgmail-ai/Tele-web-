import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini API client if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // API endpoint for AI Sports Coach & Scouting Analysis
  app.post('/api/ai-coach', async (req, res) => {
    try {
      const { prompt, athleteData, partnerData } = req.body ?? {};

      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'A valid prompt is required.' });
      }

      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured. Please check your API key in Settings > Secrets.',
        });
      }

      const systemInstruction = "You are the Head AI Coach & Director of Sports Science at Telesports Academy, a world-class elite sports management and training institution. You provide professional, tactical, encouraging, and scientifically sound training plans, scouting reports, nutrition guidance, and match analysis.";

      let fullPrompt = prompt.trim();
      if (partnerData) {
        fullPrompt = `Partner School / Organization: ${JSON.stringify(partnerData)}\n\nQuery/Task: ${fullPrompt}`;
      } else if (athleteData) {
        fullPrompt = `Athlete Profile: ${JSON.stringify(athleteData)}\n\nQuery/Task: ${fullPrompt}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: fullPrompt,
        config: {
          systemInstruction,
        },
      });

      res.json({ response: response.text || 'No response generated.' });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const status = typeof error?.status === 'number' ? error.status : 500;
      res.status(status).json({ error: error?.message || 'Failed to generate AI response' });
    }
  });

  // Vite middleware for frontend development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Telesports Academy server running on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
