# TODO — openon4net-platform (Plane 2, قبلاً «Control Plane»)

> **۲۰۲۶-۰۷-۱۷ — rename کامل شد:** این پلین از «Control Plane» به «Platform» تغییر نام داد
> (تصمیم جلسه ۷، `06_MEETINGS/07-platform-rename-and-mediated-cross-plane-access.md`).
> پوشه‌ی محلی `apps/openon4net-platform/`، ریپوی GitHub هم همون روز توسط کاربر
> rename شد (`github.com/on4nettec/openon4net-platform`)، remote محلی هم آپدیت شد.
> این فایل قبلاً `TODO-openon4net-control-plane.md` نام داشت. ارجاعات تاریخی به
> «Control Plane» در `DONE.md`/جلسات قبلی عمداً دست‌نخورده موندن (لاگ تاریخیه، نه
> چیزی که rewrite بشه) — فقط ارجاعات رو‌به‌جلو/ساختاری به‌روز شدن.
>
> **تصمیم گرفته شده (کاربر):** اسم‌های داخلی پکیج npm (`@o2n/control-plane-gateway`،
> `@o2n/control-plane-web`) عمداً همون‌جوری می‌مونن — تا وقتی مشکلی ایجاد نکنن نیازی
> به rename ندارن. pnpm/turbo از مسیر جدید درست resolve می‌کنن، تأیید شده با build واقعی.
>
> فایل تصمیم‌گیری، نه صف اجرا. من (Claude) هیچ‌کدوم از این ردیف‌ها رو خودم
> شروع نمی‌کنم — منتظر می‌مونم بگی کدوم رو انجام بدم (تک‌تک یا گروهی).
> بعد از هر تسک، وضعیتش اینجا و خلاصه‌اش در `docs/spect/DONE.md` به‌روز می‌شه.
>
> **پس‌زمینه/جزئیات هر تسک:** `docs/sprint-plan/04_control-plane-backlog.md`
> (Epic/Story/Task/Sprint کامل). این فایل فقط خلاصه‌ی عملیاتیه.
>
> **وضعیت فعلی (2026-07-10):** CP-SP-01 و CP-SP-02 کامل، در workspace ثبت شدن، و
> CP-001..CP-005 همه انجام شدن — یعنی الان روی Postgres واقعی (curl + ۲۳ تست vitest)
> و روی Docker واقعی (`docker compose build/up`) هم تست شده، نه فقط build/typecheck.
> چیزی که هنوز نه: تعامل واقعی مرورگر با `web/` (CP-002).
> جزئیات کامل هر تسک در `docs/spect/DONE.md`.
>
> **2026-07-12 — CP-008 انجام شد.** اجازه‌ی صریح برای دست‌زدن به
> `openon4net-runtime` طی جلسه‌ی `06_MEETINGS/02-skills-plugins-marketplace-model.md`
> داده شد؛ کلاینت activation سمت Runtime (T-CP-007) پیاده‌سازی و تست شد —
> ببینید `TODO-openon4net-runtime.md`'s RT-034 و `DONE.md`.
>
> **محدوده:** همه‌ی ردیف‌های بخش A فقط داخل `apps/openon4net-platform/`
> اجرا می‌شن — نه `openon4net-runtime`، نه فایل‌های ریشه مونوریپو. ردیف‌هایی
> که خارج از این محدوده‌ن (بخش B) صراحتاً علامت‌گذاری شدن.
>
> این فایل خواهر `TODO-openon4net-runtime.md` و `TODO-openon4net-memory.md` است، همون فرمت.

---

## بخش A — تکمیل/اعتبارسنجی داخل خود control-plane (بدون نیاز به اجازه اضافه)

