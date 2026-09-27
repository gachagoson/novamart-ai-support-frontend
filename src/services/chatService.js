/**
 * chatService — the one place the UI talks to a backend.
 *
 * ChatWindow and friends only ever call these five functions; none of them
 * know that a proxy server exists, that it's FastAPI, or that the real work
 * happens on Amazon Bedrock AgentCore. That's the point of the boundary:
 * swapping backends means editing this file only.
 *
 * Current backend reality (see ../../server/main.py):
 *   - POST /api/chat exists and is real: it invokes the deployed AgentCore
 *     Runtime and returns its actual reply.
 *   - There is no server-side "create conversation" or "list messages"
 *     endpoint — AgentCore Memory is keyed by session_id on AWS's side, with
 *     no HTTP verb to read a transcript back. So createConversation() and
 *     getConversation() are honestly local: a session is just an id, and the
 *     visible history is whatever this browser tab has seen.
 *   - POST /api/handoff is a stub on the server (see main.py) — it records
 *     the request but does not yet notify a human anywhere.
 */

function createConversation(business) {
  return {
    sessionId: crypto.randomUUID(),
    customerId: "CUST-001",
    businessId: business.id,
    messages: [],
  };
}

async function sendMessage(business, conversation, text) {
  const res = await fetch(`${business.apiBaseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      session_id: conversation.sessionId,
      customer_id: conversation.customerId,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }

  const data = await res.json();
  return {
    text: data.result,
    traceId: data.trace_id ?? null,
  };
}

// No backend transcript endpoint exists yet (see file header) — this returns
// what the caller already has. Kept as a named function so a real endpoint
// can replace the body later without changing call sites.
function getConversation(conversation) {
  return conversation.messages;
}

function resetConversation(business) {
  return createConversation(business);
}

async function handoffToHuman(business, conversation, reason) {
  const res = await fetch(`${business.apiBaseUrl}/api/handoff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: conversation.sessionId,
      customer_id: conversation.customerId,
      reason,
    }),
  });
  if (!res.ok) throw new Error(`Handoff request failed (${res.status})`);
  return res.json();
}

export const chatService = {
  createConversation,
  sendMessage,
  getConversation,
  resetConversation,
  handoffToHuman,
};
