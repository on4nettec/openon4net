# Backlog — اپیک‌ها، استوری‌ها، و تسک‌ها

> این بک‌لاگ باید مستقیم از Specهای `docs/spect/` تغذیه شود.
> هدف: یک مسیر روشن از **Epic → Story → Task → Sprint**.
>
> **این سند فقط `apps/openon4net-runtime` (Plane 1) را پوشش می‌دهد.** برای `apps/openon4net-Platform` (Plane 2) به `docs/sprint-plan/04_control-plane-backlog.md` مراجعه کنید (namespace شناسه جدا: `E-06#`/`T-CP-###`).
>
> لینک‌ها:
>
> - Storyboard: `docs/sprint-plan/01_storyboard.md`
> - Sprint plan + tasks: `docs/sprint-plan/03_sprint-plan.md`
> - Control Plane backlog: `docs/sprint-plan/04_control-plane-backlog.md`
> - Traceability: `docs/sprint-plan/traceability.md`

---

## اپیک‌ها (Epics) — پوشش کامل Roadmap ۱۲ ماهه

> این لیست «ستون فقرات» Roadmap است. جزئیات تسک‌ها و زمان‌بندی در `docs/sprint-plan/03_sprint-plan.md` آمده است.

---

## Phase 0 — Core Engine (July–August 2026 | Weeks 1–8)

### E-001 — Foundation: Repo/CI/Dev Environment

**هدف:** آماده‌سازی زیرساخت توسعه تا تیم بتواند سریع و تکرارشونده تحویل بدهد.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/14-monorepo-layout.md`, `docs/spect/09_TASKS/02-deployment.md`

**استوری‌ها**

- US-001: به عنوان Developer، monorepo استاندارد داشته باشم تا build/test یکپارچه شود.
- US-002: به عنوان Developer، با `docker compose` کل استک را بالا بیاورم تا dev سریع شود.
- US-003: به عنوان Developer، CI داشته باشم تا کیفیت پایه enforce شود.

### E-002 — AI Gateway Core (Multi-model)

**هدف:** اتصال چند مدل + router + rate-limit + circuit breaker + cost tracking پایه.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/02-ai-gateway.md`, `docs/spect/02_ARCHITECTURE/11-secrets-and-key-management.md`

**استوری‌ها**

- US-010: به عنوان Admin، کلیدهای مدل را ثبت/مدیریت کنم تا اتصال امن باشد.
- US-011: به عنوان System، بین چند مدل route کنم تا failover ممکن باشد.
- US-012: به عنوان System، rate-limit/circuit-breaker داشته باشم تا پایداری حفظ شود.
- US-013: به عنوان Admin، هزینه را per-request ببینم تا کنترل budget ممکن باشد.

### E-003 — Agent Runtime + Chat API (MVP)

**هدف:** ساخت/مدیریت Agent + چت ساده و استریم (SSE) + tool registry پایه.  
**Spec مرجع:** `docs/spect/04_API/01-rest-api-spec.md`, `docs/spect/02_ARCHITECTURE/04-agent-communication.md`

**استوری‌ها**

- US-020: به عنوان Admin، Agent را CRUD کنم تا lifecycle مشخص باشد.
- US-021: به عنوان User، با Agent چت کنم تا خروجی بگیرم.
- US-022: به عنوان User، پاسخ را استریم دریافت کنم تا UX بهتر شود.
- US-023: به عنوان System، tool registry داشته باشم تا ابزارها قابل افزودن باشند.

### E-004 — Web Dashboard MVP

**هدف:** UI حداقلی برای login/settings/agents/chat.  
**Spec مرجع:** `docs/spect/00_VISION/05-ux-ui-design.md`

**استوری‌ها**

- US-030: به عنوان Admin، از UI کلیدها و Agentها را مدیریت کنم.
- US-031: به عنوان User، در UI با Agent چت کنم.

### E-005 — Observability & Ops Baseline

**هدف:** لاگ/متریک/تریس حداقلی + runbook پایه.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/08-observability-otel.md`, `docs/spect/09_TASKS/03-monitoring.md`

**استوری‌ها**

- US-040: به عنوان SRE، trace id داشته باشم تا ریشه‌یابی خطا ممکن شود.
- US-041: به عنوان تیم، runbook incident داشته باشیم تا پاسخ‌دهی سریع شود.

### E-006 — Security/RBAC Baseline (MVP)

**هدف:** RBAC پیش‌فرض + مدیریت secrets + threat model baseline.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/10-rbac-and-policy.md`, `docs/spect/02_ARCHITECTURE/15-rbac-default-matrix.md`, `docs/spect/08_CODING_STANDARD/04-threat-model.md`

