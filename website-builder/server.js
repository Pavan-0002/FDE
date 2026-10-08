import express from "express";
import "dotenv/config.js"
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

const app = express();

app.use(express.text());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
You are an AI website builder agent.

Your job is to understand the user's website requirements
and use the available tools to build the website.

Use tools when necessary.
`;

function createDirectory(directoryName) {
    fs.mkdirSync(directoryName, { recursive: true });

    return `Directory "${directoryName}" created successfully.`;
}

const tools = [
    {
        functionDeclarations: [
            {
                name: "createDirectory",
                description: "Creates a new directory for the website project",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        directoryName: {
                            type: Type.STRING,
                            description: "Name of the directory to create"
                        }
                    },
                    required: ["directoryName"]
                }
            }
        ]
    }
];

app.get("/", (req, res) => {
    res.send("Website Builder Agent is running!.")
});

app.post("/chat", async (req, res) => {
    try {
        const message = req.body;

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: message,
            config: {
                systemInstruction: systemInstruction,
                tools: tools
            }
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall) {

            if (functionCall.name === "createDirectory") {

                const { directoryName } = functionCall.args;

                const result = createDirectory(directoryName);

                return res.send(result);
            }
        }

        res.send(response.text);

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

app.listen(3000, () => {
    console.log("Website Builder Agent is running on port 3000.");
});