| #      | تسک                                                                                                                                                                                                                                                                                                                                               | نیاز به اجازه؟ | وضعیت |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------: | :---: |
| CP-001 | یک دور end-to-end واقعی با curl: بالا آوردن gateway روی یک Postgres واقعی (دیتابیس جدا `o2n_control_plane`)، اجرای migration، issue کلید، check-in، credit wallet، خوندن transactions                                                                                                                                                             |     ❌ خیر     |  ✅   |
| CP-002 | باز کردن `web/` توی مرورگر واقعی: صفحه فرود، ورود ادمین، صدور کلید، جزئیات سازمان + فرم شارژ (توجه: CP-004 با curl تأیید کرد صفحات سرو می‌شن، ولی تعامل واقعی فرم‌ها/fetch در مرورگر هنوز نه)                                                                                                                                                     |     ❌ خیر     |  ❌   |
| CP-003 | تست‌های vitest واقعی برای `activation-service` و `wallet-service` (الان `--passWithNoTests` — صفر تست)، مخصوصاً idempotency                                                                                                                                                                                                                       |     ❌ خیر     |  ✅   |
| CP-004 | `Dockerfile.web` + سرویس `web` در `docker-compose.yml` (الان فقط `gateway` دیپلوی می‌شه)                                                                                                                                                                                                                                                          |     ❌ خیر     |  ✅   |
| CP-005 | صفحه‌بندی/جستجو برای `GET /admin/organizations` (الان فقط `limit` ساده)                                                                                                                                                                                                                                                                           |     ❌ خیر     |  ✅   |
| CP-006 | Observability فراتر از trace-id — یک `/metrics` (Prometheus) شبیه چیزی که Runtime تازه ساخت (T-020 معادل)                                                                                                                                                                                                                                         |     ❌ خیر     |  ✅   |
| CP-007 | مستندسازی محدودیت شناخته‌شده‌ی rate limiter (in-memory، تک-instance) یا Redis-backed کردنش اگه قراره چند replica بالا بیاد                                                                                                                                                                                                                        |     ❌ خیر     |  ✅   |
| CP-015 | **باگ تأییدشده (curl):** id نامعتبر (نه UUID) توی `/admin/organizations/:id` یا `/admin/wallets/:id/credit` به‌جای 400 تمیز، 500 `INTERNAL_ERROR` برمی‌گردونه — چون Postgres خودش موقع cast به نوع UUID ارور خام می‌ده و `error-handler.ts` فقط `CpError` رو می‌شناسه، نه خطای pg رو. فیکس: یک zod schema برای پارامترهای UUID قبل از رسیدن به DB |     ❌ خیر     |  ✅   |
| CP-016 | `web/` صفر تست داره (`package.json`'s `test` فقط `echo "no tests yet"`) — برخلاف gateway که ۲۳ تا داره. حداقل: تست‌های واحد برای منطق `lib/api-client.ts` (پارامترهای query، مدیریت 401)                                                                                                                                                          |     ❌ خیر     |  ✅   |
| CP-017 | `docker-compose.yml` برای `gateway`/`web` هیچ `healthcheck` نداره، و `web`'s `depends_on: [gateway]` فقط منتظر start شدن container می‌مونه نه واقعاً آماده بودن (`/health` سبز بودن)                                                                                                                                                              |     ❌ خیر     |  ✅   |
| CP-018 | CORS الان `origin: true` است (هر origin ای رو reflect می‌کنه) — برای پلینی که خودش رو «high-value target» معرفی کرده (README) شاید بیش‌ازحد بازه؛ حداقل یک allowlist صریح از `web/`'s origin(ها)                                                                                                                                                  |     ❌ خیر     |  ✅   |

> **CP-001 انجام شد (2026-07-10) — جزئیات کامل در `docs/spect/DONE.md`.** یک نکته‌ی جانبی: Postgres
> بیرونی موجود یک collation-version mismatch از قبل داره (`template1` خراب) — با
> `CREATE DATABASE ... TEMPLATE template0` دورش زدم. اگه جای دیگه‌ای (مثلاً Runtime) هم بخواد
> دیتابیس جدید بسازه به همین مشکل می‌خوره.
>
> **CP-003 انجام شد (2026-07-10) — جزئیات کامل در `docs/spect/DONE.md` (بخش «CP-003»).** ۱۵ تست
> vitest واقعی (نه mock) روی همون Postgres که CP-001 ساخت، شامل یک تست race واقعی برای
> idempotency (`Promise.all` با یک idempotency key). یک اسکریپت `gateway/scripts/migrate.mjs`
> هم اضافه شد (جایگزین دستور inline که در CP-001 دستی می‌زدم)، و CI (`.github/workflows/ci.yml`)
> یک Postgres service container گرفت تا این تست‌ها اونجا هم واقعاً اجرا بشن — قبلش CI اصلاً
> DB نداشت، پس این تست‌های جدید بدونش فوراً fail می‌شدن.
>
> **CP-004 انجام شد (2026-07-10) — جزئیات کامل در `docs/spect/DONE.md` (بخش «CP-004»).**
> `Dockerfile.web` + سرویس `web` در `docker-compose.yml` ساخته و با `docker compose build/up`
> واقعی تست شد. **مهم:** همین‌جا دو باگ preexisting در **هر دو** Dockerfile (`gateway` هم همینطور)
> پیدا و فیکس شد — چون تا الان هیچ‌کس واقعاً `docker compose build` رو روی این پروژه اجرا نکرده
> بود: (۱) `corepack enable` بدون pin نسخه pnpm 11.x رو می‌کشید که با `node:20-slim` کرش می‌کرد،
> (۲) نبود `.dockerignore` باعث می‌شد `COPY` مرحله build، `node_modules` هاست (symlinkهای شکسته‌ی
> pnpm) رو روی `node_modules` تازه‌نصب‌شده‌ی container بریزه.
>
> **CP-005 انجام شد (2026-07-10) — جزئیات کامل در `docs/spect/DONE.md` (بخش «CP-005»).**
> صفحه‌بندی (`limit`/`offset`) + جستجو (`q`، روی name/slug) برای `GET /admin/organizations`،
> با ۸ تست vitest جدید (مجموع gateway الان ۲۳ تست) + تأیید زنده با curl. یک race بی‌ضرر توی
> تولینگ هم پیدا شد (نه باگ کد) — ردیف CP-014 پایین رو ببین.
>
> **2026-07-10 — بازبینی و ۴ تسک جدید (CP-015..CP-018).** طبق درخواست کاربر برای شفاف‌سازی
> وضعیت، یه دور مرور کردم و چیزهایی که تا حالا فقط توی ذهنم بود یا تصادفی دیده بودم رو رسمی
> کردم. CP-015 واقعاً با curl تأیید شد (نه فقط حدس): `GET /admin/organizations/not-a-valid-uuid`
> با کلید ادمین درست، 500 `INTERNAL_ERROR` می‌گیره نه 400 — یعنی یک باگ واقعی، کوچیک ولی واقعی.
> بقیه (CP-016..CP-018) مشاهده‌ان، نه باگ تأییدشده.
>
> **CP-006, CP-007, CP-015..CP-018 انجام شدن (کامیت `daa0d0b`، ۲۰۲۶-۰۷-۱۴، در ریپوی خودِ
> control-plane) — این جدول فقط تا امروز (۲۰۲۶-۰۷-۱۵) به‌روز نشده بود.** با خوندن مستقیم کد
> تأیید شد، نه فقط commit message:
>
> - **CP-006**: `observability/metrics.ts` (`prom-client`، mirror دقیق Runtime's متریک‌های HTTP)
>   - `routes/metrics.ts` (`GET /metrics`، بدون auth چون Prometheus scraper کلید نداره) — هر دو
>     در `app.ts` وایر شدن.
> - **CP-007**: `plugins/rate-limit.ts`'s کامنت بالای فایل صریحاً محدودیت in-memory/تک-instance
>   رو مستند می‌کنه و توصیه می‌کنه اگه چند replica لازم شد Redis-backed بشه — یعنی خودِ تسک
>   («مستندسازی یا Redis-backed کردن») با انتخاب مستندسازی (نه تبدیل، چون هنوز Redis اصلاً
>   جزو infra این پلین نیست) انجام شده.
> - **CP-015**: `lib/validate-uuid.ts`'s `assertUuid()` (regex-based) قبل از رسیدن به DB در
>   `routes/admin-organizations.ts` و `routes/admin-wallet.ts` صدا زده می‌شه — با curl واقعی
>   دوباره تأیید شد امروز: `GET /admin/organizations/not-a-uuid` حالا ۴۰۰ `VALIDATION_ERROR`
>   می‌ده، نه ۵۰۰.
> - **CP-016**: `web/lib/api-client.test.ts` (۱۳۶ خط) با vitest واقعی + `vi.stubGlobal('fetch',
...)` — پوشش `saveAdminKey`/`loadAdminKey`/`clearAdminKey`، ساخت query param، ضمیمه‌شدن
>   Bearer token، و مسیر خطای `ApiError` روی پاسخ غیر-2xx.
> - **CP-017**: `docker-compose.yml`'s `web` سرویس `depends_on: { gateway: { condition:
service_healthy } }` می‌گیره (نه یک لیست ساده)؛ `HEALTHCHECK` خودِ Dockerfileهاست
>   (`Dockerfile.gateway`/`Dockerfile.web`، هر دو با `node`'s داخلی `http` چون `node:20-slim`
>   نه `curl` داره نه `wget`).
> - **CP-018**: `app.ts`'s `cors` register حالا `origin: [ctx.env.WEB_ORIGIN]` هست (نه
>   `origin: true`)؛ `WEB_ORIGIN` یک `z.string().url()` با پیش‌فرض `http://localhost:3300`. با
>   curl واقعی امروز دوباره تأیید شد: preflight از یک origin غیرمجاز، `Access-Control-Allow-
Origin` header نمی‌گیره؛ از `localhost:3300` می‌گیره.
>
> **CP-002 هنوز واقعاً ❌ مونده** — تعامل واقعی مرورگر (کلیک کردن روی فرم‌ها) کاری نیست که از
> طریق این session قابل انجام باشه (ابزار مرورگر در دسترس نیست). به‌جاش امروز یک HTTP-level
> smoke test واقعی روی gateway در حال اجرا زده شد (`/health`، `/metrics`، باگ UUID، CORS
> allowlist — همه بالا) که سطح API رو تأیید می‌کنه، ولی این جایگزین تعامل واقعی فرم/fetch در
> مرورگر نیست — صراحتاً به‌عنوان یک محدودیت باقی می‌مونه، نه یک چیز جعل‌شده.

