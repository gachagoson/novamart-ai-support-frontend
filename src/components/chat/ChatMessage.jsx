import ReactMarkdown from "react-markdown";

// `sources` is accepted but unused today — the deployed AgentCore Runtime
// returns only final text (see chatService.js), no citation list. This stays
// ready so wiring up retrieval citations later doesn't touch the message UI.
export default function ChatMessage({ role, text, error, sources, onRetry }) {
  const variant = error ? "error" : role;

  return (
    <div className={`chat-message chat-message--${variant}`}>
      {role === "assistant" && !error && typeof text === "string" ? (
        <ReactMarkdown>{text}</ReactMarkdown>
      ) : (
        text
      )}

      {error && onRetry && (
        <div>
          <button className="chat-message__retry" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {sources?.length > 0 && (
        <details className="chat-sources">
          <summary>Sources ({sources.length})</summary>
          <ul>
            {sources.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
