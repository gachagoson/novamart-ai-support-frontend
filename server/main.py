"""
NovaMart AI Support — API proxy
================================

Why this file exists
---------------------
The AgentCore backend (see ../../novamart-multi-agent-agentcore) is only reachable
through the AWS SDK's `bedrock-agentcore` `invoke_agent_runtime` call, which must be
signed with AWS credentials (SigV4). A browser cannot make that call directly, and
those credentials must never reach frontend code. This server is the smallest
possible bridge: it holds the AWS credentials, exposes plain HTTP/JSON to the
website, and translates 1:1 to the runtime's actual request/response shape.

It intentionally does NOT reimplement, wrap, or extend the agent logic. It calls
the exact same `invoke_agent_runtime` operation that
`novamart-multi-agent-agentcore/src/agent_orchestrator.py::invoke_agent` calls.

Contract (confirmed from the backend source, not assumed):
    request  -> {"prompt": str, "session_id": str, "customer_id": str}
    response -> {"result": str, "session_id": str, "customer_id": str, "trace_id": str|None}

Endpoints this proxy adds on top of that:
    POST /api/chat     -> forwards one message, returns the runtime's reply
    POST /api/handoff  -> STUB. The backend has no human-handoff mechanism today
                          (no ticketing/helpdesk integration exists in the
                          AgentCore project). This just records the request so the
                          UI has something real to call; wire it up to an actual
                          support channel (email, Zendesk, Slack, etc.) later.
    GET  /api/health   -> for uptime checks / local debugging

There is no conversation-history endpoint because AgentCore Memory is keyed by
session_id on AWS's side and the runtime does not expose a "read transcript back"
API. The frontend keeps the visible transcript client-side per session; a new
session_id (see chatService.createConversation) starts a clean AgentCore Memory
thread on the backend too.
"""

import json
import logging
import os
import uuid
from typing import Optional

from dotenv import load_dotenv
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("novamart-proxy")

load_dotenv()

AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")
AGENTCORE_RUNTIME_ARN = os.environ.get("AGENTCORE_RUNTIME_ARN", "")
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app = FastAPI(title="NovaMart AI Support Proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Credentials come from the process environment / instance role via boto3's
# standard credential chain — never read, logged, or forwarded to the client.
_agentcore_client = boto3.client("bedrock-agentcore", region_name=AWS_REGION)


class ChatRequest(BaseModel):
    message: str
    session_id: str
    customer_id: str = "CUST-001"


class ChatResponse(BaseModel):
    result: str
    session_id: str
    customer_id: str
    trace_id: Optional[str] = None


class HandoffRequest(BaseModel):
    session_id: str
    customer_id: str = "CUST-001"
    reason: Optional[str] = None


@app.get("/api/health")
def health():
    return {"status": "ok", "runtime_configured": bool(AGENTCORE_RUNTIME_ARN)}


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message must not be empty")
    if not AGENTCORE_RUNTIME_ARN:
        raise HTTPException(
            status_code=503,
            detail=(
                "AGENTCORE_RUNTIME_ARN is not configured on the server. "
                "The demo backend has not been deployed yet."
            ),
        )

    # AgentCore requires runtimeSessionId to be >= 33 characters — same scheme
    # agent_orchestrator.py uses: embed the short session id in a longer unique one.
    runtime_session_id = f"{req.session_id}-{uuid.uuid4().hex}"
    payload = json.dumps(
        {
            "prompt": req.message,
            "session_id": req.session_id,
            "customer_id": req.customer_id,
        }
    )

    try:
        response = _agentcore_client.invoke_agent_runtime(
            agentRuntimeArn=AGENTCORE_RUNTIME_ARN,
            runtimeSessionId=runtime_session_id,
            contentType="application/json",
            accept="application/json",
            payload=payload,
        )
        body = response["response"].read()
        data = json.loads(body)
    except (BotoCoreError, ClientError) as exc:
        logger.exception("AgentCore invocation failed")
        raise HTTPException(
            status_code=502, detail=f"Upstream agent error: {exc}"
        ) from exc
    except (TypeError, ValueError):
        data = {
            "result": (
                body.decode("utf-8", errors="replace")
                if isinstance(body, bytes)
                else str(body)
            )
        }

    return ChatResponse(
        result=data.get("result", ""),
        session_id=data.get("session_id", req.session_id),
        customer_id=data.get("customer_id", req.customer_id),
        trace_id=data.get("trace_id"),
    )


@app.post("/api/handoff")
def handoff(req: HandoffRequest):
    # STUB: no human-support channel is wired up yet. Recorded server-side so
    # this is a real call to replace, not a UI-only fake. Swap this log line
    # for a call to your helpdesk/ticketing API when one exists.
    logger.info(
        "Human handoff requested | session=%s customer=%s reason=%s",
        req.session_id,
        req.customer_id,
        req.reason,
    )
    return {"status": "requested", "session_id": req.session_id}