## بخش B — تصمیمات ساختاری / خارج از محدوده control-plane (نیاز به اجازه صریح)

| #      | تسک                                                                                                                                                                                                                                                                                                         | یادداشت                                                                                                                                                                                          |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CP-008 | ✅ **انجام شد (2026-07-12).** کلاینت activation سمت Runtime (T-CP-007) — check-in دوره‌ای + خوندن allowed-models/thresholds                                                                                                                                                                                 | تغییر داخل `apps/openon4net-runtime/gateway`، یعنی ریپوی دیگه — اجازه‌ی صریح داده شد؛ ببینید `services/activation-client.ts`, `services/activation-state.ts`, `services/activation-scheduler.ts` |
| CP-009 | commit کردن کد داخل ریپوی خودِ `openon4net-control-plane` (الان همه‌چیز فقط working-tree diff هست، آخرین commit اونجا هنوز `"add readme"`)                                                                                                                                                                  | طبق قانون: فقط با درخواست صریح commit می‌کنم                                                                                                                                                     |
| CP-010 | تصمیم `.gitignore`/ثبت `apps/openon4net-control-plane` به‌عنوان git submodule واقعی در ریشه (مثل `openon4net-runtime`)                                                                                                                                                                                      | الان عمداً هنوز توی `.gitignore` ریشه‌ست؛ برداشتنش یعنی git این پوشه رو embedded repo می‌بینه                                                                                                    |
| CP-011 | Admin auth واقعی‌تر (چند ادمین جدا + audit) به‌جای یک static shared-secret                                                                                                                                                                                                                                  | الان عمدی برای MVP-lite — فقط اگه قراره زودتر از CP-SP-03 جدی بشه لازمه                                                                                                                          |
| CP-014 | فیکس race بی‌ضرر ولی مزاحم در `turbo.json` ریشه: برای پکیج‌های بدون `workspace:*` dep (مثل `@o2n/control-plane-web`)، `typecheck: {dependsOn: ["^build"]}` هیچ ترتیبی با build خودِ همون پکیج نمی‌ده، پس گاهی `tsc --noEmit` وسط بازنویسیِ `.next/types/` توسط `next build` fail می‌کنه (کشف‌شده در CP-005) | نیاز به ویرایش `turbo.json` ریشه — مثلاً اضافه‌کردن یک override برای این پکیج یا تغییر `dependsOn`؛ فعلاً بی‌ضرر (rerun همیشه سبز می‌شه)                                                         |

