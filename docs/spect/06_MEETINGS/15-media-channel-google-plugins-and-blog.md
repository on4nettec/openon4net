# جلسه ۱۵ — ۲۰۲۶-۰۷-۲۱

**حضور:** کاربر (owner)، Claude
**مدت:** —
**موضوع:** پلاگین‌های media generation، دسته‌بندی/کلمه‌کلیدی پلاگین، بلاگ چندزبانه، پلاگین‌های Channel (جفت Platform+Runtime)، پلاگین Google، معماری «دو دسته پلاگین» (Platform vs Runtime، فقط Runtime قابل‌فروش)

---

## ۱. دستور کار (Agenda)

کاربر یک‌جا چند موضوع مطرح کرد: حذف Together AI، اضافه‌شدن providerهای media generation (تصویر/ویدیو/صدا)، الزام دسته‌بندی+کلمه‌کلیدی روی پلاگین‌ها، یک صفحه‌ی نقد/بررسی provider یا بلاگ چندزبانه، تسک‌های Channel (تلگرام/واتساپ/دیسکورد/گوگل‌چت/آی‌مسیج/وی‌چت)، و یک اصل معماری تازه: بعضی پلاگین‌ها روی **Platform** نصب می‌شن نه Runtime (چون Runtime لوکال گاهی دسترسی مستقیم نداره)، پلاگین‌های Google هم مثل webhook از طریق Platform عمل می‌کنن، و **فقط پلاگین‌های Runtime قابل‌فروشن**.

## ۲. بررسی وضعیت فعلی (قبل از بحث، از روی کد واقعی)

- **دسته‌بندی پلاگین موجود، فقط ۷ مقدار ثابت** (`local-plugin-categories.ts` Runtime + CHECK constraint هم‌نام در Marketplace migration 0006): `communication, productivity, data-analytics, devops, ai-ml, finance, other`. هیچ‌کدوم دقیقاً «LLM Provider» یا «Connector» یا «Media Generation» نیست.
- **`telegram-connector.ts` فقط outbound** — تأیید مجدد (قبلاً در جلسه ۱۲ هم دیده شده بود). هیچ فایل connector دیگه‌ای (whatsapp/discord/…) حتی به‌شکل stub وجود نداره.
- **Google OAuth فقط برای لاگین** (`auth/providers/oauth.ts`) — scope فقط `openid email`، هیچ دسترسی Drive/Calendar/Gmail/Sheets نداره، هیچ ذخیره‌ی توکن برای استفاده‌ی بعدی نیست. سند معماری Google Drive رو به‌عنوان مثال Connector نام برده (`02_ARCHITECTURE/07-connectors-and-tools.md`)، ولی **هیچ کد واقعی‌ای نیست**.
- **مدل «پلاگین روی Platform نصب بشه» امروز اصلاً وجود نداره** — `app.ts` Platform فقط route‌های ثابت رو استاتیک import/register می‌کنه؛ هیچ مکانیزم manifest-driven module loading یا ثبت پویا توی منوی وب نیست. نزدیک‌ترین پیش‌زمینه: جلسه ۱۲ گفته بود پلاگین LLM provider هم‌زمان روی Runtime و Platform نصب می‌شه (همون یک پلاگین، دو جا) — **متفاوت** از چیزی که امروز کاربر خواست (دو پلاگین جدا، یکی مخصوص هرکدوم، هماهنگ با هم از طریق یک کانال).
- **مدل قیمت‌گذاری Marketplace فقط یک عدد** (`priceCredits`)، هیچ فیلدی برای «قابل‌فروش/فقط‌داخلی» یا install-target (Platform/Runtime) نداره.

## ۳. بحث و تصمیمات

### موضوع ۱: حذف Together AI

- **تصمیم:** RT-128 لغو شد (issue بسته شد، ردیف TODO با ~~خط‌خورده~~ علامت‌گذاری شد، نه حذف کامل از تاریخچه).

### موضوع ۲: providerهای media generation

