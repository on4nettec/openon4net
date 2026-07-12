# جلسه ۲ — ۲۰۲۶-۰۷-۱۲

**حضور:** کاربر (owner)، Claude
**مدت:** —
**موضوع:** مدل کسب‌وکار Skills/Plugins در Marketplace (رایگان در مقابل فروشی) + نیاز به CLI/استاندارد ساخت Plugin

---

## ۱. دستور کار (Agenda)

۱. آیا کاربران می‌توانند از Marketplace، Skill بخرند/نصب کنند؟
۲. آیا Skillهای عمومی رایگان در Marketplace وجود دارند؟
۳. مدل رایگان/فروشی Pluginها چگونه است؟
۴. آیا Pluginها صفحه تنظیمات دارند (مثلاً برای اتصال‌دهنده‌های کانال)؟
۵. آیا برای ساخت Plugin، CLI/استاندارد مستندی وجود دارد؟

## ۲. بحث و تصمیمات

### موضوع ۱: Skills و Plugins دو مفهوم جدا هستند (قبلاً مستند بوده)

- **بحث:** بررسی شد که آیا Skill و Plugin یک چیز هستند یا نه.
- **تصمیم:** قبلاً هم در `docs/spect/00_VISION/06-glossary.md` و
  `docs/spect/02_ARCHITECTURE/03-skill-engine.md` این دو مفهوم جدا تعریف
  شده بودن: **Skill** = یک توالی کارِ خودکارشده که Agent یاد گرفته (دستی یا
  auto-detected)؛ **Plugin** = یک اپ/افزونه‌ی third-party (مثل پلاگین
  وردپرس). هر دو از یک ویترین (Marketplace) توزیع می‌شوند ولی جدول DB و
  lifecycle جدا دارند (`skills`/`agent_skill_grants` در مقابل
  `plugins`/`plugin_installs`). این جلسه فقط این تفکیک موجود را تأیید کرد،
  چیز جدیدی نساخت.

### موضوع ۲: مدل رایگان/فروشی — لینک جدید و قبلاً مستند نشده

- **بحث:** کاربر توضیح داد Marketplace باید دو دسته آیتم داشته باشد:
  - **Skill/Plugin عمومی رایگان**: هر سازمانی که Runtime خودش را **activate**
    کرده (بدون نیاز به خرید جداگانه) بتواند نصب/استفاده کند.
  - **Skill/Plugin فروشی**: مثل پلاگین‌های فروشی، نیاز به خرید دارد.
- **تصمیم:** این لینک («activation = دسترسی به آیتم‌های رایگان Marketplace»)
  قبلاً هیچ‌جا مستند نشده بود — بررسی مستندات نشان داد `plugins.price_cents`
  (۰ = رایگان) از قبل هست، و activation-key system کامل توی Control Plane
  ساخته و تست شده (`POST /admin/activation-keys`, `POST /activation/check-in`)،
  ولی **Runtime هنوز به این activation client متصل نیست**
  (`T-CP-007`، عمداً معلق مونده بود چون نیاز به اجازه‌ی جدا برای دست‌زدن به
  Runtime داشت — طبق `docs/spect/DONE.md` و
  `docs/sprint-plan/04_control-plane-backlog.md`). با این جلسه، این اجازه
  داده شد: پیاده‌سازی «رایگان برای activated runtime» به‌طور ذاتی یعنی
  T-CP-007 (Runtime-side activation client) هم باید ساخته بشه.
- **ADR:** نیاز به یک تصمیم معماری جدید («Marketplace access model:
  activation-gated free tier + purchase-gated paid tier») — باید در
  `docs/spect/05_DECISIONS/` ثبت بشه وقتی پیاده‌سازی شروع شد.

### موضوع ۳: صفحه تنظیمات Plugin (مثال: اتصال‌دهنده‌های کانال)

- **بحث:** بعضی Pluginها (مثلاً connector های کانال/چنل ارتباطی) نیاز به
  تنظیمات دارن — مثل API key.
- **تصمیم:** سطح داده/API قبلاً مستند بود (`plugin_installs.config JSONB`،
  و `POST /marketplace/plugins/{id}/install` بدنه‌اش `config` می‌گیره) ولی
  هیچ‌جا UI اون مستند نشده بود. این جلسه تأیید کرد: هر Plugin باید بتونه در
  manifest خودش فیلدهای تنظیمات (مثل `api_key`) رو declare کنه، و یک صفحه‌ی
  تنظیمات عمومی (schema-driven form، نه هاردکد به‌ازای هر پلاگین) این
  فیلدها رو رندر کنه.

