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

app.post('/chat', async (req, res) => {
    try {
        const  message  = req.body;

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: message,
            config: {
                tools: tools
            }
        });

        res.json({
            response: response.text,
            functionCalls: response.functionCalls
        });

        } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Something went wrong"
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});