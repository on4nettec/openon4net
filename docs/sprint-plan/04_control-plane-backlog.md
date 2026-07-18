# Control Plane Backlog — `openon4net-control-plane` (Plane 2)

> این سند مکمل `02_backlog.md` / `03_sprint-plan.md` است، نه جایگزین آن‌ها. آن دو سند فقط `apps/openon4net-runtime` (Plane 1) را پوشش می‌دهند؛ این‌جا Epic/Story/Task/Sprint مخصوص `apps/openon4net-control-plane` تعریف می‌شود تا namespace اسپرینت‌های Runtime (`E-0##`/`T-0##`/`SP-##`) قاطی نشود.
>
> Spec مرجع:
>
> - نقش Plane 2: `docs/spect/02_ARCHITECTURE/13-four-plane-architecture.md` (بخش ۵)
> - مرز پوشه/دیپلوی: `docs/spect/02_ARCHITECTURE/14-monorepo-layout.md` (بخش ۵.۲ و ۶)
> - اقتصاد/credits: `docs/spect/02_ARCHITECTURE/06-economy-and-marketplace.md`
> - API قرارداد: `docs/spect/04_API/02-billing-and-marketplace-api.md`
> - مرز MVP: `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` (بخش ۵ — "Plane 2: activation + credits minimal")
> - وضعیت فعلی Runtime که مستقیماً روی این بک‌لاگ اثر می‌گذارد: `docs/sprint-plan/03_sprint-plan.md` بخش «وضعیت واقعی»

**شناسه‌ها عمداً namespaced هستند** تا با Runtime تداخل نکنند:

- Epic: `E-06#`
- User Story: `US-6##`
- Task: `T-CP-###`
- Sprint: `CP-SP-##`

---

## چرا الان (2026-07-09)؟

طبق `03_sprint-plan.md`، پیاده‌سازی Runtime از تقویم جلوتر است (SP-00 کامل، بخش زیادی از SP-01..SP-03 هم انجام و verify شده). یک تصمیم معماری صریح در همان سند مانده که **فقط با ساخت Control Plane قابل حل است**:

> «routing/failover بین چند مدل مسئولیت انحصاری `openon4net-control-plane` است... باید به بک‌لاگ Control Plane منتقل شود» (T-011 منسوخ در Runtime)

این بک‌لاگ همان انتقال + بقیه مسئولیت‌های Plane 2 (activation, credits, policy distribution) را رسمی می‌کند.

---

## وضعیت واقعی (بروزرسانی 2026-07-10)

پیاده‌سازی به‌صورت کاملاً مستقل داخل `apps/openon4net-control-plane/` جلو رفته — بدون هیچ تغییری در `apps/openon4net-runtime`.