## بخش C — Should/Later طبق backlog (⚠️ صراحتاً جلوتر از MVP-lite — نیاز به تأیید آگاهانه)

> طبق `docs/spect/09_TASKS/08-scope-guardrails-mvp.md`: «managed AI و provider networks خارج از MVP».
> اگه اینا رو انتخاب کنی یعنی صریحاً از guardrail عبور می‌کنیم — اشکالی نداره، فقط آگاهانه باشه.

| #      | تسک                                                                                                                                        | یادداشت                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CP-012 | CP-SP-03 — Managed AI Gateway: router rules، failover، cost tracking managed، circuit breaker                                              | ✅ انجام شد (۲۰۲۶-۰۷-۱۸، طبق scope واقعی backlog US-630..633 در `04_control-plane-backlog.md`، نه کل سند آرمانی `02-ai-gateway.md`): `ai-gateway-service.ts` + migration `0007_ai_gateway.sql` (`ai_gateway_provider_configs` ordered chain + `ai_gateway_usage_events`) + `organizations.ai_gateway_enabled` (US-633، پیش‌فرض false، BYOK می‌مونه پیش‌فرض). Routes: `GET/PUT /v1/ai-gateway/config` (session-auth، org-admin)، `GET /v1/ai-gateway/usage`، `POST /v1/ai-gateway/complete` (activation-key auth، Runtime-facing). Failover ساده (تلاش زنجیره به ترتیب priority، نه retryable-vs-not) + cost tracking واقعی (`pricing.ts` مرکزی، debit از wallet). `featureFlags.managedAiGateway` در check-in از false-همیشه به true برای team/business/enterprise تغییر کرد. ۱۱ تست vitest جدید + یک HTTP smoke-test واقعی (activation key واقعی، ۴۰۲ درست). **عمداً نه**: circuit breaker، semantic cache، rule-based intent classification، provider غیر از ۴ تای `@o2n/llm-providers` (Gemini/Runway/Grok در سند آرمانی هستن، نساخته شدن) — این‌ها بخش آرمانی سند `02-ai-gateway.md`ان، نه backlog واقعی E-063. جزئیات کامل در `docs/spect/DONE.md`. **جانبی مهم**: CI این ریپو تا الان standalone بود (بدون `workspace:*`)؛ چون این تسک اولین وابستگی واقعی به `@o2n/llm-providers` رو اضافه کرد، `.github/workflows/ci.yml` به الگوی overlay-به-parent-monorepo مثل Runtime's CI تغییر کرد. |
| CP-013 | CP-SP-04 — Billing واقعی: payment provider، ledger کامل با refund، wallet settlement برای Marketplace، budget hooks، `POST /cost/estimate` | Epic E-064؛ طبق guardrail بعد از ۲-۳ مشتری واقعی                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

