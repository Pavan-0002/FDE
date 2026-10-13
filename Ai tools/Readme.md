# AI Tools & Function Calling with Gemini

A hands-on project built while learning **Forward-Deployed Engineering (FDE)**. This project explores how Large Language Models (LLMs) use tools to perform operations through function calling with Node.js, Express, JavaScript, and Google's Gemini API.

## 🚀 Overview

An LLM can understand natural language and generate responses, but it needs tools to interact with external systems and execute operations.

This project demonstrates how Gemini can select a tool, generate structured arguments, let the application execute the corresponding JavaScript function, and use the returned result to produce a final answer.

**Core concept:** 🧠 LLM = Brain | 🛠️ Tools = Hands

## ✨ Features

- **Calculator Tool** — Performs arithmetic operations through function calling.
- **Mock Weather Tool** — Returns predefined weather information for Mumbai, Delhi, Pune, and Bangalore.
- **Function Calling** — Converts natural-language requests into structured tool calls.
- **Multiple Tool Calls** — Supports requests that require multiple operations.
- **Tool-Calling Loop** — Sends tool results back to Gemini so it can decide whether another tool is needed.
- **Information Tools** — Demonstrates retrieving information using available functions.
- **AI Agent Fundamentals** — Explores the Goal → Decide → Act → Observe cycle.

## 🧰 Tech Stack

- Node.js
- Express.js
- JavaScript (ES Modules)
- Google Gemini API
- `@google/genai`
- dotenv
- Postman

## 📁 Project Structure

```text
Ai tools/
├── server.js
├── package.json
├── package-lock.json
├── .env
└── .gitignore
```

*Your actual project structure may vary.*

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Pavan-0002/FDE.git
cd FDE
```

### 2. Navigate to the project

```bash
cd "Ai tools"
```

### 3. Install dependencies

```bash
npm install
```

If the required packages are not already listed in `package.json`, install them:

```bash
npm install express dotenv @google/genai
```

### 4. Configure environment variables

Create a `.env` file in the project directory:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Get your API key from [Google AI Studio](https://aistudio.google.com/).

**Security:** Never commit your `.env` file or expose your API key in a public repository.

### 5. Start the server

```bash
node server.js
```

The server will run on the port configured in your code, for example, `3000`.

## 🌦️ Mock Weather Tool

The project includes a simple JavaScript weather function that returns predefined data:

```javascript
function getWeather(city) {
    const weatherData = {
        Mumbai: "32°C, Sunny",
        Delhi: "28°C, Clear",
        Pune: "25°C, Cloudy",
        Bangalore: "22°C, Rainy"
    };

    return weatherData[city] || "Weather data not available";
}
```

This demonstrates how an LLM can request a tool call and receive a result from application code.

**Note:** These weather values are hardcoded examples, not live weather readings.

## 🧪 Testing with Postman

Send a request to your local server using Postman.

- **Method:** `POST`
- **URL:** `http://localhost:3000/chat`
- **Body:** Use the format expected by your Express endpoint.

Example prompts:

```text
Calculate 25 multiplied by 4.
```

```text
What's the weather in Mumbai?
```

```text
Calculate 25 multiplied by 4, then add 10 to the result.
```

The exact output depends on your implementation and the tools Gemini chooses to call.

## 🔄 How the Tool-Calling Loop Works

```text
        User Request
             ↓
     Gemini analyzes request
             ↓
      Selects required tool
             ↓
    Application executes function
             ↓
       Tool returns result
             ↓
   Result sent back to Gemini
             ↓
   Another tool call if needed
             ↓
       Final response
```

The application executes the actual JavaScript functions. Gemini requests tool calls; it does not directly execute your server-side code.

## 🧠 Key Learnings

Through this project, I explored:

- Why LLMs need tools to perform operations.
- How function declarations describe available tools.
- How natural-language requests become structured arguments.
- How applications execute tool calls.
- How tool results are returned to the model.
- How multiple tool calls can solve a single request.
- How iterative tool calling forms the foundation of AI agents.

## 🔮 Future Improvements

- Connect the mock weather tool to a live weather API.
- Add currency conversion and more useful tools.
- Implement persistent conversation history.
- Improve input validation and error handling.
- Add tool permissions and approval for sensitive actions.
- Explore filesystem tools for an AI website-builder agent.

## 🎯 Learning Journey

This project is part of my **Forward-Deployed Engineering learning journey**, progressing from basic LLM applications toward practical AI agents that use tools and interact with external systems.

## 👨‍💻 Author

**Pavan Gupta**

- LinkedIn: https://www.linkedin.com/in/pavan-gupta-88a882373
- GitHub: https://github.com/Pavan-0002

---

⭐ Thanks for checking out this project! I'm continuing to explore AI engineering, tool calling, and agentic systems as part of my FDE journey.