- **CP-SP-01: کامل.** T-CP-001 (اسکلت gateway/migrations/docker-compose) ✅، T-CP-002 (ثبت در `pnpm-workspace.yaml` ریشه) ✅، T-CP-003 (migrations) ✅، T-CP-004 (app skeleton) ✅، T-CP-005 (issue activation key) ✅، T-CP-006 (check-in) ✅، T-CP-007 ✅، T-CP-008 (CI) ✅.
- **2026-07-12 — T-CP-007 (کلاینت سمت Runtime) انجام شد.** اجازه‌ی صریح طی جلسه‌ی `docs/spect/06_MEETINGS/02-skills-plugins-marketplace-model.md` داده شد. پیاده‌سازی داخل `apps/openon4net-runtime/gateway`: `services/activation-client.ts` (`checkIn()` — best-effort، هرگز throw نمی‌کنه)، `services/activation-state.ts` (`ActivationState.isActivated()` — بدون پیکربندی همیشه `true`، بعد از پیکربندی با grace window ۲۴ ساعته)، `services/activation-scheduler.ts` (poller ساعتی). ۴ تست vitest واقعی (با یک `http.createServer` محلی جای Control Plane واقعی، چون این cross-repo dependency نداره). جزئیات در `docs/spect/DONE.md` و `docs/spect/TODO-openon4net-runtime.md`'s RT-034.
- **CP-SP-02: کامل.** T-CP-009 (wallet/transactions read-only + admin manual-credit با idempotency) ✅، T-CP-010 (policy distribution — از CP-SP-01 داخل پاسخ check-in) ✅، T-CP-011 (feature flags استاتیک per-plan، داخل همان پاسخ check-in) ✅، T-CP-012 (پنل وب: صفحه فرود + بخش ادمین) ✅، T-CP-013 (trace id + child logger) ✅، T-CP-014 (rate limit پایه روی activation/admin endpoints — in-memory، نه Redis) ✅.
  - برای ساختن T-CP-012 یک endpoint خواندنی جدید هم به `gateway` اضافه شد که در طرح اولیه صریح نبود ولی بدونش پنل ادمین بی‌فایده بود: `GET /admin/organizations` (لیست) و `GET /admin/organizations/:organizationId` (جزئیات + wallet + activation keys) — چون `/billing/*` فقط با کلید خودِ سازمان قابل استفاده‌ست، نه برای یک ادمین که کلید هیچ سازمانی رو نداره.
- **2026-07-10 — T-CP-002 با اجازه کاربر انجام شد:** `apps/openon4net-control-plane/{gateway,web}` در `pnpm-workspace.yaml` ریشه ثبت شدن (تنها تغییر لازم بود — `.gitignore` عمداً دست‌نخورده موند چون pnpm/turbo اصلاً بهش نگاه نمی‌کنن؛ ثبت این مسیر به‌عنوان submodule واقعی یک تصمیم جدا و بزرگ‌تره). نتیجه: `pnpm turbo run lint typecheck test build` روی هر دو پکیج **و کل workspace** سبز شد (۱۰/۱۰ task، چیز دیگه‌ای هم نشکسته). یک باگ واقعی هم همین‌جا پیدا و فیکس شد: یک کامنت `eslint-disable-next-line react-hooks/exhaustive-deps` که به rule ناموجود اشاره می‌کرد و `next build` رو fail می‌کرد.
- **2026-07-10 — CP-001 (اولین دور end-to-end واقعی، از `docs/spect/TODO-openon4net-platform.md`):** دیتابیس واقعی `o2n_control_plane` روی همون Postgres بیرونی ساخته و migrate شد، gateway واقعاً بالا اومد، و کل مسیر issue-key → check-in → credit (با idempotency واقعاً تست‌شده) → wallet/transactions → admin/organizations با curl واقعی تأیید شد، به‌علاوه مسیرهای خطا (401 برای کلید غلط ادمین/activation). یک مشکل زیرساختی preexisting هم کشف شد (collation-version mismatch روی `template1` همون Postgres) — دورش زده شد با `TEMPLATE template0`، ربطی به کد CP نداره. جزئیات کامل در `docs/spect/DONE.md`.
- **2026-07-10 — CP-003 (تست‌های vitest واقعی):** ۱۵ تست روی همون Postgres واقعی (نه mock) برای `activation-service`/`wallet-service`، شامل یک تست race واقعی برای idempotency. `gateway/scripts/migrate.mjs` اضافه شد + CI یک Postgres service container گرفت (وگرنه این تست‌ها همون‌جا fail می‌شدن).
- **2026-07-10 — CP-004 (Docker packaging برای web/):** `Dockerfile.web` + سرویس `web` در `docker-compose.yml`، با `docker compose build/up` واقعی تست شد. **دو باگ preexisting در هر دو Dockerfile (gateway هم همینطور) پیدا و فیکس شد** — تا الان هیچ‌کس واقعاً `docker compose build` روی این پروژه اجرا نکرده بود: pnpm 11.x ناسازگار با `node:20-slim` (pin شد به `9.12.0`)، و نبود `.dockerignore` که باعث می‌شد `node_modules` هاست جای `node_modules` تازه‌نصب‌شده‌ی container رو بگیره.
- **2026-07-10 — CP-005 (صفحه‌بندی/جستجو):** `GET /admin/organizations` حالا `limit`/`offset`/`q` رو پشتیبانی می‌کنه، با ۸ تست vitest جدید (مجموع gateway = ۲۳ تست) + تأیید زنده با curl. یک race بی‌ضرر توی `turbo.json` هم کشف شد (نه باگ کد) — جزئیات و تصمیم فیکس در TODO.
- **باقی‌مونده برای اطمینان کامل:** تعامل واقعی مرورگر با فرم‌های `web/` (CP-002 در TODO)، و rate limiter به سقف نرسیده تا 429 واقعی دیده بشه (CP-007 در TODO). جزئیات در `docs/spect/TODO-openon4net-platform.md` و `docs/spect/DONE.md`.

