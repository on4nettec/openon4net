# جلسه ۹ — ۲۰۲۶-۰۷-۱۹

**حضور:** کاربر (owner)، Claude
**مدت:** —
**موضوع:** ارزیابی قدرت Workflow Engine فعلی نسبت به n8n + مسیر رسیدن به visual builder، ساخت node توسط کاربر با کمک Agent، و صدا زدن یک workflow توسط workflow دیگر

---

## ۱. دستور کار (Agenda)

۱. سیستم فعلی واقعاً multi-agent هست؟ (پرسش پیشین، پاسخ داده شد — پس‌زمینه)
۲. Workflowها روی کدام Engine اجرا می‌شوند و آیا قدرت n8n را دارند؟
۳. اگر بخواهیم loop/retry/integration را کامل کنیم، ممکن است؟
۴. آیا می‌شود مثل n8n یک لایه‌ی visual (node-based) ساخت که کاربر خودش استفاده کند؟
۵. آیا می‌شود کاری کرد که کاربر با کمک یک Agent، خودش node/workflow بسازد؟
۶. آیا workflowها می‌توانند همدیگر را صدا بزنند (sub-workflow)؟

## ۲. بررسی وضعیت فعلی (قبل از بحث، از روی کد واقعی — نه فرض)

Claude قبل از نظر دادن، این فایل‌ها را مستقیماً خواند:

- `packages/shared/src/schemas/workflow.ts` — schema واقعی. کامنت بالای خودش صریح می‌گوید: _"v1 scope... a simple DAG engine"_ و آگاهانه لیست می‌کند چه چیزی نسبت به سند معماری کامل (`02_ARCHITECTURE/05-workflow-engine.md`) کم دارد.
- `gateway/src/services/workflow-executor.ts` — `WorkflowExecutor`، یک DAG executor سفارشی و داخلی، **نه** ساخته‌شده روی هیچ engine بیرونی (نه Temporal، نه n8n، نه هیچ کتابخانه‌ی workflow).
- `gateway/src/services/tool-dispatcher.ts` — نوع step `tool` فقط بین ۲ گزینه‌ی hardcoded انتخاب می‌کند: `telegram-send`, `webhook-send`.
- `web/app/workflows/page.tsx` — ویرایشگر فعلی یک `<textarea>` است که JSON خام را با `JSON.parse()` می‌خواند؛ **هیچ canvas/drag-and-drop‌ای وجود ندارد.**

### نتیجه‌ی بررسی (خلاصه‌ی جدولی)

| قابلیت                                   | وضعیت فعلی                                                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| نوع step                                 | ۶ تا: `agent`, `tool`, `human`, `parallel`, `condition`, `plugin`                              |
| Trigger                                  | ۳ تا: `manual`, `scheduled` (interval ساده، بدون cron), `webhook`                              |
| Condition                                | فقط مقایسه‌ی ساختاریافته (`field`/`op`/`value`) — بدون expression language (عمداً، برای امنیت) |
| Parallel                                 | کم‌عمق — فقط sub-step های `agent`/`tool`، بدون تودرتو                                          |
| `loop`                                   | **ندارد**                                                                                      |
| Retry/backoff per-step                   | **ندارد** — فقط یک try/catch سطح بالا در executor                                              |
| Sub-workflow (workflow صدا زدن workflow) | **ندارد**                                                                                      |
| Visual Builder                           | **ندارد** — textarea + JSON خام                                                                |
| کتابخانه‌ی integration                   | ۲ tool hardcoded + مسیر `plugin` (فقط thin HTTP-provider، نیاز به backend HTTP از طرف سازنده)  |

## ۳. بحث و تصمیمات

### موضوع ۱: آیا این یک سیستم multi-agent است؟

- **بحث:** کاربر پرسید سیستم در حال طراحی multi-agent هست یا نه.
- **بررسی کد:** `agent-message-service.ts` (پیام‌رسانی مستقیم async بین Agentها، RT-047)، commit جداگانه‌ی _"automatic agent-to-agent skill delegation"_ (RT-086)، `workflow-executor.ts`'s نوع step `agent` (هر step می‌تواند Agent متفاوتی را صدا بزند)، `reports_to` + `assertNoReportsToCycle` (سلسله‌مراتب، RT-045)، role catalog ۱۲‌تایی (RT-044).
- **نتیجه:** بله، تأیید شد — سیستم عمداً multi-agent طراحی شده (نه یک Agent تنها که فقط با کاربر چت می‌کند).

### موضوع ۲: قدرت Workflow Engine نسبت به n8n

- **بحث:** بعد از بررسی کد بالا، مقایسه‌ی صادقانه ارائه شد: برای هدف محدود فعلی (توسعه‌دهنده از قبل یک زنجیره‌ی Agent→Tool→Approval طراحی می‌کند) کافی است، ولی برای ادعای «قدرت n8n» یا اجرای بی‌نظارت مقیاس‌پذیر، خیر.
- **تصمیم:** ۴ شکاف اولویت‌دار شناسایی و برای تسک‌بندی تأیید شد (پایین‌تر، Action Items):
  1. نبود `loop` — مانع واقعی برای usecaseهای تکرارشونده («به هر لید پیام بده»).
  2. نبود retry — چون حالا `scheduled`/`webhook` trigger داریم (اجرای بی‌نظارت)، fail بی‌صدا ریسک واقعی است.
  3. نبود sub-workflow.
  4. نبود visual builder — مخاطب فعلی فقط توسعه‌دهنده است، نه کاربر کسب‌وکاری که «Digital Employee» برایش تبلیغ می‌شود.

