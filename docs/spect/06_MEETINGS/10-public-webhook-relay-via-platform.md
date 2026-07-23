# جلسه ۱۰ — ۲۰۲۶-۰۷-۲۰

**حضور:** کاربر (owner)، Claude
**مدت:** —
**موضوع:** یک مشکل رایج در سیستم‌های مشابه — کاربرانی که Runtime رو لوکال نصب می‌کنن نمی‌تونن از webhook (که localhost رو قبول نمی‌کنه) استفاده کنن؛ راه‌حل: relay وب‌هوک عمومی از طریق Platform

---

## ۱. دستور کار (Agenda)

۱. مشکل: `POST /v1/webhooks/:token` (RT-065) مستقیم روی Runtime گیت‌وی‌ه — اگه Runtime لوکال/پشت NAT باشه، سرویس‌های بیرونی (Telegram, Stripe, GitHub, …) نمی‌تونن بهش برسن.
۲. راه‌حل پیشنهادی کاربر: کاربر توی **Platform** یک webhook URL عمومی بسازه (با verify token اختیاری)، Platform از طریق WebSocket به Runtime منتقلش کنه.
۳. طراحی relay: Platform یک registry جدا از خودش داشته باشه یا فقط از همون توکن Runtime استفاده کنه؟
۴. رفتار وقتی Runtime آفلاینه؟
۵. مسیر مقصد event: فقط agent/workflow، یا tool هم مستقیم؟

## ۲. بررسی وضعیت فعلی (قبل از بحث، از روی کد واقعی)

Claude قبل از طراحی این فایل‌ها رو خوند:

- `gateway/src/routes/webhooks.ts` (Runtime) — `POST /v1/webhooks/:token` عمداً **PUBLIC** است (بدون auth، خودِ token اعتبارسنجیه، مثل magic-link). ولی چون مستقیم روی Runtime گیت‌وی‌ه، باید publicly reachable باشه — دقیقاً منشأ مشکل.
- `migrations/0022_webhooks_and_triggers.sql` — جدول `webhook_endpoints`: `token_hash`, `target_type` (فعلاً فقط `workflow` | `agent`)، `target_id`.
- `gateway/src/services/activation-scheduler.ts` (Runtime) — تنها ارتباط فعلی Runtime→Platform یک HTTP poll ساعتی‌ست (`checkIn`)، **نه یک اتصال دائمی**.
- `gateway/src/routes/proxy.ts` + `proxy-token-service.ts` (Platform, CP-032/034) — الگوی موجود میانجی‌گری Platform برای Runtime: یک HTTP request-mediation با short-lived security token (برای Marketplace calls). این یک تونل/relay نیست — Runtime هربار یک درخواست HTTP جدا می‌فرسته، نه یک کانال باز.
- **نتیجه:** هیچ اتصال دائمی/تونلی بین Runtime و Platform وجود نداره؛ باید از صفر ساخته بشه.
- `gateway/src/services/tool-dispatcher.ts`'s `executeTool(step: SkillStep, env: Env)` — قابل صدا زدن مستقیم با یک step ساختگی، بدون نیاز به یک workflow کامل دورش. یعنی «صدا زدن مستقیم یک tool از webhook» فنی feasible‌ه، نیاز به بازنویسی dispatcher نیست.

## ۳. بحث و تصمیمات

### موضوع ۱: طراحی Relay — نازک (thin) در مقابل registry جدا

- **بحث:** آیا Platform باید مفهوم `target_type`/`target_id` خودش رو داشته باشه (دوباره‌سازی چیزی که Runtime از قبل داره)، یا فقط یک relay نازک باشه که همون token موجود Runtime رو forward کنه؟
- **تصمیم کاربر:** **Relay نازک** — Platform منطق routing (agent/workflow/tool) رو دوباره نمی‌سازه؛ این منطق همونی می‌مونه که از قبل توی تنظیمات Runtime تعریف شده. Platform فقط یک **اسم** (label) به هر webhook relay اختصاص می‌ده (برای UI خودش) و payload رو به همون Runtime instance متصل، با همون token اصلی Runtime، forward می‌کنه.
- **پیامد طراحی:** Platform هنوز به یک جدول کوچیک نیاز داره (اجتناب‌ناپذیره، نه دوباره‌سازی کامل): `org_id` (از activation) + `name` (لیبل کاربر) + `runtime_webhook_token` (توکنی که باید موقع relay به Runtime پاس داده بشه) + `public_relay_token` (توکن عمومی _جدای_ توکن Runtime، چون توکن Runtime نباید مستقیم توی یک URL عمومی expose بشه). این با «نازک» بودن در تناقض نیست — فقط یعنی Platform هیچ‌وقت خودش تصمیم نمی‌گیره درخواست باید بره سراغ کدوم agent/workflow/tool؛ فقط می‌دونه باید بره سمت کدوم token روی کدوم اتصال Runtime.

### موضوع ۲: مسیر مقصد event — اضافه شدن `tool` به‌عنوان target مستقیم

