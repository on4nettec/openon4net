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

| بخش                               | وضعیت                                                                                                                                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime — Sprint 0 (T-001..T-008) | ۸ از ۸ تکمیل، همه تست‌شده                                                                                                                                                                                                    |
| Runtime — کارهای بعد از Sprint 0  | ۷ فیچر تکمیل، همه تست‌شده به‌جز ارسال واقعی تلگرام                                                                                                                                                                           |
| Control Plane (Plane 2)           | CP-SP-01 + CP-SP-02 کامل، curl واقعی (CP-001) + ۱۵ تست vitest (CP-003) + Docker واقعی برای gateway+web (CP-004، ۲ باگ preexisting فیکس شد)؛ مونده: تعامل واقعی مرورگر با فرم‌های `web/` (CP-002) و T-CP-007 (Runtime client) |
| Memory (Plane 3)                  | اسکلت اولیه `service/` (Fastify+Zod، روت‌ها 501) + CI پایه + `Dockerfile.service` + تست همه‌ی routeها + auth با `MEMORY_API_KEY` (همه 🔧 نوشته شده، نه build/run شده)                                                        |
| Marketplace (Plane 4)             | شروع نشده — فقط README                                                                                                                                                                                                       |

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

| فیچر                                                                                                             | وضعیت      | تست                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Approval queue (تأیید/رد + اجرای مجدد بعد از تأیید)                                                              | ✅         | ✅ شامل حالت با provider override شده                                                                                                                                                                                                                                                 |
| Telegram send tool (اسکلت + اتصال واقعی به Telegram Bot API)                                                     | ✅ کد کامل | ❌ ارسال واقعی تست نشده (نیاز به bot token واقعی — به تعویق افتاده)                                                                                                                                                                                                                   |
| داشبورد: pause/resume/terminate/test-connection                                                                  | ✅         | ✅ با Playwright واقعی                                                                                                                                                                                                                                                                |
| SSE reconnect handling (قطع اتصال وسط استریم)                                                                    | ✅         | ✅ شبیه‌سازی قطع با Playwright                                                                                                                                                                                                                                                        |
| ONBOARDING.md                                                                                                    | ✅         | n/a (مستندسازی)                                                                                                                                                                                                                                                                       |
| Observability — Prometheus `/metrics` (معادل T-020)                                                              | ✅         | ✅ HTTP + LLM metrics، هم مسیر sync هم stream                                                                                                                                                                                                                                         |
| BYOK config قابل‌ویرایش per-organization (رمزنگاری‌شده در DB)                                                    | ✅         | ✅ شامل: 403 برای non-admin، 400 برای payload نامعتبر، تعامل با approval queue، رمزنگاری واقعی در DB تأیید شده                                                                                                                                                                        |
| DB-backed RBAC («minimum» مدل `10-rbac-and-policy.md` §4/§8: `roles`/`role_permissions`/`user_role_bindings`)    | ✅         | ✅ backfill برای orgهای موجود تأیید شد؛ سناریوی کامل زنده: نقش `editor` ویرایش شد (حذف `agents:chat`) و همون JWT بدون logout مجدد فوراً 403 گرفت                                                                                                                                      |
| جستجوی معنایی حافظه (pgvector، Layer 2 — `03-memory-engine.md` ADR-002)                                          | ✅         | ✅ دو کوئری بدون هیچ overlap کلمه‌ای با پیام هدف («which software dev tool…» → پیام Python، «hot climate in Iranian cities» → پیام آب‌وهوای تهران) درست پیدا شدن؛ همون کوئری‌ها روی ILIKE صفر نتیجه دادن (اثبات semantic بودن)؛ حالت غیرفعال (fallback به ILIKE) هم جدا تست شد        |
| صفحه Roles & Permissions در داشبورد (UI برای RBAC بالا، قبلاً فقط curl)                                          | ✅         | ✅ با Playwright واقعی: چک‌باکس `agents:chat` روی نقش `editor` برداشته و ذخیره شد، بعد از reload صفحه هنوز غیرفعال بود (persist شدن تأیید شد)، بعد به حالت اول برگردونده شد و با query مستقیم DB مطابقت کامل با baseline تأیید شد                                                     |
| مدیریت کاربران (`POST`/`GET /v1/users` + صفحه Users) — تکمیل RBAC با امکان ساخت کاربر دوم و sign-in به‌عنوان اون | ✅         | ✅ با Playwright واقعی: کاربر `viewer` جدید ساخته شد، با email همون کاربر (همون API key مشترک) لاگین شد، nav لینک‌های admin-only مخفی بودن، تلاش برای چت با پیام «Missing permission: agents:chat» درست رد شد — یعنی binding واقعی برای یک کاربر غیر از admin bootstrap هم کار می‌کنه |
| Audit log viewer (RT-001: `GET /v1/audit` + صفحه Audit Log)                                                      | ✅         | ✅ با Playwright واقعی: یک چت واقعی فرستاده شد، همون لحظه ردیف `agent-chat` با نام agent (نه uuid خام)، status/model/cost درست، بالای لاگ ظاهر شد؛ pagination با شمارش واقعی (۱–۲۵ از ۳۱) روی تاریخچه‌ی واقعی این نشست کار کرد                                                        |
| Workspace CRUD (RT-002: `GET`/`POST /v1/workspaces` + صفحه Workspaces + انتخاب‌گر workspace در فرم ساخت agent)   | ✅         | ✅ با Playwright واقعی: workspace دوم ساخته شد، توی picker فرم ساخت agent ظاهر شد، یک agent باهاش ساخته شد، و با join مستقیم DB تأیید شد `workspace_id` واقعاً به workspace جدید اشاره می‌کنه نه پیش‌فرض                                                                              |
| ساخت/حذف نقش سفارشی (RT-003: `POST`/`DELETE /v1/roles`)                                                          | ✅         | ✅ با Playwright + curl مستقیم: نقش سفارشی ساخته و حذف شد از UI؛ هر دو guard سمت سرور مستقیماً تست شد (نه فقط مخفی‌شدن دکمه) — حذف نقش سیستمی → 400، حذف نقش با binding فعال → 400، بعد از حذف binding → 204                                                                          |

