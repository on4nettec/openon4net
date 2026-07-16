# TODO — openon4net-marketplace (Plane 4)

> فایل تصمیم‌گیری، نه صف اجرا. من (Claude) هیچ‌کدوم از این ردیف‌ها رو خودم
> شروع نمی‌کنم — منتظر می‌مونم بگی کدوم رو انجام بدم (تک‌تک یا گروهی).
> بعد از هر تسک، وضعیتش اینجا و خلاصه‌اش در `docs/spect/DONE.md` به‌روز می‌شه.
>
> **وضعیت فعلی (2026-07-10):** MKT-002 تا MKT-006 انجام شد — جزئیات کامل در
> `docs/spect/DONE.md` (بخش «Marketplace (Plane 4)»). خلاصه: `service/`
> واقعی (Fastify+pg، نه فقط 501 مثل memory)، migration کامل، submit/list/
> discover/install routes، ۱۴ تست vitest روی Postgres واقعی، Docker build+run
> واقعی تأیید شد. فقط MKT-001 (ثبت در `pnpm-workspace.yaml` ریشه) باقی مونده
> چون نیاز به اجازه‌ی فایل ریشه داره — تا اون موقع `pnpm install
--ignore-workspace` جایگزین دائمیشه برای dev/test محلی.
>
> **2026-07-12 — MKT-017..019 انجام شد (بخش D):** Skills حالا یک entity
> موازی با Plugins در Marketplace است (بدون versions/checksum/signature/
> review pipeline — چیزی برای verify کردن باینری نیست). یک gap مستندشده‌ی
> قدیمی هم بسته شد: `plugin_installs.config` که در API doc بود ولی در جدول
> واقعی نبود، حالا با یک migration + `PATCH /marketplace/installs/:id/config`
> واقعی شده. ۹ تست vitest جدید روی Postgres واقعی. جزئیات در `DONE.md`.
>
> **یادآوری مهم از `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` §3.3/§5:**
> Plane 4 در MVP فقط باید «**private/local install + registry ساده**» باشه؛
> «Marketplace public + review pipeline + signing سخت‌گیرانه + payouts» رسماً
> «Later» است (بعد از ۲-۳ مشتری واقعی). بخش C این فایل دقیقاً همون کاره؛ اگه
> انتخابش کنی یعنی صریحاً داری از guardrail عبور می‌کنی — اشکالی نداره، فقط
> آگاهانه باشه.
>
> **محدوده:** همه‌ی ردیف‌ها (مگر خلافش نوشته شده) فقط داخل
> `apps/openon4net-marketplace/` (ریپوی جدای خودش) اجرا می‌شن. ردیف‌هایی که
> به فایل ریشه‌ی مونوریپو نیاز دارن (`pnpm-workspace.yaml`) صراحتاً
> علامت‌گذاری شدن.
>
> این فایل خواهر `TODO-openon4net-runtime.md`، `TODO-openon4net-control-plane.md`
> و `TODO-openon4net-memory.md` است، همون فرمت.

---

## بخش A — اسکلت اولیه سرویس (از صفر، مطابق الگوی memory/control-plane)

