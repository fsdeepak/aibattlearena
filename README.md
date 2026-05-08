# ⚔️ AI Battle Arena

> **Pit two AI models against each other — side by side — and let a third AI judge the winner.**

AI Battle Arena is a full-stack application that lets you submit any problem/prompt to **two AI models simultaneously**, then uses a **neutral LLM judge** to score and reason about both responses — all orchestrated through a **LangGraph** state machine.

---

## 🧠 How It Works

```
User Prompt
     │
     ▼
┌─────────────────────────────────────┐
│         LangGraph State Machine      │
│                                     │
│  ┌────────────┐  ┌────────────────┐ │
│  │  Model 1   │  │   Model 2      │ │
│  │ (Fighter 1)│  │  (Fighter 2)   │ │
│  └─────┬──────┘  └───────┬────────┘ │
│        │  parallel invoke │         │
│        └────────┬─────────┘         │
│                 ▼                   │
│         ┌─────────────┐             │
│         │  Judge Node  │             │
│         │ (Gemini 3)  │             │
│         └──────┬──────┘             │
└────────────────┼────────────────────┘
                 ▼
         Scored + Reasoned Result
```

1. **You** pick two AI models from different providers (Google, Mistral, Cohere)
2. **Both models** respond in parallel to your prompt
3. **A Gemini judge** scores each response out of 10 with detailed reasoning
4. **The UI** renders both answers side-by-side with live scores

---

## 🗂️ Project Structure

```
aibattlearena/
├── backend/                    # Express + TypeScript API
│   ├── src/
│   │   ├── app.ts              # Express routes & middleware setup
│   │   ├── config/
│   │   │   └── config.ts       # Env variable loader
│   │   ├── middleware/
│   │   │   └── tracker.ts      # Request tracking middleware
│   │   └── services/
│   │       ├── graph.service.ts # LangGraph orchestration (core logic)
│   │       └── modes.service.ts # AI model factory (provider abstraction)
│   ├── server.ts               # Entry point — starts Express server
│   ├── dockerfile
│   └── package.json
│
├── frontend/                   # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx         # Main arena UI, model selection, battle logic
│   │   │   └── App.css         # Arena styles
│   │   └── components/
│   │       ├── SolutionPanel   # Displays each model's response + score
│   │       ├── Judge           # Renders judge scores & reasoning
│   │       └── Popup           # Welcome/info popup
│   ├── nginx.conf              # Nginx reverse proxy config (for Docker)
│   ├── dockerfile
│   └── package.json
│
├── docker-compose.yml          # Local Docker orchestration
├── render.yaml                 # Render.com deployment config
└── README.md
```

---

## 🧩 Tech Stack

| Layer                | Technology                        |
| -------------------- | --------------------------------- |
| **Frontend**         | React 19, Vite 7, Tailwind CSS 4  |
| **Backend**          | Node.js, Express 5, TypeScript    |
| **AI Orchestration** | LangGraph, LangChain              |
| **AI Providers**     | Google Gemini, Mistral AI, Cohere |
| **Validation**       | Zod                               |
| **Containerization** | Docker, Docker Compose            |
| **Deployment**       | Render.com                        |

---

## 🤖 Supported Models

| Provider    | Models                                              |
| ----------- | --------------------------------------------------- |
| **Google**  | Gemini 3 Flash, Gemini 3.1 Pro                      |
| **Mistral** | Mistral Small 4, Mistral Large 3, Devstral 2 (Code) |
| **Cohere**  | Command A, Command R (Legacy)                       |

> The **Judge** always runs on `gemini-3-flash-preview` for consistent, fast evaluations.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20`
- npm
- API keys for the AI providers you intend to use

### 1. Clone the Repository

```bash
git clone https://github.com/fsdeepak/aibattlearena.git
cd aibattlearena
```

### 2. Configure the Backend

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
GOOGLE_API_KEY=your_google_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
COHERE_API_KEY=your_cohere_api_key
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run in Development

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Then open your browser at **[http://localhost:5173](http://localhost:5173)**

---

## 🐳 Docker (Local)

Run both services with Docker Compose:

```bash
docker-compose up --build
```

The app will be available at **[http://localhost:80](http://localhost:80)**

> The frontend Nginx container proxies `/api/*` requests to the backend service over the internal Docker network — no CORS issues.

---

## ☁️ Deploying to Render.com

This project includes a `render.yaml` for one-click Infrastructure-as-Code deployment.

1. Fork this repo and connect it to your [Render](https://render.com) account
2. Render will detect `render.yaml` and create both services automatically
3. Set your API keys in the **Render Dashboard** → Environment Variables:
   - `GOOGLE_API_KEY`
   - `MISTRAL_API_KEY`
   - `COHERE_API_KEY`

---

## 📡 API Reference

### `POST /api/invoke`

Triggers an AI battle between two models.

**Request Body:**

```json
{
  "input": "Write a Python function to reverse a linked list",
  "m1": { "provider": "google", "name": "gemini-3-flash-preview" },
  "m2": { "provider": "mistral", "name": "mistral-small-latest" }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Graph executed successfully",
  "result": {
    "problem": "...",
    "solution_1": "...",
    "solution_2": "...",
    "judge": {
      "solution_1_score": 8,
      "solution_2_score": 7,
      "solution_1_reasoning": "Clear explanation, edge cases handled...",
      "solution_2_reasoning": "Correct but missing type hints..."
    }
  }
}
```

**Supported Providers:** `google` | `mistral` | `cohere`

---

## 🏗️ Architecture Deep Dive

### Why LangGraph?

Instead of a simple sequential call chain, LangGraph models the pipeline as a **directed state graph**:

```
START → solution (parallel) → judge_node → END
```

This gives you:

- **Structured state** — Zod-validated at every node transition
- **Parallel execution** — Both models are invoked with `Promise.all` in `solutionNode`
- **Composability** — Easy to add nodes (e.g., retry logic, caching, streaming)

### Model Factory Pattern

`modes.service.ts` implements a **factory pattern** — the `modelFactory(provider, name)` function returns the correct LangChain chat model. Adding a new provider is a single `case` block.

### Nginx Reverse Proxy

In production (Docker / Render), the frontend Nginx server acts as a reverse proxy:

- `/api/*` → forwarded to the backend container
- Everything else → served from the React build

This means the frontend and backend share the same origin in production, **eliminating CORS complexity entirely**.

---

## 🔐 Security Notes

- API keys are loaded via environment variables — **never hardcode them**
- In production, remove the `error: error?.message` field from the `/api/invoke` error response to avoid leaking internal details
- Validate and sanitize user input before passing it to LLMs to prevent prompt injection

---

## 📜 License

ISC

---

_Built with ⚔️ by a developer who wanted to know which AI wins._
