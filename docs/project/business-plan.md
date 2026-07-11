# Business Plan (Investor Version) — Open on4net (O₂N)

> نسخه: 0.3 (Draft)  
> تاریخ: July 2026  
> هدف: نسخه‌ی مناسب ارائه به سرمایه‌گذار (مقایسه رقبا + اندازه بازار + مدل مالی/فرضیات)

---

## 0) Executive Summary (یک صفحه‌ای)

### فرصت

AI از «تولید متن» به «انجام کار» مهاجرت کرده است. سازمان‌ها برای استفاده عملی از Agentها سه نیاز غیرقابل‌چشم‌پوشی دارند:

1. **Governance** (Approval/Budget/Audit/Policy)
2. **Self-host و کنترل داده** (برای صنایع حساس و تیم‌های امنیت‌محور)
3. **یکپارچگی با سیستم‌های واقعی** (Connectors/Tools/Workflows)

### راه‌حل

Open on4net یک «AI Operating System سازمانی» است که Agentها را با **Tools/Connectors + Workflows + Governance** یکپارچه می‌کند و در عین حال **Runtime را self-hosted و رایگان** ارائه می‌دهد.

### مدل کسب‌وکار

- **Free self-hosted Runtime (Plane 1):** موتور توزیع و جذب (Developer-led)
- **Managed/Enterprise add-ons:** Control Plane / Marketplace / (Later) Memory + پشتیبانی سازمانی
- **Marketplace take-rate (Later):** سهم از فروش پلاگین‌ها و خدمات

### مزیت رقابتی

Governance-first + self-hosted واقعی + معماری 4-Plane (مسیر رشد از MVP تا Enterprise بدون بازنویسی).

### North Star Metric (NSM)

«تعداد اکشن‌های ارزشمندِ انجام‌شده توسط Agentها در هفته» با policy/approval درست و error rate پایین.

---

## 1) Why Now (چرا الان)

- LLMها commodity شده‌اند؛ مزیت رقابتی به سمت **integration + governance + distribution** حرکت می‌کند.
- سازمان‌ها با ریسک‌های امنیتی/هزینه‌ای مواجه‌اند و به «کنترل‌پذیری» نیاز دارند، نه فقط کیفیت پاسخ.
- تقاضا برای self-host / private deployment در حال افزایش است (به‌خصوص برای داده‌های حساس).

> یادداشت: برای نسخه‌ی نهایی سرمایه‌گذار، این بخش باید با ۳–۵ آمار قابل استناد (با citation) تقویت شود.

---

## 2) Market Sizing (TAM/SAM/SOM) — با روش محاسبه

### 2.1) تعریف بازار

بازار هدف: پلتفرم‌های «Agentic Automation / AI Ops for Teams» که شامل:

- ابزارهای AI برای تیم‌ها (Ops/Sales/Support/Marketing)
- پلتفرم‌های workflow+agent
- لایه governance و compliance برای اکشن‌های هوشمند

### 2.2) روش ۱: Top-down (Placeholder)

- TAM = کل هزینه جهانی نرم‌افزارهای اتوماسیون/AI برای سازمان‌ها
- SAM = سهم بخش‌هایی که self-host/enterprise governance می‌خواهند
- SOM = سهم قابل‌دستیابی با GTM فعلی در 24–36 ماه

### 2.3) روش ۲: Bottom-up (قابل دفاع‌تر برای سرمایه‌گذار)

فرمول نمونه:

```
SOM (24mo) = (#Customers) × (ARPA) × (Retention-adjusted)

#Customers = (Leads) × (Activation) × (Conversion to paid)
Leads = (OSS installs + inbound + outbound)
ARPA = mix(Team plan, Enterprise contracts, Support)
```

> این نسخه intentionally عدد قطعی نمی‌دهد تا ادعای بدون منبع ساخته نشود. در فاز بعد، با داده‌های واقعی/منابع معتبر پر می‌شود.

---