> **یادداشت CI — ریشه‌ی واقعی پیدا شد (2026-07-10):** چهار بار همین خطای ظاهری افتاد
> («`@o2n/gateway` has no exported member ...») و هر بار پیش‌فرض غلطی گرفتیم که «flake
> گذرا»ست. ریشه‌ی واقعی خیلی ساده‌تر بود: توی این نشست، الگوی همیشگی این بود که اول
> commit داخل submodule (`openon4net-runtime`) push بشه، بعد جداگانه commit روت
> (`openon4net`, که export جدید `packages/shared`/`packages/llm-providers` توش هست) push
> بشه. چون CI با push به submodule تریگر می‌شه و اون لحظه هنوز parent repo روی GitHub
> export جدید رو نداره، CI واقعاً و به‌درستی fail می‌کرد — نه یک race توی scheduler.
> retrigger «های موفق» قبلی صرفاً به این خاطر سبز می‌شدن که تا اون لحظه commit روت هم
> push شده بود، نه به خاطر اینکه چیزی «حل» شده بود. تغییر `ci.yml` (`511a4e3`، جدا کردن
> build از lint/typecheck/test) یک بهبود بی‌ضرر بود ولی مشکل واقعی رو حل نکرده بود —
> بار چهارم (`fd5949b`، RT-003) با همون علت دقیق دوباره fail کرد، و با یک retrigger _بعد_
> از push شدن commit روت (`7b98906`) سبز شد که همین فرضیه رو تأیید کرد.
>
> **قاعده‌ی درست از این به بعد:** وقتی یک تسک export جدیدی به `packages/*` اضافه می‌کنه
> که همون submodule commit مصرفش می‌کنه، commit روت باید **قبل از** push کردن submodule
> push بشه، نه بعدش.

---

## Control Plane (Plane 2) — `docs/sprint-plan/04_control-plane-backlog.md`

> شروع: 2026-07-09، به‌صراحت درخواست کاربر. همه‌چیز فقط داخل
> `apps/openon4net-control-plane/` (بدون دست‌زدن به `openon4net-runtime`).
> **2026-07-10 (وصل به workspace):** با اجازه کاربر، `apps/openon4net-control-plane/{gateway,web}`
> در `pnpm-workspace.yaml` ریشه ثبت شد؛ `pnpm turbo run lint typecheck test build`
> روی هر دو پکیج و کل workspace سبز شد.
> **2026-07-10 (CP-001 — اولین دور end-to-end واقعی):** یک دیتابیس واقعی
> (`o2n_control_plane` روی همون Postgres بیرونی) ساخته و migrate شد، gateway
> واقعاً بالا اومد، و کل مسیر issue-key → check-in → credit → wallet/transactions
> با curl واقعی تأیید شد (جزئیات کامل پایین). به همین خاطر بیشتر ردیف‌های زیر
> از ⚠️ به ✅ ارتقا پیدا کردن.

### CP-SP-01 — Foundation + Activation MVP

