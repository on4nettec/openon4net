# API Bible — Open on4net

> **فایل:** 04_API/01-rest-api-spec.md
> **نسخه:** 1.0

---

## ۱. اصول API

| ویژگی          | مقدار                                   |
| -------------- | --------------------------------------- |
| **Protocol**   | REST + WebSocket (real-time)            |
| **Base URL**   | `https://api.on4net.com/v1`             |
| **Auth**       | Bearer Token (JWT)                      |
| **Format**     | JSON                                    |
| **Rate Limit** | ۱۰۰ req/min (free), ۱۰۰۰ req/min (paid) |

> APIهای Billing/Credits و Marketplace/Publisher در فایل جدا آمده‌اند: `04_API/02-billing-and-marketplace-api.md`
> APIهای Connectorها و ingestion حافظه در فایل جدا آمده‌اند: `04_API/03-connectors-memory-ingestion-api.md`
> قرارداد اجرایی (OpenAPI) در فایل جدا آمده است: `04_API/00-openapi-v0.1.yaml`

### Tenant Headers (برای multi-tenant)

- `X-Organization-Id` (اجباری در اکثر endpointها)
- `X-Workspace-Id` (اختیاری؛ برای scope دقیق‌تر)

---

## ۲. Authentication

### دریافت Token

```
POST /auth/token
{
    "api_key": "o2n_abcde_xxxxxxxxxxxxxxxxxxxxxxxx",
    "organization_id": "org-xxx"
}
→ { "token": "eyJ...", "expires_in": 3600 }
```

### استفاده

```
Authorization: Bearer eyJ...
X-Organization-Id: org-xxx
```

---

## ۳. Agents API

### ۳.۱ لیست Agentها

```
GET /agents
→ {
    "agents": [
        {
            "id": "agent-xxx",
            "name": "Marketing Agent",
            "role": "marketing",
            "status": "active",
            "department": "Marketing",
            "kpi_summary": {
                "campaigns_completed": 24,
                "success_rate": 94.5
            }
        }
    ],
    "total": 12
}
```

### ۳.۲ ایجاد Agent

> نیازمند permission: `agents:create` (در MVP فقط admin).

```
POST /agents
{
    "name": "Support Agent",
    "role": "support",
    "department": "Support",
    "reports_to": "agent-ceo-01",
    "monthly_budget_cents": 30000,
    "model_preferences": {
        "primary": "claude-3-haiku",
        "fallback": "gpt-4o-mini"
    }
}
→ { "agent": { ... }, "status": "created" }
```

### ۳.۳ ارسال پیام به Agent

```
POST /agents/{agent_id}/chat
{
    "message": "یک کمپین تخفیف تابستونه طراحی کن",
    "conversation_id": "conv-456", // اختیاری؛ اگر نباشد یک session جدید ساخته می‌شود
    "locale": "fa-IR", // اختیاری؛ اگر نباشد از تنظیمات user/workspace می‌آید
    "context": {
        "project_id": "proj-123",
        "urgency": "high"
    }
}
→ {
    "response": "کمپین طراحی شد...",
    "model_used": "claude-3.5-sonnet",
    "cost_cents": 12,
    "skills_used": ["campaign-designer"],
    "memory_updated": true
}
```

### ۳.۴ استریم پاسخ (Server-Sent Events)

```
POST /agents/{agent_id}/chat/stream
{
    "message": "یک گزارش فروش بنویس"
}

→ event: token
   data: {"token": "گزارش", "index": 0}

→ event: token
   data: {"token": "فروش", "index": 1}

→ event: done
   data: {"model": "gpt-4o", "cost": 0.05, "time_ms": 3200}

→ event: skill-suggestion
   data: {
       "type": "new-skill-detected",
       "name": "sales-report-generator",
       "confidence": 0.92,
       "suggestion": "این کار را ۱۵ بار انجام دادم..."
   }
```

### ۳.۵ Sessions (Conversations) API

