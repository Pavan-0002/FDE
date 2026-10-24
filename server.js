import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.text());
app.use(express.static("public"));

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

        conversationHistory.push({
            role: "user",
            parts: [{ text: userMessage }]
        });

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Transfer-Encoding", "chunked");

        const stream = await ai.models.generateContentStream({
            model: "gemini-3.8-flash",
            contents: conversationHistory,
            config: {
                systemInstruction:
                    "You are Tomato AI Support. Only answer questions related to Tomato food orders, delivery, payments, refunds, cancellations, and restaurant support."
            }
        });

        let assistantReply = "";

        for await (const chunk of stream) {
            const text = chunk.text || "";

            if (text) {
                assistantReply += text;
                res.write(text);
            }
        }

        conversationHistory.push({
            role: "model",
            parts: [{ text: assistantReply }]
        });

        res.end();

    } catch (error) {
        console.error("Streaming error:", error);

        if (!res.headersSent) {
            res.status(500).send("Something went wrong.");
        } else {
            res.end();
        }
    }
});


app.post("/reset", (req, res) => {
    conversationHistory.length = 0; 
    res.send("Conversation reset.");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});