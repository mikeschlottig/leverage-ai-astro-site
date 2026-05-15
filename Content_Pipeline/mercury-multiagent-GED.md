# GED: Mercury Multi-Agent Task Crusher
**Guided Execution Document — paste the entire file as context in a new Claude Code session**

---

## 🎯 Mission Statement

Build a production-grade **multi-agent chat application** on **Cloudflare Agents SDK** that uses **Mercury 2** (Inception Labs diffusion LLM) as the primary fast-inference worker tier, **Claude** (via Anthropic API) as the orchestrator/planner, and **Workers AI** as a cheap local fallback tier. Agents communicate internally via **Service Bindings** and expose an **ACP-compatible interface** for external agent pool integration (OpenCode, external agents, etc.).

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT (React SPA)                     │
│         useAgentChat hook → WebSocket to OrchestratorAgent│
└──────────────────────┬──────────────────────────────────┘
                       │ WebSocket / HTTP
┌──────────────────────▼──────────────────────────────────┐
│             OrchestratorAgent (Durable Object)           │
│  - Receives task from user                               │
│  - Plans sub-tasks via Claude Sonnet                     │
│  - Dispatches to worker agents via Service Bindings      │
│  - Aggregates results, streams back to client            │
│  - Maintains full conversation + task state (SQLite)     │
│  - Exposes ACP endpoint for external agent integration   │
└──────┬──────────────┬──────────────────┬────────────────┘
       │              │                  │
       │ SB           │ SB               │ SB
┌──────▼──────┐ ┌─────▼──────┐ ┌────────▼───────┐
│MercuryAgent │ │MercuryAgent│ │ WorkersAIAgent │
│ (DO pool)   │ │ (DO pool)  │ │ (DO pool)      │
│ fast gen    │ │ fast gen   │ │ local fallback │
│ via Mercury │ │ via Mercury│ │ via @cf/llama  │
│ 2 API       │ │ 2 API      │ │ or mistral     │
└─────────────┘ └────────────┘ └────────────────┘
       ↑
  ACP Interface (HTTP/JSON-RPC)
  External agents: OpenCode, CLI agents, etc.
```

---

## 🗂️ Project Structure

```
mercury-crusher/
├── src/
│   ├── agents/
│   │   ├── OrchestratorAgent.ts    # Main DO — planning, routing, state
│   │   ├── MercuryAgent.ts         # DO — Mercury 2 worker wrapper
│   │   └── WorkersAIAgent.ts       # DO — Workers AI fallback
│   ├── mcp/
│   │   └── tools.ts                # MCP tool definitions (web search, fs, etc.)
│   ├── acp/
│   │   └── router.ts               # ACP-compatible HTTP endpoint handler
│   ├── client/
│   │   ├── App.tsx                 # React chat UI
│   │   ├── components/
│   │   │   ├── Chat.tsx            # Main chat panel
│   │   │   ├── AgentPanel.tsx      # Live agent pool status sidebar
│   │   │   ├── TaskTree.tsx        # Visual sub-task breakdown
│   │   │   └── StreamToken.tsx     # Token-level streaming display
│   │   └── hooks/
│   │       └── useOrchestrator.ts  # Wraps useAgentChat + custom RPC
│   ├── worker.ts                   # Main CF Worker entry + routing
│   └── types.ts                    # Shared types
├── wrangler.jsonc
├── package.json
└── .dev.vars                       # Local secrets (never commit)
```

---

## ⚙️ Wrangler Config (`wrangler.jsonc`)

```jsonc
{
  "name": "mercury-crusher",
  "main": "src/worker.ts",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],

  "durable_objects": {
    "bindings": [
      { "name": "ORCHESTRATOR", "class_name": "OrchestratorAgent" },
      { "name": "MERCURY_AGENT", "class_name": "MercuryAgent" },
      { "name": "WORKERS_AI_AGENT", "class_name": "WorkersAIAgent" }
    ]
  },

  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["OrchestratorAgent", "MercuryAgent", "WorkersAIAgent"]
    }
  ],

  "ai": {
    "binding": "AI"
  },

  "vars": {
    "ENVIRONMENT": "development"
  }

  // Secrets (set via wrangler secret put):
  // ANTHROPIC_API_KEY
  // MERCURY_API_KEY
}
```

---

## 🤖 Agent Specs

### 1. `OrchestratorAgent` (primary DO)

**Extends:** `AIChatAgent` from `agents/ai`

**Responsibilities:**
- Accept user message via WebSocket (`useAgentChat`)
- Call Claude Sonnet to decompose task into N sub-tasks (JSON plan)
- Spawn/select MercuryAgent or WorkersAIAgent DOs via Service Bindings based on task type + load
- Collect streamed results, merge, verify with Claude
- Maintain `state`:
  ```typescript
  type OrchestratorState = {
    conversations: Message[];
    activeTasks: Task[];
    agentPool: AgentStatus[];
    plan: SubTask[] | null;
  }
  ```
- Expose `@callable` RPC methods:
  - `getTaskTree()` — live sub-task breakdown for UI
  - `cancelTask(id)` — kill running sub-task
  - `getAgentPool()` — pool status for sidebar
- Expose `/acp` HTTP endpoint (see ACP section)

**Key methods:**
```typescript
async onMessage(connection, message) // main entry point
async planWithClaude(userMessage: string): Promise<SubTask[]>
async dispatchToWorkers(tasks: SubTask[]): Promise<Result[]>
async verifyAndMerge(results: Result[]): Promise<string>
```

---

### 2. `MercuryAgent` (worker DO, pooled)

**Extends:** `Agent`

**Responsibilities:**
- Accept sub-task prompt via Service Binding RPC
- Call Mercury 2 API (OpenAI-compatible endpoint)
- Stream tokens back to OrchestratorAgent
- Track usage stats in state

**Mercury 2 API Notes:**
- Base URL: `https://api.inceptionlabs.ai/v1` (verify current endpoint)
- Model: `mercury-coder-small` or `mercury-coder` (check available models)
- OpenAI-compatible: use `fetch` with `Authorization: Bearer ${MERCURY_API_KEY}`
- Supports streaming SSE
- ~1000 tok/s, $0.25/$0.75 per M tokens