- **تصمیم:** تصویر → OpenAI (DALL-E) + Stability AI. ویدیو → Runway + Luma (Sora فعلاً API عمومی نداره، کنار گذاشته شد تا وقتی عرضه بشه). صدا/گفتار → ElevenLabs + OpenAI TTS/Whisper.
- **نتیجه‌ی فنی:** این providerها با قرارداد RT-112 (متن، messages-in/text-out) سازگار نیستن — یک قرارداد جدید «Media Generation Provider Plugin» لازمه (prompt-in / asset-out، احتمالاً با polling غیرهمزمان برای ویدیو). حتی برای OpenAI که هم متن (RT-122) هم تصویر داره، این دو تا **پلاگین جدا** می‌مونن (قرارداد متفاوت = پلاگین متفاوت، حتی برای یک provider تجاری).

### موضوع ۳: دسته‌بندی + کلمه‌کلیدی پلاگین

- **تصمیم:** enum دسته‌بندی از ۷ به ۱۰ مقدار گسترش پیدا می‌کنه: `llm-provider`, `media-generation`, `connector` اضافه می‌شن. یک فیلد جدید `keywords: string[]` هم به manifest اضافه می‌شه (آزاد، نه enum — برای سرچ + توضیح کاربرد).
- **پیامد:** چون این enum هم توی Runtime (`local-plugin-categories.ts`) هم توی Marketplace (CHECK constraint، migration جدا) تعریف شده، هر دو باید هم‌زمان/هماهنگ به‌روز بشن (دقیقاً همون الگوی migration 0006 که خودش گفته «همون taxonomy ثابت Marketplace»).

### موضوع ۴: بخش بلاگ

- **تصمیم:** بلاگ کامل چندزبانه در Platform، نه فقط یک فیلد نقد روی کاتالوگ. ادمین مقاله می‌نویسه (سئو: slug/meta title/meta description per-language)، و مقاله‌ها می‌تونن در انتها به صفحه‌ی کاتالوگ provider/model (CP-037/CP-040) لینک بدن.
- **جزئیات فنی (تصمیم Claude، ریسک پایین، موکول به پیاده‌سازی):** چندزبانگی از همون الگوی CP-028 استفاده می‌کنه (زبان مرجع + AI-translate)، ولی برخلاف رشته‌های UI، ترجمه‌ی هر زبان قبل از publish باید توسط ادمین تأیید/ویرایش بشه (پیش‌نویس، نه auto-publish) — چون این محتوای عمومی/سئوئه، نه رشته‌ی رابط کاربری داخلی.

### موضوع ۵: پلاگین‌های Channel — جفت Platform + Runtime

- **بحث:** کاربر دقیقاً همون مشکل webhook (جلسه ۱۰) رو برای Channelها هم مطرح کرد — Runtime لوکال/پشت NAT نمی‌تونه مستقیم از سرویس‌های بیرونی (تلگرام و…) ورودی بگیره. راه‌حل: **دو پلاگین جدا** — یکی روی Platform (گیرنده‌ی inbound، از طریق یک کانال دائمی به Runtime relay می‌کنه) و یکی روی Runtime (منطق واقعی bot/پاسخ‌گویی).
- **تصمیم Claude (مهندسی، نه یک fork واقعی — گسترش منطقی زیرساخت موجود):** به‌جای ساختن یک کانال جدا، همون WebSocket relay جلسه ۱۰ (CP-046) **تعمیم داده می‌شه** به یک «Plugin Event Relay» عمومی (نه فقط webhook) — یک اتصال دائمی Runtime↔Platform که چند نوع رویداد (webhook، پیام channel، …) رو multiplex می‌کنه، نه یک کانال جدا به‌ازای هر feature.
- **لیست channel (تسک‌بندی‌شده):** Telegram, WhatsApp, Discord, Google Chat, WeChat — روال عادی. **iMessage با پرچم ریسک بالا** — هیچ API عمومی/رسمی Business نداره؛ خودکارسازی معمولاً یا به یک Mac واقعی + AppleScript نیاز داره یا یک سرویس واسط شخص‌ثالث با شرایط مبهم اپل. این تسک فعلاً «نیاز به تحقیق feasibility» علامت‌گذاری می‌شه، نه یک build عادی.
- **پیامد روی RT-114:** توضیح RT-114 (جلسه ۱۲) اصلاح می‌شه — inbound handling دیگه سمت پلاگین Runtime نیست، سمت پلاگین Platform است (چون فقط اون یک endpoint عمومی داره)؛ پلاگین Runtime رویداد relay‌شده رو از طریق Plugin Event Relay دریافت می‌کنه.

