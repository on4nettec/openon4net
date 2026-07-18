# جلسه ۷ — ۲۰۲۶-۰۷-۱۷

**حضور:** کاربر (owner)، Claude
**مدت:** —
**موضوع:** جای درست AI Gateway + تغییر نام Control Plane به Platform + الزام عبور تمام ترافیک Runtime↔Memory/Marketplace از Platform

---

## ۱. دستور کار (Agenda)

این جلسه ادامه‌ی مستقیم بحث AI Gateway در جلسه‌ی قبل (بدون شماره‌ی رسمی، بلافاصله قبل از
این سند) بود: آیا AI Gateway باید از Control Plane به Memory منتقل بشه؟ بحث به یک تصمیم
معماری بزرگ‌تر کشیده شد: تغییر نام Control Plane به «Platform»، و این‌که Runtime دیگه
مستقیم با Memory/Marketplace حرف نزنه، بلکه همه‌چیز از Platform عبور کنه.

## ۲. بحث و تصمیمات

### موضوع ۱: جای AI Gateway — تأیید نهایی

- **بحث:** کاربر اول گفت AI Gateway (تصمیم‌گیری هوشمند بین چند provider بر اساس موضوع پیام)
  باید بره داخل Memory، چون Memory هم برای embedding به provider نیاز داره و نتیجه‌ی routing
  ممکنه لازم باشه در حافظه ذخیره/بازیابی بشه.
- **تصحیح واقعیتی که حین بحث پیدا شد:** این AI Gateway هنوز **جایی در کد وجود نداره** — نه
  در Control Plane نه جای دیگه. فقط یک آیتم برنامه‌ریزی‌شده (`CP-012`, «Managed AI Gateway»)
  هست که RT-078 رو بلاک کرده. Runtime الان فقط یک provider ثابت per-org داره (BYOK، بدون
  routing هوشمند).
- **استدلال Claude:** engine تصمیم‌گیری لازم نیست فیزیکی داخل Memory باشه تا بهش دسترسی
  داشته باشه — می‌تونه مثل هر caller دیگه‌ای از طریق API به `/memory/search` برسه. علاوه بر
  این، routing یک عملیات پرتکرار/latency-حساسه (هر پیام چت) در حالی که Memory (embedding،
  Neo4j graph) پروفایل مقیاس‌پذیری کاملاً متفاوتی داره — قاطی‌کردنشون ریسک داره.
- **تصمیم نهایی کاربر:** AI Gateway همون‌جا که برنامه‌ریزی شده بود می‌مونه (`CP-012`، در
  Control Plane/Platform) — منتقل نمی‌شه.

### موضوع ۲: تغییر نام Control Plane → Platform

- **بحث:** کاربر تصمیم گرفت اسم «Control Plane» به «Platform» تغییر کنه.
- **دلیل کاربر:** چون قراره Platform دیگه فقط یک لایه‌ی کنترل/activation نباشه، بلکه واسطه‌ی
  اجباری هر ارتباطی بین Runtime و Memory/Marketplace هم باشه (موضوع ۳ پایین) — «Platform»
  این نقش گسترده‌تر رو بهتر از «Control Plane» نشون می‌ده.
- **نکته‌ی Claude:** با خودِ اسم مخالفتی نیست، ولی **اجرای واقعی این تغییر نام** (نه فقط
  عنوان در مستندات، بلکه احتمالاً اسم repo -`openon4net-control-plane`- ، مسیر submodule،
  env varها مثل `CONTROL_PLANE_URL`، و ده‌ها ارجاع در مستندات هر ۴ پلین) یک تغییر
  زیرساختی واقعیه، نه صرفاً کلمه‌ای. پیشنهاد Claude: این کار دومرحله‌ای بشه — (۱) از همین
  الان در مستندات/UI جدید «Platform» استفاده بشه، (۲) rename فیزیکی repo/پوشه/env var به‌عنوان
  یک تسک جدا و با تأیید صریح قبل از اجرا (چون تغییر اسم یک repo زنده‌ی گیت‌هاب روی remoteهای
  همه‌ی clone های محلی و هر CI config که اسمش رو hardcode کرده اثر می‌ذاره).

### موضوع ۳: عبور اجباری ترافیک Runtime↔Memory/Marketplace از Platform

- **بحث:** کاربر می‌خواد Runtime دیگه مستقیم به Memory یا Marketplace وصل نشه؛ هر درخواستی
  باید از Platform عبور کنه. دو دلیل: (۱) یک لایه‌ی امنیتی اضافه می‌شه (Platform می‌تونه
  authorize/audit کنه قبل از عبور درخواست)، (۲) میزان مصرف هر سازمان از Memory/Marketplace
  در یک‌جا (Platform) قابل‌اندازه‌گیری می‌شه — دقیقاً هم‌راستا با نقش موجود Platform به‌عنوان
  مالک wallet/billing (guardrail شناخته‌شده‌ی CP-013).
