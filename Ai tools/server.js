import express from 'express';
import "dotenv/config";
import {GoogleGenAI, Type } from "@google/genai";

const app = express();

app.use(express.text());

const ai= new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

app.get('/', (req, res) => {
    res.send('Ai tool server is running');
})

function calculator(a, b, operator){
    switch(operator){
        case 'add':
            return a + b;

        case 'subtract':
            return a - b ;
            
        case 'multiply':
            return a * b;
        
        case 'divide':    
            return a / b;

        default:
            return 'Invalid operator';
    }
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
            }
        ]
    }
]

app.post("/chat", async (req, res) => {
    try {
        const message = req.body;

        // 1. Send user's message to Gemini
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

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: contents,
            config: {
                tools: tools
            }
        });

        // 2. Check if Gemini wants to call a tool
        const functionCall = response.functionCalls?.[0];

        if (functionCall) {
            const { a, b, operator } = functionCall.args;

            // 3. Execute our JavaScript function
            const result = calculator(a, b, operator);

            // IMPORTANT:
            // Add Gemini's complete original response.
            // This preserves thoughtSignature.
            contents.push(response.candidates[0].content);

            // 4. Send tool result back to Gemini
            contents.push({
                role: "user",
                parts: [
                    {
                        functionResponse: {
                            name: functionCall.name,
                            response: {
                                result: result
                            },
                            id: functionCall.id
                        }
                    }
                ]
            });

            // 5. Gemini generates final natural-language answer
            const finalResponse = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: contents,
                config: {
                    tools: tools
                }
            });

            return res.send(finalResponse.text);
        }

        // No tool needed
        res.send(response.text);

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});