## بخش D — ثبت‌نام self-service + مدل activation شخصی/سازمانی (جلسه ۵، `06_MEETINGS/05-self-service-signup-and-activation-model.md`)

| #      | تسک                                                                                                                                       | یادداشت                                                                                                         |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| CP-025 | ثبت‌نام self-service (ایمیل/پسورد + مگ‌لینک) — جدول `users` جدید در Control Plane، لاگین/session واقعی                                    | ✅ انجام شد — argon2+JWT+مگ‌لینک (عیناً معماری Runtime)، جزئیات در `DONE.md`                                    |
| CP-026 | `activation_keys` نوع شخصی/سازمانی + سقف ۵ کد به‌ازای کاربر + سقف seat (۳ رایگان سازمانی، بدون پرداخت واقعی)                              | ✅ انجام شد — `/v1/activation-keys` + صفحه `/account` واقعی، جزئیات در `DONE.md`                                |
| CP-027 | مارکت‌پلیس در Control Plane — Control Plane مستقیم API مارکت‌پلیس رو صدا بزنه، UI خودش رو بسازه                                           | ✅ انجام شد — `/v1/marketplace/*` + صفحه `/marketplace`، gate روی `hasActivatedAnyRuntime`، جزئیات در `DONE.md` |
| CP-028 | چندزبانگی — `organizations.language` + انتخاب زبان اولین ورود + JSON locale (`en.json` مرجع) + AI-generation برای زبان غایب               | ✅ انجام شد — `/v1/locales/:lang` + بنر انتخاب زبان در `/account`، جزئیات در `DONE.md`                          |
| CP-029 | قفل activation key سازمانی به IP استاتیک/دامنه — چک در هر check-in، عدم تطابق = رد                                                        | ✅ انجام شد — اختیاری، قابل‌ویرایش بعداً، جزئیات در `DONE.md`                                                   |
| CP-030 | Revoke/expire واقعی — route ادمین برای لغو دستی + اجرای واقعی `expires_at`                                                                | ✅ انجام شد — انقضا lazy در لحظه‌ی استفاده، revoke دستی via route، جزئیات در `DONE.md`                          |
| CP-031 | مدل Reseller/Host — entity `resellers` (سهمیه `max_connected_instances`) + `activation_keys.reseller_id` + API صدور/لغو کلید در سقف سهمیه | ✅ انجام شد — سهمیه بر اساس کلیدهای فعال (نه عمری)، جزئیات در `DONE.md`                                         |