## 3) Customer Segments (ICP) + Use Cases + Pay Drivers

### ICP-1 — SMB/Startup (Developer-led)

Use caseهای سریع:

- Support: triage + پاسخ + ساخت ticket با approval
- Sales: تحقیق مشتری + ایمیل/CRM update با approval
  Pay driver: زمان ذخیره‌شده تیم + کاهش هزینه ابزارهای پراکنده.

### ICP-2 — Enterprise / Security-led

Use caseهای کلیدی:

- Workflows حساس (مالی/حقوقی/داده مشتری) با audit evidence
- استقرار private/VPC/on-prem
  Pay driver: کاهش ریسک + compliance + governance و کنترل اکشن‌ها.

---

## 4) Competitive Analysis (رفتار مقایسه‌ای)

### 4.1) دسته‌بندی رقبا

1. **Chat/Assistant tools** (پذیرش بالا، governance پایین)
2. **Agent frameworks** (انعطاف فنی، اما نیاز به تیم نگهداری و governance ناقص)
3. **Workflow/RPA** (کنترل خوب، اما هوشمندی و انعطاف کمتر)
4. **Enterprise AI platforms** (قوی اما معمولاً گران/قفل‌شدگی/کم self-host)

### 4.2) ماتریس مقایسه‌ای (Feature/Position)

| معیار                                         | O₂N | Chat tools | Agent frameworks | RPA/Workflow | Enterprise AI |
| --------------------------------------------- | --- | ---------- | ---------------- | ------------ | ------------- |
| Self-hosted runtime                           | ✅  | ⚠️/❌      | ✅               | ✅           | ⚠️            |
| Governance-first (approval/budget/audit)      | ✅  | ❌         | ⚠️               | ✅           | ✅            |
| Plugin/Connector permission model             | ✅  | ⚠️         | ⚠️               | ⚠️           | ✅            |
| مسیر Marketplace                              | ✅  | ❌         | ❌               | ⚠️           | ✅            |
| Plane-based separation (managed vs self-host) | ✅  | ❌         | ❌               | ❌           | ⚠️            |

> نکته: جدول بالا «مقایسه‌ی دسته‌ای» است. برای نسخه‌ی نهایی، باید 5–8 رقیب مشخص نام‌برده شوند و جدول به آن‌ها نگاشت شود.

### 4.3) Moat (مزیت پایدار)

- **Distribution moat**: Runtime رایگان self-hosted → نصب زیاد → inbound enterprise
- **Governance moat**: policy/approval/audit به‌عنوان core (سخت‌تر از UI/LLM swap)
- **Ecosystem moat**: marketplace + permission model → شبکه توسعه‌دهنده/پلاگین

---

## 5) Product & Packaging (چه چیزی را می‌فروشیم)

### 5.1) محصول رایگان (Free)

- Plane 1 Runtime self-hosted (gateway + dashboard)
- Governance پایه (approval/budget/audit) + RBAC

### 5.2) محصول پولی (Paid)

> نمونه بسته‌بندی (Illustrative):

| پلن        | مخاطب   | ارزش                       | قیمت‌گذاری (نمونه) |
| ---------- | ------- | -------------------------- | ------------------ |
| Team       | SMB     | مدیریت تیمی + پشتیبانی سبک | $99–$499 / ماه     |
| Enterprise | سازمانی | SSO/policies/SLA/support   | $30k–$200k / سال   |

### 5.3) درآمدهای جانبی

- Professional services (راه‌اندازی، connector سفارشی، migration)
- Marketplace take-rate (Later)

---

## 6) Go-To-Market (GTM) + Funnel

### 6.1) Motion A — OSS/Developer-led (Top of funnel)

کانال‌ها:

- GitHub + Docker quickstart + docs
- نمونه‌های آماده use-case محور (support/sales)
- محتوا و SEO

### 6.2) Motion B — Enterprise/Security-led (Mid/Bottom funnel)