> UI به این‌ها «session» می‌گوید. هر Agent می‌تواند چند session داشته باشد.

#### ۳.۵.۱ لیست sessionهای یک Agent

```
GET /agents/{agent_id}/sessions
→ {
  "sessions": [
    { "id": "conv-456", "title": "main", "updated_at": "2026-07-10T18:51:00Z" }
  ]
}
```

#### ۳.۵.۲ ساخت session جدید برای یک Agent

```
POST /agents/{agent_id}/sessions
{
  "title": "telegram",
  "locale": "fa-IR"
}
→ { "session": { "id": "conv-789", "title": "telegram" } }
```

#### ۳.۵.۳ تغییر عنوان session

```
PATCH /sessions/{session_id}
{ "title": "project alpha" }
→ { "status": "ok" }
```

#### ۳.۵.۴ آرشیو/حذف session

```
DELETE /sessions/{session_id}
→ { "status": "deleted" }
```

### ۳.۶ Agent Access (Grant/Revoke)

> هر کاربر می‌تواند به یک یا چند Agent دسترسی داشته باشد. مدیریت دسترسی نیازمند admin است.

```
POST /agents/{agent_id}/access/grant
{ "user_id": "user-123", "access_role": "member" }
→ { "status": "granted" }

DELETE /agents/{agent_id}/access/{user_id}
→ { "status": "revoked" }
```

---

## ۴. Memory API

### ۴.۱ نوشتن در حافظه

```
POST /memory/write
{
    "agent_id": "agent-xxx",
    "layer": 3,
    "content": {
        "type": "decision",
        "title": "استفاده از Docker",
        "description": "تصمیم به Dockerize کردن پروژه Alpha",
        "related_to": ["project-alpha", "file-docker-compose"]
    },
    "context": {
        "project_id": "proj-123",
        "conversation_id": "conv-456"
    }
}
→ { "memory_id": "mem-789", "graph_updated": true }
```

### ۴.۲ جستجوی حافظه

```
POST /memory/search
{
    "agent_id": "agent-xxx",
    "query": "چرا از داکر استفاده کردیم",
    "layers": [2, 3, 4],
    "limit": 5,
    "min_score": 0.7
}
→ {
    "results": [
        {
            "layer": 3,
            "score": 0.95,
            "content": {
                "type": "decision",
                "title": "استفاده از Docker",
                "description": "تصمیم به Dockerize کردن..."
            },
            "context": {
                "project": "Alpha",
                "decided_by": "سروش",
                "date": "2026-07-05"
            }
        }
    ],
    "total": 3
}
```

### ۴.۳ Memory Graph Query

```
POST /memory/graph
{
    "query": "چه تصمیماتی برای پروژه Alpha گرفته شده؟",
    "depth": 2,
    "start_nodes": ["project-alpha"]
}
→ {
    "graph": {
        "nodes": [...],
        "edges": [...]
    },
    "summary": "۳ تصمیم: Docker, Microservices, PostgreSQL"
}
```

---

## ۵. Skills API

### ۵.۱ لیست Skillها

```
GET /skills?agent_id=agent-xxx
→ {
    "skills": [
        {
            "id": "skill-123",
            "name": "weekly-report",
            "version": "2.1.0",
            "executions": 127,
            "success_rate": 98.7,
            "avg_duration_ms": 45000
        }
    ]
}
```

### ۵.۲ اجرای Skill

```
POST /skills/{skill_id}/execute
{
    "params": {
        "week": "27",
        "year": "2026"
    }
}
→ {
    "status": "completed",
    "duration_ms": 2100,
    "steps": [
        {"id": "fetch-data", "duration": 800},
        {"id": "generate-report", "duration": 1100},
        {"id": "send-email", "duration": 200}
    ],
    "result": "Report sent to team@company.com"
}
```

### ۵.۳ تأیید Skill پیشنهادی

```
POST /skills/proposals/{proposal_id}/approve
→ { "status": "approved", "skill_id": "skill-new-456" }
```