- **وضعیت فعلی (چک‌شده در کد):**
  - Runtime → Marketplace: الان **مستقیم** است (`gateway/src/services/marketplace-client.ts`
    در Runtime، با `MARKETPLACE_SERVICE_URL`/`MARKETPLACE_API_KEY` مستقیم). این یک تغییر رفتار
    واقعیه (باید از مستقیم به proxy-شده تبدیل بشه)، نه صرفاً یک قابلیت جدید.
  - Runtime → Memory: الان **هیچ ارتباطی اصلاً وجود نداره** (چک شد، صفر ارجاع). یعنی این
    مسیر از صفر ساخته می‌شه — فرصت خوبیه که از همون اول درست (از طریق Platform) ساخته بشه،
    نه بعداً migrate بشه.
  - Control Plane خودش از قبل مستقیم به Marketplace وصل می‌شه (`CP-027`، برای صفحه‌ی
    `/marketplace` خودش) — این یک الگوی متفاوته (Control Plane خودش caller است، نه
    proxy-کننده‌ی درخواست یک سرویس دیگه) و دست‌نخورده می‌مونه.
- **⚠️ تنش شناسایی‌شده، هنوز حل‌نشده:** `activation-client.ts` یک اصل طراحی صریح داره:
  «a Control-Plane outage must never block Runtime's own operation» (best-effort، هیچ‌وقت
  throw نمی‌کنه). اگه الان دسترسی به Memory/Marketplace هم اجباراً از Platform عبور کنه،
  Runtime یک وابستگی سخت جدید به در دسترس‌بودن Platform پیدا می‌کنه — برخلاف فلسفه‌ی
  self-hosted بودن که تا الان دنبال شده (اگه Platform پایین باشه، آیا نصب Plugin/نوشتن به
  Memory هم باید failbody بشه، یا باید مثل activation یک مسیر best-effort/cache داشته باشه؟).
  **این سؤال باز مونده و باید قبل از پیاده‌سازی کامل تصمیم‌گیری بشه.**
- **هم‌افزایی با تصمیم قبلی:** توکن امنیتی `CP-032` (صادرشده بعد از تأیید activation) دقیقاً
  همون credentialیه که Runtime برای این ارتباطات proxy-شده با Platform لازم داره — یعنی
  به‌جای نگه‌داشتن secretهای پراکنده (`MARKETPLACE_API_KEY` و هرچی بعداً برای Memory لازم
  بشه)، Runtime فقط با یک توکن Platform حرف می‌زنه.

## ۳. Action Items

| #      | تسک                                                                                                                                         | Plane         | یادداشت                                                                                                                                | وضعیت |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- | :---: |
| CP-033 | تغییر نام Control Plane → Platform در مستندات/UI (مرحله‌ی اول، کم‌ریسک)                                                                     | Control Plane | مرحله‌ی دوم (rename فیزیکی repo/پوشه/env var مثل `CONTROL_PLANE_URL`) عمداً یک تسک جدا نیست هنوز — نیاز به تأیید صریح قبل از اجرا داره |  ❌   |
| CP-034 | لایه‌ی mediation/proxy در Platform برای درخواست‌های Runtime→Memory و Runtime→Marketplace (لایه‌ی امنیتی + ثبت میزان مصرف)، با توکن `CP-032` | Control Plane | ⚠️ منتظر حل تنش «best-effort در برابر hard-fail» (بالا) قبل از پیاده‌سازی کامل                                                         |  ❌   |
| RT-093 | مهاجرت مشتری Marketplace موجود در Runtime (`marketplace-client.ts`) از تماس مستقیم به تماس proxy-شده از طریق Platform                       | Runtime       | وابسته به `CP-034`؛ یک تغییر رفتار روی چیزی که همین الان کار می‌کنه، نه یک قابلیت کاملاً جدید                                          |  ❌   |

## ۴. نکات آزاد

- **گاردریل جدید برای هر تسک آینده‌ی Runtime↔Memory:** هر وقت integration واقعی Runtime با
  سرویس Memory ساخته بشه (هنوز هیچ تسکی براش ثبت نشده)، باید از همون ابتدا از طریق Platform
  باشه، نه مستقیم — این محدودیت همین‌جا ثبت می‌شه تا در طراحی اون تسک فراموش نشه.
- بعد از قطعی‌شدن نام «Platform»، حافظه‌ی خودِ Claude (`four-plane-architecture` memory) و
  ارجاعات به «Control Plane» در مستندات آینده باید به‌روز بشن — این یک کار مستمر است، نه یک
  رویداد یک‌باره.

---

> **خلاصه:** AI Gateway در جایگاه برنامه‌ریزی‌شده‌اش (Platform/`CP-012`) تأیید شد. نام
> Control Plane به Platform تغییر می‌کنه (دومرحله‌ای: مستندات اول، rename فیزیکی بعداً با
> تأیید جدا). Runtime→Memory/Marketplace اجباراً از Platform عبور می‌کنه — CP-033، CP-034،
> RT-093 ثبت شد. یک تنش طراحی مهم (best-effort در برابر hard-fail هنگام قطعی Platform) باز
> مونده و باید قبل از تکمیل CP-034 حل بشه.
