# Roadmap ۱۲ ماهه — Open on4net

> **فایل:** 01_ROADMAP/01-roadmap-12-months.md
> **نسخه:** 1.0
> **شروع:** July 2026

---

## ۱. فازبندی کلان

```
فاز ۰: Core Engine    ──── July - August 2026     (ماه ۱-۲)
فاز ۱: Memory         ──── September - October    (ماه ۳-۴)
فاز ۲: Skills         ──── November - December    (ماه ۵-۶)
فاز ۳: Organization   ──── January - February     (ماه ۷-۸)
فاز ۴: Ecosystem      ──── March - April          (ماه ۹-۱۰)
فاز ۵: Enterprise     ──── May - June             (ماه ۱۱-۱۲)
```

---

## ۲. فاز ۰: Core Engine (ماه ۱-۲ | July - August 2026)

> **وضعیت (2026-07-11): برای Runtime (Plane 1) کامل شده.** جزئیات و تاریخچه‌ی
> تست در `docs/spect/DONE.md` (بخش‌های Sprint 0 و «بعد از Sprint 0»). سه مورد
> پایین‌تر که checkbox ندارن (Model Router چند-مدلی، Circuit Breaker، و
> WebSocket) عمداً به شکل دیگه‌ای حل شدن — توضیح کنار هرکدوم.

### هدف: AI Gateway + Agent Framework پایه

### هفته ۱-۲: پروژه و زیرساخت

- [x] راه‌اندازی Monorepo (Turborepo + pnpm)
- [x] Docker Compose برای توسعه محلی
- [x] PostgreSQL + Redis + MinIO setup
- [x] CI/CD pipeline (GitHub Actions)
- [x] Structure اولیه packages

### هفته ۳-۴: AI Gateway Core