### موضوع ۳: مسیر visual builder — canvas مثل n8n در مقابل ساخت با کمک Agent

- **بحث:** کاربر دو مسیر را مطرح کرد: (الف) node های آماده مثل n8n که کاربر با drag-and-drop استفاده کند، (ب) کاربر خودش با کمک یک Agent، node/workflow بنویسد.
- **تحلیل Claude:**
  - مسیر (الف) از نظر معماری قابل نگاشت است — هر step type فعلی مفهوماً معادل یک «نوع node»ی n8n است — ولی از نظر حجم کار، یک زیرسیستم frontend کاملاً جدا و چند-هفته‌ای است (canvas، پالت node، فرم تنظیمات هر node، sync دوطرفه با JSON).
  - مسیر (ب) از زیرساخت موجود (Agent/LLM) مستقیماً استفاده می‌کند: کاربر با زبان طبیعی به یک Agent می‌گوید چه می‌خواهد، Agent همان JSON معتبر `WorkflowDefinition` را (روی step typeهای موجود) تولید می‌کند و با همان Zod schema اعتبارسنجی می‌شود — بدون نیاز به ساختن canvas.
- **تصمیم:** مسیر (ب) اول ساخته شود (سریع‌تر، از زیرساخت موجود استفاده می‌کند)؛ مسیر (الف) به‌عنوان فاز بزرگ‌تر و جدا، بعد از تکمیل loop/retry/sub-workflow (تا node-palette نهایی باشد).
- **محدودیت مستندشده:** مسیر (ب) فقط روی step typeهای _موجود_ کار می‌کند. اگر کاربر منطق واقعاً جدید/کد دلخواه بخواهد، هنوز به مسیر `plugin` (نیاز به HTTP backend) یا WASM sandbox (عمداً هنوز ساخته نشده، `02_ARCHITECTURE/09-plugin-sandbox.md` Level 2) برمی‌گردد — این جلسه چیزی در این مورد تغییر نداد.

### موضوع ۴: Sub-workflow

- **بحث:** آیا یک workflow می‌تواند workflow دیگری را صدا بزند (معادل n8n's Execute Workflow node)؟
- **تصمیم:** یک step type جدید (`subworkflow`) اضافه شود که یک `workflowId` را ارجاع می‌دهد؛ executor آن را recursive صدا می‌زند؛ باید جلوی چرخه (workflow A → B → A) گرفته شود — با همان الگوی `assertNoReportsToCycle` که برای سلسله‌مراتب Agent از قبل ساخته شده.

## ۴. Action Items

| #   | Task                                                                          | مسئول  | Deadline   | Status                                                                                                                    |
| --- | ----------------------------------------------------------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| ۱   | RT-103 — نوع step جدید `loop`                                                 | Claude | —          | ⏳                                                                                                                        |
| ۲   | RT-104 — retry policy روی هر step                                             | Claude | —          | ⏳                                                                                                                        |
| ۳   | RT-105 — نوع step جدید `subworkflow` + جلوگیری از چرخه                        | Claude | —          | ⏳                                                                                                                        |
| ۴   | RT-106 — ساخت workflow با کمک Agent از زبان طبیعی (چت→JSON معتبر)             | Claude | —          | ⏳                                                                                                                        |
| ۵   | RT-107 — Visual Builder (canvas مثل n8n) — فاز جدا و بزرگ‌تر، بعد از ۱۰۳..۱۰۵ | Claude | —          | ⏳                                                                                                                        |
| ۶   | ثبت تسک‌های انگلیسی در GitHub Project #4 (`on4nettec`) با `gh` CLI            | Claude | ۲۰۲۶-۰۷-۱۹ | ✅ issue #103..#107 در `on4nettec/openon4net-runtime` ساخته و به Project #4 اضافه شدن (تعداد آیتم پروژه ۱۲۸→۱۳۳ تأیید شد) |

جزئیات کامل هر تسک در `docs/spect/TODO-openon4net-runtime.md` بخش K.

## ۵. نکات آزاد

- کتابخانه‌ی integration (فراتر از ۲ tool فعلی) عمداً در این جلسه به‌عنوان تسک جدا مطرح نشد — چون مسیرش از قبل مشخصه (اکوسیستم Marketplace/Plugin، نه خودِ Workflow Engine) و نیازمند تصمیم جدا درباره‌ی اولویت integrationهاست.
- **اصلاحیه:** اولین چک (`command not found` در git-bash/PowerShell) گمراه‌کننده بود — `gh` واقعاً نصب بود (`C:\Program Files\GitHub CLI\gh.exe`) و از قبل هم login، فقط توی PATH اون دو تا شل نبود. با مسیر کامل صداش زدیم و مشکلی نبود. issue های #103..#107 واقعاً ساخته و به Project #4 اضافه شدن.

## ۶. جلسه بعدی

- **تاریخ:** نامشخص
- **موضوع:** —