**استوری‌ها**

- US-050: به عنوان Admin، نقش‌ها و دسترسی‌ها را اعمال کنم تا امنیت پایه برقرار باشد.
- US-051: به عنوان System، secrets را امن نگه دارم تا key leak کاهش یابد.

---

## Phase 1 — Memory (September–October 2026 | Weeks 9–16)

### E-010 — Memory L1/L2 (Redis + PostgreSQL)

**هدف:** short memory + conversation memory + query + summarization.  
**Spec مرجع:** `docs/spect/00_VISION/03-memory-engine.md`, `docs/spect/03_DATABASE/01-schema-master.md`

**استوری‌ها**

- US-100: به عنوان User، تاریخچه گفتگو حفظ شود تا هر بار از صفر شروع نکنم.
- US-101: به عنوان Admin، TTL و سیاست نگهداری را تنظیم کنم.
- US-102: به عنوان System، پس از N پیام خلاصه بسازم تا prompt budget کنترل شود.
- US-103: به عنوان User، history/summary را در UI ببینم.

### E-011 — Memory L3/L4 (Project + Company Knowledge)

**هدف:** project memory + company knowledge با pgvector و semantic search.  
**Spec مرجع:** `docs/spect/03_DATABASE/01-schema-master.md`

**استوری‌ها**

- US-110: به عنوان Admin، دانش پروژه را ingest کنم تا تیم روی context مشترک کار کند.
- US-111: به عنوان Admin، دانش سازمان را ingest کنم تا Agent پاسخ‌های سازمانی بدهد.
- US-112: به عنوان User، semantic search داشته باشم تا دانش سریع پیدا شود.
- US-113: به عنوان System، auto-classification انجام دهم تا داده به لایه درست برود.

### E-012 — Memory L5/L6 (Personal + Global)

**هدف:** personal/global knowledge + سیاست‌های دسترسی و نگهداری.  
**Spec مرجع:** `docs/spect/00_VISION/03-memory-engine.md`, `docs/spect/02_ARCHITECTURE/10-rbac-and-policy.md`

**استوری‌ها**

- US-120: به عنوان User، دانش شخصی‌ام جدا باشد تا privacy حفظ شود.
- US-121: به عنوان System، دانش عمومی را با سیاست‌ها مصرف کنم تا کیفیت/امنیت حفظ شود.

### E-013 — Memory Graph (Neo4j)

**هدف:** node/edge CRUD + graph query API + لینک به semantic.  
**Spec مرجع:** `docs/spect/00_VISION/03-memory-engine.md`, `docs/spect/03_DATABASE/01-schema-master.md`

**استوری‌ها**

- US-130: به عنوان Admin، گراف دانش بسازم تا ارتباط‌ها قابل پرس‌وجو باشد.
- US-131: به عنوان User، از graph query در پاسخ‌ها استفاده کنم تا accuracy بالا برود.

### E-014 — Memory Optimization

**هدف:** pruning, compression, ranking, benchmarks.  
**Spec مرجع:** `docs/spect/09_TASKS/04-performance.md`

**استوری‌ها**

- US-140: به عنوان System، context compression داشته باشم تا هزینه/latency کنترل شود.
- US-141: به عنوان System، pruning و time-decay داشته باشم تا حافظه سالم بماند.

---

## Phase 2 — Skills (November–December 2026 | Weeks 17–24)

### E-020 — Skill Engine Core

**هدف:** Skill registry + format (YAML) + versioning + execution engine.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/03-skill-engine.md`, `docs/spect/07_PROMPTS/01-master-prompts.md`

**استوری‌ها**

- US-200: به عنوان Developer، Skill را ثبت/نسخه‌بندی کنم تا قابل reuse باشد.
- US-201: به عنوان System، Skill را در runtime اجرا کنم تا tool-use انجام شود.

### E-021 — Auto-Skill Detection

**هدف:** pattern detector + پیشنهاد + approval flow + validation.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/03-skill-engine.md`

**استوری‌ها**

