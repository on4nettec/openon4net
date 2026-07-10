# TODO — openon4net-control-plane (Plane 2)

> فایل تصمیم‌گیری، نه صف اجرا. من (Claude) هیچ‌کدوم از این ردیف‌ها رو خودم
> شروع نمی‌کنم — منتظر می‌مونم بگی کدوم رو انجام بدم (تک‌تک یا گروهی).
> بعد از هر تسک، وضعیتش اینجا و خلاصه‌اش در `docs/spect/DONE.md` به‌روز می‌شه.
>
> **پس‌زمینه/جزئیات هر تسک:** `docs/sprint-plan/04_control-plane-backlog.md`
> (Epic/Story/Task/Sprint کامل). این فایل فقط خلاصه‌ی عملیاتیه.
>
> **وضعیت فعلی (2026-07-10):** CP-SP-01 و CP-SP-02 کد کامل و در
> `pnpm-workspace.yaml` ثبت شدن — `pnpm turbo run lint typecheck test build`
> سبزه (هم این دو پکیج، هم کل workspace). هنوز هیچی روی زیرساخت واقعی
> (Postgres واقعی، مرورگر واقعی) اجرا/تست نشده.
>
> **محدوده:** همه‌ی ردیف‌های بخش A فقط داخل `apps/openon4net-control-plane/`
> اجرا می‌شن — نه `openon4net-runtime`، نه فایل‌های ریشه مونوریپو. ردیف‌هایی
> که خارج از این محدوده‌ن (بخش B) صراحتاً علامت‌گذاری شدن.
>
> این فایل خواهر `TODO-openon4net-runtime.md` و `TODO-openon4net-memory.md` است، همون فرمت.

---

## بخش A — تکمیل/اعتبارسنجی داخل خود control-plane (بدون نیاز به اجازه اضافه)

| #      | تسک                                                                                                                                                                                           | نیاز به اجازه؟ | وضعیت |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------: | :---: |
| CP-001 | یک دور end-to-end واقعی با curl: بالا آوردن gateway روی یک Postgres واقعی (دیتابیس جدا `o2n_control_plane`)، اجرای migration، issue کلید، check-in، credit wallet، خوندن transactions         |     ❌ خیر     |  ✅   |
| CP-002 | باز کردن `web/` توی مرورگر واقعی: صفحه فرود، ورود ادمین، صدور کلید، جزئیات سازمان + فرم شارژ (توجه: CP-004 با curl تأیید کرد صفحات سرو می‌شن، ولی تعامل واقعی فرم‌ها/fetch در مرورگر هنوز نه) |     ❌ خیر     |  ❌   |
| CP-003 | تست‌های vitest واقعی برای `activation-service` و `wallet-service` (الان `--passWithNoTests` — صفر تست)، مخصوصاً idempotency                                                                   |     ❌ خیر     |  ✅   |
| CP-004 | `Dockerfile.web` + سرویس `web` در `docker-compose.yml` (الان فقط `gateway` دیپلوی می‌شه)                                                                                                      |     ❌ خیر     |  ✅   |
| CP-005 | صفحه‌بندی/جستجو برای `GET /admin/organizations` (الان فقط `limit` ساده)                                                                                                                       |     ❌ خیر     |  ✅   |
| CP-006 | Observability فراتر از trace-id — یک `/metrics` (Prometheus) شبیه چیزی که Runtime تازه ساخت (T-020 معادل)                                                                                     |     ❌ خیر     |  ❌   |
| CP-007 | مستندسازی محدودیت شناخته‌شده‌ی rate limiter (in-memory، تک-instance) یا Redis-backed کردنش اگه قراره چند replica بالا بیاد                                                                    |     ❌ خیر     |  ❌   |

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

## بخش B — تصمیمات ساختاری / خارج از محدوده control-plane (نیاز به اجازه صریح)

| #      | تسک                                                                                                                                        | یادداشت                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| CP-008 | کلاینت activation سمت Runtime (T-CP-007) — check-in دوره‌ای + خوندن allowed-models/thresholds                                              | تغییر داخل `apps/openon4net-runtime/gateway`، یعنی ریپوی دیگه — نه فایل ریشه، ولی همون سطح ریسک |
| CP-009 | commit کردن کد داخل ریپوی خودِ `openon4net-control-plane` (الان همه‌چیز فقط working-tree diff هست، آخرین commit اونجا هنوز `"add readme"`) | طبق قانون: فقط با درخواست صریح commit می‌کنم                                                    |
| CP-010 | تصمیم `.gitignore`/ثبت `apps/openon4net-control-plane` به‌عنوان git submodule واقعی در ریشه (مثل `openon4net-runtime`)                     | الان عمداً هنوز توی `.gitignore` ریشه‌ست؛ برداشتنش یعنی git این پوشه رو embedded repo می‌بینه   |
| CP-011 | Admin auth واقعی‌تر (چند ادمین جدا + audit) به‌جای یک static shared-secret                                                                 | الان عمدی برای MVP-lite — فقط اگه قراره زودتر از CP-SP-03 جدی بشه لازمه                         |

## بخش C — Should/Later طبق backlog (⚠️ صراحتاً جلوتر از MVP-lite — نیاز به تأیید آگاهانه)

> طبق `docs/spect/09_TASKS/08-scope-guardrails-mvp.md`: «managed AI و provider networks خارج از MVP».
> اگه اینا رو انتخاب کنی یعنی صریحاً از guardrail عبور می‌کنیم — اشکالی نداره، فقط آگاهانه باشه.

| #      | تسک                                                                                                                                        | یادداشت                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| CP-012 | CP-SP-03 — Managed AI Gateway: router rules، failover، cost tracking managed، circuit breaker                                              | جانشین رسمی T-011 منسوخ Runtime؛ Epic E-063      |
| CP-013 | CP-SP-04 — Billing واقعی: payment provider، ledger کامل با refund، wallet settlement برای Marketplace، budget hooks، `POST /cost/estimate` | Epic E-064؛ طبق guardrail بعد از ۲-۳ مشتری واقعی |

---

## نحوه استفاده

بهم بگو کدوم شماره‌(ها) رو انجام بدم (مثلاً «CP-001 و CP-003 رو برو انجام بده»).
اگه چیزی این‌جا نیست ولی لازمشه، بگو تا اضافه‌اش کنم.
