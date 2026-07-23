# جلسه ۱۳ — ۲۰۲۶-۰۷-۲۰

**حضور:** کاربر (owner)، Claude
**مدت:** —
**موضوع:** تقویت enforcement استاندارد manifest پلاگین — از یک قرارداد مستندشده‌ولی-اجرانشده به یک schema واقعاً اعتبارسنجی‌شده در CLI + Runtime + Marketplace

---

## ۱. دستور کار (Agenda)

کاربر پرسید آیا استاندارد و CLI برای ساخت پلاگین داریم. Claude قبل از جواب دادن، کد واقعی رو بررسی کرد (نه فرض) و گزارش داد: استاندارد مستند هست، CLI واقعیه، ولی enforcement سمت سرور تقریباً صفره. کاربر خواست این موضوع مستند و تسک‌بندی بشه (بدون شروع ساخت).

## ۲. وضعیت فعلی (بررسی شده قبل از بحث، نه فرض)

- **استاندارد مستنده:** `docs/spect/02_ARCHITECTURE/03-skill-engine.md` بخش ۵ — ساختار پلاگین (`manifest.json` + `main.ts` + `actions/` + `prompts/` + `assets/` + `README.md`) و فیلدهای manifest (`id`, `name`, `version`, `description`, `author`, `license`, `permissions[]`, `models[]`, `hooks[]`, `configSchema[]`) رو مشخص کرده.
- **CLI واقعیه:** `pnpm create o2n-plugin <name>` (`packages/create-o2n-plugin`) دقیقاً همین ساختار رو اسکفولد می‌کنه.
- **SDK هست ولی مصرف‌کننده نداره:** `packages/plugin-sdk` (`@o2n/plugin-sdk`) تایپ‌ها/helperهای `createPlugin()`/`.defineTool()`/`.defineAction()` رو داره، ولی خودِ کامنت بالای فایلش می‌گه «فقط type-level؛ Runtime هنوز یک پلاگین ساخته‌شده رو واقعاً لود/اجرا نمی‌کنه». هیچ package.json ای (نه Runtime gateway، نه web) بهش وابسته نیست — کاملاً مصرف‌نشده.
- **Enforcement سمت سرور تقریباً صفره** — هر سه مسیری که manifest می‌گیرن، خودِ manifest رو `z.record(z.unknown())` (یک blob بدون schema) قبول می‌کنن:
  - Runtime، نصب لوکال (`routes/local-plugins.ts`) — فقط `name` الزامیه.
  - Runtime، آپلود zip — فقط چک می‌کنه `manifest.json` توی zip باشه، JSON معتبر باشه، و `name` غیرخالی داشته باشه.
  - Marketplace، مسیر submit (`routes/publisher-plugins.ts`) — همون الگو.
- **یافته‌ی کلیدی برای تصمیم امروز:** `apps/openon4net-marketplace/service` اصلاً توی root `pnpm-workspace.yaml` ثبت نشده (فقط runtime/gateway، runtime/web، platform/gateway، platform/web، memory/service، و `packages/*` ثبت شدن). یعنی Marketplace الان فنی نمی‌تونه یک پکیج `@o2n/*` رو `workspace:*` import کنه — بدون تغییر این فایل root.

## ۳. بحث و تصمیمات

### موضوع ۱: کجا schema واحد نگه‌داری بشه

- **بحث:** Claude دو گزینه مطرح کرد — پکیج مشترک (`@o2n/plugin-sdk`، نیاز به ثبت Marketplace توی root workspace) در مقابل duplicate کردن همون schema توی هر دو ریپو (بدون تغییر root، مثل الگوی موجود `lib/crypto.ts`، با ریسک drift).
- **تصمیم کاربر:** **پکیج مشترک.** `apps/openon4net-marketplace/service` به root `pnpm-workspace.yaml` اضافه می‌شه تا بتونه `@o2n/plugin-sdk` رو import کنه — طبق قرارداد این پروژه (نیاز به اجازه‌ی صریح جدا برای تغییر فایل root)، همین تصمیم همون اجازه‌ست.

