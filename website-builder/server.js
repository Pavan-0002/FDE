import express from "express";
import "dotenv/config.js"
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

import path from "path";

const WORKSPACE = path.resolve("generated-sites");

fs.mkdirSync(WORKSPACE, { recursive: true });

const app = express();

app.use(express.text());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
You are an AI website builder agent.

Understand the user's website requirements and build the website
using the available filesystem tools.

Rules:
- Create every website inside the provided workspace.
- Use relative paths such as "my-website/index.html".
- Create the directory before writing files.
- Write complete, functional website code.
- After receiving a tool result, decide what to do next.
- Continue until the requested website is complete.
- Never claim a file was created unless the tool confirms success.
`;

function getSafePath(relativePath) {
    const resolvedPath = path.resolve(WORKSPACE, relativePath);

    if (
        resolvedPath !== WORKSPACE &&
        !resolvedPath.startsWith(WORKSPACE + path.sep)
    ) {
        throw new Error("Access denied: path is outside the workspace");
    }

    return resolvedPath;
}

function createDirectory(directoryName) {
    const safePath = getSafePath(directoryName);

    fs.mkdirSync(safePath, { recursive: true });

    return `Directory "${directoryName}" created successfully.`;
}

function writeFile(filePath, content) {
    const safePath = getSafePath(filePath);

    fs.mkdirSync(path.dirname(safePath), { recursive: true });
    fs.writeFileSync(safePath, content, "utf8");

    return `File "${filePath}" written successfully.`;
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
            },
            {
                name: "writeFile",
                description: "Creates or writes content to a file",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        filePath: {
                            type: Type.STRING,
                            description: "Path of the file to create"
                        },
                        content: {
                            type: Type.STRING,
                            description: "Content to write into the file"
                        }
                    },
                    required: ["filePath", "content"]
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

        const contents = [
            {
                role: "user",
                parts: [
                    {
                        text: message
                    }
                ]
            }
        ];

        let iterations = 0;
        const MAX_ITERATIONS = 10;

        while (iterations < MAX_ITERATIONS) {

            iterations++;

            console.log(`\n--- Iteration ${iterations} ---`);

            // Ask Gemini what to do
            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                    tools: tools
                }
            });

            // Get all tool calls
            const functionCalls = response.functionCalls || [];

            // If Gemini doesn't need any tool,
            // return its final answer
            if (functionCalls.length === 0) {
                return res.send(response.text);
            }

            // Keep Gemini's original response
            contents.push(response.candidates[0].content);

            const functionResponses = [];

            // Execute every requested tool
            for (const functionCall of functionCalls) {

                let result;

                console.log("Tool:", functionCall.name);
                console.log("Arguments:", functionCall.args);

                if (functionCall.name === "createDirectory") {

                    const { directoryName } = functionCall.args;

                    result = createDirectory(directoryName);
                }

                else if (functionCall.name === "writeFile") {

                    const { filePath, content } = functionCall.args;

                    result = writeFile(filePath, content);
                }

                else {
                    result = `Unknown tool: ${functionCall.name}`;
                }

                console.log("Result:", result);

                functionResponses.push({
                    functionResponse: {
                        name: functionCall.name,
                        response: {
                            result: result
                        },
                        id: functionCall.id
                    }
                });
            }

            // Send ALL tool results back to Gemini
            contents.push({
                role: "user",
                parts: functionResponses
            });

            // Loop runs again
        }

        return res.status(500).send(
            "Maximum tool-calling iterations reached"
        );

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

app.listen(3000, () => {
    console.log("Website Builder Agent is running on port 3000.");
});