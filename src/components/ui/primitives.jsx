import "./primitives.css";
import Button from "./Button";

export function Input(props) {
  return <input className="input" {...props} />;
}

export function Card({ className = "", ...props }) {
  return <div className={`card ${className}`.trim()} {...props} />;
}

export function Badge({ dot = false, children }) {
  return (
    <span className="badge">
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function LoadingDots({ label = "Assistant is typing" }) {
  return (
    <span className="loading-dots" role="status" aria-label={label}>
      <span />
      <span />
      <span />
    </span>
  );
}

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
        {children}
        <Button variant="secondary" size="sm" className="modal__close" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

export function Toast({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="toast" role="alert">
      {message}{" "}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{ background: "none", border: "none", marginLeft: 8, cursor: "pointer", fontWeight: 600 }}
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