| #        | تسک                                                                           | وضعیت         | تست                                                                                                                           |
| -------- | ----------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| T-CP-001 | اسکلت `gateway/` + `migrations/` + `docker-compose.yml`                       | ✅            | ✅ هم مستقیم (`pnpm dev`) هم واقعاً از طریق `docker compose build/up` (CP-004، دو باگ واقعی همونجا پیدا و فیکس شد — پایین‌تر) |
| T-CP-002 | ثبت در `pnpm-workspace.yaml` ریشه                                             | ✅            | ✅ `pnpm install` + `pnpm turbo run lint typecheck test build` سبز، هم برای این دو پکیج هم کل workspace (۱۰/۱۰ task)          |
| T-CP-003 | Migrations: `organizations`/`activation_keys`/`wallets`/`credit_transactions` | ✅            | ✅ روی یک Postgres واقعی (همون سرور بیرونی runtime، دیتابیس جدا `o2n_control_plane`) اجرا شد؛ هر ۴ جدول ساخته شدن             |
| T-CP-004 | App skeleton (Fastify) + health check                                         | ✅            | ✅ `curl /health` → `{"status":"ok"}` (200)                                                                                   |
| T-CP-005 | `POST /admin/activation-keys` (issue، admin-auth)                             | ✅            | ✅ curl واقعی: org+wallet+key ساخته شد، کلید خام یک‌بار برگشت                                                                 |
| T-CP-006 | `POST /activation/check-in`                                                   | ✅            | ✅ curl واقعی: policy/thresholds درست مطابق پلن `team` برگشت                                                                  |
| T-CP-007 | کلاینت activation سمت Runtime                                                 | ❌ عمداً معلق | نیاز به اجازه صریح کاربر (تغییر در Runtime)                                                                                   |
| T-CP-008 | CI پایه (`.github/workflows/ci.yml`)                                          | ✅            | ❌ push واقعی برای تست انجام نشده                                                                                             |

### CP-SP-02 — Wallet Read-only + Policy Distribution + Web Panel

| #        | تسک                                                                                                                                                             | وضعیت | تست                                                                                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T-CP-009 | `GET /billing/wallet`, `/billing/transactions` + admin manual-credit با idempotency                                                                             | ✅    | ✅ credit واقعی (0→10000)، replay همون idempotency key دوبار شارژ نکرد، transactions دقیقاً ۱ ردیف برگردوند                                                                                           |
| T-CP-010 | Policy distribution (allowed models/providers + thresholds در پاسخ check-in)                                                                                    | ✅    | ✅ مقادیر پلن `team` (`approvalThresholdCents: 5000`, مدل‌های درست) دقیقاً مطابق کد در پاسخ واقعی برگشت                                                                                               |
| T-CP-011 | Feature flags استاتیک per-plan (در همان پاسخ check-in)                                                                                                          | ✅    | ✅ `{managedAiGateway:false, workflowEngine:false}` در پاسخ واقعی check-in تأیید شد                                                                                                                   |
| T-CP-012 | `web/` — صفحه فرود (`/`) + پنل ادمین (`/admin`, `/admin/new`, `/admin/organizations/[id]`)                                                                      | ✅    | ⚠️ `next build` سبز + سرو شدن واقعی از containerized `next start` تأیید شد با curl (CP-004، HTTP 200 + محتوای درست)، ولی تعامل واقعی با فرم‌ها/fetch در یک مرورگر واقعی هنوز چک نشده (CP-002 در TODO) |
| T-CP-013 | Trace id (`X-Trace-Id` + child logger)                                                                                                                          | ✅    | ✅ `curl -D -` هدر `x-trace-id` با یک UUID واقعی روی هر پاسخ تأیید شد                                                                                                                                 |
| T-CP-014 | Rate limiting پایه (in-memory) روی activation/admin endpoints                                                                                                   | ✅    | ⚠️ کد سر جاشه ولی به سقف نرسوندیم که واقعاً 429 بگیریم — رفتار مرزی هنوز تست نشده                                                                                                                     |
| —        | _اضافه‌ی خارج از طرح اولیه:_ `GET /admin/organizations`, `GET /admin/organizations/:id` (لازم برای پنل ادمین — `/billing/*` فقط با کلید خودِ سازمان کار می‌کند) | ✅    | ✅ لیست + جزئیات (wallet + activation keys با `lastSeenAt` واقعی) هر دو با curl تأیید شدن                                                                                                             |

