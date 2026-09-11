import "./LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <span className="loading-spinner__ring" aria-hidden="true" />
    </div>
  );
}