**State:**
```typescript
type MercuryState = {
  status: 'idle' | 'busy' | 'error';
  tasksCompleted: number;
  tokensGenerated: number;
  lastError: string | null;
}
```

**Callable:**
```typescript
@callable({ streaming: true })
async generate(res: StreamingResponse, prompt: string, opts: GenerateOpts)
```

---

### 3. `WorkersAIAgent` (fallback DO)

**Extends:** `Agent`

**Responsibilities:**
- Same interface as MercuryAgent (`generate` callable)
- Uses `env.AI.run('@cf/meta/llama-3.1-8b-instruct', ...)` or mistral
- Fallback when Mercury is rate-limited, unavailable, or task is simple/cheap

---

## 🔧 MCP Tools

Define in `src/mcp/tools.ts`, register on OrchestratorAgent:

| Tool | Source | Use |
|------|--------|-----|
| `web_search` | Cloudflare Tavily or Brave MCP | Research tasks |
| `read_file` / `write_file` | R2 binding | Code file I/O |
| `run_code` | Cloudflare sandbox (or Deno DO) | Code execution |
| `fetch_url` | Native fetch | Scraping, APIs |

Register via:
```typescript
import { McpAgent } from "agents/mcp";
// or register tools directly on OrchestratorAgent using the tools array in AIChatAgent
```

---

## 🌐 ACP Interface (`/acp`)

Exposes OrchestratorAgent to external agents (OpenCode, CLI agents, etc.)

**Endpoint:** `POST /acp/task`

**Request:**
```json
{
  "agent_id": "external-opencode-1",
  "task": "Refactor auth module to use JWT",
  "context": { "files": [...], "constraints": {} },
  "callback_url": "https://external.agent/results"  // optional webhook
}
```

**Response (streaming SSE or JSON):**
```json
{
  "task_id": "uuid",
  "status": "accepted",
  "stream_url": "/acp/stream/uuid"
}
```

**Additional endpoints:**
- `GET /acp/status/:task_id` — poll task status
- `GET /acp/stream/:task_id` — SSE stream of output tokens
- `DELETE /acp/task/:task_id` — cancel

Keep ACP handler thin — just a routing layer into OrchestratorAgent DOs.

