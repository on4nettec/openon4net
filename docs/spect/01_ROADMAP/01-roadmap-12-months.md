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
> `docs/spect/06_MEETINGS/02-skills-plugins-marketplace-model.md`.
>
> **بروزرسانی (2026-07-14):** ۶ آیتم باقی‌مانده‌ی این فاز هم تکمیل شد
> (RT-049..053, MKT-020..022) — versioning/fork، Skill validation module،
> permission-diff consent gate، analytics (downloads/ratings)، و publisher
> dashboard. **WASM Sandbox عمداً همچنان بیرون این batch موند** (طبق
> `09-plugin-sandbox.md` و تأیید صریح کاربر) — «Permission system» یعنی
> consent gate روی install/upgrade (MKT-010 از قبل + RT-051 این batch)، نه
> sandboxing واقعی روی اجرا، چون اصلاً هیچ Plugin execution engine ای هنوز
> ساخته نشده. جزئیات: `docs/spect/DONE.md`.

### هدف: Skill Engine + Auto-Skill Detection

### هفته ۱۷-۱۸: Skill Engine Core

- [x] Skill Registry (`skills` CRUD)
- [x] Skill format (JSON/Zod، نه لفظاً YAML — ساختار مشابه سند §۴، محدود به `trigger.type: 'manual'` و `steps[].type: 'tool'` در v1؛ `query`/`prompt` step types موکول به بعد)
- [x] Skill execution engine (`skill-executor.ts` — واقعاً روی `webhook-send`/`telegram-send` اجرا می‌شود)
- [x] Skill versioning — `SkillService.update()` روی تغییر `definition` نسخه رو auto-bump می‌کنه (patch)، `SkillService.fork()` + `POST /v1/skills/:id/fork` (RT-049)

### هفته ۱۹-۲۰: Auto-Skill Detection

- [x] Pattern Detector (Frequency + Similarity — ۲ از ۴ شرط سند، Duration/Complexity سیگنال قابل‌اتکا ندارن)
- [x] Proposal system (`skill_proposals`)
- [x] User approval flow (`routes/skill-proposals.ts` + صفحه `/skill-proposals`)
- [x] Skill validation — `services/skill-validator.ts` (شناسه‌ی تکراری، سقف تعداد step، و SSRF guard وب‌هوک در زمان _ذخیره_، نه فقط اجرا) — `query`/`prompt` step types همچنان بیرون (RT-050)

### هفته ۲۱-۲۲: Plugin SDK

- [x] SDK package (npm) — `@o2n/plugin-sdk` (`packages/plugin-sdk`) + CLI اسکلت‌ساز `create-o2n-plugin`
- [x] Plugin manifest format — `manifest.json` (`03-skill-engine.md` §۵) از قبل مستند بود، حالا `configSchema` هم اضافه شد
- [ ] WASM Sandbox — عمداً بیرون این batch (طبق `09-plugin-sandbox.md` و تأیید صریح کاربر، 2026-07-14)
- [x] Permission system — چون هنوز هیچ Plugin execution engine ای نیست (نیازمند WASM Sandbox بالا)، «enforcement» یعنی consent gate در Runtime: `permissions` حالا در discovery API نشون داده می‌شه + `acknowledgePermissionDiff` تا انتهای UI وایر شد (MKT-010 قبلاً سمت marketplace بود، RT-051 سمت Runtime این batch)
- [x] Plugin lifecycle (install, enable, disable) — نصب از Marketplace با activation-gating (subset: enable/disable دستی جدا از upgrade هنوز نیست، فقط `is_active` داخلی روی upgrade تغییر می‌کند)

### هفته ۲۳-۲۴: Marketplace MVP

- [x] Plugin listing page — `web/app/marketplace/page.tsx` (Plugin + Skill با هم)
- [x] Install from marketplace — `POST /v1/marketplace/{plugins,skills}/:id/install` (activation-gated)
- [x] Publisher dashboard — صفحه‌ی جدید `web/app/marketplace/publisher/page.tsx` روی API از قبل موجود `/publisher/{plugins,skills}` (MKT-022, RT-053) — بدون publisher identity واقعی (MVP-lite، همون shared-secret)
- [x] Basic analytics (downloads, ratings) — `plugin_ratings`/`skill_ratings` (migration جدید در پلن Marketplace)، `installCount` (COUNT روی installs موجود، بدون ستون جدید)، `avgRating`/`ratingCount`، rate کردن از UI (MKT-020/021, RT-052)

