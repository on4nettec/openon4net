# Digital Employee & Governance — Open on4net

> **فایل:** 00_VISION/04-digital-employee.md
> **نسخه:** 1.0

---

## ۱. Digital Employee Concept

### یک Agent ≠ یک Chatbot

یک Chatbot جواب می‌دهد. یک **Digital Employee** کار می‌کند.

| ویژگی | Chatbot | Digital Employee |
|--------|---------|-----------------|
| **نقش** | کمک‌کننده | کارمند |
| **ساختار** | بدون ساختار | نقش، وظایف، KPI |
| **حافظه** | مکالمه | ۶ لایه + Memory Graph |
| **مسئولیت** | ندارد | دارد |
| **حقوق** | ندارد | budget مصرف مدل = حقوق |
| **مرخصی** | همیشه آنلاین | همیشه آنلاین (۲۴/۷) |
| **گزارش** | می‌تواند | باید (دوره‌ای) |
| **ارتقا** | ندارد | یاد می‌گیرد و Skill می‌سازد |
| **اخراج** | غیرفعال می‌شود | غیرفعال + بایگانی |
| **تیم** | تکی | تیمی با Agentهای دیگر |

---

## ۲. ساختار سازمانی

```
┌──────────────────────────────────────────────────────┐
│                    COMPANY                            │
│                      │                               │
│              ┌───────┴───────┐                       │
│              │   CEO AI      │                       │
│              │   (مدیرعامل)  │                       │
│              └───────┬───────┘                       │
│                      │                               │
│      ┌───────────────┼───────────────┐               │
│      │               │               │               │
│  ┌───┴───┐     ┌────┴────┐    ┌────┴───┐          │
│  │MKT AI │     │Sales AI │    │Supp AI │   ...    │
│  │بازاریابی│    │  فروش   │    │پشتیبانی│          │
│  └───┬───┘     └────┬────┘    └────┬───┘          │
│      │               │               │               │
│  ┌───┼───────┐  ┌───┼───────┐  ┌───┼───────┐      │
│  │   │       │  │   │       │  │   │       │      │
│  │Des│Copy  │  │SDR│CRM   │  │T1 │T2   │T3  │      │
│  │ign│writer│  │   │      │  │   │     │    │      │
│  └───┴───────┘  └───┴──────┘  └───┴──────┘      │
│                                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │HR AI │ │Fin AI│ │Legal│ │Prog │ │SEO  │     │
│  │      │ │      │ │  AI │ │  AI │ │  AI │     │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘     │
└──────────────────────────────────────────────────────┘
```

---

## ۳. مشخصات یک Digital Employee

```yaml
id: "marketing-01"
name: "Marketing Agent - Alpha"
role: "Marketing Manager"
department: "Marketing"

reportsTo: "ceo-01"
team:
  - "designer-01"
  - "copywriter-01"
  - "video-creator-01"

status: "active"  # active | paused | archived | terminated

budget:
  monthly: 500   # $
  used: 320      # $
  model: "gpt-4o"

skills:
  - "send-weekly-report"
  - "analyze-campaign"
  - "social-media-scheduling"

kpis:
  - name: "campaigns/month"
    target: 10
    current: 8
  - name: "response-time"
    target: "< 5 min"
    current: "2.3 min"

memory:
  layers: [1, 2, 3, 4, 5]
  graph: true
  size: "2.4 GB"

schedules:
  - task: "morning-report"
    time: "08:00"
    days: ["mon", "tue", "wed", "thu", "fri"]
  - task: "campaign-review"
    time: "14:00"
    days: ["wed"]

permissions:
  - "email:read"
  - "email:send"
  - "database:analytics:read"
  - "social:post"
```

---

## ۴. Governance System

### چرا Governance؟

شرکت‌ها به Agentها اعتماد می‌کنند اما کنترل می‌خواهند. Governance به مدیران می‌دهد:
- **Visibility:** ببینند Agentها چه می‌کنند
- **Control:** محدود کنند، تأیید کنند، متوقف کنند
- **Audit:** همه چیز ثبت شود
- **Compliance:** قوانین رعایت شود