**نکته‌ی جانبی (2026-07-10):** برای ساخت دیتابیس `o2n_control_plane` یک مشکل زیرساختی از قبل موجود کشف شد: Postgres container بیرونی (`openon4net-runtime-postgres-1`) collation-version mismatch داره («template database was created using collation version 2.41, but the OS provides 2.36» — به‌احتمال زیاد به‌خاطر آپدیت سیستم بعد از init شدن `template1`). این مربوط به کد Control Plane نیست؛ فقط با `CREATE DATABASE ... TEMPLATE template0` دورش زده شد تا `template1` خراب دست‌نخورده بمونه. اگه بعداً `openon4net-runtime` هم بخواد دیتابیس جدید بسازه به همین مشکل می‌خوره.

منفی‌های auth هم چک شدن: کلید ادمین غلط → 401 `UNAUTHORIZED`، کلید activation غلط → 401 `ACTIVATION_KEY_INVALID`، بدون هدر → 401 — هر سه با envelope خطای درست.

### CP-003 — تست‌های vitest واقعی (2026-07-10، از `docs/spect/TODO-openon4net-control-plane.md`)

> رویکرد: Postgres واقعی، نه mock (هم‌راستا با CP-001 و روش تست‌نویسی بقیه‌ی این پروژه). هر تست
> با `uniqueSlug()` داده‌ی خودش رو می‌سازه و در `afterEach` پاک می‌کنه — بعد از اجرا فقط همون یک
> org دمو از CP-001 (`Acme Test Org`) توی DB باقی می‌مونه، صفر residue.

| #         | تسک                                                                                                                                                                                                                                     | وضعیت | تست                                                                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| T-CP-003a | `activation-service.test.ts` — issue، عدم ذخیره کلید خام (فقط hash)، authenticate + `last_seen_at`، رد کلید نامعتبر/secret اشتباه، policy/flags per-plan، پیش‌فرض پلن starter                                                           | ✅    | ✅ ۷ تست، همه روی DB واقعی سبز                                                                                                              |
| T-CP-003b | `wallet-service.test.ts` — موجودی صفر اولیه، `NotFoundError` برای wallet/org ناموجود، credit+transaction، **idempotency واقعی زیر race همزمان** (`Promise.all` با یک idempotency key)، دو کلید جدا هر دو اعمال می‌شن، رد amount غیرمثبت | ✅    | ✅ ۸ تست، همه سبز — شامل تست race واقعی (نه فقط replay ترتیبی) که به لطف `SELECT ... FOR UPDATE` توی `withTransaction` درست serialize می‌شه |
| —         | `gateway/scripts/migrate.mjs` — اجراکننده‌ی migration قابل استفاده‌ی مجدد (جایگزین دستور دستی inline که در CP-001 استفاده شد) + اسکریپت `pnpm run migrate`                                                                              | ✅    | ✅ همینو CI هم مصرف می‌کنه (پایین)                                                                                                          |
| —         | `.github/workflows/ci.yml` — اضافه شدن Postgres service container + step اجرای migration، چون بدونش تست‌های جدید در CI فورا fail می‌شدن (قبلاً هیچ service ای نداشت)                                                                    | ✅    | ❌ push واقعی هنوز انجام نشده (همون محدودیت T-CP-008 قبلی)                                                                                  |

نتیجه‌ی `pnpm turbo run lint typecheck test build --filter=@o2n/control-plane-gateway --filter=@o2n/control-plane-web`: **۸/۸ سبز** (شامل ۱۵ تست واقعی).

### CP-004 — Docker packaging برای `web/` (2026-07-10، از `docs/spect/TODO-openon4net-control-plane.md`)

> این تسک دو تا باگ واقعی preexisting رو لو داد که تا الان هیچ‌جا کشف نشده بودن — چون تا امروز
> هیچ‌کس (نه من، نه CP-001) واقعاً `docker compose build` رو روی این پروژه اجرا نکرده بود، فقط
> `pnpm dev`/`node` مستقیم. یعنی `Dockerfile.gateway` هم همین باگ‌ها رو داشت، نه فقط `Dockerfile.web`.

