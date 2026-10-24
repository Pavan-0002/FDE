
import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.text());
app.use(express.static("public"));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

let conversationHistory = [];

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

// Clear conversation history
app.post("/clear", (req, res) => {
    conversationHistory = [];
    res.send("Chat cleared successfully");
});

// Chat with streaming
app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body;

        if (!userMessage || userMessage.trim() === "") {
            return res.status(400).send("Message cannot be empty");
        }

        if (userMessage.length > 500) {
            return res.status(400).send("Message is too long.");
        }

        console.log("USER MESSAGE:", userMessage);

        conversationHistory.push({
            role: "user",
            parts: [{ text: userMessage }]
        });

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("X-Content-Type-Options", "nosniff");

        const stream = await ai.models.generateContentStream({
            model: "gemini-3.8-flash",
            contents: conversationHistory,
            config: {
                systemInstruction:
                    "You are Tomato AI Support. Only answer questions related to Tomato food orders, delivery, payments, refunds, cancellations, and restaurant support. Give answers in minimum words."
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
        console.error("Chat error:", error);

        if (!res.headersSent) {
            res.status(500).send("Something went wrong");
        } else {
            res.end();
        }
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