| #       | تسک                                                                                                                                                                                                 | نیاز به اجازه فایل ریشه؟ |                                                        وضعیت                                                        |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------: | :-----------------------------------------------------------------------------------------------------------------: |
| MKT-001 | اسکلت اولیه `service/` (Fastify + TS + pg) + ثبت در `pnpm-workspace.yaml` ریشه                                                                                                                      |          ✅ بله          |                          🔧 (فقط بخش ثبت در ریشه باقیه؛ خود اسکلت ساخته و تست شده — پایین)                          |
| MKT-002 | migration اولیه (`publishers`, `plugins`, `plugin_versions`, `plugin_reviews`) طبق `02_ARCHITECTURE/12-marketplace-service.md` §8 و `03_DATABASE/*`                                                 |          ❌ خیر          | ✅ (`plugin_installs` هم اضافه شد — لازم بود تا MKT-003's install route جایی برای نوشتن داشته باشه؛ جزئیات DONE.md) |
| MKT-003 | route های اسکلتی حداقلی MVP-lite (طبق guardrail §5 — فقط local/private، نه public): `POST/GET /publisher/plugins`، `GET /marketplace/plugins` (لیست local)، `POST /marketplace/plugins/:id/install` |          ❌ خیر          |                                                         ✅                                                          |
| MKT-004 | CI ساده داخل ریپوی خودش (`.github/workflows/ci.yml`: typecheck+test+build) — مثل الگوی memory/control-plane                                                                                         |          ❌ خیر          |                              🔧 (نوشته شده، push/اجرای واقعی روی GitHub Actions نشده)                               |
| MKT-005 | `Dockerfile.service` (فقط build image)                                                                                                                                                              |          ❌ خیر          |                            ✅ (+ `docker-compose.yml`؛ build و run واقعی هر دو تأیید شد)                            |
| MKT-006 | تست‌های vitest برای route های بخش A (submit/list/install)                                                                                                                                           |          ❌ خیر          |     ✅ (سطح service، نه HTTP — مثل قرارداد تستی control-plane؛ ۱۴ تست روی DB واقعی + curl زنده برای مسیر HTTP)      |

## بخش B — سخت‌تر کردن قرارداد (هنوز private/local، در چارچوب MVP-lite)

| #       | تسک                                                                                                                         | نیاز به اجازه فایل ریشه؟ | وضعیت |
| ------- | --------------------------------------------------------------------------------------------------------------------------- | :----------------------: | :---: |
| MKT-007 | لایه auth ساده (API key/bearer ثابت) — مثل `MEM-005` در memory، چون این سرویس هم قراره از بیرون (Runtime/admin) صدا زده بشه |          ❌ خیر          |  ✅   |
| MKT-008 | trace_id passthrough + structured logging مطابق `08-observability-otel.md`                                                  |          ❌ خیر          |  ✅   |
| MKT-009 | checksum (sha256) verification برای artifact روی install — فقط local file storage، بدون CDN واقعی                           |          ❌ خیر          |  ✅   |
| MKT-010 | Permission diff on update (طبق §6.2 سند معماری): اگه نسخه جدید permission بیشتر بخواد، install باید re-approve بشه وگرنه رد |          ❌ خیر          |  ✅   |
| MKT-011 | مستندسازی `API.md` (curl + نمونه response برای هر route) — مثل الگوی memory                                                 |          ❌ خیر          |  ✅   |

> **۲۰۲۶-۰۷-۱۵ — بازبینی بخش B.** MKT-007..010 از قبل کامل پیاده‌سازی و کامیت شده بودن، فقط
> این جدول به‌روز نشده بود:
>
> - **MKT-007**: `plugins/auth.ts` — چک `Authorization: Bearer <MARKETPLACE_API_KEY>` با
>   `safeEqual`، در `app.ts` وایر شده. `PUBLIC_ROUTES` فقط `/health` و روت‌های discovery رو
>   استثنا می‌کنه (`GET /marketplace/plugins`, `/marketplace/plugins/:id`,
>   `/marketplace/skills`, `/marketplace/skills/:id`).
> - **MKT-008**: `plugins/trace-id.ts` — `X-Trace-Id` ورودی رو honor می‌کنه، وگرنه یکی می‌سازه،
>   در پاسخ echo می‌کنه، و `request.log.child({traceId})` برای structured logging.
> - **MKT-009**: `lib/artifact-storage.ts`'s `verifyChecksum()` — در `installPlugin()` صدا زده
>   می‌شه، اگه artifact محلی موجود باشه.
> - **MKT-010**: `services/marketplace-service.ts`'s `installPlugin()` — دیف permission بین
>   نسخه‌ی فعال قدیم و نسخه‌ی جدید، بدون `acknowledgePermissionDiff` رد می‌کنه
>   (`PERMISSION_DIFF_REQUIRED`، ۴۰۹).
>
> **MKT-011 امروز واقعاً انجام شد** (نه فقط بازبینی) — `API.md` قبلاً فقط plugin routes رو
> پوشش می‌داد (صفر اشاره به «skill»). بخش‌های جدید اضافه شد: `POST/GET /publisher/skills`،
> `GET /marketplace/skills` (+ `/:id`)، `POST /marketplace/skills/:id/install`، rating هم
> برای plugin هم skill (MKT-021)، و `PATCH /marketplace/installs/:id/config` (MKT-019) — همه
> با پاسخ واقعی گرفته‌شده از سرویس در حال اجرا (نه دست‌نویس)، مطابق قرارداد خودِ فایل
> («Every example below is a real response from the running service»).

## بخش D — Skills به‌عنوان یک Marketplace entity (2026-07-12، فاز ۲ تکمیلی Runtime)

> جزئیات تصمیم در `06_MEETINGS/02-skills-plugins-marketplace-model.md` و
> `02_ARCHITECTURE/12-marketplace-service.md` §۱۰.

| #       | تسک                                                                                                                                                                       | نیاز به اجازه فایل ریشه؟ | وضعیت |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------: | :---: |
| MKT-017 | migration `marketplace_skills` + `skill_installs` (موازی با plugins، بدون versions/checksum/signature/review pipeline)                                                    |          ❌ خیر          |  ✅   |
| MKT-018 | `publisher-skill-service.ts` (`submitSkill`, upsert بر اساس slug) + `marketplace-skill-service.ts` (`listMarketplaceSkills`, `installMarketplaceSkill`) + routeهای مربوطه |          ❌ خیر          |  ✅   |
| MKT-019 | `PATCH /marketplace/installs/:id/config` — تکمیل یک gap مستندشده‌ی قبلی (`plugin_installs.config` در API doc بود ولی نه در جدول/کد)                                       |          ❌ خیر          |  ✅   |

## بخش E — Permission consent + Analytics + Publisher دسترس‌پذیر از Runtime (2026-07-14)

> کاربر خواست باقی‌مانده‌های فاز ۲ روadmap تکمیل بشه؛ این سه آیتم روی این
> سرویس (Marketplace) هم کار لازم داشتن، چون سمت Runtime فقط proxy می‌کنه.
> جزئیات کامل در `docs/spect/DONE.md`.

| #       | تسک                                                                                                                                                                                                                        |  نیاز به اجازه فایل ریشه؟   | وضعیت |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------: | :---: |
| MKT-020 | `listMarketplacePlugins()` حالا `permissions` نسخه‌ی approved رو برمی‌گردونه (قبلاً هیچ‌وقت expose نمی‌شد) — پیش‌نیاز consent gate سمت Runtime (RT-051)                                                                    |           ❌ خیر            |  ✅   |
| MKT-021 | migration `0005_marketplace_ratings.sql` (`plugin_ratings`/`skill_ratings`، upsert بر اساس (item, org))؛ `installCount` از `COUNT(*)` روی installs موجود (بدون ستون جدید)؛ `ratePlugin`/`rateSkill` + route های `.../rate` | ❌ خیر (فقط migration محلی) |  ✅   |
| MKT-022 | بدون کد اضافه سمت این سرویس — `/publisher/plugins`/`/publisher/skills` از قبل (بخش A) کامل بودن، فقط هیچ‌وقت از Runtime صدا زده نمی‌شدن؛ کاری که این batch اضافه کرد سمت Runtime بود (RT-053)                              |           ❌ خیر            |  ✅   |

## بخش F — تکمیلی: اکوسیستم Plugin (طبق جلسه ۴، `06_MEETINGS/04-plugin-ecosystem-architecture.md`)

| #       | تسک                                                                                                                               | نیاز به اجازه فایل ریشه؟ | وضعیت |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- | :----------------------: | :---: |
| MKT-024 | دسته‌بندی (category) برای Plugin — ستون/تاکسونومی روی جدول `plugins` + فیلتر در discovery                                         |          ❌ خیر          |  ❌   |
| MKT-025 | Sandbox test-gate پیش از انتشار — گسترش `plugin_versions.status` (submitted → sandbox_testing → sandbox_passed/rejected → listed) |          ❌ خیر          |  ❌   |
| MKT-026 | تأیید/تکمیل مدل رایگان/فروشی یکسان برای Skill (طبق ADR-012) — ممکن است بخشی از قبل ساخته شده باشد، نیاز به بررسی                  |          ❌ خیر          |  ❌   |

## بخش C — ⚠️ صراحتاً خارج از MVP guardrail (نیاز به تأیید آگاهانه)

> طبق `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` §3.3: «Marketplace public
>
> - review pipeline + signing سخت‌گیرانه + payouts» بعد از ۲-۳ مشتری واقعی.

> **بروزرسانی (2026-07-14):** این جدول قدیمی شده بود — MKT-013/015/016 و نیمی
> از MKT-014 در یک پاس قبلی (بدون شماره‌گذاری صریح در این فایل) واقعاً ساخته
> شدن، فقط اینجا هیچ‌وقت ✅ نشدن. جزئیات کامل + ارجاع کد: `docs/spect/DONE.md`.

| #       | تسک                                                                                                     | یادداشت                                                                                                                                                                                                     | وضعیت |
| ------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---: |
| MKT-012 | Public marketplace واقعی (چند publisher/سازمان خارجی، نه فقط لوکال)                                     | جایگزین دامنه‌ی v0.1 (module داخل API) با v0.2+ سرویس مستقل طبق §9 سند معماری                                                                                                                               |  ❌   |
| MKT-013 | Review pipeline — بخش «manual review واقعی» + بخش «هیوریستیک خودکار» ساخته شدن                          | ✅ `reviewPluginVersion()` (approve/reject/needs_changes واقعی، persisted) + `runAutomatedChecks()` (allowlist مجوزها، نه SAST/dependency-scan واقعی — اون نیم دیگه همچنان نیست، به‌صراحت مستند شده در کد)  |  🔧   |
| MKT-014 | Signing + verified publisher                                                                            | ✅ signing (checksum sha256 + امضای ed25519 روی رجیستری) و flag «verified publisher» (`verifyPublisher()`) ساخته شدن؛ ❌ PKI/cosign سخت‌گیرانه و یک برنامه‌ی واقعی verified-publisher (معیار/KYC) هنوز نیست |  🔧   |
| MKT-015 | Revenue share ledger کامل + payout queue واقعی (پول واقعی به publisher)                                 | ✅ ledger (`accrueRevenueShare`/`getPublisherLedger`/`createPayoutBatch`، ۷۰/۳۰ طبق سند) ساخته شد؛ ❌ payout هنوز فقط ثبت دفتری است، نه انتقال پول واقعی — طبق guardrail §4 عمداً همینطور می‌مونه           |  🔧   |
| MKT-016 | Kill switch platform-level واقعی + CDN distribution برای artifact                                       | ✅ kill switch (`getKillSwitch`/`setKillSwitch`) ساخته شد؛ ❌ CDN distribution وابسته به MKT-012 (بدون public marketplace اولویت پایینه) هنوز نیست                                                          |  🔧   |
| MKT-023 | نمایش `priceCredits` پلاگین‌ها در discovery + endpoint تک‌آیتمی `GET /marketplace/{plugins,skills}/:id` | ✅ انجام شد — پیش‌نیاز RT-057 سمت Runtime (کسر واقعی کیف‌پول سازمان نصب‌کننده برای آیتم‌های پولی). جزئیات در `DONE.md`                                                                                      |  ✅   |

---

## نحوه استفاده

بهم بگو کدوم شماره‌(ها) رو انجام بدم (مثلاً «MKT-001 و MKT-002 رو برو انجام بده»).
اگه چیزی این‌جا نیست ولی لازمشه، بگو تا اضافه‌اش کنم.

---

## فازبندی سریع

### MVP-lite / Private marketplace

- `MKT-001..MKT-011`
- `MKT-017..MKT-019` — Skills entity + Plugin config PATCH، ✅ انجام شد ۲۰۲۶-۰۷-۱۲
- `MKT-020..MKT-022` — permission consent + analytics (downloads/ratings) + publisher dashboard (سمت Runtime، RT-051..053)، ✅ انجام شد ۲۰۲۶-۰۷-۱۴
- `MKT-023` — نمایش priceCredits + endpoint تک‌آیتمی (پیش‌نیاز RT-057 پرداخت واقعی سمت Runtime)، ✅ انجام شد ۲۰۲۶-۰۷-۱۴
- review pipeline (نیم manual)، revenue-share ledger، kill switch، و flag «verified publisher» هم عملاً از قبل ساخته شده بودن (بدون شماره‌ی رسمی در این فایل تا حالا) — جزئیات در بخش C بالا و `DONE.md`

### Post-MVP / Public marketplace

- `MKT-012..MKT-016`

> فازها و انتظار سیستم: `docs/spect/09_TASKS/13-phase-expectations.md`

---

## فاز 3 تا 5 در Marketplace

### Phase 3 — Organization

- `MKT-001..MKT-011`
- private/local install و registry ساده برای orgها

### Phase 4 — Ecosystem

- `MKT-012..MKT-016`
- public marketplace و publisher economy
- وابستگی‌های roadmap: `T-105..T-132`

### Phase 5 — Enterprise

- hardening، signing، kill switch، SLA-ready distribution
- وابستگی‌های roadmap: `T-133..T-160`