- چک‌لیست امنیتی + runbook استقرار
- demo استاندارد: اکشن حساس → approval → audit evidence
- PoC کوتاه 2–4 هفته‌ای

### 6.3) KPIهای Funnel (برای جذب سرمایه‌گذار)

این KPIها باید ماه‌به‌ماه گزارش شوند:

- OSS installs / active deployments
- Activation rate (نصب → اولین Agent/Workflow)
- Conversion to paid (Team/Enterprise)
- Retention (WAU/MAU) و expansion revenue

---

## 7) Financial Model (مدل مالی) — سناریوی فرضی قابل دفاع

> **مهم:** اعداد زیر «مثال فرضی» هستند تا ساختار مدل مشخص باشد؛ برای نسخه‌ی سرمایه‌گذار باید با داده واقعی جایگزین شوند.

### 7.1) فرضیات نمونه (24 ماه)

- OSS installs: 5,000
- Activation: 15% → 750 active deployments
- Paid conversion: 3% از active → 22 مشتری پولی
- Mix: 18 Team + 4 Enterprise
- ARPA: Team $200/mo، Enterprise $7,500/mo (معادل سالانه $90k)

### 7.2) خروجی نمونه (Run-rate)

- MRR Team ≈ 18 × $200 = $3,600
- MRR Enterprise ≈ 4 × $7,500 = $30,000
- **Total MRR ≈ $33,600 (ARR ≈ $403k)**

### 7.3) Unit economics (قابل اندازه‌گیری)

- CAC (Team/Enterprise جدا)
- Payback period
- Gross margin (با لحاظ LLM cost + infra)
- NRR/GRR

---

## 8) Metrics & Benchmarks (آمار لازم برای جذب سرمایه‌گذار)

این بخش باید با **منابع معتبر و citation** تکمیل شود. ساختار پیشنهادی:

### 8.1) Market benchmarks (برای Story)

- رشد هزینه‌های AI در سازمان‌ها (روند 3–5 ساله)
- سهم استقرارهای private/VPC/on-prem در صنایع حساس

### 8.2) OSS SaaS benchmarks (برای Funnel)

- نسبت install → active (با تعریف دقیق)
- نسبت active → paid در مدل OSS-to-SaaS

### 8.3) Sales benchmarks (برای Enterprise)

- طول چرخه فروش (PoC → قرارداد)
- نرخ تبدیل PoC به قرارداد

> اگر خواستی، من همین بخش را با قالب «[عدد] + [منبع] + [توضیح]» آماده می‌کنم تا فقط اعداد/منابع را وارد کنی.

---

## 9) Funding Ask (درخواست سرمایه) + Use of Funds

> این بخش هم باید با تصمیم شما پر شود.

### 9.1) هدف سرمایه

- رسیدن به Production-ready Runtime (auth واقعی + KMS provider + hardening)
- آماده‌سازی funnel (docs/demo/telemetry) برای conversion
- چند PoC enterprise و 1–2 قرارداد سالانه

### 9.2) استفاده از سرمایه (نمونه)

- 45% Engineering (security/auth/kms/connectors)
- 25% Product/UX + docs + onboarding
- 20% GTM (content, outbound, partnerships)
- 10% Ops/Legal/Compliance

---

## 10) Risks & Mitigations

- پیچیدگی self-host (SSO/Vault/SMTP): provider-based + defaults ساده + runbook
- امنیت auth/secrets: hard guards + audit + KMS strategy
- تمرکز روی planes later: guardrail و milestoneهای روشن (MVP اول)

---

## 11) Milestones (High-level)

### MVP → Production-ready (پیشنهادی)

- auth واقعی per-user + سیاست‌های امنیتی لازم
- secrets/kms provider-based + مسیر rotation/migration
- demo استاندارد end-to-end (approval + audit evidence)

### Later

- Memory managed (vector/graph) بر اساس نیاز واقعی
- Public marketplace + verified publishers + payout