| #                | تسک                                                                                                                                                                                                                                                                                                           | وضعیت      | تست                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| T-CP-012 (تکمیل) | `Dockerfile.web` + سرویس `web` در `docker-compose.yml`                                                                                                                                                                                                                                                        | ✅         | ✅ `docker compose build` + `docker compose up -d` واقعی، هر دو container بالا اومدن                                                               |
| —                | **باگ ۱ (preexisting، هر دو Dockerfile):** `corepack enable` بدون pin کردن نسخه، pnpm 11.x رو می‌کشه که به Node 22.13+ نیاز داره → کرش «Unknown built-in module: node:sqlite» روی `node:20-slim`                                                                                                              | ✅ فیکس شد | ✅ با `corepack prepare pnpm@9.12.0 --activate` (همون نسخه‌ی `packageManager` روت) فیکس شد، هر دو Dockerfile                                       |
| —                | **باگ ۲ (preexisting، هر دو Dockerfile):** نبود `.dockerignore` باعث می‌شد `COPY web ./` (یا `COPY gateway ./`) در stage «build»، `node_modules` تازه‌نصب‌شده‌ی stage «deps» رو با `node_modules` هاست (symlinkهای pnpm که به مسیرهای هاست اشاره دارن) خراب کنه → «Cannot find module .../next/dist/bin/next» | ✅ فیکس شد | ✅ با اضافه‌کردن `apps/openon4net-control-plane/.dockerignore` (چون context خودِ همین پوشه‌ست، نه ریشه‌ی مونوریپو که `.dockerignore` خودش رو داره) |

تأیید نهایی: `docker compose up -d` → `curl http://localhost:4100/health` (containerized، از طریق `host.docker.internal` به همون Postgres) → `{"status":"ok"}`؛ `curl http://localhost:3300/` و `/admin` → هر دو HTTP 200 با محتوای واقعی (`<title>on4net Control Plane</title>` تأیید شد در HTML واقعی). بعدش `docker compose down` تمیز پاک شد.

### باقی‌مانده

- CP-SP-03 (Managed AI Gateway routing/failover) و CP-SP-04 (پرداخت واقعی) — عمداً شروع نشده، طبق backlog جزو Should/Later هستند نه MVP-lite.
- `web/` هنوز docker-compose/Dockerfile ندارد (فقط `gateway/` دیپلوی می‌شود).
- `web/` هنوز در مرورگر واقعی باز نشده (CP-002 در `docs/spect/TODO-openon4net-control-plane.md`).
- Rate limiter هنوز به سقف نرسیده تا 429 واقعی دیده بشه.

---

## صریحاً انجام‌نشده (شناخته‌شده، نه فراموش‌شده)

- **T-009 (Secrets/KMS واقعی):** فقط نسخه MVP env-first + رمزنگاری envelope در DB برای BYOK per-org ساخته شده؛ یکپارچگی با Vault/secret manager واقعی (برای production/enterprise) ساخته نشده.
- **RBAC — Policy Layer (ABAC، §6 سند `10-rbac-and-policy.md`):** جدول `roles`/`role_permissions`/`user_role_bindings` («minimum» §4/§8)، UI مدیریت نقش‌ها، ساخت کاربر، و ساخت/حذف نقش سفارشی (RT-003) ساخته و تست شده (بالا). جدول جداگانه‌ی `policies` با شرایط ABAC (cost/layer/tag/time/environment) هنوز ساخته نشده. همچنین هنوز نیست: حذف کاربر، تغییر نقش یک کاربر بعد از ساخت (فقط در لحظه create قابل تنظیمه — RT-004)، و per-user credential واقعی (auth هنوز یک API key مشترک org-wide هست، فقط email مشخص می‌کنه کدوم کاربر — RT-012).
- **حافظه معنایی/vector search:** فقط برای Layer 2 (Conversation Memory، پیام‌های یک مکالمه) ساخته شد (بالا) — عمداً فقط با openai/ollama کار می‌کند (anthropic/deepseek endpoint embeddings ندارند). Layers 3-6 (Project/Company/Personal/Global Knowledge) و Neo4j Memory Graph کلاً ساخته نشدن.
- **اجرای پلاگین/marketplace:** خارج از scope فعلی.
- **Memory / Marketplace:** طبق تصمیم صریح کاربر، فقط با درخواست جداگانه پیش می‌رود. Memory از 2026-07-09 صرفاً در حد اسکلت contract (`service/`, بدون storage واقعی — جزئیات در جدول بالا) شروع شده و طبق `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` §3.3/§5 عمداً همونجا متوقفه. Marketplace اصلاً شروع نشده. (Control Plane از 2026-07-09 شروع شده — جزئیات در بخش بالا.)

---

## نحوه به‌روزرسانی این فایل

بعد از هر تسک/فیچر تکمیل‌شده: یک ردیف جدید یا تغییر وضعیت یک ردیف موجود،
با ستون تست دقیق (✅/⚠️/🔧/❌ — نه خوش‌بینانه). اگر تسکی نیمه‌کاره موند، همینجا
با ⚠️ یا یادداشت کوتاه مشخص بشه، نه اینکه حذف بشه.
