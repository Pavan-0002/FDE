import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
    const result = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: "An astronaut stranded on Mars uses science and ingenuity to survive.",
    });

    const embedding = result.embeddings[0].values;

    console.log("Embedding dimensions:", embedding.length);
    console.log("First 10 values:", embedding.slice(0, 10));
}

main().catch(console.error);