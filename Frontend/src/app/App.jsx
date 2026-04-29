import "./App.css";
import { useState, useRef } from "react";
import SolutionPanel from "../components/SolutionPanel";
import JudgePanel from "../components/Judge";
import axios from "axios";

const MODELS_REGISTRY = {
  google: [
    { id: "gemini-3-flash-preview", label: "Gemini 3 Flash" }, // Added -preview
    { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro" }, // Added -preview
  ],
  mistral: [
    { id: "mistral-small-latest", label: "Mistral Small 4" },
    { id: "mistral-large-latest", label: "Mistral Large 3" },
    { id: "devstral-2512", label: "Devstral 2 (Code)" },
  ],
  cohere: [
    { id: "command-a", label: "Command A" },
    { id: "command-r-08-2024", label: "Command R (Legacy)" },
  ],
};

const App = () => {
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Standardized State Names
  const [model1, setModel1] = useState({
    provider: "google",
    name: "gemini-3-flash-preview",
  });
  const [model2, setModel2] = useState({
    provider: "mistral",
    name: "mistral-small-latest",
  });

  const handleBattle = async () => {
    if (!problem.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("/api/invoke", {
        input: problem,
        m1: model1, // Matches backend: const { input, m1, m2 } = req.body;
        m2: model2,
      });

      setResult(response.data.result);
      setProblem("");
    } catch (err) {
      console.error("Battle failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBattle();
    }
  };

  return (
    <div className="arena-root">
      <header className="arena-header">
        <div className="header-brand">
          <span className="header-title">⚔️ AI Battle Arena</span>
        </div>

        <div className="live-badge">
          <span className="live-dot" /> Live Battle
        </div>
      </header>

      {/* Model Selection UI */}
      <div className="flex items-center justify-around bg-white/5 rounded border h-18 border-white/10">
        {/* Model 1 Selector */}
        <div className="flex flex-col ">
          <span className="text-[18px] uppercase text-blue-400 font-bold mb-1">
            Fighter 1
          </span>
          <div className="flex gap-2">
            <select
              className="bg-zinc-900 text-xs border h-8 w-20 border-zinc-700 rounded px-1"
              value={model1.provider}
              onChange={(e) =>
                setModel1({
                  provider: e.target.value,
                  name: MODELS_REGISTRY[e.target.value][0].id,
                })
              }
            >
              {Object.keys(MODELS_REGISTRY).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              className="bg-zinc-900 text-xs border border-zinc-700 rounded px-1"
              value={model1.name}
              onChange={(e) => setModel1({ ...model1, name: e.target.value })}
            >
              {MODELS_REGISTRY[model1.provider].map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-zinc-500 italic font-black text-sm">VS</div>

        {/* Model 2 Selector */}
        <div className="flex flex-col">
          <span className="text-[18px] uppercase text-green-400 font-bold mb-1">
            Fighter 2
          </span>
          <div className="flex gap-2">
            <select
              className="bg-zinc-900 h-8 w-20 text-xs border border-zinc-700 rounded px-1"
              value={model2.provider}
              onChange={(e) =>
                setModel2({
                  provider: e.target.value,
                  name: MODELS_REGISTRY[e.target.value][0].id,
                })
              }
            >
              {Object.keys(MODELS_REGISTRY).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              className="bg-zinc-900 text-xs border border-zinc-700 rounded px-1"
              value={model2.name}
              onChange={(e) => setModel2({ ...model2, name: e.target.value })}
            >
              {MODELS_REGISTRY[model2.provider].map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="arena-body">
        <SolutionPanel
          title={`Model 1 (${model1.name})`}
          icon="🤖"
          nameClass="panel-name-alpha"
          panelClass="panel-alpha"
          score={result?.judge?.solution_1_score}
          content={result?.solution_1}
          loading={loading}
          emptyLabel="Awaiting Fighter 1..."
        />

        <JudgePanel
          judge={result?.judge}
          loading={loading}
          hasResult={!!result}
        />

        <SolutionPanel
          title={`Model 2 (${model2.name})`}
          icon="🤖"
          nameClass="panel-name-beta"
          panelClass="panel-beta"
          score={result?.judge?.solution_2_score}
          content={result?.solution_2}
          loading={loading}
          emptyLabel="Awaiting Fighter 2..."
        />
      </main>

      <footer className="arena-footer">
        {result?.problem && (
          <div className="history-hint">
            <span className="text-blue-500 mr-2">▶</span> {result.problem}
          </div>
        )}
        <div className="input-bar">
          <input
            ref={inputRef}
            className="problem-input"
            type="text"
            placeholder="Challenge the AIs... (e.g. Write a regex to validate emails in JS)"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="battle-btn"
            onClick={handleBattle}
            disabled={loading || !problem.trim()}
          >
            {loading ? "⚔️ Battling..." : "⚡ Battle!"}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