---

## 💻 Client UI

**Stack:** React + Vite + Tailwind (served from Worker via static assets)

**Layout:**
```
┌──────────────┬─────────────────────────┬──────────────┐
│  Agent Pool  │      Chat / Output       │  Task Tree   │
│  Sidebar     │  (streaming tokens)      │  Sidebar     │
│              │                          │              │
│ ● Mercury-1  │  [user message]          │ ▼ Plan       │
│   busy       │  ──────────────          │   ✓ subtask1 │
│ ● Mercury-2  │  [streaming response]    │   ⟳ subtask2 │
│   idle       │   def hello_wor|         │   ○ subtask3 │
│ ● WorkersAI  │                          │              │
│   standby    │  [input bar]             │              │
└──────────────┴─────────────────────────┴──────────────┘
```

**Key hooks:**
```typescript
// Primary chat connection
const { messages, input, handleSubmit, isLoading } = useAgentChat({
  agent: "orchestrator",
  name: sessionId,
});

// Live agent pool status
const agent = useAgent({
  agent: "orchestrator",
  name: sessionId,
  onStateUpdate: (s) => setAgentPool(s.agentPool),
});

// Task tree via RPC
const taskTree = await agent.getTaskTree();
```

---

## 🔑 Environment / Secrets

```bash
# .dev.vars (local) / wrangler secret put (prod)
ANTHROPIC_API_KEY=sk-ant-...
MERCURY_API_KEY=...         # from inceptionlabs.ai
```

---

## 🏗️ Build Order (follow strictly)

1. **Scaffold** — `npm create cloudflare@latest mercury-crusher -- --template=cloudflare/agents-starter`
2. **Types** — define all shared types in `types.ts` first
3. **MercuryAgent DO** — implement + test generate callable in isolation
4. **WorkersAIAgent DO** — same interface, swap backend
5. **OrchestratorAgent DO** — planning + dispatch loop (no UI yet)
6. **ACP router** — wire `/acp/*` routes in `worker.ts`
7. **React client** — build UI last, wire to working backend
8. **MCP tools** — add incrementally after core loop works
9. **Integration test** — full round-trip: user → orchestrator → mercury workers → response

---

## 🚫 Constraints & Non-Negotiables

- **`wrangler.jsonc`** format only (not `wrangler.toml`)
- **No placeholder values** anywhere — if a value isn't known, leave an explicit `TODO:` comment
- **Service Bindings only** for inter-agent communication — no HTTP between Workers
- **All agents must be proper DOs** — no stateless Workers acting as agents
- **Mercury 2 is primary** — Workers AI is fallback only, not default
- **Streaming everywhere** — never buffer full responses, always SSE/stream
- **TypeScript strict mode** — no `any` types in agent interfaces

---

## 📦 Key Dependencies

```json
{
  "agents": "latest",
  "hono": "^4",
  "@anthropic-ai/sdk": "^0.27",
  "ai": "^4",
  "react": "^18",
  "vite": "^5",
  "@cloudflare/workers-types": "latest"
}
```

---

## 🔍 Verification Checklist (per phase)

- [ ] `wrangler dev` starts without errors
- [ ] WebSocket connects to OrchestratorAgent
- [ ] Single-agent Mercury 2 call returns streamed tokens
- [ ] Multi-task dispatch fires concurrent MercuryAgent DOs
- [ ] WorkersAI fallback triggers on Mercury failure
- [ ] ACP endpoint accepts external task, returns stream URL
- [ ] React client shows live agent pool status
- [ ] Task tree updates in real-time during execution
- [ ] Full session state persists across page reload (SQLite)

---

## 📎 Reference Links (fetch these at session start)

- Agents SDK docs: `https://developers.cloudflare.com/agents/`
- AIChatAgent: `https://github.com/cloudflare/agents/blob/main/docs/getting-started.md`
- Mercury 2 API: `https://inceptionlabs.ai/docs` (verify current endpoint/models)
- Workers AI models: `https://developers.cloudflare.com/workers-ai/models/`
- ACP spec: `https://agentcommunicationprotocol.dev/` (verify current spec)

---

*GED version: 1.0 | Created: 2025-03-22 | Owner: Mike*
