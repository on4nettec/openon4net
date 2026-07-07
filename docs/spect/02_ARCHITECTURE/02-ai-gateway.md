# AI Gateway & Model Router — Open on4net

> **فایل:** 02_ARCHITECTURE/02-ai-gateway.md
> **نسخه:** 1.0

---

## ۱. چیستی AI Gateway

AI Gateway مغز O₂N است. تمام درخواست‌های Agentها به AI Gateway می‌رسد و Gateway تصمیم می‌گیرد:

1. کدام مدل بهترین پاسخ را می‌دهد؟
2. هزینه چقدر است؟
3. آیا مدل در دسترس است؟
4. آیا fallback نیاز است؟

---

## ۲. Model Router (مسیریاب هوشمند)

### قوانین مسیریابی پیش‌فرض:

| نوع کار | مدل پیش‌فرض | دلیل |
|---------|-------------|------|
| **سوال ساده / چت روزمره** | Qwen 2.5 (محلی، Ollama) | رایگان، سریع، کافی |
| **کدنویسی / debug** | Claude 3.5 Sonnet | بهترین کدنویسی |
| **تحلیل / reasoning عمیق** | GPT-4o / o1 | قدرت تحلیل بالا |
| **تولید تصویر** | Gemini 2.0 / DALL-E 3 | کیفیت تصویر |
| **تولید ویدئو** | Runway Gen-3 / Pika | تخصصی ویدئو |
| **مستندات فنی** | Claude 3 Haiku | سریع، دقیق، ارزان |
| **ترجمه** | DeepSeek-V3 | قوی در چندزبانگی |
| **برنامه‌ریزی / task list** | GPT-4o mini | متعادل هزینه/کیفیت |
| **تحلیل داده / نمودار** | Gemini 1.5 Pro | context طولانی |
| **جستجوی داخلی** | Mistral | سبک، مناسب RAG |
| **کارهای ساده (yes/no)** | Llama 3 (محلی) | سریع‌ترین |
| **چت عمومی/اجتماعی** | Grok | tone متفاوت |

### معماری Model Router:

```
                    ┌─────────────────────────────┐
                    │      MODEL ROUTER           │
                    ├─────────────────────────────┤
                    │                             │
User Request ──────▶│  ۱. Intent Classification   │────▶ Rule-based
                    │                             │
                    │  ۲. Cost Check              │────▶ Budget enforcer
                    │                             │
                    │  ۳. Availability Check       │────▶ Health check
                    │                             │
                    │  ۴. Performance History      │────▶ Latency tracking
                    │                             │
                    │  ۵. Fallback Chain           │────▶ Plan B, C, D
                    │                             │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │      LLM EXECUTOR           │
                    ├─────────────────────────────┤
                    │  ┌───────────────────────┐  │
                    │  │ Rate Limiter          │  │
                    │  └───────────────────────┘  │
                    │  ┌───────────────────────┐  │
                    │  │ Circuit Breaker       │  │
                    │  └───────────────────────┘  │
                    │  ┌───────────────────────┐  │
                    │  │ Retry Logic           │  │
                    │  └───────────────────────┘  │
                    │  ┌───────────────────────┐  │
                    │  │ Response Parser       │  │
                    │  └───────────────────────┘  │
                    └─────────────────────────────┘
```

---

## ۳. مدیریت هزینه (Cost Management)

### رهگیری لحظه‌ای:
```
Agent: marketing-01
ماه: July 2026
بودجه: $۵۰۰

مدل مصرف:
├── GPT-4o: $۱۲۰ (۲۴٪)
├── Claude 3.5: $۲۵۰ (۵۰٪)
├── Qwen (local): $۰ (۰٪)
├── Gemini: $۴۵ (۹٪)
└── DeepSeek: $۳۵ (۷٪)

Total: $۴۵۰
باقی‌مانده: $۵۰
هشدار: نزدیک به پایان بودجه ⚠️
```

### قوانین بودجه:

| قانون | توضیح |
|-------|--------|
| **Monthly Cap** | سقف هزینه ماهانه هر Agent |
| **Per-Request Limit** | سقف هزینه هر درخواست |
| **Model Blacklist** | مدل‌های ممنوعه برای Agent خاص |
| **Auto-Downgrade** | وقتی بودجه کم میاد، مدل ارزان‌تر انتخاب کن |
| **Alert Threshold** | هشدار در ۸۰٪ و ۹۵٪ مصرف |

---

## ۴. Failover & Resilience

### زنجیره Failover پیشنهادی:

```
Primary: Claude 3.5
    │ (خطا / timeout / rate limit)
    ▼
Fallback 1: GPT-4o
    │
    ▼
Fallback 2: Gemini 1.5
    │
    ▼
Fallback 3: Qwen (محلی)
    │
    ▼
Emergency: "متأسفم، همه مدل‌ها در دسترس نیستند"
    + Queue برای پردازش بعدی
```

### Circuit Breaker:
```
وضعیت: بسته (Closed)
درخواست‌ها: ۱۰۰۰
خطاها: ۵ (۰.۵٪)
▶ طبیعی

وضعیت: باز (Open)
خطاها: ۵۰٪ در ۱ دقیقه
▶ مسدود برای ۳۰ ثانیه
▶ درخواست‌ها به fallback می‌روند

وضعیت: نیمه‌باز (Half-Open)
۳۰ ثانیه گذشته
▶ ۱ درخواست تست
▶ اگر موفق → بسته، اگر ناموفق → باز
```

---

## ۵. Cache Layer

| نوع کش | مدت | مدل‌ها |
|--------|-----|--------|
| **Response Cache** | ۱ ساعت | پاسخ‌های یکسان |
| **Semantic Cache** | ۳۰ دقیقه | سوالات مشابه (embeddings) |
| **Tool Results** | ۵ دقیقه | نتایج API, DB query |

---

```
Cache Hit ────────────────────────────────────────── ۵۰٪ کاهش هزینه
Cache Hit + Semantic ─────────────────────────────── ۷۰٪ کاهش latency
```

---

## ۶. Prompt Manager

### ساختار Prompt:
```
┌─────────────────────────────────────┐
│         PROMPT TEMPLATE             │
├─────────────────────────────────────┤
│  System Prompt (Role + Rules)       │
│  └── از 07_PROMPTS/                 │
│                                     │
│  Memory Context (از Memory Engine)  │
│  └── ۶ لایه + Graph                │
│                                     │
│  Tool Definitions                   │
│  └── از Tool Registry              │
│                                     │
│  Conversation History               │
│  └── آخرین ۱۰ پیام                  │
│                                     │
│  User Input                         │
└─────────────────────────────────────┘
```

### ورژنینگ Prompt:
```
07_PROMPTS/
├── agents/
│   ├── ceo-agent-v1.md
│   ├── marketing-agent-v2.md
│   └── programmer-agent-v1.md
├── system/
│   ├── base-system-v3.md
│   └── memory-injection-v1.md
└── templates/
    ├── code-review-v2.md
    └── meeting-summary-v1.md
```

---

> **خلاصه:** AI Gateway مغز O₂N است. Model Router هوشمند + Cost Management + Failover + Cache + Prompt Manager = یک لایه AI قدرتمند که همه مدل‌ها را یکپارچه و بهینه مدیریت می‌کند.
