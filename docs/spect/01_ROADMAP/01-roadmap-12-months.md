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

> **وضعیت (2026-07-12): ۱۰۰٪ کامل.** لایه‌های ۱-۲ در Runtime (Sprint 0،
> T-007)؛ لایه‌های ۳-۶ + Memory Graph + Extractor/Ranking/Pruning/Compression/
> Benchmark در `apps/openon4net-memory` (MEM-008..018) — با تأیید صریح کاربر
> زودتر از زمان‌بندی رسمی (guardrail عبور داده شد، جزئیات:
> `docs/spect/TODO-openon4net-memory.md`). جزئیات تست‌شده/نشده هر آیتم:
> `docs/spect/DONE.md` بخش‌های Memory.

### هدف: ۶ لایه حافظه + Memory Graph

### هفته ۹-۱۰: Short + Conversation Memory

- [x] لایه ۱: Short Memory (Redis)
- [x] لایه ۲: Conversation Memory (PostgreSQL)
- [x] Conversation summarization
- [x] Memory query API

### هفته ۱۱-۱۲: Project + Company Knowledge

- [x] لایه ۳: Project Memory
- [x] لایه ۴: Company Knowledge (pgvector)
- [x] Semantic search
- [x] Auto-classification: این دانش کدوم لایه؟

### هفته ۱۳-۱۴: Personal + Global + Graph

- [x] لایه ۵: Personal Knowledge
- [x] لایه ۶: Global Knowledge
- [x] Neo4j راه‌اندازی
- [x] Memory Graph: Node/Edge CRUD
- [x] Graph query API

### هفته ۱۵-۱۶: Memory Optimization

- [x] Memory Pruning خودکار
- [x] Context compression (برای prompt budget)
- [x] Ranking: relevance, time decay
- [x] Benchmark: latency < 200ms

### تحویل فاز ۱:

✅ Agent با ۶ لایه حافظه
✅ Memory Graph
✅ Semantic search
✅ API کامل Memory

---

## ۴. فاز ۲: Skills (ماه ۵-۶ | November - December)

> **وضعیت (2026-07-12): هفته‌های ۱۷-۲۰ (Skill Engine Core + Auto-Skill
> Detection) کامل شد در `apps/openon4net-runtime` (RT-032, RT-033) — با
> تأیید صریح کاربر زودتر از زمان‌بندی رسمی.
>
> **بروزرسانی (همون روز):** هفته‌های ۲۱-۲۴ هم با تأیید صریح کاربر همون روز
> تکمیل شدن (RT-034..037, MKT-017..019, T-CP-007) — جزئیات:
> `docs/spect/DONE.md`'s «Phase 2 تکمیلی» و
> `docs/spect/06_MEETINGS/02-skills-plugins-marketplace-model.md`. WASM
> Sandbox و permission-system واقعی برای اجرای Plugin عمداً بیرون این batch
> موندن (طبق `09-plugin-sandbox.md` — یک آیتم جدا و بزرگ‌تر).

### هدف: Skill Engine + Auto-Skill Detection

### هفته ۱۷-۱۸: Skill Engine Core

- [x] Skill Registry (`skills` CRUD)
- [x] Skill format (JSON/Zod، نه لفظاً YAML — ساختار مشابه سند §۴، محدود به `trigger.type: 'manual'` و `steps[].type: 'tool'` در v1؛ `query`/`prompt` step types موکول به بعد)
- [x] Skill execution engine (`skill-executor.ts` — واقعاً روی `webhook-send`/`telegram-send` اجرا می‌شود)
- [ ] Skill versioning (فیلد `version` هست، ولی منطق bump/fork هنوز نیست)

### هفته ۱۹-۲۰: Auto-Skill Detection

- [x] Pattern Detector (Frequency + Similarity — ۲ از ۴ شرط سند، Duration/Complexity سیگنال قابل‌اتکا ندارن)
- [x] Proposal system (`skill_proposals`)
- [x] User approval flow (`routes/skill-proposals.ts` + صفحه `/skill-proposals`)
- [ ] Skill validation (فقط اعتبارسنجی Zod روی شکل داده — یک ماژول جدای safety-check/تست اجرایی ساخته نشده)

### هفته ۲۱-۲۲: Plugin SDK

- [x] SDK package (npm) — `@o2n/plugin-sdk` (`packages/plugin-sdk`) + CLI اسکلت‌ساز `create-o2n-plugin`
- [x] Plugin manifest format — `manifest.json` (`03-skill-engine.md` §۵) از قبل مستند بود، حالا `configSchema` هم اضافه شد
- [ ] WASM Sandbox — عمداً بیرون این batch (طبق `09-plugin-sandbox.md`)
- [ ] Permission system — manifest آرایه‌ی `permissions` را declare می‌کند، ولی enforcement واقعی روی اجرا هنوز نیست (اجرای Plugin خودش هنوز پیاده‌سازی نشده)
- [x] Plugin lifecycle (install, enable, disable) — نصب از Marketplace با activation-gating (subset: enable/disable دستی جدا از upgrade هنوز نیست، فقط `is_active` داخلی روی upgrade تغییر می‌کند)