### موضوع ۶: پلاگین Google — یک پلاگین، چند سرویس، چند حساب

- **تصمیم:** فقط **یک** پلاگین Google (نه یکی جدا به‌ازای هر سرویس) — موقع اتصال، کاربر یک صفحه‌ی consent می‌بینه و انتخاب می‌کنه به کدوم سرویس‌ها (Drive/Calendar/Gmail/Sheets) دسترسی بده (OAuth scope انتخابی/افزایشی). کاربر می‌تونه **چند حساب Google** رو هم‌زمان وصل کنه (رابطه‌ی one-to-many) — همین اصل one-to-many برای اتصالات Channel هم صادقه (چند بات تلگرام، چند شماره‌ی واتساپ).
- **سرویس‌های فاز اول:** Drive (اولویت اول، جایگزین CP-041 قدیمی)، Calendar، Gmail، Sheets.
- **وابستگی خارجی:** نیاز به credential واقعی OAuth از Google Cloud Console (Client ID/Secret + تنظیم consent screen) از طرف کاربر داره — بدون این، فقط ساختار/schema قابل ساخت و تسته، نه یک login واقعی Google.

### موضوع ۷: معماری «دو دسته پلاگین» — Platform vs Runtime، فقط Runtime قابل‌فروش

- **تصمیم کاربر (از قبل تصمیم‌گرفته‌شده، فقط مستند شد):** هر پلاگین دقیقاً یکی از این دو target داره: **Platform** (نصب روی Platform، برای توسعه/زیرساخت) یا **Runtime** (نصب روی Runtime، تنها دسته‌ای که از طریق Marketplace **قابل‌فروش**ه).
- **نتیجه‌گیری Claude — این اصل CP-051 رو هم توضیح می‌ده:** CP-051 («بسته‌بندی AI Gateway به‌عنوان پلاگین») همین الگو رو از قبل (جلسه ۱۲) داشت، فقط اسمش گذاشته نشده بود — نیمه‌ی Platform همون جفت LLM-provider-plugin است. این جلسه فقط این الگو رو صریح/عمومی کرد و برای Channel/Google هم اعمال کرد.
- **✏️ تصحیح همون روز (بعد از یک سؤال کاربر روی TikTok/LinkedIn/YouTube):** پیش‌فرض اولیه‌ی Claude («پلاگین Platform هیچ‌وقت روی Marketplace لیست نمی‌شه») **اشتباه بود و اصلاح شد.** تصمیم درست: **همه‌ی پلاگین‌هایی که برای Runtime استفاده می‌شن — چه قابل‌فروش چه رایگان، چه installTarget=runtime چه installTarget=platform — روی Marketplace لیست می‌شن.** فقط پلاگین‌هایی که کاملاً داخلی/زیرساخت خودِ Platform‌ان و هیچ مصرف‌کننده‌ی Runtime ندارن (مثل CP-052 خودِ hosting system، CP-053 خودِ relay، CP-055 بلاگ) از این قاعده مستثنی می‌مونن.
  - برای پلاگین‌های `installTarget=platform` که Runtime مصرفشون می‌کنه (Google/CP-054، TikTok/CP-064، LinkedIn/CP-065، YouTube/CP-066): یک ردیف Marketplace می‌گیرن (معمولاً رایگان)، ولی «نصب» به‌جای دانلود فایل Runtime، فرآیند فعال‌سازی/OAuth سمت Platform رو براش راه می‌ندازه.
  - برای Channelهای جفتی (Telegram/WhatsApp/Discord/GoogleChat/WeChat/Facebook/Instagram): **یک ردیف Marketplace واحد** کل قابلیت رو نشون می‌ده؛ نصب کردنش هر دو نیمه (Platform + Runtime) رو هماهنگ فعال می‌کنه، نه دو ردیف جدا.
