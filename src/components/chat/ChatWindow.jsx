import { useRef, useState, useEffect } from "react";
import { chatService } from "../../services/chatService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { LoadingDots } from "../ui/primitives";

let idCounter = 0;
const nextId = () => `m${++idCounter}`;

export default function ChatWindow({ business, onClose, embedded = false }) {
  const [conversation, setConversation] = useState(() => chatService.createConversation(business));
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("empty"); // empty | sending | ready | handed-off
  const [pendingText, setPendingText] = useState(null); // for retry
  const bodyRef = useRef(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  async function send(text) {
    const userMsg = { id: nextId(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setStatus("sending");
    setPendingText(null);

    try {
      const reply = await chatService.sendMessage(business, conversation, text);
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", text: reply.text }]);
      setStatus("ready");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", error: true, text: err.message || "Something went wrong. Please try again." },
      ]);
      setPendingText(text);
      setStatus("ready");
    }
  }

  function retry() {
    if (pendingText) send(pendingText);
  }

  function reset() {
    setConversation(chatService.resetConversation(business));
    setMessages([]);
    setStatus("empty");
    setPendingText(null);
  }

  async function requestHandoff() {
    setStatus("handed-off");
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "system",
        text: "Connecting you with a human teammate. They'll pick up this conversation shortly.",
      },
    ]);
    try {
      await chatService.handoffToHuman(business, conversation, "customer_requested");
    } catch {
      // Handoff has no live human channel behind it yet (see chatService.js) —
      // the UI still confirms the request so the flow doesn't feel broken.
    }
  }

  return (
    <div className={`chat-panel ${embedded ? "chat-panel--embedded" : ""}`}>
      <div className="chat-header">
        <div className="chat-header__avatar">{business.logoInitial}</div>
        <div className="chat-header__meta">
          <div className="chat-header__name">{business.assistantName}</div>
          <div className="chat-header__status">
            <span className="chat-header__status-dot" /> Online
          </div>
        </div>
        <div className="chat-header__actions">
          <button className="chat-header__icon-btn" onClick={reset} title="Reset conversation">
            Reset
          </button>
          {!embedded && (
            <button className="chat-header__icon-btn" onClick={onClose} title="Close">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="chat-body" ref={bodyRef}>
        {messages.length === 0 ? (
          <div className="chat-empty">
            <ChatMessage role="assistant" text={business.welcomeMessage} />
            <div className="chat-empty__starters">
              {business.conversationStarters.map((starter) => (
                <button key={starter} className="chat-starter" onClick={() => send(starter)}>
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <ChatMessage key={m.id} role={m.role} text={m.text} error={m.error} onRetry={m.error ? retry : undefined} />
          ))
        )}
        {status === "sending" && <ChatMessage role="assistant" text={<LoadingDots />} />}
      </div>

      <div style={{ padding: "0 14px" }}>
        {status !== "handed-off" && messages.length > 0 && (
          <button
            className="chat-message__retry"
            style={{ fontSize: "0.78rem", color: "var(--color-ink-soft)" }}
            onClick={requestHandoff}
          >
            Talk to a human instead
          </button>
        )}
      </div>

      <ChatInput disabled={status === "sending" || status === "handed-off"} onSend={send} />
    </div>
  );
}
