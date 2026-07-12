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
| MKT-007 | لایه auth ساده (API key/bearer ثابت) — مثل `MEM-005` در memory، چون این سرویس هم قراره از بیرون (Runtime/admin) صدا زده بشه |          ❌ خیر          |  ❌   |
| MKT-008 | trace_id passthrough + structured logging مطابق `08-observability-otel.md`                                                  |          ❌ خیر          |  ❌   |
| MKT-009 | checksum (sha256) verification برای artifact روی install — فقط local file storage، بدون CDN واقعی                           |          ❌ خیر          |  ❌   |
| MKT-010 | Permission diff on update (طبق §6.2 سند معماری): اگه نسخه جدید permission بیشتر بخواد، install باید re-approve بشه وگرنه رد |          ❌ خیر          |  ❌   |
| MKT-011 | مستندسازی `API.md` (curl + نمونه response برای هر route) — مثل الگوی memory                                                 |          ❌ خیر          |  ❌   |

## بخش D — Skills به‌عنوان یک Marketplace entity (2026-07-12، فاز ۲ تکمیلی Runtime)

> جزئیات تصمیم در `06_MEETINGS/02-skills-plugins-marketplace-model.md` و
> `02_ARCHITECTURE/12-marketplace-service.md` §۱۰.

| #       | تسک                                                                                                                                                                       | نیاز به اجازه فایل ریشه؟ | وضعیت |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------: | :---: |
| MKT-017 | migration `marketplace_skills` + `skill_installs` (موازی با plugins، بدون versions/checksum/signature/review pipeline)                                                    |          ❌ خیر          |  ✅   |
| MKT-018 | `publisher-skill-service.ts` (`submitSkill`, upsert بر اساس slug) + `marketplace-skill-service.ts` (`listMarketplaceSkills`, `installMarketplaceSkill`) + routeهای مربوطه |          ❌ خیر          |  ✅   |
| MKT-019 | `PATCH /marketplace/installs/:id/config` — تکمیل یک gap مستندشده‌ی قبلی (`plugin_installs.config` در API doc بود ولی نه در جدول/کد)                                       |          ❌ خیر          |  ✅   |

## بخش C — ⚠️ صراحتاً خارج از MVP guardrail (نیاز به تأیید آگاهانه)

> طبق `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` §3.3: «Marketplace public
>
> - review pipeline + signing سخت‌گیرانه + payouts» بعد از ۲-۳ مشتری واقعی.

| #       | تسک                                                                                              | یادداشت                                                                             |
| ------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| MKT-012 | Public marketplace واقعی (چند publisher/سازمان خارجی، نه فقط لوکال)                              | جایگزین دامنه‌ی v0.1 (module داخل API) با v0.2+ سرویس مستقل طبق §9 سند معماری       |
| MKT-013 | Review pipeline خودکار (SAST/dependency scan) + manual review workflow واقعی                     | فعلاً حتی approve/reject ساده هم بخش A/B پوشش نمی‌ده، این یعنی pipeline قضاوت واقعی |
| MKT-014 | Signing سخت‌گیرانه (PKI/cosign به‌جای صرفاً checksum) + verified publisher program               | امنیتی، پیش‌نیاز توزیع عمومی artifact                                               |
| MKT-015 | Revenue share ledger کامل + payout queue واقعی (پول واقعی به publisher)                          | طبق guardrail §4: «payout پولی به publisherها فعلاً ممنوع — credits داخلی کافیه»    |
| MKT-016 | Kill switch platform-level واقعی (غیرفعال‌سازی global در حادثه) + CDN distribution برای artifact | وابسته به MKT-012 (بدون public marketplace، global kill switch اولویت پایینه)       |

---

## نحوه استفاده

بهم بگو کدوم شماره‌(ها) رو انجام بدم (مثلاً «MKT-001 و MKT-002 رو برو انجام بده»).
اگه چیزی این‌جا نیست ولی لازمشه، بگو تا اضافه‌اش کنم.

---

## فازبندی سریع

### MVP-lite / Private marketplace

- `MKT-001..MKT-011`
- `MKT-017..MKT-019` — Skills entity + Plugin config PATCH، ✅ انجام شد ۲۰۲۶-۰۷-۱۲

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
