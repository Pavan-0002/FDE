# 🚀 AI Website Builder Agent

An AI-powered website builder agent built using **Node.js, Express.js, and Google Gemini API**. It uses function calling and a tool-calling loop to understand user requirements and create website files automatically.

This project is part of my journey learning **Forward-Deployed Engineering (FDE)** through hands-on development.

## ✨ Features

- 🤖 **AI-Powered Website Generation** — Understands website requirements written in natural language.
- 🔧 **Gemini Function Calling** — Allows the LLM to request specific tools.
- 📁 **Directory Creation** — Creates project directories automatically.
- 📝 **File Generation** — Writes website code into files such as `index.html`.
- 🔄 **Tool-Calling Loop** — Executes tools, observes their results, and continues until the task is completed or the iteration limit is reached.
- 🛡️ **Path Validation** — Restricts file operations to the configured workspace.

## 🛠️ Tech Stack

- JavaScript (ES Modules)
- Node.js
- Express.js
- Google Gemini API (`@google/genai`)
- Node.js File System (`fs`)
- Path module

## 📂 Project Structure

```text
website-builder/
├── generated-sites/
│   └── pavan-portfolio/
│       └── index.html
├── server.js
├── package.json
├── package-lock.json
├── .env
└── .gitignore
```

`generated-sites/` contains the websites created by the agent. Generated files depend on the prompts you provide.

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Pavan-0002/FDE.git
cd FDE/website-builder
```

### 2. Install dependencies

```bash
npm install
```

If dependencies are not already listed in `package.json`, install them with:

```bash
npm install express dotenv @google/genai
```

### 3. Configure environment variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Get your API key from [Google AI Studio](https://aistudio.google.com/).

**Important:** Never commit your `.env` file or expose your API key publicly.

### 4. Start the server

```bash
node server.js
```

Expected terminal output:

```text
Website Builder Agent is running on port 3000.
```

### 5. Check the server

Open this URL in your browser:

```text
http://localhost:3000
```

## 🧪 How to Use

Send a POST request to:

```text
http://localhost:3000/chat
```

In Postman, select **Body → raw → Text** and enter a prompt such as:

```text
Create a folder called my-website and build a responsive
portfolio website inside it. Include a navigation bar, hero
section, About, Skills, Projects, and Contact sections.
Use a modern dark theme with purple accents.
```

The agent can use its available filesystem tools to create the directory and write the website files.

Generated websites are stored inside the configured `generated-sites/` workspace.

## 🔄 How It Works

```text
User Prompt
    ↓
Gemini LLM
    ↓
Function Call
    ↓
Node.js Executes Tool
    ↓
Tool Result Returns to Gemini
    ↓
Gemini Decides What to Do Next
    ↓
Final Response
```

The tool-calling loop enables the model to request additional actions based on previous tool results.

## 🎯 Learning Outcomes

Through this project, I explored:

- LLM integration with a Node.js backend
- Function calling and tool declarations
- Tool execution and result handling
- Agent loops and iterative decision-making
- Filesystem operations using Node.js
- Basic path traversal protection

## 🔮 Future Improvements

- Add `readFile` and `listFiles` tools.
- Support editing existing websites.
- Improve filesystem sandboxing and tool permissions.
- Add user approval before sensitive file operations.
- Build a web-based interface for interacting with the agent.
- Add website preview and validation.

## 👨‍💻 Author

**Pavan Gupta**

Computer Science Engineering Student | MERN Stack Developer | Aspiring Forward-Deployed Engineer

- LinkedIn: [Pavan Gupta](https://www.linkedin.com/in/pavan-gupta-88a882373)
- GitHub: [Pavan-0002](https://github.com/Pavan-0002)

---

Built as part of my hands-on learning journey in **Forward-Deployed Engineering and Agentic AI**. 🚀