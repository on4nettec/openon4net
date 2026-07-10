# Done Log

> به‌روزرسانی می‌شود بعد از هر تسک تکمیل‌شده. هدف: تصویر سریع از اینکه چقدر
> پروژه واقعاً ساخته شده، بدون نیاز به مرور کل تاریخچه commitها.
>
> **Scope:** `apps/openon4net-runtime` (Plane 1) + از 2026-07-09 به‌صراحت
> `apps/openon4net-control-plane` (Plane 2) هم شروع شد. `memory`/`marketplace`
> هنوز شروع نشده مگر درخواست جداگانه. برای نقشه کامل ۱۲ماهه/۴-Plane به
> `docs/sprint-plan/*.md` نگاه کن (Control Plane مشخصاً:
> `docs/sprint-plan/04_control-plane-backlog.md`).
>
> **ستون «تست»:**
>
> - ✅ = واقعاً end-to-end روی زیرساخت واقعی اجرا و تأیید شده (curl/مرورگر واقعی، نه فقط build/typecheck)
> - ⚠️ = کد کامل و build/typecheck سبز، ولی رفتار واقعی‌اش مستقیماً چک نشده
> - 🔧 = کد کامل نوشته شده، ولی حتی build/typecheck هم اجرا نشده (پایین‌تر از ⚠️ — فقط برای Control Plane، چون هنوز در `pnpm-workspace.yaml` ثبت نیست؛ ریسک باگ ساده تایپ/import هنوز هست)
> - ❌ = اصلاً پیاده‌سازی/تست نشده

**آخرین به‌روزرسانی:** 2026-07-10

---

## خلاصه وضعیت

| بخش                               | وضعیت                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| Runtime — Sprint 0 (T-001..T-008) | ۸ از ۸ تکمیل، همه تست‌شده                                                           |
| Runtime — کارهای بعد از Sprint 0  | ۷ فیچر تکمیل، همه تست‌شده به‌جز ارسال واقعی تلگرام                                  |
| Control Plane (Plane 2)           | CP-SP-01 + CP-SP-02 کد کامل (🔧 build/typecheck نشده)؛ T-CP-002/T-CP-007 عمداً معلق |
| Memory (Plane 3)                  | فقط اسکلت اولیه `service/` (Fastify+Zod، روت‌ها 501)                                |
| Marketplace (Plane 4)             | شروع نشده — فقط README                                                              |

---

## Sprint 0 — `docs/spect/09_TASKS/01-current-sprint.md`

| #     | تسک                                                                   | وضعیت                             | تست                                                                    |
| ----- | --------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| T-001 | Monorepo Setup (pnpm+turbo، packages/shared،governance،llm-providers) | ✅                                | ✅ build/typecheck/lint سبز                                            |
| T-002 | Docker Compose Dev Environment (Postgres/Redis/MinIO/migrations)      | ✅                                | ✅ 8 جدول ساخته شده، سرویس‌ها healthy                                  |
| T-003 | AI Gateway — اولین اتصال مدل (BYOK, یک provider)                      | ✅                                | ✅ تماس واقعی با Ollama                                                |
| T-004 | Basic Chat API (sync + SSE stream)                                    | ✅                                | ✅ هر دو مسیر با پیام واقعی                                            |
| T-005 | Next.js Dashboard MVP                                                 | ✅                                | ✅ login→list→create→chat با Playwright واقعی                          |
| T-006 | GitHub CI/CD                                                          | ✅ (`ci.yml`, `docker-build.yml`) | ✅ push واقعی (2026-07-10) — هر دو workflow روی GitHub Actions سبز شدن |
| T-007 | Memory Layer 1 (Redis) & 2 (Postgres)                                 | ✅                                | ✅ پیام‌ها/summary در DB و session در Redis تأیید شد                   |
| T-008 | Agent Lifecycle (CRUD + pause/resume/terminate)                       | ✅                                | ✅ از طریق API و داشبورد                                               |

---

## بعد از Sprint 0 (بدون شناسه رسمی — از تحلیل شکاف sprint-plan)

| فیچر                                                          | وضعیت      | تست                                                                                                            |
| ------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| Approval queue (تأیید/رد + اجرای مجدد بعد از تأیید)           | ✅         | ✅ شامل حالت با provider override شده                                                                          |
| Telegram send tool (اسکلت + اتصال واقعی به Telegram Bot API)  | ✅ کد کامل | ❌ ارسال واقعی تست نشده (نیاز به bot token واقعی — به تعویق افتاده)                                            |
| داشبورد: pause/resume/terminate/test-connection               | ✅         | ✅ با Playwright واقعی                                                                                         |
| SSE reconnect handling (قطع اتصال وسط استریم)                 | ✅         | ✅ شبیه‌سازی قطع با Playwright                                                                                 |
| ONBOARDING.md                                                 | ✅         | n/a (مستندسازی)                                                                                                |
| Observability — Prometheus `/metrics` (معادل T-020)           | ✅         | ✅ HTTP + LLM metrics، هم مسیر sync هم stream                                                                  |
| BYOK config قابل‌ویرایش per-organization (رمزنگاری‌شده در DB) | ✅         | ✅ شامل: 403 برای non-admin، 400 برای payload نامعتبر، تعامل با approval queue، رمزنگاری واقعی در DB تأیید شده |

---

## Control Plane (Plane 2) — `docs/sprint-plan/04_control-plane-backlog.md`