### تحویل فاز ۲:

✅ Skill Engine با auto-detection + versioning/fork + validation module
✅ Plugin SDK عمومی (بدون WASM sandbox واقعی — عمداً موکول شد)
✅ Marketplace کامل: install + permission consent + publisher dashboard + analytics (downloads/ratings)

---

## ۵. فاز ۳: Organization (ماه ۷-۸ | January - February 2027)

### هدف: Workspace + Governance + Digital Employee

> **وضعیت (2026-07-14): کل فاز ۳ (هفته ۲۵-۳۲) کامل شد** (RT-038..048,
> RT-054..056 در `docs/spect/DONE.md`) — با تأیید صریح کاربر زودتر از
> زمان‌بندی رسمی. هفته‌های ۲۹-۳۲ (RT-044..048) با v1-scoping ساخته شدن:
> Workflow Engine فقط DAG ساده (`agent`/`tool`/`human`/`parallel`/`condition`،
> بدون `loop`/`notification`/Visual Builder/trigger زمان‌بندی‌شده) طبق
> `09_TASKS/08-scope-guardrails-mvp.md`. Outcome Engine (تحلیل خودکار
> KPI/business intelligence) عمداً بیرون این batch موند — مال فاز ۴.
> Governance (هفته ۲۷-۲۸) هم بعداً (2026-07-14) تکمیل شد: Audit Log
> export/retention/tamper-evidence (RT-054/055) و HITL عمومی‌شده (RT-056،
> فقط روی مسیرهای مستقیم اجرای tool، نه Workflow steps — عمداً محدود).

### هفته ۲۵-۲۶: Organization & Workspace

- [x] Multi-tenant architecture (app-level `organization_id` scoping در همه جدول‌ها/query‌ها؛ بدون Postgres RLS یا isolation سخت‌تر — کافی برای self-host تک‌مستأجر-به-ازای-دیپلوی)
- [x] Organization CRUD — `GET`/`PATCH /v1/organization` (RT-038؛ `plan`/`status` عمداً غیرقابل‌ویرایش، کار Control-Plane)
- [x] Workspace CRUD — create از قبل بود، update/archive این batch اضافه شد (RT-039؛ حذف واقعی نه، چون `ON DELETE CASCADE` روی agents خطرناکه)
- [x] User management + roles — CRUD از قبل بود، تخصیص نقش سفارشی + workspace انتخابی این batch اضافه شد (RT-040)
- [x] Invitation system (RT-041 — ایمیل واقعی با همون `nodemailer` مگ‌لینک، صفحه‌ی `/accept-invite`)

### هفته ۲۷-۲۸: Governance

- [x] Audit Log کامل — export (`GET /v1/audit/export?format=csv|json`)، retention (`organizations.settings.auditRetentionDays` + `AUDIT_RETENTION_DAYS` + scheduler روزانه)، tamper-evidence (زنجیره‌ی hash SHA-256 با `prev_hash`/`row_hash` + `verifyChain()`؛ فقط از migration 0020 به بعد، ردیف‌های قدیمی‌تر verifiable نیستن) (RT-054, RT-055)
- [x] Human-in-the-Loop system — عمومی شد فراتر از chat: `PolicyCondition`'s نوع جدید `action_type_in` + قلاب توی دو route مستقیم اجرای tool (`telegram-send`/`webhook-send`)؛ عمداً Workflow Engine's خودِ step های `tool`/`agent` رو نگرفت (scope محدود، نه فراموشی) (RT-056)
- [x] Approval queue — `ApprovalService.create()` عمومی + `expireStale()` + صفحه‌ی `/approvals` (RT-042؛ trigger واقعی فعلاً همچنان فقط chat-cost/policy است، این batch فقط زیرساخت رو عمومی کرد)
- [x] Budget management — `WalletService` روی جدول `wallets` که تا الان schema-only بود (RT-043؛ سطح سازمان، opt-in، علاوه بر سقف موجود per-agent)
- [x] Access Control (RBAC) — baseline از قبل قوی‌ترین بخش بود؛ این batch محدودیت «فقط ۴ نقش سیستمی قابل‌تخصیص» رو برداشت (RT-040)