---

## ۶. Governance API

### ۶.۱ لاگ‌ها

```
GET /audit?agent_id=agent-xxx&from=2026-07-01&to=2026-07-07
→ {
    "logs": [
        {
            "timestamp": "2026-07-07T14:30:00Z",
            "agent_id": "agent-xxx",
            "action": "send-email",
            "model": "gpt-4o",
            "cost_cents": 4,
            "status": "success"
        }
    ],
    "total_cost_cents": 12450,
    "total_actions": 340
}
```

### ۶.۲ تأیید انسانی

```
GET /approvals/pending
→ {
    "pending": [
        {
            "id": "aprv-001",
            "agent": "Sales Agent",
            "action": "ثبت قرارداد $۵۰,۰۰۰",
            "reason": "مبلغ بیش از حد مجاز",
            "created_at": "2026-07-07T14:31:00Z"
        }
    ]
}

POST /approvals/{id}/approve
→ { "status": "approved", "action_executed": true }

POST /approvals/{id}/reject
{
    "reason": "قیمت مناسب نیست، دوباره مذاکره کن"
}
→ { "status": "rejected", "note": "به Agent اعلام شد" }
```

---

## ۷. WebSocket API (Real-time)

### Connection

```
ws://api.on4net.com/v1/ws?token=eyJ...
```

### Events (Server → Client)

| Event                | توضیح                 |
| -------------------- | --------------------- |
| `agent:message`      | پاسخ جدید از Agent    |
| `agent:status`       | تغییر وضعیت Agent     |
| `agent:error`        | خطا                   |
| `skill:suggestion`   | Skill جدید پیشنهاد شد |
| `approval:request`   | درخواست تأیید جدید    |
| `bi:alert`           | هشدار BI              |
| `marketplace:update` | بروزرسانی Marketplace |

### Events (Client → Server)

| Event              | توضیح                    |
| ------------------ | ------------------------ |
| `agent:chat`       | ارسال پیام به Agent      |
| `agent:cancel`     | لغو درخواست              |
| `memory:subscribe` | دنبال کردن تغییرات حافظه |

---

## ۸. Webhook API

### ثبت Webhook

```
POST /webhooks
{
    "url": "https://company.com/webhooks/o2n",
    "events": ["agent:message", "approval:request"],
    "secret": "whsec_xxx"
}
→ { "id": "wh-001", "status": "active" }
```

### Payload نمونه

```json
{
  "event": "approval:request",
  "timestamp": "2026-07-07T14:31:00Z",
  "organization_id": "org-xxx",
  "data": {
    "approval_id": "aprv-001",
    "agent": "Sales Agent",
    "action": "ثبت قرارداد",
    "amount": 50000
  }
}
```

---

## ۹. Error Codes

| کد                      | HTTP | توضیح                                                                |
| ----------------------- | ---- | -------------------------------------------------------------------- |
| `rate_limited`          | ۴۲۹  | محدودیت درخواست                                                      |
| `insufficient_budget`   | ۴۰۲  | بودجه Agent تمام شده                                                 |
| `model_unavailable`     | ۵۰۳  | مدل در دسترس نیست                                                    |
| `requires_approval`     | ۲۰۲  | نیاز به تأیید انسانی                                                 |
| `skill_not_found`       | ۴۰۴  | Skill یافت نشد                                                       |
| `permission_denied`     | ۴۰۳  | دسترسی غیرمجاز                                                       |
| `invalid_memory_layer`  | ۴۰۰  | لایه حافظه معتبر نیست                                                |
| `feature_not_available` | ۴۰۳  | قابلیت/پلن فعال نیست (مثلاً Programmer Agent بدون لایسنس AI Gateway) |

---

> **خلاصه:** API O₂N با REST + WebSocket + Webhook طراحی شده. همه عملیات (Chat, Memory, Skills, Governance, BI) از طریق API قابل دسترسی هستند. استریم پاسخ برای UX روان و real-time events برای notificationها.