### موضوع ۴: نیاز به CLI و استاندارد ساخت Plugin

- **بحث:** ساخت Plugin باید یک مسیر استاندارد و ابزار CLI داشته باشه، نه
  فقط یک spec متنی.
- **تصمیم:** `docs/spect/02_ARCHITECTURE/03-skill-engine.md` بخش Plugin SDK
  از قبل یک API مفهومی (`@on4net/sdk`, `createPlugin`/`defineTool`/`defineAction`)
  و ساختار پوشه (`manifest.json`, `main.ts`, `actions/`, ...) مستند کرده
  بود، ولی هیچ ابزار CLI برای scaffold کردن یک پروژه‌ی Plugin جدید وجود
  نداشت. این جلسه تأیید کرد این CLI باید ساخته بشه (مثلاً
  `create-o2n-plugin` یا معادلش)، به‌عنوان بخشی از پیاده‌سازی فاز ۲.

## ۳. Action Items

> **بروزرسانی ۲۰۲۶-۰۷-۱۲ (بعد از پیاده‌سازی):** وقتی زمان implementation
> رسید، حجم واقعی کل این کار (Skill Engine + Auto-Detection + پنج آیتم زیر)
> حدود ۱۳ فاز روی ۳ ریپو (Runtime + Control Plane + Marketplace) + یک
> پکیج جدید تخمین زده شد. کاربر صریحاً scope رو به **فقط هسته‌ی Runtime:
> Skill Engine + Auto-Skill Detection** محدود کرد (RT-032, RT-033 در
> `docs/spect/DONE.md`). آیتم‌های ۱-۵ زیر همه به یک session بعدی موکول شدن.

| #   | Task                                                                                                             | مسئول  | Deadline     | Status      |
| --- | ---------------------------------------------------------------------------------------------------------------- | ------ | ------------ | ----------- |
| ۱   | فرمول‌بندی دقیق «Marketplace access model» (activation-gated free + purchase-gated paid) و ثبت به‌عنوان ADR      | Claude | session بعدی | ⏳ موکول شد |
| ۲   | افزودن Skills به‌عنوان یک entity قابل‌فروش/رایگان در `12-marketplace-service.md` (الان فقط Plugin پوشش داده شده) | Claude | session بعدی | ⏳ موکول شد |
| ۳   | مستندسازی UI صفحه تنظیمات Plugin (schema-driven، از manifest) در جای مناسب (`04_API` یا سند UI جدید)             | Claude | session بعدی | ⏳ موکول شد |
| ۴   | طراحی و ساخت CLI/استاندارد Plugin (`create-o2n-plugin` یا معادل)                                                 | Claude | session بعدی | ⏳ موکول شد |
| ۵   | T-CP-007 (Runtime-side activation client) — پیش‌نیاز مدل رایگان — با اجازه‌ی این جلسه شروع می‌شود                | Claude | session بعدی | ⏳ موکول شد |

## ۴. نکات آزاد

- این جلسه فقط **تصمیمات** را ثبت می‌کند؛ پیاده‌سازی واقعی (کد) در ادامه
  همین گفتگو، با یک plan جداگانه (`/plan`) طراحی و اجرا می‌شود — طبق همون
  الگویی که برای Memory (Plane 3) استفاده شد.
- هیچ‌کدوم از تصمیمات این جلسه به‌معنای ساخت واقعی WASM sandbox (Level 2،
  طبق `02_ARCHITECTURE/09-plugin-sandbox.md`) نیست — برای فاز ۲ همون سطح
  MVP سند (Level 0، in-process با permission/budget/audit check) کافیه؛
  WASM sandboxing واقعی یک آیتم جدا و بزرگ‌تره که به‌صراحت به فاز بعد موکول
  می‌شه، مگر کاربر صراحتاً بخواد الان انجام بشه.
- پرداخت واقعی (payment gateway) طبق roadmap جزو فاز ۴ («Ecosystem») است،
  نه فاز ۲. برای فاز ۲، «فروشی» یعنی رکورد مالکیت/خرید (entitlement) با
  `price_cents > 0`، نه اتصال واقعی به یک درگاه پرداخت.

## ۵. جلسه بعدی

- **تاریخ:** —
- **موضوع:** بازبینی بعد از پیاده‌سازی فاز ۲ (Skills) — آیا مدل access
  واقعاً همون‌طوری که اینجا تصمیم گرفته شد کار می‌کنه؟