- Model Router (اتصال هم‌زمان + routing خودکار بین OpenAI/Claude/Gemini/Qwen) و
  Circuit Breaker: **به‌صراحت مال Control Plane's managed AI Gateway هستن،
  نه Runtime** — تصمیم معماری قبلاً گرفته شده و مستقیماً در کد مستند شده
  (`gateway/src/services/llm-service.ts`: _"Runtime deliberately does not
  reimplement [routing/fallback-chain/circuit-breaker]"_). Runtime فقط BYOK
  با یک provider فعال در هر لحظه است (`anthropic`/`openai`/`deepseek`/`ollama`) —
  Qwen/Gemini از طریق همون OpenAI-compatible adapter قابل‌استفاده‌ست اگه
  endpoint سازگار داشته باشن، ولی هیچ routing خودکاری بینشون نیست.
- [x] Rate Limiter (per-agent, Redis fixed-window)
- [x] Cost Tracker اولیه (`pricing.ts` + `used_budget_cents` + نمایش در داشبورد، RT-009)
- Health Check برای همه مدل‌ها: چون فقط یک provider هم‌زمان فعاله، معادلش
  `POST /v1/config/test-connection` است (تست همون provider فعال) — از قبل ساخته و تست شده.

### هفته ۵-۶: Agent Framework MVP

- [x] Agent Lifecycle (create, pause, resume, terminate)
- [x] Basic Chat API (`POST /v1/agents/:id/chat`)
- [x] Tool Registry
- [x] Simple Memory (لایه ۱ Redis + لایه ۲ PostgreSQL)
- استریم پاسخ: به‌جای WebSocket از **SSE** استفاده شده
  (`POST /v1/agents/:id/chat/stream`) — از نظر عملکردی معادل برای یک استریم
  یک‌طرفه‌ی سرور→کلاینت، شامل reconnect handling، از قبل کامل تست شده. جایگزینی عمدی بوده.

### هفته ۷-۸: Dashboard MVP

- [x] Next.js project
- [x] Login/Auth (فراتر از MVP — چند روش ورود، RT-014..018)
- [x] Chat UI با Agent
- [x] Agent list + create
- [x] Basic settings

### تحویل فاز ۰:

✅ یک Agent که با یک مدل BYOK حرف می‌زند (نه «چند مدل هم‌زمان» — طبق تصمیم معماری ۴-Plane، routing/چندمدلی مال Control Plane شد)
✅ داشبورد ساده برای چت
✅ Docker Compose برای deploy

---

## ۳. فاز ۱: Memory (ماه ۳-۴ | September - October)

### هدف: ۶ لایه حافظه + Memory Graph

### هفته ۹-۱۰: Short + Conversation Memory

- [ ] لایه ۱: Short Memory (Redis)
- [ ] لایه ۲: Conversation Memory (PostgreSQL)
- [ ] Conversation summarization
- [ ] Memory query API

### هفته ۱۱-۱۲: Project + Company Knowledge

- [ ] لایه ۳: Project Memory
- [ ] لایه ۴: Company Knowledge (pgvector)
- [ ] Semantic search
- [ ] Auto-classification: این دانش کدوم لایه؟

### هفته ۱۳-۱۴: Personal + Global + Graph

- [ ] لایه ۵: Personal Knowledge
- [ ] لایه ۶: Global Knowledge
- [ ] Neo4j راه‌اندازی
- [ ] Memory Graph: Node/Edge CRUD
- [ ] Graph query API

### هفته ۱۵-۱۶: Memory Optimization

- [ ] Memory Pruning خودکار
- [ ] Context compression (برای prompt budget)
- [ ] Ranking: relevance, time decay
- [ ] Benchmark: latency < 200ms

### تحویل فاز ۱:

✅ Agent با ۶ لایه حافظه
✅ Memory Graph
✅ Semantic search
✅ API کامل Memory

---

## ۴. فاز ۲: Skills (ماه ۵-۶ | November - December)

### هدف: Skill Engine + Auto-Skill Detection

### هفته ۱۷-۱۸: Skill Engine Core

- [ ] Skill Registry
- [ ] Skill format (YAML definition)
- [ ] Skill execution engine
- [ ] Skill versioning

### هفته ۱۹-۲۰: Auto-Skill Detection

- [ ] Pattern Detector (frequency analysis)
- [ ] Proposal system
- [ ] User approval flow
- [ ] Skill validation

### هفته ۲۱-۲۲: Plugin SDK

- [ ] SDK package (npm)
- [ ] Plugin manifest format
- [ ] WASM Sandbox
- [ ] Permission system
- [ ] Plugin lifecycle (install, enable, disable)

### هفته ۲۳-۲۴: Marketplace MVP

- [ ] Plugin listing page
- [ ] Install from marketplace
- [ ] Publisher dashboard
- [ ] Basic analytics (downloads, ratings)

### تحویل فاز ۲:

✅ Skill Engine با auto-detection
✅ Plugin SDK عمومی
✅ Marketplace پایه

---

## ۵. فاز ۳: Organization (ماه ۷-۸ | January - February 2027)

### هدف: Workspace + Governance + Digital Employee

### هفته ۲۵-۲۶: Organization & Workspace

- [ ] Multi-tenant architecture
- [ ] Organization CRUD
- [ ] Workspace CRUD
- [ ] User management + roles
- [ ] Invitation system

### هفته ۲۷-۲۸: Governance

- [ ] Audit Log کامل
- [ ] Human-in-the-Loop system
- [ ] Approval queue
- [ ] Budget management
- [ ] Access Control (RBAC)

### هفته ۲۹-۳۰: Digital Employee

- [ ] Agent → Employee transformation
- [ ] Role system (CEO, Marketing, Sales, …)
- [ ] Agent hierarchy (reports_to)
- [ ] Agent schedule
- [ ] Agent KPI definition

### هفته ۳۱-۳۲: Agent Teams

- [ ] Agent-to-Agent communication
- [ ] Workflow engine (simple DAG)
- [ ] Team assignment
- [ ] Task delegation

### تحویل فاز ۳:

✅ Multi-tenant با Organization
✅ Governance کامل
✅ Digital Employee با نقش و KPI
✅ Agent Teams

---

## ۶. فاز ۴: Ecosystem (ماه ۹-۱۰ | March - April 2027)

### هدف: Marketplace بالغ + BI Dashboard

### هفته ۳۳-۳۴: Marketplace پیشرفته

- [ ] Payment integration
- [ ] Revenue sharing (70/30)
- [ ] Plugin review system
- [ ] Verified publisher program

### هفته ۳۵-۳۶: Outcome Engine

- [ ] KPI tracking system
- [ ] Outcome measurement
- [ ] BI Dashboard (charts, reports)
- [ ] Automated insights ("فروش ۱۲٪ کم شده…")

### هفته ۳۷-۳۸: Smart Features

- [ ] Auto-reporting (daily/weekly)
- [ ] Anomaly detection
- [ ] Predictive analytics
- [ ] Natural language query on data

### هفته ۳۹-۴۰: Integration Hub

- [ ] Webhook system بالغ
- [ ] API برای همه چیز
- [ ] Zapier/Make-like workflow
- [ ] Import/Export

### تحویل فاز ۴:

✅ Marketplace کامل با پرداخت
✅ Outcome Engine + BI Dashboard
✅ Smart analytics
✅ Integration Hub

---

## ۷. فاز ۵: Enterprise (ماه ۱۱-۱۲ | May - June 2027)

### هدف: Enterprise-ready + Scale

### هفته ۴۱-۴۲: Enterprise Security

- [ ] SSO (SAML, OIDC)
- [ ] Audit compliance (SOC2 ready)
- [ ] Data encryption at rest
- [ ] VPC / Private network support

### هفته ۴۳-۴۴: Performance & Scale

- [ ] Horizontal scaling
- [ ] Kubernetes manifests
- [ ] Auto-scaling برای Agentها
- [ ] Database sharding strategy
- [ ] CDN for static assets

### هفته ۴۵-۴۶: Reliability

- [ ] Multi-region support
- [ ] Disaster recovery
- [ ] Backup/restore system
- [ ] SLA monitoring
- [ ] 99.9% uptime target

### هفته ۴۷-۴۸: Launch Prep

- [ ] Documentation site
- [ ] Public API docs (ReadMe/Swagger)
- [ ] Tutorials + examples
- [ ] Case studies
- [ ] Enterprise sales kit

### تحویل فاز ۵:

✅ Enterprise-ready
✅ 99.9% SLA
✅ Kubernetes deployment
✅ Full documentation

---

## ۸. Milestone Timeline

```
Jul ──── Core Engine: Chat with Agent
Aug ──── AI Gateway: Multi-Model
Sep ──── Memory: 6-Layer + Graph
Oct ──── Memory: Optimization
Nov ──── Skills: Engine + Auto-Detect
Dec ──── Plugin SDK + Marketplace
Jan ──── Organization + Governance
Feb ──── Digital Employee + Teams
Mar ──── Marketplace + Payment
Apr ──── Outcome Engine + BI
May ──── Enterprise Security
Jun ──── v1.0 Launch 🚀
```

---

> **خلاصه:** ۱۲ ماه → ۶ فاز → هر فاز ۲ ماه → ۴۸ هفته کار دقیق. هر هفته deliverables مشخص دارد. از Core Engine ساده شروع می‌کنیم و به Enterprise Platform کامل می‌رسیم.
