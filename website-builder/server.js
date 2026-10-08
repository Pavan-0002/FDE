import express from "express";
import "dotenv/config.js"
import { GoogleGenAI, Type } from "@google/genai";

const app = express();

app.use(express.text());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
   // model: "gemini-3.8-flash
});

const systeminstructions = `
You are an AI website builder agent.

Your job is to understand the user's website requirements
and use the available tools to build the website.

Use tools when necessary.
`;

app.get("/", (req, res) => {
    res.send("Website Builder Agent is running!.")
});

app.listen(3000, () => {
    console.log("Website Builder Agent is running on port 3000.");
});