- US-210: به عنوان System، الگوها را تشخیص دهم تا پیشنهاد Skill بدهم.
- US-211: به عنوان Admin، پیشنهادها را تایید/رد کنم تا کنترل انسانی باشد.

### E-022 — Plugin SDK

**هدف:** SDK (npm) + plugin manifest + lifecycle.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/09-plugin-sandbox.md`

**استوری‌ها**

- US-220: به عنوان Developer، با SDK پلاگین بسازم تا اکوسیستم شکل بگیرد.
- US-221: به عنوان Admin، پلاگین را نصب/فعال/غیرفعال کنم.

### E-023 — Sandbox & Permissions

**هدف:** WASM sandbox + capabilities + metering.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/09-plugin-sandbox.md`, `docs/spect/08_CODING_STANDARD/02-security.md`

**استوری‌ها**

- US-230: به عنوان Admin، Permissionها را قبل از اجرا تایید کنم.
- US-231: به عنوان System، اجرای پلاگین را sandbox کنم تا امنیت حفظ شود.

### E-024 — Marketplace MVP

**هدف:** listing + install + publisher dashboard + analytics پایه.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/12-marketplace-service.md`, `docs/spect/02_ARCHITECTURE/06-economy-and-marketplace.md`

**استوری‌ها**

- US-240: به عنوان User، پلاگین‌ها را ببینم/نصب کنم.
- US-241: به عنوان Publisher، پلاگین را منتشر کنم و آمار پایه ببینم.

---

## Phase 3 — Organization (January–February 2027 | Weeks 25–32)

### E-030 — Multi-tenant Organization & Workspace

**هدف:** سازمان/ورک‌اسپیس چندمستاجری + CRUD.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/10-rbac-and-policy.md`

**استوری‌ها**

- US-300: به عنوان Admin، Organization بسازم تا tenant جدا داشته باشم.
- US-301: به عنوان Admin، Workspace بسازم تا تیم‌ها جدا شوند.

### E-031 — User Management & Invitations

**هدف:** کاربران/نقش‌ها/دعوت‌نامه‌ها.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/15-rbac-default-matrix.md`

**استوری‌ها**

- US-310: به عنوان Admin، کاربر اضافه/حذف کنم تا مدیریت تیم ممکن شود.
- US-311: به عنوان Admin، دعوت‌نامه ارسال کنم تا onboarding سریع شود.

### E-032 — Governance (Audit/HITL/Budgets)

**هدف:** audit log + HITL + approval queue + budget management.  
**Spec مرجع:** `docs/spect/09_TASKS/07-security-ops-runbook.md`

**استوری‌ها**

- US-320: به عنوان Admin، تاییدیه انسانی برای اکشن‌های حساس داشته باشم.
- US-321: به عنوان Admin، budget محدود کنم تا هزینه‌ها کنترل شود.
- US-322: به عنوان Auditor، audit log کامل داشته باشم.

### E-033 — Digital Employee

**هدف:** تبدیل Agent به Employee با نقش/KPI/سلسله‌مراتب/برنامه.  
**Spec مرجع:** `docs/spect/00_VISION/04-digital-employee.md`

**استوری‌ها**

- US-330: به عنوان Admin، role و KPI تعریف کنم تا outcome قابل اندازه‌گیری شود.
- US-331: به عنوان Admin، hierarchy و schedule تعریف کنم تا سازمانی شود.

### E-034 — Agent Teams & Workflow

**هدف:** تیم‌ها + workflow engine ساده (DAG) + delegation.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/05-workflow-engine.md`, `docs/spect/02_ARCHITECTURE/04-agent-communication.md`

**استوری‌ها**

- US-340: به عنوان Admin، تیم Agent بسازم تا کارها تقسیم شود.
- US-341: به عنوان User، workflow اجرا کنم تا چندمرحله‌ای شود.

---

## Phase 4 — Ecosystem (March–April 2027 | Weeks 33–40)

### E-040 — Marketplace Advanced (Payments/RevShare/Trust)

**هدف:** پرداخت + revenue share + review + verified publisher.  
**Spec مرجع:** `docs/spect/03_DATABASE/02-billing-schema.md`, `docs/spect/04_API/02-billing-and-marketplace-api.md`

**استوری‌ها**

