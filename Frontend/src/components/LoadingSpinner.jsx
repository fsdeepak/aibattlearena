export default function LoadingSpinner({ variant }) {
  const cls = `loading-orb loading-${variant}`;
  const labels = {
    alpha: "Model 1 thinking…",
    beta: "Model 2 thinking…",
    judge: "Judge deliberating…",
  };
  return (
    <div className="loading-wrap">
      <div className={cls} />
      <span className="loading-text">{labels[variant]}</span>
    </div>
  );
}