---

## بخش E — توکن امنیتی بعد از activation (جلسه ۶، `06_MEETINGS/06-agent-definition-review-and-runtime-gaps.md`)

| #      | تسک                                                                                                                                                      | یادداشت                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CP-032 | صدور توکن امنیتی اختصاصی برای ارتباط Marketplace/Control-Plane، بعد از تأیید موفق activation code (به‌جای secretهای ثابت فعلی مثل `MARKETPLACE_API_KEY`) | ✅ انجام شد (کاربر تصمیم معماری رو تأیید کرد: «طراحی و بساز») — `issueProxyToken(env, organizationId)`/`verifyProxyToken(env, token)`: JWT کوتاه‌عمر (۲ ساعت) امضاشده با `JWT_SECRET` موجود Platform، payload `{ sub: organizationId, type: 'proxy-access' }`، در هر `/activation/check-in` موفق صادر می‌شه. جایگزین secretهای ثابت سراسری که قبلاً هر deployment Runtime مستقیم نگه می‌داشت. تست واقعی round-trip + رد secret اشتباه + تفکیک JWT کاربر از JWT proxy + انقضا. جزئیات در `DONE.md` |

---

## بخش F — تغییر نام به Platform + عبور اجباری Runtime↔Memory/Marketplace (جلسه ۷، `06_MEETINGS/07-platform-rename-and-mediated-cross-plane-access.md`)

> پس‌زمینه: AI Gateway در جایگاه برنامه‌ریزی‌شده‌اش (`CP-012`) تأیید شد، منتقل نمی‌شه. تصمیم
> جدید: Control Plane اسمش «Platform» می‌شه چون نقشش گسترده‌تر از کنترل/activation صرفه —
> واسطه‌ی اجباری هر ارتباط Runtime↔Memory/Marketplace هم می‌شه.

| #      | تسک                                                                                                                                         | یادداشت                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CP-033 | تغییر نام Control Plane → Platform (مستندات + rename فیزیکی repo/پوشه)                                                                      | ✅ انجام شد — پوشه، `.gitignore`/`pnpm-workspace.yaml`، فایل TODO، و خودِ ریپوی GitHub (توسط کاربر) rename شدن. `CONTROL_PLANE_URL` env var و اسم‌های داخلی npm package (`@o2n/control-plane-*`) عمداً دست‌نخورده موندن (تصمیم کاربر، نه گپ)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| CP-034 | لایه‌ی mediation/proxy در Platform برای درخواست‌های Runtime→Memory و Runtime→Marketplace (لایه‌ی امنیتی + ثبت میزان مصرف)، با توکن `CP-032` | ✅ انجام شد برای Marketplace (Memory عمداً خارج از scope — Runtime هنوز هیچ client‌ای برای Memory نداره که «مهاجرت» بشه) — route عمومی `ALL /v1/proxy/marketplace/*`، توکن CP-032 رو verify می‌کنه، با `MARKETPLACE_API_KEY` خودِ Platform (نه Runtime) به Marketplace واقعی forward می‌کنه، پاسخ رو عیناً برمی‌گردونه. متریک `proxyRequestsTotal` (label `service`/`outcome`). تنش best-effort/hard-fail حل شد: activation check-in همچنان best-effort می‌مونه (چون عملیات هسته‌ای چت/Agent هرگز نباید به Platform وابسته باشه)، ولی تماس‌های Marketplace از طریق proxy درست hard-fail می‌کنن چون دسترسی به Marketplace ذاتاً یک وابستگی بیرونیه، چه با واسطه چه بی‌واسطه — CP-034 فقط تغییر می‌ده Runtime با **کی** حرف بزنه، نه اینکه وابستگی بیرونی وجود داره یا نه. تست route-level واقعی با `buildApp()`+`.inject()`. تست end-to-end واقعی: Runtime→Platform→fake-Marketplace. جزئیات در `DONE.md` |

