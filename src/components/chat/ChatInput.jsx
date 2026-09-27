import { useState } from "react";

export default function ChatInput({ disabled, onSend }) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="chat-footer">
      <div className="chat-input-row">
        <textarea
          rows={1}
          placeholder="Type your message…"
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message"
        />
        <button
          className="chat-send-btn"
          disabled={disabled || !value.trim()}
          onClick={submit}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
      <div className="chat-footer__hint">Enter to send · Shift+Enter for a new line</div>
    </div>
  );
}