---

## اپیک‌ها (Epics)

### E-060 — Control Plane Foundation (Repo/CI/Deploy Skeleton)

**هدف:** اسکلت سرویس مستقل طبق مدل دیپلوی Plane 2 (زیرساخت مرکزی on4net، جدا از Runtime خودمیزبان).
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/14-monorepo-layout.md` بخش ۴ و ۵.۲

- US-600: به عنوان Developer، `apps/openon4net-control-plane/{gateway,web,migrations,docker-compose.yml}` را طبق layout استاندارد داشته باشم.
- US-601: به عنوان Developer، این app در `pnpm-workspace.yaml` ثبت شود و از `@o2n/shared`/`@o2n/llm-providers` استفاده کند (همان‌طور که Runtime می‌کند) تا قرارداد بین‌سرویسی یکی باشد.
- US-602: به عنوان تیم، CI پایه (lint/typecheck/test/build) مستقل برای این app داشته باشیم.

### E-061 — Activation / Licensing (MVP)

**هدف:** یک Runtime self-hosted بتواند با activation key به Control Plane وصل شود و plan/limits بگیرد.
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/13-four-plane-architecture.md` بخش ۵.۱، `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` بخش ۳.۱ ("activation/license ساده — می‌تواند mock/primitive باشد")

- US-610: به عنوان Admin، برای یک Organization یک activation key صادر کنم.
- US-611: به عنوان Runtime (System-to-System)، با activation key خودم را معرفی کنم و plan/limits بگیرم.
- US-612: به عنوان Runtime، به‌صورت دوره‌ای check-in کنم تا وضعیت لایسنس تازه بماند (revoke/expire قابل اعمال باشد).

### E-062 — Wallet & Credits (Read-only در MVP)

**هدف:** مشاهده موجودی/تراکنش‌های credits؛ شارژ واقعی خارج از MVP.
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/06-economy-and-marketplace.md` بخش ۴.۱، `docs/spect/04_API/02-billing-and-marketplace-api.md` بخش ۲

- US-620: به عنوان Admin، موجودی wallet سازمانم را ببینم.
- US-621: به عنوان Admin، تاریخچه تراکنش‌ها را ببینم.
- US-622: به عنوان System، بتوانم (به‌صورت دستی/seed، نه پرداخت واقعی) به یک wallet credit اضافه کنم تا MVP قابل دمو باشد.

### E-063 — Managed AI Gateway: Routing + Failover (Should — بعد از MVP-lite)

**هدف:** تنها جایی که routing/fallback/cost-tracking بین چند LLM واقعاً پیاده می‌شود (طبق تصمیم معماری، نه در Runtime).
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/02-ai-gateway.md`, `docs/spect/02_ARCHITECTURE/14-monorepo-layout.md` بخش ۵.۲
**وضعیت:** خارج از MVP طبق `08-scope-guardrails-mvp.md` ("managed AI و provider networks خارج از MVP") — این Epic **جانشین رسمی T-011 منسوخ Runtime** است و فقط بعد از این‌که Foundation/Activation/Wallet MVP-lite کار کرد شروع می‌شود.

