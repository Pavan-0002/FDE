
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateEmbedding(text) {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
  });

  return result.embeddings[0].values;
}
