# Tasks — Open on4net

> **فایل:** 09_TASKS/01-current-sprint.md
> **نسخه:** 1.0
> **Sprint:** ۰ — Foundation (July 7-21, 2026)

---

## Sprint 0: Foundation

اولین قدم برای ساختن O₂N. تمرکز روی Core Engine و زیرساخت.

---

## Priority 1 (🔥 بحرانی — همین هفته)

### T-001: Monorepo Setup
```yaml
id: T-001
title: راه‌اندازی Monorepo با Turborepo
priority: 🔥 critical
estimate: ۲-۳ ساعت
assignee: Pouya
dependencies: []
status: ⏳ pending

steps:
  - init Turborepo + pnpm workspaces
  - ساختار apps/ و packages/
  - TypeScript config مشترک
  - ESLint + Prettier config
  - Git hooks (husky)

output: github.com/on4nettec/openon4net با ساختار monorepo
```

### T-002: Docker Compose Dev Environment
```yaml
id: T-002
title: Docker Compose برای توسعه محلی
priority: 🔥 critical
estimate: ۳-۴ ساعت
assignee: Pouya
dependencies: []

steps:
  - Dockerfile برای API
  - Dockerfile برای Web
  - docker-compose.yml با:
    - PostgreSQL 16
    - Redis 7
    - MinIO
    - API service
    - Web service
  - Volume mapping
  - Health checks

output: با docker compose up همه چیز بالا بیاید
```

### T-003: AI Gateway — اولین Model Connection
```yaml
id: T-003
title: اتصال به اولین مدل (API Key Setup)
priority: 🔥 critical
estimate: ۴-۵ ساعت
assignee: Pouya
dependencies: [T-001]

steps:
  - OpenAI API integration
  - Claude API integration
  - Model Router MVP (rule-based)
  - Basic prompt passthrough
  - Rate limiter اولیه

output: GET /api/chat?q=hello → پاسخ از مدل
```

---

## Priority 2 (⚡ بالا — این Sprint)

### T-004: Basic Chat API
```yaml
id: T-004
title: API چت ساده با Agent
priority: ⚡ high
estimate: ۴ ساعت
assignee: Pouya
dependencies: [T-003]

features:
  - POST /agents/:id/chat
  - POST /agents/:id/chat/stream (SSE)
  - Conversation history (Memory لایه ۱ و ۲)
  - Basic error handling

output: یک Agent که history مکالمه را به خاطر می‌سپارد
```

### T-005: Next.js Dashboard MVP
```yaml
id: T-005
title: داشبورد ساده با Next.js
priority: ⚡ high
estimate: ۶-۸ ساعت
assignee: Pouya
dependencies: [T-001]

features:
  - Authentication page
  - Chat interface با Agent
  - Agent list
  - Create new Agent form
  - Settings page (API Keys)

output: https://app.on4net.com/chat با UI اولیه
```

### T-006: GitHub CI/CD
```yaml
id: T-006
title: CI/CD Pipeline
priority: ⚡ high
estimate: ۲ ساعت
assignee: Pouya
dependencies: [T-001]

steps:
  - GitHub Actions: lint + typecheck
  - GitHub Actions: test
  - GitHub Actions: build
  - Docker image build on main
  - Deploy to staging (optional)

output: هر push به main → تست و build
```

---

## Priority 3 (📋 معمولی — این Sprint اگر وقت باشد)

### T-007: Simple Memory Layer 1 & 2
```yaml
id: T-007
title: لایه ۱ و ۲ حافظه (Redis + PostgreSQL)
priority: 📋 normal
estimate: ۴ ساعت
assignee: Pouya
dependencies: [T-002]

features:
  - لایه ۱: Short Memory در Redis (TTL-based)
  - لایه ۲: Conversation Memory در PostgreSQL
  - Memory CRUD API
  - Auto-summary بعد از ۵۰ پیام

output: Agent تاریخچه مکالمه را به خاطر دارد
```

### T-008: Agent Lifecycle
```yaml
id: T-008
title: چرخه حیات Agent (CRUD)
priority: 📋 normal
estimate: ۳ ساعت
assignee: Pouya
dependencies: [T-001]

features:
  - ایجاد Agent
  - فعال/غیرفعال کردن
  - حذف Agent
  - Agent config (name, role, model prefs)
  - API کامل

output: CRUD Agent از داشبورد و API
```

---

## Sprint Backlog

| Task | Priority | Status | Dependencies |
|------|----------|--------|-------------|
| T-001 Monorepo | 🔥 | ⏳ | - |
| T-002 Docker Compose | 🔥 | ⏳ | - |
| T-003 AI Gateway | 🔥 | ⏳ | T-001 |
| T-004 Chat API | ⚡ | ⏳ | T-003 |
| T-005 Dashboard | ⚡ | ⏳ | T-001 |
| T-006 CI/CD | ⚡ | ⏳ | T-001 |
| T-007 Memory L1/L2 | 📋 | ⏳ | T-002 |
| T-008 Agent CRUD | 📋 | ⏳ | T-001 |

---

## تعاریف

| وضعیت | توضیح |
|-------|--------|
| ⏳ Pending | آماده برای شروع |
| 🏗️ In Progress | در حال انجام |
| ✅ Done | تکمیل شده |
| ❌ Blocked | مسدود |

| Priority | توضیح |
|----------|-------|
| 🔥 Critical | اگر نباشد، پروژه جلو نمی‌رود |
| ⚡ High | مهم اما blocker نیست |
| 📋 Normal | وقتی وقت شد |
| 💭 Backlog | ایده برای بعد |

---

> این اولین Sprint است. با اتمام این ۸ Task، O₂N یک MVP قابل اجرا دارد: یک Agent که چت می‌کند، history را به خاطر می‌سپارد، و از dashboard قابل استفاده است.