- **بحث:** کاربر گفت event وقتی webhook فایر می‌شه باید بتونه یک agent، یک workflow، **یا یک tool** رو مستقیم صدا بزنه.
- **بررسی:** `webhook_endpoints.target_type` فعلاً فقط `workflow` | `agent` قبول می‌کنه (`migrations/0022`). صدا زدن مستقیم tool (بدون پوشوندنش توی یک workflow تک-قدمی یا agent) الان امکان‌پذیر نیست.
- **تصمیم:** `target_type` باید یک مقدار سوم بگیره: `tool`. این **کاملاً سمت Runtime**ه (نه Platform) — بخشی از همون relay نیست، یک gap مستقل که همین بحث لو داد.

### موضوع ۳: رفتار وقتی Runtime آفلاینه (WebSocket قطع)

- **بحث:** Claude دو گزینه مطرح کرد (fail-fast فوری در مقابل صف‌کردن و redeliver). پاسخ کاربر بیشتر روی _مسیر routing_ (موضوع ۱/۲ بالا) تمرکز داشت تا خودِ رفتار failure.
- **وضعیت:** **هنوز صریحاً تصمیم‌گیری نشده.** Claude پیش‌فرض `fail-fast (503)` رو به‌عنوان نسخه‌ی v1 پیشنهاد می‌کنه — هم‌راستا با فلسفه‌ی موجود پروژه («عملیات هسته‌ی Runtime هیچ‌وقت نباید به در دسترس بودن Platform وابسته باشه»، همون چیزی که برای activation check-in هم صادقه) و ساده‌تر برای v1 (بدون state/صف جدید روی Platform). اکثر providerهای واقعی webhook (Stripe, Telegram, GitHub) خودشون retry دارن، پس fail-fast فوری معمولاً بی‌ضرره.
- **این تصمیم باید قبل از شروع RT/CP مربوطه صریحاً تأیید یا رد بشه** — پایین در Action Items با وضعیت `❓` علامت‌گذاری شده، نه `⏳`.

## ۴. Action Items

| #   | Task                                                                                                                                                                                                     | مسئول  | Deadline | Status                                                                                                                                                                                                                                                                                                                             |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ۱   | CP-045 — Platform: مدیریت webhook relay (ساخت/حذف، اسم، تولید `public_relay_token`) + صفحه‌ی وب                                                                                                          | Claude | —        | ⏳                                                                                                                                                                                                                                                                                                                                 |
| ۲   | CP-046 — Platform: WebSocket server که Runtime بهش وصل می‌شه (احراز هویت با activation key)                                                                                                              | Claude | —        | ⏳                                                                                                                                                                                                                                                                                                                                 |
| ۳   | CP-047 — Platform: مسیر عمومی `POST /v1/webhook-relay/:publicToken` که payload رو از طریق WebSocket به Runtime متصل forward می‌کنه                                                                       | Claude | —        | ⏳ (بلاک روی تصمیم موضوع ۳)                                                                                                                                                                                                                                                                                                        |
| ۴   | RT-108 — Runtime: WebSocket client دائمی به Platform (reconnect خودکار)، دریافت payload relay‌شده و صدا زدن همون منطق داخلی `POST /v1/webhooks/:token` (بدون round-trip واقعی HTTP، صدا زدن مستقیم تابع) | Claude | —        | ⏳ (بلاک روی CP-046)                                                                                                                                                                                                                                                                                                               |
| ۵   | RT-109 — Runtime: اضافه شدن `target_type: 'tool'` به `webhook_endpoints` + مسیر اجرای مستقیم از `tool-dispatcher.ts`'s `executeTool`                                                                     | Claude | —        | ⏳ (مستقل، بلاک روی هیچی نیست)                                                                                                                                                                                                                                                                                                     |
| ۶   | تصمیم صریح کاربر: رفتار offline (fail-fast در مقابل صف/redeliver)                                                                                                                                        | کاربر  | —        | ✅ **تصمیم‌گیری شد (۲۰۲۶-۰۷-۲۰، توسط Claude، با تفویض صریح کاربر — «الان نمی‌تونم فکر کنم خودت تصمیم بگیر... تا بعد درست چک کنم»): fail-fast (503).** پیشنهاد اولیه‌ی همین سند به‌عنوان تصمیم نهایی پذیرفته شد؛ کاربر صریحاً خواسته بعداً دوباره چک کنه — این ردیف تا اون چک نهایی به‌عنوان **موقت-اما-فعال** علامت‌گذاری می‌مونه. |

جزئیات کامل هر تسک در `docs/spect/TODO-openon4net-runtime.md` بخش L و `docs/spect/TODO-openon4net-platform.md` بخش مربوطه.

## ۵. نکات آزاد

- این feature **کاملاً وابسته به activation**ه — برخلاف بعضی مسیرهای دیگه (مثل `marketplace-client.ts`، RT-093) هیچ fallback مستقیم/self-host-only براش وجود نداره، چون خودِ مشکل («localhost عمومی نیست») فقط با یک واسط عمومی (Platform) قابل حل‌ه. باید همین‌قدر صریح توی مستندات/UI هم گفته بشه که «این قابلیت فقط برای سازمان‌های activated در دسترسه».
- امنیت: چون `public_relay_token` مسیر Platform می‌شه ورودی عمومی بدون auth (مثل خودِ توکن Runtime)، باید همون سطح محافظت (rate limit + فقط SHA-256 hash ذخیره بشه، نه توکن خام) که RT-065 برای توکن خودش داره، اینجا هم رعایت بشه.

## ۶. جلسه بعدی

- **تاریخ:** نامشخص
- **موضوع:** —