### هفته ۲۳-۲۴: Marketplace MVP

- [x] Plugin listing page — `web/app/marketplace/page.tsx` (Plugin + Skill با هم)
- [x] Install from marketplace — `POST /v1/marketplace/{plugins,skills}/:id/install` (activation-gated)
- [ ] Publisher dashboard — فقط API (`/publisher/plugins`, `/publisher/skills`)، صفحه‌ی UI برای publisher هنوز نیست
- [ ] Basic analytics (downloads, ratings) — هنوز نیست

### تحویل فاز ۲:

✅ Skill Engine با auto-detection
✅ Plugin SDK عمومی (بدون WASM sandbox واقعی)
✅ Marketplace پایه (بدون publisher dashboard/analytics)

---

## ۵. فاز ۳: Organization (ماه ۷-۸ | January - February 2027)

### هدف: Workspace + Governance + Digital Employee

> **وضعیت (2026-07-13): هفته‌های ۲۵-۲۸ کامل شد** (RT-038..043 در
> `docs/spect/DONE.md`) — با تأیید صریح کاربر زودتر از زمان‌بندی رسمی.
> هفته‌های ۲۹-۳۲ (Digital Employee + Agent Teams) عمداً به یک batch بعدی
> موکول شدن — بزرگ‌ترین/پرریسک‌ترین بخش‌های فاز ۳ و طبق
> `09_TASKS/08-scope-guardrails-mvp.md` هم «Should»/«Later» بودن، نه Must.

### هفته ۲۵-۲۶: Organization & Workspace

- [x] Multi-tenant architecture (app-level `organization_id` scoping در همه جدول‌ها/query‌ها؛ بدون Postgres RLS یا isolation سخت‌تر — کافی برای self-host تک‌مستأجر-به-ازای-دیپلوی)
- [x] Organization CRUD — `GET`/`PATCH /v1/organization` (RT-038؛ `plan`/`status` عمداً غیرقابل‌ویرایش، کار Control-Plane)
- [x] Workspace CRUD — create از قبل بود، update/archive این batch اضافه شد (RT-039؛ حذف واقعی نه، چون `ON DELETE CASCADE` روی agents خطرناکه)
- [x] User management + roles — CRUD از قبل بود، تخصیص نقش سفارشی + workspace انتخابی این batch اضافه شد (RT-040)
- [x] Invitation system (RT-041 — ایمیل واقعی با همون `nodemailer` مگ‌لینک، صفحه‌ی `/accept-invite`)

### هفته ۲۷-۲۸: Governance

- [ ] Audit Log کامل — پوشش گسترده از قبل هست (chat/agents/skills/marketplace/approvals/login) ولی نه export/retention/tamper-evidence؛ این batch دست نزد
- [ ] Human-in-the-Loop system — از قبل واقعی و کار می‌کنه ولی فقط روی chat cost/policy scope شده، نه یک قلاب عمومی «هر اکشنی می‌تونه approval بخواد»؛ این batch دست نزد
- [x] Approval queue — `ApprovalService.create()` عمومی + `expireStale()` + صفحه‌ی `/approvals` (RT-042؛ trigger واقعی فعلاً همچنان فقط chat-cost/policy است، این batch فقط زیرساخت رو عمومی کرد)
- [x] Budget management — `WalletService` روی جدول `wallets` که تا الان schema-only بود (RT-043؛ سطح سازمان، opt-in، علاوه بر سقف موجود per-agent)
- [x] Access Control (RBAC) — baseline از قبل قوی‌ترین بخش بود؛ این batch محدودیت «فقط ۴ نقش سیستمی قابل‌تخصیص» رو برداشت (RT-040)

### هفته ۲۹-۳۰: Digital Employee (موکول شد)

- [ ] Agent → Employee transformation
- [ ] Role system (CEO, Marketing, Sales, …) — فیلد `agents.role` آزاد از قبل هست، یک catalog ساختاریافته نیست
- [ ] Agent hierarchy (reports_to) — ستون FK از قبل کار می‌کنه، ابزار traversal/validation/UI نیست
- [x] Agent schedule (RT-007 — از قبل کامل و واقعاً کار می‌کنه)
- [ ] Agent KPI definition — فقط یک ستون JSONB ذخیره‌سازی، بدون هیچ محاسبه/گزارش‌گیری

### هفته ۳۱-۳۲: Agent Teams (موکول شد، عمداً کاملاً خالی)

- [ ] Agent-to-Agent communication
- [ ] Workflow engine (simple DAG)
- [ ] Team assignment
- [ ] Task delegation

### تحویل فاز ۳:

✅ Multi-tenant با Organization
✅ Governance — تعمیم‌یافته (Approval queue + Wallet)، نه «کامل» به معنای سند (Audit/HITL گسترش پیدا نکردن)
❌ Digital Employee با نقش و KPI — موکول شد
❌ Agent Teams — موکول شد

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