- **پیامد Marketplace:** برخلاف فرض اولیه، این دفعه enforcement جدید لازمه — مسیر نصب Marketplace باید بر اساس `installTarget` شاخه بره (MKT-032، تسک جدید).
- **الزام UI:** پلاگین‌های نصب‌شده روی Platform باید در منوی وب Platform نمایش داده بشن — یعنی خودِ Platform به یک مکانیزم «نصب/ثبت پلاگین» نیاز داره که **امروز اصلاً وجود نداره** (بررسی وضعیت فعلی، بالا). این پایه‌ی همه‌ی تسک‌های Platform-side این جلسه‌ست.

## ۴. Action Items

جدول کامل تسک‌ها (فارسی) در `TODO-openon4net-runtime.md` بخش P، `TODO-openon4net-platform.md` بخش K، `TODO-openon4net-marketplace.md` بخش J.

**خلاصه‌ی بلوک‌های اصلی:**

1. زیرساخت پایه: CP-052 (Platform Plugin Hosting System)، CP-053 (تعمیم CP-046 به Plugin Event Relay عمومی)، RT-132 (گسترش enum دسته‌بندی + keywords)، MKT-031 (هم‌گام‌سازی enum سمت Marketplace)، **MKT-032 (پشتیبانی نصب `installTarget=platform` + ردیف واحد برای Channelهای جفتی، تصحیح موضوع ۷)**.
2. Media generation: RT-133 (قرارداد جدید) + RT-134..139 (۶ پلاگین provider).
3. بلاگ: CP-055.
4. Channel: RT-114 اصلاح شد + RT-140..145 (سمت Runtime، ۶ تا، شامل iMessage با پرچم ریسک) + CP-056..061 (سمت Platform، ۶ تا، شامل iMessage با پرچم ریسک).
5. Google: CP-054 (جایگزین CP-041).

## ۵. نکات آزاد

- طبق روال، **هیچ‌کدوم از این تسک‌ها امروز پیاده‌سازی نشدن** — فقط ثبت/تصمیم‌گیری شد.
- CP-052 (Platform Plugin Hosting System) بزرگ‌ترین و پایه‌ای‌ترین تسک این جلسه‌ست — عملاً یک زیرساخت جدید موازی با چیزی که Runtime سال‌ها پیش (RT-076..080) ساخت، این‌بار برای Platform.
- iMessage (هم سمت Platform هم Runtime) نیاز به یک تسک تحقیق feasibility جدا داره قبل از build واقعی — در جدول با یادداشت صریح علامت‌گذاری شد، نه یک ⏳ عادی.
- CP-041 (اتصال Workspace به Google Drive) با این جلسه منسوخ شد؛ CP-054 جایگزینش می‌شه (دامنه‌ی بزرگ‌تر: چند سرویس، چند حساب، consent انتخابی).

## ۶. افزوده (همون روز) — Facebook, Instagram, TikTok, LinkedIn, YouTube

کاربر خواست پلاگین برای این ۵ پلتفرم هم اضافه بشه. Claude قبل از تسک‌بندی یک تفاوت فنی واقعی رو بررسی کرد: همه‌ی این ۵ تا «channel» به‌معنای گفتگوی دوطرفه (مثل تلگرام) نیستن.

### تفکیک فنی (بررسی‌شده، نه فرض)

