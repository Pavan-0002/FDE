import express from 'express';
import "dotenv/config";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();

app.use(express.text());

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

const systemInstruction = `
You are a helpful AI assistant.

Use the available tools whenever they are needed to complete the user's request.
After getting tool results, decide whether you need another tool.
When you have enough information, give the user a clear final answer.
`;

app.get('/', (req, res) => {
    res.send('Ai tool server is running');
})

function calculator(a, b, operator) {
    switch (operator) {
        case 'add':
            return a + b;

        case 'subtract':
            return a - b;

        case 'multiply':
            return a * b;

        case 'divide':
            return a / b;

        default:
            return 'Invalid operator';
    }
}

function getWeather(city) {
    const weatherData = {
        Mumbai: "32°C, Sunny",
        Delhi: "28°C, Clear",
        Pune: "25°C, Cloudy",
        Bangalore: "22°C, Rainy"
    };

    return weatherData[city] || "Weather data not available";
}

import fs from 'fs';

function saveNote(note) {
    fs.appendFileSync('notes.txt', note + '\n');

    return 'Note saved successfully';
}

const tools = [
    {
        functionDeclarations: [
            {
                name: "calculator",
                description: "Performs basic arithmetic calculations",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        a: {
                            type: Type.NUMBER,
                            description: "First number"
                        },
                        b: {
                            type: Type.NUMBER,
                            description: "Second number"
                        },
                        operator: {
                            type: Type.STRING,
                            enum: [
                                "add",
                                "subtract",
                                "multiply",
                                "divide"
                            ],
                            description: "Arithmetic operation"
                        }
                    },
                    required: ["a", "b", "operator"]
                }
            },

            {
                name: "getWeather",
                description: "Gets the current weather information for a city",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        city: {
                            type: Type.STRING,
                            description: "Name of the city"
                        }
                    },
                    required: ["city"]
                }
            },

            {
                name: "saveNote",
                description: "Saves a note to a local notes file",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        note: {
                            type: Type.STRING,
                            description: "The note that should be saved"
                        }
                    },
                    required: ["note"]
                }
            }

        ]
    }
];

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

        // Prevent an accidental infinite loop
        let iterations = 0;
        const MAX_ITERATIONS = 5;

        while (iterations < MAX_ITERATIONS) {

            iterations++;

            console.log(`\n--- Iteration ${iterations} ---`);

            // Ask Gemini what to do
            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: contents,
                config: {
                    tools: tools,
                    systemInstruction: systemInstruction
                }
            });

            // Get all tool calls from Gemini
            const functionCalls = response.functionCalls || [];

            // If Gemini does not need any tool,
            // it is ready with the final answer
            if (functionCalls.length === 0) {
                return res.send(response.text);
            }

            // Keep Gemini's complete response
            contents.push(response.candidates[0].content);

            // Store results of all requested tools
            const functionResponses = [];

            // Execute every tool Gemini requested
            for (const functionCall of functionCalls) {

                let result;

                console.log("Tool:", functionCall.name);
                console.log("Arguments:", functionCall.args);

                if (functionCall.name === "calculator") {

                    const { a, b, operator } = functionCall.args;

                    result = calculator(a, b, operator);
                }

                else if (functionCall.name === "getWeather") {

                    const { city } = functionCall.args;

                    result = getWeather(city);
                }

                else if (functionCall.name === "saveNote") {

                    const { note } = functionCall.args;

                    result = saveNote(note);
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

            // Send all tool results back to Gemini
            contents.push({
                role: "user",
                parts: functionResponses
            });

            // Loop starts again
        }

        return res.status(500).send(
            "Maximum tool-calling iterations reached"
        );

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});