---

## بخش G — بازطراحی AI Gateway به مدل OpenRouter (جلسه ۸، `06_MEETINGS/08-ai-gateway-openrouter-model.md`)

> پس‌زمینه: CP-012 موجود فقط org-level است (یک زنجیره‌ی provider، ۴ provider ثابت،
> بدون Workspace/Token). این بخش اون رو به یک مدل شبیه OpenRouter.ai گسترش می‌ده:
> Workspace + توکن‌های محدودشده (پول/provider/مدل/زمان) + کاتالوگ provider (~۱۰-۱۵ تا،
> نه ۴۰۰ آداپتور کد جدا) + انتخاب هوشمند (ترتیب دستی کاربر در اولویت، وگرنه
> هزینه/در‌دسترس‌بودن/latency) + داشبورد مصرف + نمای عمومی محبوبیت provider در
> landing page. جزئیات باز (فرمول امتیازدهی، لیست دقیق provider، معنای دقیق
> محدودیت زمانی) موکول به فاز پیاده‌سازی — ببینید جلسه ۸ بخش ۵.

| #      | تسک                                                                                                                                                                                                                                                                                                                                                                                                                                                        | یادداشت                                                                                                                                                                                                                                                                    |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CP-035 | Entity جدید `workspaces` داخل Platform (مستقل از Workspaceهای Runtime، بدون sync در این فاز) — هر Organization چند Workspace داره                                                                                                                                                                                                                                                                                                                          | پایه‌ی همه‌ی تسک‌های زیر — باید اول ساخته بشه                                                                                                                                                                                                                              |
| CP-036 | مدل توکن AI Gateway (`ai_gateway_tokens`): محدود به یک یا چند Workspace، سقف مصرف پولی، allowlist provider/مدل، ترتیب دستی provider (اختیاری)، محدودیت زمانی                                                                                                                                                                                                                                                                                               | جایگزین/گسترش `ai_gateway_provider_configs` فعلی (که org-level و بدون token بود). معنای دقیق «محدودیت زمانی» (بازه‌ی اعتبار یا زمان‌بندی ساعت/روز مثل RT-088) موکول به پیاده‌سازی                                                                                          |
| CP-037 | کاتالوگ فنی Provider/Model (~۱۰-۱۵ provider اول، داده نه کد) — فیلدها: `Provider`, `Model`, `Parameters`, `Training Tokens`, `Context Window`, `Architecture`, `Active Parameters`, `Benchmark Scores`, `Reasoning Ability`, `Inference Speed`, `Latency`, `Knowledge Cutoff`, `Multimodal Support`, `Tool/Function Calling`, `Fine-tuning Support`, `Memory Support`, `License`, `Hardware Requirement`, `Price/M tokens` (ورودی/خروجی جدا + `updatedAt`) | روی همون آداپتورهای OpenAI-compatible/Anthropic-native موجود در `@o2n/llm-providers`. قیمت **دستی توسط ادمین Platform** ویرایش می‌شه (نه scraping خودکار — هیچ API عمومی یکپارچه‌ای برای قیمت لحظه‌ای همه‌ی providerها وجود نداره). لیست دقیق provider موکول به پیاده‌سازی |
| CP-038 | موتور انتخاب هوشمند provider: اگه ترتیب دستی کاربر روی توکن ست شده همون استفاده بشه، وگرنه امتیازدهی ترکیبی هزینه/در‌دسترس‌بودن/latency                                                                                                                                                                                                                                                                                                                    | فرمول دقیق امتیازدهی و اینکه circuit-breaker واقعی لازمه یا شمارش ساده‌ی خطای اخیر کافیه، موکول به پیاده‌سازی                                                                                                                                                              |
| CP-039 | داشبورد مصرف در Platform: مصرف کل + به‌تفکیک هر Workspace + هزینه‌ی هر provider به‌تفکیک هر کاربر، در داشبورد مدیریت اصلی                                                                                                                                                                                                                                                                                                                                  | گسترش `listUsage()` موجود از سطح org به سطح workspace/token/user                                                                                                                                                                                                           |
| CP-040 | نمای عمومی محبوبیت provider در landing page (پرمصرف‌ترین provider، آمار تجمیعی/بی‌نام)                                                                                                                                                                                                                                                                                                                                                                     | صرفاً marketing/آمار عمومی، بدون افشای داده‌ی سازمان خاص                                                                                                                                                                                                                   |
| CP-041 | اتصال Workspace به Google Drive، به‌شکل انتزاع «storage connector» قابل‌گسترش (نه Google-specific) — درایورهای دیگه بعداً اضافه می‌شن                                                                                                                                                                                                                                                                                                                      | مفهوماً جدا از AI Gateway، فقط از طریق entity جدید Workspace (CP-035) به این batch وصل شد                                                                                                                                                                                  |
| CP-042 | کمیسیون Platform روی مصرف — درصد قابل‌تنظیم توسط ادمین Platform، روی قیمت خام هر provider (به‌ازای هر یک میلیون توکن) اعمال می‌شه قبل از کسر از wallet workspace/توکن                                                                                                                                                                                                                                                                                      | بخشی از همون تنظیمات قیمت‌گذاری CP-037، نه یک مسیر جدا. وابسته به CP-013 (Billing) طبق یادداشت پایین                                                                                                                                                                       |
| CP-043 | Model Fusion — استفاده‌ی هم‌زمان از چند مدل برای یک درخواست، **فقط در وب‌سایت Platform** (نه از طریق API که Runtime باهاش صحبت می‌کنه)                                                                                                                                                                                                                                                                                                                     | ⏳ مکانیزم دقیق fusion (نمایش مقایسه‌ای چند پاسخ در کنار هم، یا یک مدل داور که پاسخ‌ها رو ترکیب می‌کنه) هنوز تصمیم‌گیری نشده — باز قبل از پیاده‌سازی                                                                                                                       |
| CP-044 | دسته‌بندی کاربردی مدل‌ها (الهام از openrouter.ai/models — مثلاً Roleplay/Programming/Marketing) — محور جدا از دسته‌بندی فنی CP-037                                                                                                                                                                                                                                                                                                                         | هر مدل می‌تونه به یک یا چند دسته نسبت داده بشه؛ لیست دقیق دسته‌ها موکول به پیاده‌سازی                                                                                                                                                                                      |

