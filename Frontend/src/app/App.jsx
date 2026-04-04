import "./App.css";
import { useState, useRef } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import SolutionPanel from "../components/SolutionPanel";
import JudgePanel from "../components/Judge";

const DEMO_DATA = {
  problem: "Write an code for Factorial function in js",
  solution_1:
    'Here\'s a JavaScript function to calculate the factorial of a number using both **iterative** and **recursive** approaches:\n\n### 1. **Iterative Approach (Using a Loop)**\n```javascript\nfunction factorialIterative(n) {\n    if (n < 0) return "Factorial is not defined for negative numbers";\n    if (n === 0 || n === 1) return 1;\n\n    let result = 1;\n    for (let i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\nconsole.log(factorialIterative(5)); // Output: 120\n```\n\n### 2. **Recursive Approach (Function calls itself)**\n```javascript\nfunction factorialRecursive(n) {\n    if (n < 0) return "Factorial is not defined for negative numbers";\n    if (n === 0 || n === 1) return 1;\n\n    return n * factorialRecursive(n - 1);\n}\n\nconsole.log(factorialRecursive(5)); // Output: 120\n```\n\n### **Key Notes:**\n- **Base Case:** `0! = 1` and `1! = 1`.\n- **Edge Case:** Factorial is not defined for negative numbers.\n- **Recursion vs Iteration:**\n  - **Recursion** is elegant but may cause a stack overflow for very large `n`.\n  - **Iteration** is more efficient for large numbers.\n\nWould you like an optimized version (e.g., using memoization)? 😊',
  solution_2:
    "Certainly! Below is a JavaScript function to calculate the factorial of a given number using both iterative and recursive approaches.\n\n### Iterative Approach:\n```javascript\nfunction factorialIterative(n) {\n    if (n < 0) return undefined; // Factorial is not defined for negative numbers\n    let result = 1;\n    for (let i = 1; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\n// Example usage:\nconsole.log(factorialIterative(5)); // Output: 120\n```\n\n### Recursive Approach:\n```javascript\nfunction factorialRecursive(n) {\n    if (n < 0) return undefined; // Factorial is not defined for negative numbers\n    if (n === 0 || n === 1) return 1;\n    return n * factorialRecursive(n - 1);\n}\n\n// Example usage:\nconsole.log(factorialRecursive(5)); // Output: 120\n```\n\n### Explanation:\n- **Iterative Approach**: Uses a loop to multiply numbers from 1 to `n`.\n- **Recursive Approach**: Calls itself with `n-1` until it reaches the base case (`n === 0` or `n === 1`), then multiplies the results back up the call stack.\n\nBoth functions handle the edge case where `n` is negative by returning `undefined`, as factorial is not defined for negative numbers.\n\nChoose the approach that best fits your needs!",
  judge: {
    solution_1_score: 9,
    solution_2_score: 8.5,
    solution_1_reasoning:
      "Solution 1 provides a very comprehensive answer. It includes both iterative and recursive approaches with correct logic. It handles negative numbers (the edge case) and the base cases (0 and 1) correctly. The 'Key Notes' section adds significant value by explaining the pros and cons of recursion versus iteration (mentioning stack overflow). While returning a string for the negative edge case is less standard than returning NaN or undefined in a production environment, it is helpful for a general explanation.",
    solution_2_reasoning:
      "Solution 2 is also correct and provides both approaches. It uses 'undefined' for the negative number edge case, which is generally better programming practice than returning a string. However, it is slightly less detailed than Solution 1, lacking the explicit mention of stack overflow risks or the specific performance benefit of the iterative approach. The iterative loop starts at 1, which is correct but slightly less optimized than starting at 2.",
  },
};

const App = () => {
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleBattle = async () => {
    if (!problem.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      // TODO: replace with real API call:
      // const res = await fetch("/api/battle", { method: "POST", body: JSON.stringify({ problem }), headers: { "Content-Type": "application/json" } });
      // const data = await res.json();

      // Simulate network delay with demo data
      await new Promise((r) => setTimeout(r, 1800));
      setResult({ ...DEMO_DATA, problem });
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
      {/* Header */}
      <header className="arena-header">
        <div className="header-brand">
          <span className="header-title">⚔️ AI Battle Arena</span>
          <span className="header-subtitle">Two AIs. One Winner.</span>
        </div>
        <div className="live-badge">
          <span className="live-dot" />
          Live Battle
        </div>
      </header>

      {/* Main 3-col grid */}
      <main className="arena-body">
        {/* Solution 1 — Model Alpha */}
        <SolutionPanel
          title="Model 1 "
          icon="🤖"
          nameClass="panel-name-alpha"
          panelClass="panel-alpha"
          score={result?.judge?.solution_1_score}
          scoreClass="score-alpha"
          content={result?.solution_1}
          loading={loading}
          emptyIcon="🤖"
          emptyLabel="Awaiting problem"
        />

        {/* Judge — center */}
        <JudgePanel
          judge={result?.judge}
          loading={loading}
          hasResult={!!result}
        />

        {/* Solution 2 — Model Beta */}
        <SolutionPanel
          title="Model 2"
          icon="🤖"
          nameClass="panel-name-beta"
          panelClass="panel-beta"
          score={result?.judge?.solution_2_score}
          scoreClass="score-beta"
          content={result?.solution_2}
          loading={loading}
          emptyIcon="🤖"
          emptyLabel="Awaiting problem"
        />
      </main>

      {/* Input bar */}
      <footer className="arena-footer">
        {result?.problem && (
          <div
            style={{
              marginBottom: 8,
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              letterSpacing: "0.06em",
            }}
          >
            <span style={{ color: "var(--primary)", marginRight: 6 }}>▶</span>
            {result.problem}
          </div>
        )}
        <div className="input-bar">
          <input
            id="problem-input"
            ref={inputRef}
            className="problem-input"
            type="text"
            placeholder="Enter your coding problem… (e.g. Write a binary search in Python)"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoComplete="off"
          />
          <button
            id="battle-btn"
            className="battle-btn"
            onClick={handleBattle}
            disabled={loading || !problem.trim()}
          >
            {loading ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Battling…
              </>
            ) : (
              <>⚡ Battle!</>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
