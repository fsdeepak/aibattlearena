import LoadingSpinner from "./LoadingSpinner";

export default function JudgePanel({ judge, loading, hasResult }) {
  if (loading) {
    return (
      <div className="panel panel-judge">
        <div className="panel-header">
          <div className="panel-title-row">
            <span className="panel-icon">⚖️</span>
            <span className="panel-name panel-name-judge">Judge AI</span>
          </div>
        </div>
        <div className="panel-content">
          <LoadingSpinner variant="judge" />
        </div>
      </div>
    );
  }

  const winner =
    judge && judge.solution_1_score > judge.solution_2_score
      ? "🏆 Model 1 Wins"
      : judge && judge.solution_1_score < judge.solution_2_score
        ? "🏆 Model 2 Wins"
        : judge
          ? "🤝 It's a Tie"
          : null;

  return (
    <div className="panel panel-judge">
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon">⚖️</span>
          <span className="panel-name panel-name-judge">Judge AI</span>
        </div>
      </div>

      <div className="panel-content">
        {!hasResult ? (
          <div className="empty-state">
            <span className="empty-icon">⚖️</span>
            <span className="empty-label">Awaiting verdict</span>
          </div>
        ) : (
          <div className="fade-in">
            {/* Verdict */}
            <div className="verdict-card">
              <div className="verdict-label">Verdict</div>
              <div className="verdict-winner">{winner}</div>
            </div>

            {/* Score bars */}
            <div className="divider-label">Scores</div>
            <div className="score-bar-wrap">
              <div className="score-bar-label">
                <span
                  style={{
                    color: "var(--alpha-blue)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}
                >
                  Model 1
                </span>
                <span
                  style={{
                    color: "var(--alpha-blue)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  {judge.solution_1_score}
                </span>
              </div>
              <div className="score-bar-bg">
                <div
                  className="score-bar-fill score-bar-alpha"
                  style={{ width: `${(judge.solution_1_score / 10) * 100}%` }}
                />
              </div>
            </div>
            <div className="score-bar-wrap">
              <div className="score-bar-label">
                <span
                  style={{
                    color: "var(--beta-green)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}
                >
                  Model 2
                </span>
                <span
                  style={{
                    color: "var(--beta-green)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  {judge.solution_2_score}
                </span>
              </div>
              <div className="score-bar-bg">
                <div
                  className="score-bar-fill score-bar-beta"
                  style={{ width: `${(judge.solution_2_score / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Reasoning */}
            <div className="divider-label">Reasoning</div>
            <div className="reasoning-card reasoning-alpha">
              <div className="reasoning-title">Model Alpha</div>
              <div className="reasoning-text">{judge.solution_1_reasoning}</div>
            </div>
            <div className="reasoning-card reasoning-beta">
              <div className="reasoning-title">Model Beta</div>
              <div className="reasoning-text">{judge.solution_2_reasoning}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
