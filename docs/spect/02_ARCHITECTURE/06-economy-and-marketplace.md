# Economy (Credits/Coin) & Marketplace — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/06-economy-and-marketplace.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف اقتصاد داخلی چیست؟

اقتصاد داخلی O₂N برای ۳ هدف طراحی می‌شود:
1) **شفاف‌سازی هزینه** برای مصرف‌کننده (هر Agent/Workflow/Plugin چقدر هزینه داشت؟)  
2) **کنترل و محدودسازی** (budget، سقف مصرف، approval chain)  
3) **انگیزه‌دهی به اکوسیستم** (سازنده plugin/tool از مصرف منتفع شود)

---

## ۲) تعریف “Coin” در v1

در v1، “Coin” یک **Credit داخلی** است:
- قابل خرید با پول واقعی (Top-up)
- قابل مصرف در: مدل‌ها (LLM calls) + ابزارها + pluginهای marketplace
- قابل برگشت/chargeback طبق policy (برای موارد استثنایی)
- **غیرقابل انتقال آزادانه بین کاربران** (به‌صورت پیش‌فرض) مگر در Enterprise (policy-based transfers)

> هدف v1: سادگی، کنترل، حسابرسی، و ریسک حقوقی کمتر.  
> اگر در آینده نیاز شد، می‌توان “crypto token” را به‌عنوان یک ماژول اختیاری جدا کرد.

---

## ۳) واحدهای هزینه و قیمت‌گذاری

سه سطح هزینه داریم:

### ۳.۱) هزینه مدل (AI Cost)
- هر provider هزینه واقعی خود را دارد (per-token / per-request)
- O₂N آن را به **credits** تبدیل می‌کند
- نرخ تبدیل در settings سازمان قابل پیکربندی است (برای margin/پوشش هزینه‌ها)

### ۳.۲) هزینه ابزار/پلاگین (Tool/Plugin Cost)
هر plugin می‌تواند یکی از مدل‌های قیمت‌گذاری را انتخاب کند:
- **Per Call** (مثلاً 10 credits هر اجرا)
- **Per Successful Outcome** (مثلاً “ارسال موفق پیام”)
- **Subscription** (ماهانه) + usage cap
- **Freemium** (تا N بار رایگان)

### ۳.۳) هزینه workflow
workflow هزینه را از جمع stepها حساب می‌کند:
- tool/plugin usage
- model usage
- infra usage (اختیاری در Enterprise)

---

## ۴) کیف پول، بودجه و کنترل (Wallet + Budget + Governance)

### ۴.۱) Wallet
هر **Organization** یک wallet دارد؛ هر **Workspace** می‌تواند sub-wallet داشته باشد:
- org_wallet: منبع اصلی credits
- workspace_wallet: سقف/بودجه مشخص
- agent_budget: سقف ماهانه/روزانه

### ۴.۲) قوانین بودجه (Enforcement)
- per-agent monthly budget
- per-workflow max cost
- per-plugin max cost
- alert thresholds (80%, 95%)
- auto-downgrade models (طبق 02_ARCHITECTURE/02-ai-gateway.md)

### ۴.۳) Human-in-the-loop و approval chain
اگر هزینه پیش‌بینی‌شده از حدی بیشتر شود:
- درخواست به approval_queue می‌رود
- تا approve نشود اجرا نمی‌شود

---

## ۵) جریان پرداخت (Billing Flow)

### ۵.۱) Top-up
1) Admin سازمان credits می‌خرد
2) سیستم یک `credit_transaction` ثبت می‌کند
3) wallet افزایش می‌یابد

### ۵.۲) Consumption (مصرف)
1) قبل از اجرا: **estimate cost**  
2) governance check  
3) reserve credits (اختیاری)  
4) اجرا  
5) settle (final cost) + audit log

### ۵.۳) Refund / Dispute
در صورت خطای سیستم/charge اشتباه:
- refund transaction
- لینک به trace_id/audit_log

---

## ۶) Marketplace و منتفع شدن سازنده

### ۶.۱) اصول
- plugin publisher یک حساب publisher دارد
- هر بار استفاده از plugin، یک usage event ثبت می‌شود
- بخشی از هزینه به publisher تعلق می‌گیرد (revenue share)

### ۶.۲) Revenue Share (پیشنهادی v1)
- 70% به سازنده
- 30% به پلتفرم

### ۶.۳) Payout
در v1 پیشنهاد می‌شود payout به شکل:
- credits قابل استفاده در O₂N (ساده‌ترین)
- و برای publisherهای verified: امکان payout پولی (بعداً)

---

## ۷) امنیت و ضدتقلب

### ۷.۱) Idempotency
برای جلوگیری از دوبار شارژ شدن:
- هر execution یک `idempotency_key` دارد
- ledger فقط یکبار settle می‌شود

### ۷.۲) Signed Usage Events
eventها توسط runtime امضا می‌شوند تا publisher نتواند fake usage بسازد.

### ۷.۳) Cost Caps
pluginها نمی‌توانند “بی‌نهایت” هزینه ایجاد کنند:
- per-call max credits
- per-minute rate limit
- kill switch

---

## ۸) API سطح بالا (خلاصه)

جزئیات کامل در `04_API/02-billing-and-marketplace-api.md`.

---

> **خلاصه:** اقتصاد O₂N یک ledger شفاف و قابل حسابرسی است که هزینه مدل + ابزار + پلاگین را به credits داخلی تبدیل می‌کند، مصرف را کنترل می‌کند، و به سازندگان plugin امکان درآمد می‌دهد.

