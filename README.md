# Aidesk — AI Customer Operations frontend

A commercial-looking frontend for the NovaMart multi-agent backend
(`novamart-multi-agent-agentcore`), built by inspecting that repo first rather
than inventing an API to make the UI look finished.

## Why there's a `server/` folder

The AgentCore backend has no HTTP API of its own. The only way to call it is
`boto3.client("bedrock-agentcore").invoke_agent_runtime(...)`, which must be
signed with AWS credentials — a browser can't do that, and those credentials
can't ship in frontend code. `server/main.py` is the smallest possible bridge:
a FastAPI process that holds the AWS credentials and exposes plain JSON to the
website. It is a **pass-through**, not a reimplementation — it calls the exact
same operation, with the exact same payload shape, as
`agent_orchestrator.py::invoke_agent` in the backend repo.

```
Browser  →  chatService.js  →  server/main.py (FastAPI)  →  invoke_agent_runtime  →  AgentCore Runtime
```

## What's real vs. what's a stub

| Feature | Status |
|---|---|
| Sending a message and getting the agent's reply | **Real.** Forwards to the deployed AgentCore Runtime and returns its actual text. |
| Conversation memory within a session | **Real**, on AWS's side (AgentCore Memory), keyed by the `session_id` this frontend generates. |
| "Sources" citations in chat replies | **Not wired up.** The deployed runtime's `/invocations` response only returns final text — no citation list — even though the Policy agent retrieves from Knowledge Bases internally. `ChatMessage` accepts a `sources` prop and renders it if present, so this is a one-line change away once the backend returns citations. |
| "Talk to a human" handoff | **UI-only stub.** `POST /api/handoff` logs the request server-side; there is no ticketing/helpdesk system behind it yet. Replace the log line in `server/main.py` with a call to whatever support channel you use. |
| "Deploy for my business" / demo request form | **Local-only.** No lead-capture backend exists; submitting shows a confirmation toast and nothing is sent anywhere. Point it at a real endpoint, form service, or CRM connector before launch. |
| Multi-tenant business config | **Structural, not multi-tenant yet.** `src/config/businesses.js` defines the shape (name, logo, theme, welcome message, API base URL); only `novamart` exists today. Add a second object and pass it to `<ChatWidget business={...} />` to add a tenant — no component changes needed. |

## Running it

**Backend proxy**
```bash
cd server
pip install -r requirements.txt
cp .env.example .env   # fill in AGENTCORE_RUNTIME_ARN once the backend is deployed
uvicorn main:app --reload --port 8000
```
Without `AGENTCORE_RUNTIME_ARN` set, `/api/chat` returns a clear 503 instead of
a fake reply — useful while the backend's Knowledge Base / deployment phases
are still in progress.

**Frontend**
```bash
npm install
cp .env.example .env   # VITE_API_BASE_URL, defaults to http://localhost:8000
npm run dev
```

## Project layout

```
src/
  config/businesses.js      per-tenant configuration
  services/chatService.js   the ONLY file that knows the backend URL/shape
  components/
    ui/                     Button, Input, Card, Badge, Modal, Toast, LoadingDots
    layout/                 Navbar, Section, Footer
    chat/                   ChatWidget, ChatWindow, ChatMessage, ChatInput
    landing/                Hero, Features, HowItWorks, LiveDemo, Trust, Pricing CTA
server/
  main.py                   FastAPI proxy — the only place AWS credentials are touched
```

## Deliberately not built (per the brief)

Dashboards, billing, user management, CRM, an analytics UI, and an admin
portal. Add these once real users show they're needed.
