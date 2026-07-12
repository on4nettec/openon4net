# Scope Guardrails + MVP Boundaries (CTO) — Open on4net (O₂N)

> **فایل:** 09_TASKS/08-scope-guardrails-mvp.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف این سند

این سند برای جلوگیری از **Scope Creep** است تا تیم/Claude بداند:

- در MVP دقیقاً چه چیزی “باید” ساخته شود
- چه چیزهایی “فعلاً نباید” وارد MVP شوند
- معیار Done چیست

هدف MVP: یک **Customer Runtime** که واقعاً کار کند و برای یک شرکت کوچک/متوسط ارزش عملی بدهد؛ نه اینکه همه ۴ Plane را کامل کنیم.

---

## ۲) محصول نهایی MVP (در یک جمله)

**یک سازمان** بتواند روی سرور خودش O₂N را نصب کند، چند **Digital Employee** بسازد، یک دستور کسب‌وکاری بدهد، سیستم آن را به کارهای قابل اجرا تقسیم کند، اجرا کند، و همه چیز با **Governance + Audit + Budget** قابل کنترل و قابل ردیابی باشد.

---

## ۳) MVP Feature Set (Must / Should / Later)

### ۳.۱) Must Have (بدون این‌ها MVP شکست است)

**Core Runtime (Plane 1)**

- Organization/Workspace/User پایه (multi-tenant حداقلی)
- Agent CRUD (create/list/update/pause)
- Chat API (sync) + Stream (SSE)
- Memory L1/L2 (Redis + PostgreSQL: conversations/messages)
- Governance پایه:
  - permission check حداقلی
  - budget enforcement (credits یا cents)
  - approval queue برای درخواست‌های پرهزینه/حساس
  - audit_logs برای همه actionها
- ۱ تا ۲ Connector واقعی (کم‌ریسک و پرکاربرد):
  - Email (send)
  - Telegram (send) یا Slack (send)
- Observability حداقلی:
  - trace_id در پاسخ‌ها
  - چند span کلیدی (http + model call + tool call)

**Control Plane حداقلی (Plane 2 – MVP-lite)**

- activation/license ساده (می‌تواند mock/primitive باشد)
- credits view/read-only (شارژ واقعی می‌تواند بعداً)

### ۳.۲) Should Have (اگر زمان رسید، ارزش زیاد)

- Workflow Engine با YAML ساده (بدون Visual Builder)
- Skill Engine: approve پیشنهاد skill + execute
- Plugin install محلی (private install) + permissions approve

### ۳.۳) Later (بعد از ۲–۳ مشتری واقعی)

- Marketplace public + review pipeline + signing سخت‌گیرانه + payouts
- Managed AI (استفاده از کلیدهای شما به صورت سرویس)
- ~~Memory-as-a-Service providers (Plane 3 managed)~~ — **۲۰۲۶-۰۷-۱۲: زودتر انجام شد.**
  کاربر صریحاً guardrail را عبور داد («می‌خوام پروژه از حالت mvp دربیاد، هرکار
  لازم هست بکن») بعد از این‌که این تناقض مطرح شد که `01_ROADMAP/01-roadmap-12-months.md`
  همین کار را Phase 1 (ماه ۳-۴) برنامه‌ریزی کرده بود، نه Later. توجه: چیزی که
  ساخته شد **self-host واقعی** (Postgres/pgvector + Neo4j اختصاصی) است، نه
  یک ارائه‌دهنده‌ی managed برای مشتری‌های دیگر — یعنی همچنان با هدف §۵ (Plane
  3 = self-host) سازگار است، فقط زودتر از زمان‌بندی این فایل. جزئیات:
  `docs/spect/TODO-openon4net-memory.md` بخش C (MEM-008..013).
- Compute-provider network / “VM incentives”
- Multi-region + 99.9% SLA
- SSO/SAML + compliance کامل
- Visual Workflow Builder

---

## ۴) Guardrails (چیزهایی که در MVP ممنوع/De-scope هستند)

این موارد در MVP **نباید** وارد شوند:

- “شبکه غیرمتمرکز/بلاکچینی” برای AI یا Memory (فقط concept/اختیاری آینده)
- payout پولی به publisherها (فعلاً credits داخلی کافی است)
- همه Connectorها (CRM/Ads/Instagram) — فقط ۱–۲ مورد low-risk
- enterprise grade sharding/multi-region
- sandbox کامل WASM برای third-party (می‌تواند in-process برای first-party باشد؛ WASM فاز بعد)

> **شاخص تکمیلی:** همه‌ی taskهای post-MVP و خارج از MVP-lite در
> `docs/spect/09_TASKS/11-post-mvp-task-index.md` جمع شده‌اند تا review آن‌ها
> ساده‌تر باشد.

---

## ۵) چهار Plane در MVP چه وضعیتی دارند؟

### Plane 1 — Customer Runtime

**هدف:** کامل و قابل استفاده (MVP واقعی اینجاست)

### Plane 2 — AI Control Plane

**هدف:** activation + credits minimal  
**نکته:** managed AI و provider networks خارج از MVP

### Plane 3 — Long-term Memory

**هدف:** self-host (همین DBهای محلی)  
**managed providers:** فاز بعد

### Plane 4 — Marketplace

**هدف:** private/local install + registry ساده  
**public marketplace:** فاز بعد

---

## ۶) Acceptance Criteria (Definition of Done)

MVP زمانی Done است که:

- نصب با Docker Compose در < ۱۵ دقیقه بالا بیاید
- کاربر بتواند:
  - org/workspace بسازد
  - یک agent بسازد
  - به agent پیام بدهد و پاسخ بگیرد
  - history مکالمه ذخیره شود و قابل query باشد
- یک Tool واقعی اجرا شود (email/telegram) و:
  - permission/budget چک شود
  - در audit_logs ثبت شود
  - trace_id قابل دنبال‌کردن باشد
- اگر هزینه تخمینی از threshold رد شد:
  - درخواست در approval_queue بنشیند
  - تا approve نشود اجرا نشود

---

## ۷) Timeline پیشنهادی (۶ تا ۸ هفته)

1. هفته ۱–۲: repo/infra/db schema + api skeleton + auth stub
2. هفته ۳–۴: ai gateway minimal + chat + memory L1/L2
3. هفته ۵–۶: governance + audit + approvals + budget
4. هفته ۷–۸: ۱–۲ connector واقعی + dashboard ساده + hardening

---

## ۸) خروجی این سند برای Claude

Claude باید در هر مرحله این سؤال را از خودش بپرسد:

> “این feature مستقیم MVP را به Done نزدیک می‌کند یا فقط scope را بزرگ می‌کند؟”

اگر پاسخ دومی بود، feature باید به “Later” منتقل شود.

---

> **خلاصه:** MVP باید کوچک ولی “واقعاً قابل استفاده” باشد. هسته = Plane 1. بقیه planeها در MVP فقط حداقل لازم برای رشد/تجاری‌سازی را دارند.