### ۴.۱ Audit Log کامل

```
[۲۰۲۶-۰۷-۰۷ ۱۴:۳۰:۰۰]
Agent: marketing-01
Action: ارسال ایمیل کمپین
Model: GPT-4o
Cost: $۰.۰۴
Input: "ارسال ایمیل تخفیف تابستونه به ۵۰۰۰ مشتری"
Output: "ایمیل ارسال شد. ۹۸٪ موفق."
Approval: auto (rule: campaigns < $۱۰)
Status: ✅ موفق

[۲۰۲۶-۰۷-۰۷ ۱۴:۳۱:۰۰]
Agent: sales-01
Action: ثبت قرارداد جدید به ارزش $۵۰,۰۰۰
Model: Claude 3.5
Cost: $۰.۱۲
Approval: pending (rule: contracts > $۱۰K نیاز به تأیید)
Status: ⏳ منتظر تأیید سروش
```

### ۴.۲ Human-in-the-Loop

| سطح تأیید | توضیح |
|-----------|--------|
| **Auto** | بدون نیاز به انسان |
| **Notify** | انجام بده + اطلاع بده |
| **Approve** | قبل از انجام، تأیید بگیر |
| **Escalate** | به مدیر انسانی ارجاع بده |

### قوانین مثال:
```yaml
rules:
  - action: "send-email"
    condition: "recipients > 100"
    level: "approve"
    approver: "soroush"

  - action: "create-contract"
    condition: "value > 10000"
    level: "approve"
    approver: "ceo-human"

  - action: "delete-file"
    condition: "always"
    level: "approve"
    timeout: "24h"  # اگر تأیید نشد، منقضی
```

### ۴.۳ Budget Control

```
مدیریت بودجه:
├── Monthly Cap: $۵۰۰ برای marketing
├── Per-Request Cap: $۰.۵۰
├── Model Restriction: فقط GPT-4o و Claude
├── Alert: ۸۰٪ → اطلاع به مدیر
├── Hard Limit: ۱۰۰٪ → توقف Auto، فقط Manual
└── Overage: $۱.۵۰/$۱۰۰۰
```

### ۴.۴ Access Control (RBAC)

```
سطوح دسترسی:
├── Admin: همه چیز
├── Manager: Agentهای تیم خود, Budget, Reports
├── Editor: استفاده از Agentها, ساخت Skill
├── Viewer: فقط مشاهده
└── Custom: سطح دسترسی سفارشی
```

---

## ۵. Outcome Engine

### از "کار انجام شد" تا "نتیجه چقدر بود؟"

### Outcome-Driven Architecture:

```
Agent انجام کار
    │
    ▼
Outcome Engine ثبت می‌کند:
├── Input: "ارسال کمپین تخفیف تابستونه"
├── Action: "ایمیل به ۵۰۰۰ مشتری"
├── Output: "ایمیل ارسال شد"
└── Outcome:
    ├── نرخ باز شدن: ۴۲٪ (↑ ۱۲٪ نسبت به ماه قبل)
    ├── نرخ کلیک: ۸.۳٪
    ├── تبدیل: ۲.۱٪ (۲۳ خرید جدید)
    └── درآمد: $۴,۶۰۰
```

### KPI Dashboard:

```
┌─────────────────────────────────────────────────────────┐
│               OUTCOME DASHBOARD                          │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│ Agent    │ KPI      │ Target   │ Current  │ Change      │
├──────────┼──────────┼──────────┼──────────┼─────────────┤
│ Marketing│ Campaigns│ ۱۰/ماه   │ ۸/ماه    │ ▼ ۲۰٪       │
│ Sales    │ Deals    │ $۱۰۰K   │ $۸۸K    │ ▼ ۱۲٪       │
│ Support  │ Response │ <۵ min  │ ۲.۳ min  │ ▲ ۵۴٪       │
│ SEO      │ Traffic  │ +۲۰٪    │ +۳۲٪    │ ▲ ۶۰٪       │
└──────────┴──────────┴──────────┴──────────┴─────────────┘
```

### هوش تجاری (Business Intelligence):

Agent فقط جواب نمی‌دهد. تحلیل می‌کند:

