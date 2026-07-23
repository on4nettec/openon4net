# جلسه ۱۴ — ۲۰۲۶-۰۷-۲۰

**حضور:** کاربر (owner)، Claude
**مدت:** —
**موضوع:** تفکیک RT-113 (پلاگین‌های LLM Provider) به تسک‌های جدا به‌ازای هر provider + گسترش لیست providerها

---

## ۱. دستور کار (Agenda)

کاربر خواست تسک‌های مربوط به «Provider LLM» ثبت و اولویت‌بندی بشن. RT-113 (جلسه ۱۲) در حال حاضر مهاجرت anthropic/openai/deepseek رو یک تسک واحد فرض کرده بود. Claude قبل از تسک‌بندی دو سؤال معماری واقعاً باز مطرح کرد.

## ۲. بحث و تصمیمات

### موضوع ۱: دانه‌بندی (granularity) پلاگین

- **بحث:** Claude دو گزینه مطرح کرد — یک پلاگین جدا به‌ازای هر provider تجاری (Anthropic, OpenAI, Groq, …) در مقابل فقط دو پلاگین عمومی بر پایه‌ی پروتکل سیمی (`OpenAI-compatible` با baseUrl قابل‌تنظیم + `Anthropic-native` جدا) — دقیقاً همون اصلی که برای کاتالوگ CP-037 سمت Platform هم استفاده شد.
- **تصمیم کاربر:** **یک پلاگین جدا به‌ازای هر provider.** ساده‌تر برای اولویت‌بندی تک‌تک (کاربر می‌تونه بگه کدوم provider اول)، ولی یعنی کد بین providerهای هم‌پروتکل (اکثراً OpenAI-compatible) تکرار می‌شه — پذیرفته‌شده آگاهانه.

### موضوع ۲: لیست providerها

- **بحث:** فقط ۳ provider موجود (Anthropic/OpenAI/DeepSeek) در مقابل کل لیست پیشنهادی جلسه ۸ (۱۰-۱۵ provider).
- **تصمیم کاربر:** **کل لیست جلسه ۸.** ۱۱ provider: OpenAI, Anthropic, DeepSeek (موجود) + Groq, Together AI, Fireworks, Mistral, Google Gemini, Perplexity, Azure OpenAI, Cohere (جدید). Ollama طبق تصمیم قبلی جلسه ۱۲ همچنان بدون‌پلاگین/پیش‌فرض می‌مونه.

### موضوع ۳: اولویت‌بندی بین providerها (استخراج‌شده توسط Claude)

کاربر خواست اولویت از همین لیست استخراج بشه. منطق:

- **P0:** Anthropic، OpenAI — provider اصلی/پیش‌فرض فعلی Runtime، فقط مهاجرته (ریسک کم، قابلیت موجود).
- **P1:** DeepSeek (موجود، مهاجرت)، Groq (سریع/ارزان/محبوب)، Google Gemini (provider اصلی دیگه، ولی پروتکل خودش رو داره، نه لزوماً OpenAI-compatible).
- **P2:** Mistral، Azure OpenAI، Together AI، Fireworks، Perplexity، Cohere — providerهای جدید با محبوبیت/تقاضای فرض‌شده کمتر از P1، قابل تغییر با بازخورد واقعی بازار.

## ۳. Action Items

RT-113 از «هر سه provider» به فقط **Anthropic** محدود شد (چون Anthropic provider اصلی/پیش‌فرض تاریخی Runtime‌ه). ۱۰ تسک جدید RT-122 تا RT-131 برای بقیه‌ی providerها ثبت شد.

| #      | تسک                                  | Priority | Size |
| ------ | ------------------------------------ | :------: | :--: |
| RT-113 | Anthropic Provider Plugin (مهاجرت)   |    P0    |  M   |
| RT-122 | OpenAI Provider Plugin (مهاجرت)      |    P0    |  M   |
| RT-123 | DeepSeek Provider Plugin (مهاجرت)    |    P1    |  S   |
| RT-124 | Groq Provider Plugin (جدید)          |    P1    |  S   |
| RT-125 | Google Gemini Provider Plugin (جدید) |    P1    |  M   |
| RT-126 | Mistral Provider Plugin (جدید)       |    P2    |  S   |
| RT-127 | Azure OpenAI Provider Plugin (جدید)  |    P2    |  S   |
| RT-128 | Together AI Provider Plugin (جدید)   |    P2    |  S   |
| RT-129 | Fireworks Provider Plugin (جدید)     |    P2    |  S   |
| RT-130 | Perplexity Provider Plugin (جدید)    |    P2    |  S   |
| RT-131 | Cohere Provider Plugin (جدید)        |    P2    |  M   |

همه‌ی این ۱۱ تسک وابسته به RT-112 (قرارداد پلاگین) هستن. جزئیات کامل در `docs/spect/TODO-openon4net-runtime.md` بخش N (به‌روزرسانی‌شده).

## ۴. نکات آزاد

- کد بین providerهای هم‌پروتکل (Groq/Together/Fireworks/Mistral/Azure/Perplexity — همه تقریباً OpenAI-compatible) شبیه هم می‌مونه؛ این تکرار آگاهانه پذیرفته شد (تصمیم موضوع ۱)، نه یک oversight.
- Google Gemini و Cohere پروتکل native خودشون رو دارن (نه لزوماً OpenAI-compatible کامل) — همین باعث شد Size اونها M باشه، نه S مثل بقیه.
- طبق روال، **هیچ‌کدوم از این تسک‌ها امروز پیاده‌سازی نشدن** — فقط ثبت/اولویت‌بندی شد.

## ۵. جلسه بعدی

- **تاریخ:** نامشخص
- **موضوع:** —
