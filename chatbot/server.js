import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.send("AI Chatbot Server is Running!");
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: userMessage
        });

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});