### موضوع ۲: سخت‌گیری فیلدهای شبیه-enum (`permissions[]`, `hooks[]`)

- **بحث:** لیست بسته (فقط مقادیر شناخته‌شده قبول می‌شن) در مقابل لیست باز (هر string، فقط شکل آرایه چک می‌شه).
- **تصمیم کاربر:** **لیست بسته.** مقادیر نامعتبر رد می‌شن؛ اضافه‌کردن یک permission/hook جدید یک تغییر عمدی کد+مستندات می‌خواد، نه چیزی که به‌صورت ضمنی از یک manifest دلخواه وارد بشه.

### موضوع ۳: نکات تکمیلی (تصمیم Claude، ریسک پایین/افزودنی، نیازی به سوال نداشت)

- **`schemaVersion`** یک فیلد جدید به manifest اضافه می‌شه (مثلاً `1`) — تا خودِ استاندارد بعداً بتونه تغییر کنه بدون اینکه پلاگین‌های قدیمی retroactively نامعتبر بشن.
- **`version`** (نسخه‌ی خودِ پلاگین) باید semver واقعی باشه (`x.y.z`)، نه یک متن آزاد.
- **نقطه‌ی اعتبارسنجی: هر سه جا** (defense in depth، نه فقط یکی) — CLI (پیش از publish)، Runtime (لحظه‌ی نصب لوکال/آپلود zip)، Marketplace (لحظه‌ی submit). هر سه از همون یک schema استفاده می‌کنن تا قرارداد در طول مسیر عوض نشه.

## ۴. Action Items

| #   | Task                                                                                                                                                                                 | مسئول  | Status                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ----------------------------- |
| ۱   | RT-119 — تعریف `PluginManifestSchema` (Zod) در `@o2n/plugin-sdk` — تمام فیلدهای بخش ۵ سند معماری + `schemaVersion` + semver روی `version` + enum بسته برای `permissions[]`/`hooks[]` | Claude | ⏳                            |
| ۲   | RT-118 — ثبت `apps/openon4net-marketplace/service` در root `pnpm-workspace.yaml` (تغییر root، طبق تصمیم موضوع ۱ مجاز شد)                                                             | Claude | ⏳                            |
| ۳   | RT-120 — اعمال `PluginManifestSchema` روی مسیرهای نصب Runtime (`local-plugins.ts`: نصب لوکال + آپلود zip) — رد با خطای تمیز به‌جای پذیرش blob                                        | Claude | ⏳ (بلاک روی RT-119)          |
| ۴   | RT-121 — گسترش CLI (`create-o2n-plugin`) با یک دستور `validate` که همون schema رو روی یک پوشه‌ی پلاگین اجرا می‌کنه، پیش از publish                                                   | Claude | ⏳ (بلاک روی RT-119)          |
| ۵   | MKT-030 — اعمال همون `PluginManifestSchema` (از طریق `@o2n/plugin-sdk`) روی مسیر submit Marketplace (`publisher-plugins.ts`)                                                         | Claude | ⏳ (بلاک روی RT-118 + RT-119) |

جزئیات کامل هر تسک در `docs/spect/TODO-openon4net-runtime.md` بخش O و `docs/spect/TODO-openon4net-marketplace.md` بخش I.

## ۵. نکات آزاد

- این کار enforcement مسیر «پلاگین‌های agent-generated» (سؤال باز جلسه ۴، هنوز حل‌نشده) رو حل نمی‌کنه — اون یک لایه‌ی جدا (چطور کد جدید وارد Runtime بشه) روی این لایه (شکل manifest چقدر معتبره) سواره.
- Sandbox واقعی (WASM) طبق جلسه ۴ عمداً به تعویق افتاده و توی این batch نیست — این جلسه فقط manifest رو محکم می‌کنه، نه اجرای امن کد پلاگین رو.
- طبق دستور صریح کاربر، **هیچ‌کدوم از این تسک‌ها امروز پیاده‌سازی نشدن** — فقط ثبت/تصمیم‌گیری شد.

## ۶. جلسه بعدی

- **تاریخ:** نامشخص
- **موضوع:** —