- US-400: به عنوان User، پرداخت انجام دهم تا پلاگین‌های پولی بخرم.
- US-401: به عنوان Platform، سهم درآمد را حساب کنم تا ناشر پرداخت شود.
- US-402: به عنوان User، review بدهم تا اعتماد افزایش یابد.
- US-403: به عنوان Platform، ناشر verified کنم تا ریسک کاهش یابد.

### E-041 — Outcome Engine + BI Dashboard

**هدف:** KPI tracking + outcome measurement + BI + insights.  
**Spec مرجع:** `docs/spect/00_VISION/04-digital-employee.md`

**استوری‌ها**

- US-410: به عنوان Admin، KPI را track کنم تا عملکرد قابل اندازه‌گیری باشد.
- US-411: به عنوان User، داشبورد BI ببینم تا تصمیم‌گیری داده‌محور شود.

### E-042 — Smart Features (Reporting/Anomaly/Predict/NL)

**هدف:** گزارش‌های دوره‌ای + anomaly detection + predictive + پرس‌وجوی زبانی.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/08-observability-otel.md`

**استوری‌ها**

- US-420: به عنوان User، گزارش روزانه/هفتگی بگیرم تا وضعیت روشن باشد.
- US-421: به عنوان System، anomaly را تشخیص دهم تا هشدار بدهم.
- US-422: به عنوان User، با زبان طبیعی روی داده سؤال کنم.

### E-043 — Integration Hub

**هدف:** webhooks کامل + API جامع + Zapier/Make-like + import/export.  
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/07-connectors-and-tools.md`, `docs/spect/04_API/03-connectors-memory-ingestion-api.md`

**استوری‌ها**

- US-430: به عنوان Admin، وبهوک/اتصال بسازم تا سیستم‌ها متصل شوند.
- US-431: به عنوان User، workflowهای اتوماسیون بسازم تا کارها خودکار شود.

---

## Phase 5 — Enterprise (May–June 2027 | Weeks 41–48)

### E-050 — Enterprise Security & Compliance

**هدف:** SSO + SOC2 readiness + encryption at rest + VPC/private.  
**Spec مرجع:** `docs/spect/08_CODING_STANDARD/02-security.md`, `docs/spect/02_ARCHITECTURE/11-secrets-and-key-management.md`

**استوری‌ها**

- US-500: به عنوان Enterprise Admin، SSO داشته باشم تا مدیریت هویت ساده شود.
- US-501: به عنوان Auditor، کنترل‌های SOC2-ready ببینم تا compliance نزدیک شود.
- US-502: به عنوان Enterprise Admin، VPC/private network داشته باشم.

### E-051 — Performance & Scale

**هدف:** horizontal scaling + k8s + autoscaling + sharding + CDN.  
**Spec مرجع:** `docs/spect/09_TASKS/04-performance.md`, `docs/spect/09_TASKS/02-deployment.md`

**استوری‌ها**

- US-510: به عنوان Platform، سرویس‌ها scale شوند تا مشتری enterprise جواب بگیرد.

### E-052 — Reliability & DR

**هدف:** multi-region + DR + backup/restore + SLA monitoring + 99.9%.  
**Spec مرجع:** `docs/spect/09_TASKS/05-disaster-recovery.md`

**استوری‌ها**

- US-520: به عنوان SRE، DR و backup/restore داشته باشم تا downtime کم شود.
- US-521: به عنوان Platform، SLA monitor کنم تا 99.9% هدف شود.

### E-053 — Launch Readiness (Docs & Enablement)

**هدف:** docs site + public API docs + tutorials/examples + case studies + sales kit.  
**Spec مرجع:** `docs/spect/09_TASKS/10-production-artifacts.md`, `docs/spect/00_VISION/02-market-analysis.md`

**استوری‌ها**

- US-530: به عنوان Developer، API docs عمومی ببینم تا integration سریع شود.
- US-531: به عنوان Sales, sales kit داشته باشم تا فروش enterprise ممکن شود.

---

## قوانین اولویت‌بندی (Quick Rules)

1. هر آیتم که مسیر SB-01 را کوتاه‌تر می‌کند، اولویت بالاتری دارد.
2. هر آیتمی که observability/امنیت پایه را بالا می‌برد، قبل از featureهای پیچیده انجام شود.
3. هر آیتمی که وابستگی‌های سخت (DB schema, API contracts) دارد، جلوتر از UI polish قرار بگیرد.