> شروع: 2026-07-09، به‌صراحت درخواست کاربر. همه‌چیز فقط داخل
> `apps/openon4net-control-plane/` (بدون دست‌زدن به `openon4net-runtime` یا
> فایل‌های ریشه مونوریپو). **هیچ‌کدام از ردیف‌های زیر واقعاً build/typecheck
> نشده‌اند** — پکیج هنوز در `pnpm-workspace.yaml` ثبت نیست، پس `pnpm install`
> داخلش عملاً هیچ‌کاری نمی‌کند (فقط workspace ریشه را بی‌اثر دوباره نصب می‌کند).

### CP-SP-01 — Foundation + Activation MVP

| #        | تسک                                                                           | وضعیت         | تست                                         |
| -------- | ----------------------------------------------------------------------------- | ------------- | ------------------------------------------- |
| T-CP-001 | اسکلت `gateway/` + `migrations/` + `docker-compose.yml`                       | ✅            | 🔧 نوشته شده، build نشده                    |
| T-CP-002 | ثبت در `pnpm-workspace.yaml` ریشه                                             | ❌ عمداً معلق | نیاز به اجازه صریح کاربر (فایل ریشه)        |
| T-CP-003 | Migrations: `organizations`/`activation_keys`/`wallets`/`credit_transactions` | ✅            | 🔧 روی DB واقعی اجرا نشده                   |
| T-CP-004 | App skeleton (Fastify) + health check                                         | ✅            | 🔧 نوشته شده، build نشده                    |
| T-CP-005 | `POST /admin/activation-keys` (issue، admin-auth)                             | ✅            | 🔧 نوشته شده، build نشده                    |
| T-CP-006 | `POST /activation/check-in`                                                   | ✅            | 🔧 نوشته شده، build نشده                    |
| T-CP-007 | کلاینت activation سمت Runtime                                                 | ❌ عمداً معلق | نیاز به اجازه صریح کاربر (تغییر در Runtime) |
| T-CP-008 | CI پایه (`.github/workflows/ci.yml`)                                          | ✅            | ❌ push واقعی برای تست انجام نشده           |

### CP-SP-02 — Wallet Read-only + Policy Distribution + Web Panel

| #        | تسک                                                                                                                                                             | وضعیت | تست                      |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------ |
| T-CP-009 | `GET /billing/wallet`, `/billing/transactions` + admin manual-credit با idempotency                                                                             | ✅    | 🔧 نوشته شده، build نشده |
| T-CP-010 | Policy distribution (allowed models/providers + thresholds در پاسخ check-in)                                                                                    | ✅    | 🔧 نوشته شده، build نشده |
| T-CP-011 | Feature flags استاتیک per-plan (در همان پاسخ check-in)                                                                                                          | ✅    | 🔧 نوشته شده، build نشده |
| T-CP-012 | `web/` — صفحه فرود (`/`) + پنل ادمین (`/admin`, `/admin/new`, `/admin/organizations/[id]`)                                                                      | ✅    | 🔧 نوشته شده، build نشده |
| T-CP-013 | Trace id (`X-Trace-Id` + child logger)                                                                                                                          | ✅    | 🔧 نوشته شده، build نشده |
| T-CP-014 | Rate limiting پایه (in-memory) روی activation/admin endpoints                                                                                                   | ✅    | 🔧 نوشته شده، build نشده |
| —        | _اضافه‌ی خارج از طرح اولیه:_ `GET /admin/organizations`, `GET /admin/organizations/:id` (لازم برای پنل ادمین — `/billing/*` فقط با کلید خودِ سازمان کار می‌کند) | ✅    | 🔧 نوشته شده، build نشده |

### باقی‌مانده

- CP-SP-03 (Managed AI Gateway routing/failover) و CP-SP-04 (پرداخت واقعی) — عمداً شروع نشده، طبق backlog جزو Should/Later هستند نه MVP-lite.
- `web/` هنوز docker-compose/Dockerfile ندارد (فقط `gateway/` دیپلوی می‌شود).

---

## صریحاً انجام‌نشده (شناخته‌شده، نه فراموش‌شده)

- **T-009 (Secrets/KMS واقعی):** فقط نسخه MVP env-first + رمزنگاری envelope در DB برای BYOK per-org ساخته شده؛ یکپارچگی با Vault/secret manager واقعی (برای production/enterprise) ساخته نشده.
- **RBAC کامل:** نقش‌ها/دسترسی‌ها هنوز hardcoded در `packages/governance/src/permissions.ts`؛ جدول‌های `roles`/`policies` در DB وجود ندارد.
- **حافظه معنایی/vector search:** فقط L1(Redis)/L2(Postgres) با جستجوی متنی ساده؛ لایه‌های 3-6 و embeddings ساخته نشده.
- **اجرای پلاگین/marketplace:** خارج از scope فعلی.
- **Memory / Marketplace:** طبق تصمیم صریح کاربر، فقط با درخواست جداگانه پیش می‌رود. Memory از 2026-07-09 صرفاً در حد اسکلت contract (`service/`, بدون storage واقعی — جزئیات در جدول بالا) شروع شده و طبق `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` §3.3/§5 عمداً همونجا متوقفه. Marketplace اصلاً شروع نشده. (Control Plane از 2026-07-09 شروع شده — جزئیات در بخش بالا.)

---

## نحوه به‌روزرسانی این فایل

بعد از هر تسک/فیچر تکمیل‌شده: یک ردیف جدید یا تغییر وضعیت یک ردیف موجود،
با ستون تست دقیق (✅/⚠️/🔧/❌ — نه خوش‌بینانه). اگر تسکی نیمه‌کاره موند، همینجا
با ⚠️ یا یادداشت کوتاه مشخص بشه، نه اینکه حذف بشه.
