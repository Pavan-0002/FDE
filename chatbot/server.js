import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.text());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const conversationHistory = [];

app.get("/", (req, res) => {
    res.send("AI Chatbot Server is Running!");
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body;

        console.log("USER MESSAGE:", userMessage);
        console.log("TYPE:", typeof userMessage);

        conversationHistory.push({
            role: "user",
            parts: [{ text: userMessage }]
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: conversationHistory,
            config: {
                systemInstruction:
                    "You are Tomato AI Support. Only answer questions related to Tomato food orders, delivery, payments, refunds, cancellations, and restaurant support."
            }
        });

        conversationHistory.push({
            role: "model",
            parts: [{ text: response.text }]
        });

        res.send(response.text);

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});