### هفته ۲۹-۳۰: Digital Employee

- [x] Agent → Employee transformation — feature جدا نیست؛ حاصل جمع role catalog + hierarchy + KPI + schedule/budget از قبل موجوده (RT-044..046؛ مستند در `docs/spect/DONE.md`'s تصمیم‌های طراحی)
- [x] Role system (CEO, Marketing, Sales, …) — `AGENT_ROLE_CATALOG` (۱۲ نقش) در `packages/shared`، `agents.role` همچنان `VARCHAR` آزاد (RT-044)
- [x] Agent hierarchy (reports_to) — `assertNoReportsToCycle` + `listReports`/`listTeam` + org-chart تو-رفته در UI (RT-045)
- [x] Agent schedule (RT-007 — از قبل کامل و واقعاً کار می‌کنه)
- [x] Agent KPI definition — `KpiDefinitionSchema` + `updateKpis` + پنل UI؛ فقط target/current ادمین‌تنظیم، بدون محاسبه‌ی خودکار (RT-046؛ Outcome Engine مال فاز ۴)

### هفته ۳۱-۳۲: Agent Teams

- [x] Agent-to-Agent communication — `agent_messages` + `agent-message-scheduler.ts`، async/fire-and-forget (RT-047)
- [x] Workflow engine (simple DAG) — `agent`/`tool`/`human`/`parallel`/`condition` step types، اجرای دستی فقط v1، بدون Visual Builder (RT-048)
- [x] Team assignment — `AgentService.listTeam()` روی `reports_to` موجود، بدون جدول جدید (RT-045)
- [x] Task delegation — feature جدا نیست؛ همون step نوع `agent` توی Workflow Engine (RT-048)

### تحویل فاز ۳:

✅ Multi-tenant با Organization
✅ Governance — کامل: Approval queue + Wallet + Audit Log (export/retention/tamper-evidence) + HITL عمومی‌شده (محدود به مسیرهای مستقیم tool، نه Workflow steps)
✅ Digital Employee با نقش و KPI — role catalog + hierarchy + KPI (v1: بدون Outcome Engine خودکار)
✅ Agent Teams — messaging + Workflow Engine v1 (بدون Visual Builder/scheduled trigger) + team assignment

---

## ۶. فاز ۴: Ecosystem (ماه ۹-۱۰ | March - April 2027)

### هدف: Marketplace بالغ + BI Dashboard

### هفته ۳۳-۳۴: Marketplace پیشرفته

- [x] Payment integration — **stub عمداً، طبق تصمیم کاربر** (نه Stripe/درگاه واقعی): گپ واقعی این بود که نصب آیتم پولی هیچ‌وقت کیف‌پول سازمان نصب‌کننده رو کسر نمی‌کرد؛ حالا `routes/marketplace.ts` قبل از نصب قیمت رو از marketplace می‌پرسه و `WalletService.debit()` رو صدا می‌زنه (RT-057, MKT-023). شارژ واقعی کیف‌پول (از طریق کارت/Stripe) همچنان دستی/ادمین است (RT-043)
- [x] Revenue sharing (70/30) — از قبل ساخته شده بود (`accrueRevenueShare`، ۷۰۰۰bps)، فقط اینجا و در `TODO-openon4net-marketplace.md` هیچ‌وقت ✅ نشده بود؛ payout هنوز فقط دفتری، نه پول واقعی (عمداً، طبق guardrail)
- [x] Plugin review system — از قبل ساخته شده بود (manual approve/reject + هیوریستیک allowlist خودکار)؛ SAST/dependency-scan واقعی همچنان نیست
- [x] Verified publisher program — از قبل یک flag ادمین ساده بود (`verifyPublisher`)؛ بدون معیار/KYC واقعی، مستند شده به‌عنوان محدودیت

### هفته ۳۵-۳۶: Outcome Engine

- [x] KPI tracking system — `KpiDefinitionSchema` گرفت `metricType` (`manual`/`action_count`/`cost_cents`/`success_rate`) + `windowDays`؛ پیش‌فرض `manual` یعنی سازگار با عقب (RT-058)
- [x] Outcome measurement — `agent_kpi_snapshots` (migration جدید) + `kpi-computation-service.ts` (aggregate روی `audit_logs`) + `kpi-snapshot-scheduler.ts` (روزانه) — تاریخچه‌ی روند، نه فقط آخرین مقدار (RT-058)
- [x] BI Dashboard (charts, reports) — صفحه‌ی `/outcomes` با sparkline دست‌ساز SVG (بدون افزودن کتابخانه‌ی جدید)؛ روت `GET /v1/agents/:id/kpi-outcomes` عمداً insights+anomalies+prediction رو یکجا برمی‌گردونه (RT-059)
- [x] Automated insights ("فروش ۱۲٪ کم شده…") — `insight-generator.ts`: جمله‌ی template‌شده وقتی `|% change| > 15` — **هیوریستیک آستانه‌ای، نه NLG واقعی** (RT-060)

### هفته ۳۷-۳۸: Smart Features

- [x] Auto-reporting (daily/weekly) — opt-in (`organizations.settings.reportingEnabled`/`reportingFrequency`)؛ `report-scheduler.ts` فقط اگه SMTP تنظیم شده باشه ایمیل می‌فرسته، وگرنه گزارش فقط از طریق `GET /v1/reports/latest` در دسترسه (RT-061)
- [x] Anomaly detection — `anomaly-detector.ts`: Z-score نسبت به میانگین/انحراف‌معیار ۳۰روزه‌ی trailing — **هیوریستیک آماری ساده، نه مدل آموزش‌دیده** (RT-062)
- [x] Predictive analytics — `trend-predictor.ts`: رگرسیون خطی ساده (OLS) روی نقاط اخیر — **برون‌یابی خطی، نه پیش‌بینی واقعی** (RT-063)
- [x] Natural language query on data — `nl-query-service.ts`: سوال کاربر با LLM به یک intent ثابت و Zod-validated ترجمه می‌شه (`{metric, agentId, windowDays}`) — **LLM هیچ‌وقت SQL یا کوئری آزاد تولید نمی‌کنه**، فقط از بین گزینه‌های محدود انتخاب می‌کنه؛ جواب عددی با یک تماس دوم LLM به جمله تبدیل می‌شه (RT-064)

### هفته ۳۹-۴۰: Integration Hub

- [x] Webhook system بالغ — `webhook-connector.ts` از قبل فقط outbound بود؛ حالا inbound هم هست: `webhook_endpoints` (migration جدید، token هش‌شده مثل magic-link/invitation)، `POST /v1/webhooks/:token` (public، بدون JWT — خودِ token اعتبارسنجیه)، rate-limited (RT-065)
- [x] API برای همه چیز — از قبل ۲۲+ فایل route برای موجودیت‌های اصلی بود؛ این batch فقط `GET /v1/skills/:id/export` و `GET /v1/workflows/:id/export` رو اضافه کرد (پایین‌تر)
- [x] Zapier/Make-like workflow — Workflow Engine's DAG (`agent`/`tool`/`human`/`parallel`/`condition`) از فاز ۳ بود، فقط manual-run؛ حالا `workflows.trigger` ستون جدید (`manual`/`scheduled`/`webhook`) + `workflow-trigger-scheduler.ts` (همون الگوی interval بدون کتابخانه‌ی cron) (RT-066)
- [x] Import/Export — `GET /v1/skills/:id/export` / `GET /v1/workflows/:id/export` (فقط `{name, description, definition}` قابل‌حمل)؛ «import» یعنی همون `POST` ایجاد موجود، بدون روت جدا؛ UI هر دو صفحه دکمه‌ی Export + حالت paste-JSON برای import گرفتن (RT-067)

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
