import LoadingSpinner from "./LoadingSpinner";
import { MarkdownRenderer } from "../app/MarkdownRenderer";

export default function SolutionPanel({
  title,
  icon,
  nameClass,
  score,
  scoreClass,
  content,
  loading,
  emptyIcon,
  emptyLabel,
  panelClass,
}) {
  return (
    <div className={`panel ${panelClass}`}>
      <div className="panel-header">
        <div className="panel-title-row">
          <span className="panel-icon">{icon}</span>
          <span className={`panel-name ${nameClass}`}>{title}</span>
        </div>
        {score != null && !loading && content && (
          <span className={`score-badge ${scoreClass}`}>{score} / 10</span>
        )}
      </div>

      <div className="panel-content">
        {loading ? (
          <LoadingSpinner
            variant={panelClass === "panel-alpha" ? "alpha" : "beta"}
          />
        ) : content ? (
          <div className="fade-in">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">{emptyIcon}</span>
            <span className="empty-label">{emptyLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
