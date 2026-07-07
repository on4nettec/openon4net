# System Architecture — Open on4net

> **فایل:** 02_ARCHITECTURE/01-system-overview.md
> **نسخه:** 1.0

---

## ۱. معماری کلی

```
                    ┌─────────────────────────────────────┐
                    │         USER LAYER                   │
                    │  Web App │ Dashboard │ API │ Mobile  │
                    └────────────┬────────────────────────┘
                                 │
                    ┌────────────▼────────────────────────┐
                    │         API GATEWAY                  │
                    │   Auth · Rate Limit · Routing        │
                    └────────────┬────────────────────────┘
                                 │
                    ┌────────────▼────────────────────────┐
                    │      ORCHESTRATION LAYER             │
                    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌────┐ │
                    │  │Agent │ │Work  │ │Skill │ │Gov │ │
                    │  │Frame │ │flow  │ │Engine│ │    │ │
                    │  └──────┘ └──────┘ └──────┘ └────┘ │
                    │  ┌──────┐ ┌──────┐ ┌──────────┐   │
                    │  │Outco │ │Plugin│ │Workspace │   │
                    │  │me    │ │      │ │          │   │
                    │  └──────┘ └──────┘ └──────────┘   │
                    └────────────┬────────────────────────┘
                                 │
                    ┌────────────▼────────────────────────┐
                    │         AI GATEWAY                   │
                    │  Model Router · Cost Tracker         │
                    │  Prompt Manager · Cache              │
                    │  GPT │ Claude │ Gemini │ Qwen │ ...  │
                    └────────────┬────────────────────────┘
                                 │
                    ┌────────────▼────────────────────────┐
                    │         MEMORY ENGINE                │
                    │  6-Layer + Graph (Neo4j + Vector)    │
                    └────────────┬────────────────────────┘
                                 │
                    ┌────────────▼────────────────────────┐
                    │         DATA LAYER                   │
                    │  PostgreSQL │ Redis │ Neo4j │ MinIO  │
                    └─────────────────────────────────────┘
```

## ۲. Tech Stack

| لایه | تکنولوژی |
|------|-----------|
| Backend | Node.js + TypeScript + Fastify |
| Frontend | Next.js 15 + React + Tailwind |
| Primary DB | PostgreSQL 16 + pgvector |
| Cache | Redis 7 |
| Graph DB | Neo4j |
| Storage | MinIO (S3-compatible) |
| Queue | RabbitMQ / Redis Streams |
| Auth | Keycloak / Casdoor |
| Container | Docker + Compose |
| Orchestration | Kubernetes (Enterprise) |

## ۳. Data Flow

### Chat Request:
```
User → API Gateway → Auth → Workspace → Agent Framework
→ Memory Engine (context) → AI Gateway (model router)
→ LLM → Response → Memory Store → User
```

### Agent-to-Agent:
```
Agent A → Communication Bus → Governance Check
→ Workflow Engine → Agent B → Response → Memory Graph Update
```

## ۴. Deployment

| نوع | روش |
|-----|------|
| Development | Docker Compose |
| Production | Kubernetes + Helm |
| Enterprise | On-Premise K8s |

---

> معماری ماژولار و مقیاس‌پذیر. هر کامپوننت مستقل scale می‌شود.

---

## ۵. معماری رسمی ۴ بخشی (4-Plane)

برای هم‌زمان پشتیبانی از self-host، کنترل هزینه AI (credits/activation)، حافظه بلندمدت managed/self-host و marketplace، معماری O₂N به صورت ۴ Plane تعریف می‌شود.

جزئیات: `02_ARCHITECTURE/13-four-plane-architecture.md`