- **Facebook Messenger و Instagram DM** — واقعاً conversational‌ان (پیام دوطرفه، inbound واقعی داره) → دقیقاً همون الگوی جفت Platform+Runtime بخش ۵ موضوع ۵ (مثل تلگرام).
- **TikTok، LinkedIn، YouTube** — اینها اساساً پلتفرم انتشار محتوا/کامنت‌ان، نه گفتگوی real-time. API رسمی LinkedIn برای messaging شدیداً محدود/partner-only‌ه؛ YouTube اصلاً DM نداره (فقط ویدیو/کامنت)؛ TikTok API نسبتاً جدید و محدودتر از Meta/Google‌ه. برای این سه‌تا، الگوی **جفت Platform+Runtime لازم نیست** — دقیقاً مثل الگوی پلاگین Google (بخش ۵ موضوع ۶): یک پلاگین تک، فقط سمت Platform (OAuth رو نگه می‌داره)، و Runtime از طریق همون مکانیزم proxy موجود (RT-079، الگوی CP-032/034) بهش وصل می‌شه — نیازی به پلاگین جدا سمت Runtime نیست.

### تصمیم

- Facebook Messenger و Instagram DM → جفت کامل (Platform + Runtime)، مثل بخش Channel.
- TikTok، LinkedIn، YouTube → فقط یک پلاگین Platform-side (الگوی Google)، بدون پلاگین Runtime جدا.

### Action Items

| #      | تسک                                                            | Priority | Size | یادداشت                                                                                                         |
| ------ | -------------------------------------------------------------- | :------: | :--: | --------------------------------------------------------------------------------------------------------------- |
| RT-146 | Facebook Messenger Channel Plugin (سمت Runtime) — قابل‌فروش    |    P1    |  M   | وابسته به RT-114 + CP-053 + CP-062                                                                              |
| RT-147 | Instagram DM Channel Plugin (سمت Runtime) — قابل‌فروش          |    P1    |  M   | وابسته به RT-114 + CP-053 + CP-063                                                                              |
| CP-062 | Facebook Messenger Channel Plugin (سمت Platform)               |    P1    |  M   | وابسته به CP-052 + CP-053. نیاز به OAuth app واقعی Meta (Client ID/Secret) از کاربر                             |
| CP-063 | Instagram DM Channel Plugin (سمت Platform)                     |    P1    |  M   | وابسته به CP-052 + CP-053. همون Meta OAuth app بالا (Facebook/Instagram یکی هستن) قابل استفاده مجدده            |
| CP-064 | TikTok Connector Plugin (فقط سمت Platform، بدون جفت Runtime)   |    P2    |  M   | وابسته به CP-052. الگوی Google (بخش ۵ موضوع ۶)، نه الگوی Channel. نیاز به OAuth app واقعی TikTok for Developers |
| CP-065 | LinkedIn Connector Plugin (فقط سمت Platform، بدون جفت Runtime) |    P2    |  M   | ⚠️ API رسمی messaging محدود/partner-only‌ه — فاز اول فقط قابلیت‌های publish/read در دسترسه                      |
| CP-066 | YouTube Connector Plugin (فقط سمت Platform، بدون جفت Runtime)  |    P2    |  M   | ⚠️ اصلاً DM نداره — فقط آپلود ویدیو/مدیریت کامنت، نه گفتگو                                                      |

همه‌ی پلاگین‌های Platform این افزوده (CP-062..066) نیاز به OAuth app واقعی (Client ID/Secret) از کنسول توسعه‌دهنده‌ی همون پلتفرم دارن — بدون اون فقط ساختار/schema قابل‌ساخت‌وتسته.

> **تصحیح بعدی همون روز (بخش ۳ موضوع ۷):** «بدون جفت Runtime» یعنی TikTok/LinkedIn/YouTube
> کد سمت Runtime ندارن، **نه** اینکه از Marketplace غایب باشن — طبق تصحیح موضوع ۷، این سه‌تا
> هم یک ردیف رایگان روی Marketplace می‌گیرن (MKT-032).

جدول کامل در `TODO-openon4net-runtime.md` بخش P و `TODO-openon4net-platform.md` بخش K (هر دو به‌روزرسانی شدن).

## ۷. جلسه بعدی

- **تاریخ:** نامشخص
- **موضوع:** —