> **وابستگی به CP-013:** سقف بودجه‌ی هر توکن (CP-036) و کمیسیون Platform (CP-042)
> باید از همون معماری wallet/pricing موجود (`pricing.ts`, `wallet-service.ts`)
> استفاده کنن، نه یک مسیر پرداخت موازی جدید — هماهنگ با CP-013 (Billing واقعی)
> در فاز پیاده‌سازی.

---

## نحوه استفاده

بهم بگو کدوم شماره‌(ها) رو انجام بدم (مثلاً «CP-001 و CP-003 رو برو انجام بده»).
اگه چیزی این‌جا نیست ولی لازمشه، بگو تا اضافه‌اش کنم.

---

## فازبندی سریع

### MVP / MVP-lite

- `CP-001..CP-005`
- `CP-008`
- `CP-009..CP-011`

### Post-MVP / Phase 2+

- `CP-006..CP-007`
- `CP-012..CP-014`
- `CP-015..CP-018`

### Later / Phase 3+

- `CP-019..CP-024`

> فازها و انتظار سیستم: `docs/spect/09_TASKS/13-phase-expectations.md`

---

## فاز 3 تا 5 در Control Plane

### Phase 3 — Organization

- `CP-006..CP-018`
- پشتیبانی governance/budget/approval برای `T-077..T-104`

### Phase 4 — Ecosystem

- `CP-019..CP-024`
- پشتیبانی billing/settlement/integration برای `T-105..T-132`

### Phase 5 — Enterprise

- hardening و launch readiness برای کنترل‌پلین
- وابستگی‌های roadmap: `T-133..T-160`
