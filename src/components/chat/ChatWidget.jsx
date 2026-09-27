import { useState } from "react";
import "./chat.css";
import ChatWindow from "./ChatWindow";

/**
 * Drop this anywhere with a business config and it renders a floating
 * launcher that opens into a full chat panel. Pass `embedded` to render the
 * panel inline instead (used for the hero preview and the live demo section)
 * — same component, same state machine, different chrome.
 */
export default function ChatWidget({ business, embedded = false, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  if (embedded) {
    return <ChatWindow business={business} embedded />;
  }

  return (
    <>
      {open && <ChatWindow business={business} onClose={() => setOpen(false)} />}
      {!open && (
        <button className="chat-launcher" onClick={() => setOpen(true)} aria-label="Open chat">
          💬
        </button>
      )}
    </>
  );
}