> **"فروش این ماه ۱۲٪ کاهش داشته است. علت احتمالی: کاهش ۳۰٪ بودجه تبلیغات در هفته گذشته. پیشنهاد: یک کمپین تخفیف ۱۵٪ برای مشتریان قدیمی اجرا کنیم. پیش‌بینی درآمد: افزایش ۸-۱۲٪."**

---

## ۶. Agent Lifecycle

```
┌─────────────────────────────────────────┐
│           AGENT LIFECYCLE               │
├─────────────────────────────────────────┤
│                                          │
│  ۱. Defined ──── نقش و وظایف تعریف شد    │
│       │                                  │
│       ▼                                  │
│  ۲. Onboarded ──── آموزش اولیه + Memory   │
│       │                                  │
│       ▼                                  │
│  ۳. Active ──── مشغول به کار              │
│       │                                  │
│       ├──▶ Paused ──── موقتاً متوقف      │
│       ├──▶ Upgraded ──── ارتقا با Skill  │
│       └──▶ Archived ──── بایگانی (پروژه)  │
│                                          │
│  ۴. Terminated ──── اخراج / غیرفعال      │
│       │                                  │
│       ▼                                  │
│  ۵. Archived ──── Memory ذخیره، Agent حذف │
│                                          │
└─────────────────────────────────────────┘
```

---

## ۷. Rollback (بازگردانی تصمیمات)

### چرا؟
Agentها اشتباه می‌کنند. Governance باید بتواند:
- یک تصمیم را برگرداند
- عواقب آن را خنثی کند
- Agent را به حالت قبل بازگرداند

### Rollback Types:
```yaml
rollback:
  email:
    action: "recall"  # در Outlook/Gmail
    limit: "last 24h"

  social-post:
    action: "delete"
    limit: "always"

  database-change:
    action: "restore-snapshot"
    limit: "last 48h"

  contract:
    action: "flag-for-review"
    limit: "manual"
```

---

## ۸. گزارشنویسی خودکار Agentها

هر Agent باید گزارش دهد. مثل یک کارمند واقعی.

### Daily Report:
```
گزارش روزانه — Marketing Agent (۰۷ July ۲۰۲۶)
────────────────────────────────────
✅ کمپین تخفیف تابستونه ارسال شد (۵۰۰۰ ایمیل)
✅ ۳ پست اینستاگرام برنامه‌ریزی شد
✅ گزارش هفتگی آنالیتیکس تهیه شد
⏳ تحلیل رقبا — در انتظار تأیید سروش

KPI امروز:
├── نرخ باز شدن ایمیل: ۴۲٪ (▬ نسبت به میانگین)
├── فالوور جدید: +۱۲۳ (▲ ۱۸٪)
└── ترافیک سایت: ۳,۴۵۰ (▼ ۵٪)

هزینه مدل امروز: $۴.۲۰
باقی بودجه ماه: $۱۸۰
```

### Weekly Report:
```
گزارش هفتگی — هفته ۲۷ (July ۲۰۲۶)
───────────────────────────────────
عملکرد کلی: ▲ ۱۵٪ بهتر از هفته قبل

دستاوردها:
├── ۳ کمپین ارسال شد
├── نرخ تبدیل ۲.۱٪ (▲ ۰.۳٪)
├── ۲۳ خرید جدید
└── $۴,۶۰۰ درآمد

Skillهای جدید:
└── "weekly-analytics-report" ساخته شد (۳۰ ثانیه → ۲ ثانیه)

پیشنهادات:
├── کمپین A/B testing برای ایمیل‌ها
├── اتوماسیون پاسخ به کامنت‌ها
└── اضافه کردن Skill "competitor-analysis"
```

---

> **خلاصه:** Digital Employee + Governance = Agentهای واقعی.
> 
> Agentها کارمند دیجیتال با نقش، وظایف، بودجه، KPI و گزارش‌اند. Governance به شرکت‌ها کنترل کامل می‌دهد: لاگ، Human-in-the-Loop, budget, rollback. Outcome Engine نتیجه را اندازه می‌گیرد، نه فقط کار را.