- US-630: به عنوان System، بین چند مدل بر اساس هزینه/در دسترس‌بودن route کنم.
- US-631: به عنوان System، اگر مدل A fail شد به مدل B failover کنم.
- US-632: به عنوان Admin، هزینه هر درخواست managed را ببینم.
- US-633: به عنوان Org Admin، حالت managed را opt-in فعال/غیرفعال کنم (پیش‌فرض BYOK طبق اصل امنیتی در ۱۳-four-plane-architecture.md بخش ۵.۳).

### E-064 — Billing / Top-up / Settlement (Later)

**هدف:** پرداخت واقعی، ledger کامل با idempotency، و تسویه‌حساب Marketplace از طریق wallet CP.
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/06-economy-and-marketplace.md` بخش ۵ و ۷، `docs/spect/04_API/02-billing-and-marketplace-api.md` بخش ۲.۳ و ۶.۳
**وضعیت:** Later — طبق guardrails بعد از ۲–۳ مشتری واقعی.

- US-640: به عنوان Admin، credits واقعی top-up کنم.
- US-641: به عنوان Platform، هر execution یک idempotency_key داشته باشد تا دوبار شارژ نشود.
- US-642: به عنوان Publisher (از طریق Marketplace)، سهم درآمدم (70/30) از طریق wallet CP تسویه شود.
- US-643: به عنوان Admin، budget سطح org/workspace/agent را enforce کنم.

### E-065 — Policy & Feature-flag Distribution

**هدف:** Control Plane منبع حقیقت برای allowed models/providers، آستانه‌های approval/budget، و feature flagها به Runtime.
**Spec مرجع:** `docs/spect/02_ARCHITECTURE/13-four-plane-architecture.md` بخش ۵.۱

- US-650: به عنوان Runtime، در activation check-in لیست allowed models/providers را بگیرم.
- US-651: به عنوان Admin، feature flag یک plan را عوض کنم بدون دیپلوی Runtime.

---

## اسپرینت‌ها

### CP-SP-01 — Foundation + Activation MVP

```yaml
id: CP-SP-01
date_range: 2026-07-09..2026-07-23
goal: 'اسکلت سرویس مستقل + activation/license حداقلی که یک Runtime واقعی به آن وصل شود'
mvp_status: must (طبق scope-guardrails-mvp §3.1)
```

| Task     | Title                                                                                                | Epic  | Est | Dependencies | Output                                                     |
| -------- | ---------------------------------------------------------------------------------------------------- | ----- | --- | ------------ | ---------------------------------------------------------- |
| T-CP-001 | Scaffold: `gateway/` (Fastify+TS)، `web/`، `migrations/`، `docker-compose.yml`                       | E-060 | M   | -            | ساختار طبق `14-monorepo-layout.md`                         |
| T-CP-002 | ثبت در `pnpm-workspace.yaml` + وایرینگ `@o2n/shared`, `@o2n/llm-providers`                           | E-060 | S   | T-CP-001     | build/typecheck یکپارچه با بقیه مونوریپو                   |
| T-CP-003 | DB migrations: `organizations` (license-scoped)، `activation_keys`، `wallets`، `credit_transactions` | E-060 | M   | T-CP-001     | جداول مستقل CP (DB جدا از Runtime طبق مدل دیپلوی)          |
| T-CP-004 | App skeleton: health check + service-to-service auth (JWT)                                           | E-060 | M   | T-CP-002     | endpoint پایه بالا می‌آید                                  |
| T-CP-005 | Activation key issuance API (admin-only)                                                             | E-061 | M   | T-CP-003     | `POST /admin/activation-keys`                              |
| T-CP-006 | Activation validate/check-in endpoint                                                                | E-061 | L   | T-CP-005     | `POST /activation/check-in` — Runtime می‌تواند فعال شود    |
| T-CP-007 | ✅ Runtime-side: activation client + periodic check-in                                               | E-061 | M   | T-CP-006     | انجام شد (2026-07-12) در `apps/openon4net-runtime/gateway` |
| T-CP-008 | CI پایه (lint/typecheck/test/build) برای control-plane                                               | E-060 | S   | T-CP-001     | pipeline سبز                                               |

**Demo:** یک نمونه Runtime با activation key واقعی به Control Plane وصل می‌شود و وضعیت `active` می‌گیرد.
**Risks (حل‌شده):** T-CP-007 نیاز به تغییر در ریپوی دیگر (`openon4net-runtime`) داشت؛ اجازه‌ی صریح گرفته شد و بدون رگرسیون در SP-03 آن ریپو انجام شد (۲۱/۲۱ تست gateway بعد از تغییر همچنان سبز).

---

### CP-SP-02 — Wallet Read-only + Policy Distribution

```yaml
id: CP-SP-02
date_range: 2026-07-23..2026-08-06
goal: 'مشاهده wallet/credits (بدون پرداخت واقعی) + توزیع policy به Runtime'
mvp_status: must (طبق scope-guardrails-mvp §3.1)
```

| Task     | Title                                                                                                 | Epic  | Est | Dependencies | Output                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------- | ----- | --- | ------------ | --------------------------------------------------------------------------------- |
| T-CP-009 | Wallet read model: `GET /billing/wallet`, `GET /billing/transactions` (+ seed/manual credit برای دمو) | E-062 | M   | T-CP-003     | مطابق `04_API/02-billing-and-marketplace-api.md` §2                               |
| T-CP-010 | Policy distribution: allowed models/providers + governance thresholds در پاسخ check-in                | E-065 | M   | T-CP-006     | Runtime می‌تواند به‌جای env محلی از این بخواند (fallback باقی می‌ماند)            |
| T-CP-011 | Feature flags endpoint (MVP: static per-plan)                                                         | E-065 | S   | T-CP-010     | flag روشن/خاموش بدون دیپلوی Runtime                                               |
| T-CP-012 | Web پنل حداقلی + صفحه فرود                                                                            | E-060 | M   | T-CP-009     | `web/`: landing (`/`) + admin (`/admin`: لیست org، issue key، مشاهده+شارژ wallet) |
| T-CP-013 | Observability پایه (trace id + لاگ ساختاریافته) برای CP gateway                                       | E-060 | S   | T-CP-004     | قابل ردیابی                                                                       |
| T-CP-014 | Security review اولیه: rate-limit روی activation/check-in، secrets handling                           | E-060 | S   | T-CP-006     | کاهش ریسک high-value target (طبق README امنیتی control-plane)                     |

**Demo:** مسیر کامل SB — Runtime لیست allowed models را از Control Plane می‌خواند؛ Admin موجودی credits را در پنل CP می‌بیند.

> **پایان MVP-lite Control Plane در این نقطه.** طبق `08-scope-guardrails-mvp.md`، هرچه بعد از CP-SP-02 است Should/Later محسوب می‌شود — قبل از رفتن به CP-SP-03 باید دوباره چک شود که آیا واقعاً لازم است یا scope را بزرگ می‌کند.

---

### CP-SP-03 — Managed AI Gateway: Routing + Failover (Should)

```yaml
id: CP-SP-03
date_range: TBD (بعد از تایید نیاز واقعی — طبق guardrails، معمولاً بعد از اولین مشتری‌های MVP)
goal: 'روتینگ/failover واقعی بین چند LLM به‌عنوان سرویس managed — جانشین T-011 منسوخ Runtime'
mvp_status: should (خارج از MVP طبق scope-guardrails-mvp §5)
```

| Task     | Title                                                            | Epic  | Est | Dependencies | Output                                       |
| -------- | ---------------------------------------------------------------- | ----- | --- | ------------ | -------------------------------------------- |
| T-CP-015 | Router rules engine (انتخاب مدل بر اساس هزینه/در دسترس‌بودن)     | E-063 | L   | T-CP-006     | معادل T-011 منسوخ، اما در CP نه Runtime      |
| T-CP-016 | Failover policy + health checks per provider                     | E-063 | M   | T-CP-015     | پایداری                                      |
| T-CP-017 | Cost tracking per-request (managed mode) → `usage_events` ledger | E-063 | M   | T-CP-015     | معادل T-014 Runtime ولی برای managed         |
| T-CP-018 | Runtime: سوییچ "managed mode" (opt-in per org)                   | E-063 | M   | T-CP-016     | تغییر متقابل در Runtime؛ پیش‌فرض همچنان BYOK |
| T-CP-019 | Rate limiting + circuit breaker برای managed AI gateway          | E-063 | M   | T-CP-015     | جلوگیری از abuse                             |

**Demo:** یک درخواست managed در صورت fail مدل A به مدل B failover می‌کند (دموی اصلی T-011 که در Runtime منسوخ شده بود، این‌جا واقعاً اجرا می‌شود).

---

### CP-SP-04 — Real Billing / Top-up / Marketplace Settlement (Later)

```yaml
id: CP-SP-04
date_range: TBD (بعد از CP-SP-03)
goal: 'پرداخت واقعی + ledger کامل + تسویه‌حساب Marketplace از طریق wallet CP'
mvp_status: later (طبق scope-guardrails-mvp §3.3 — بعد از ۲-۳ مشتری واقعی)
```

| Task     | Title                                                        | Epic  | Est | Dependencies | Output                               |
| -------- | ------------------------------------------------------------ | ----- | --- | ------------ | ------------------------------------ |
| T-CP-020 | Payment provider integration (top-up)                        | E-064 | L   | T-CP-009     | `POST /billing/topup` واقعی          |
| T-CP-021 | Ledger کامل: idempotency + settle + refund                   | E-064 | M   | T-CP-020     | جلوگیری از دوبار شارژ                |
| T-CP-022 | Wallet settlement API برای Marketplace (revenue share 70/30) | E-064 | M   | T-CP-021     | مصرف‌کننده: `openon4net-marketplace` |
| T-CP-023 | Budget enforcement hooks (org/workspace/agent)               | E-064 | M   | T-CP-021     | کنترل هزینه                          |
| T-CP-024 | Cost estimate endpoint (`POST /cost/estimate`)               | E-064 | M   | T-CP-021     | تخمین قبل از اجرا (طبق economy §5.2) |

---

## نکات باز / تصمیم‌های لازم قبل از اجرا

1. **DB مستقل:** طبق `14-monorepo-layout.md`، Control Plane باید Postgres مستقل خودش را داشته باشد (نه اشتراکی با Runtime). باید مشخص شود این در dev محلی چطور اجرا می‌شود (یک docker-compose جدا، طبق سند).
2. ~~`tools/migrations/0003_billing.sql` منسوخ است.~~ **انجام شد (2026-07-09):** `apps/openon4net-control-plane/README.md` اصلاح شد تا به `apps/openon4net-control-plane/migrations/` (هنوز ساخته نشده، T-CP-003) اشاره کند و صراحتاً بگوید DB مستقل از Runtime است.
3. **service-to-service auth** بین Runtime↔Control Plane هنوز جایی مشخص نشده (نه در `10-rbac-and-policy.md` و نه در `11-secrets-and-key-management.md` به‌صراحت). T-CP-004/T-CP-006 باید این را تعریف کنند (پیشنهاد اولیه: JWT با کلید مشترک یا mTLS — نیاز به ADR کوتاه دارد).
