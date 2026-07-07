# Workflow Engine — Open on4net

> **فایل:** 02_ARCHITECTURE/05-workflow-engine.md
> **نسخه:** 1.0

---

## ۱. چیستی Workflow Engine

Workflow Engine به Agentها اجازه می‌دهد کارهای چندمرحله‌ای را orchestrate کنند. هر Workflow یک DAG (Directed Acyclic Graph) از steps است که می‌توانند به صورت ترتیبی، موازی یا شرطی اجرا شوند.

---

## ۲. معماری Workflow Engine

```
                    ┌──────────────────────────────────────┐
                    │          WORKFLOW ENGINE              │
                    ├──────────────────────────────────────┤
                    │                                      │
                    │  ┌──────────────────────────────┐   │
                    │  │  Visual Builder (UI)         │   │
                    │  │  Drag & Drop · Template Lib   │   │
                    │  └──────────┬───────────────────┘   │
                    │             │                        │
                    │  ┌──────────▼───────────────────┐   │
                    │  │  Workflow Parser              │   │
                    │  │  YAML → DAG · Validation      │   │
                    │  └──────────┬───────────────────┘   │
                    │             │                        │
                    │  ┌──────────▼───────────────────┐   │
                    │  │  State Machine                │   │
                    │  │  pending → running → ...      │   │
                    │  └──────────┬───────────────────┘   │
                    │             │                        │
                    │  ┌──────────▼───────────────────┐   │
                    │  │  Step Executor                │   │
                    │  │  Sequential · Parallel · Cond │   │
                    │  └──────────┬───────────────────┘   │
                    │             │                        │
                    │  ┌──────────▼───────────────────┐   │
                    │  │  Retry & Error Handler        │   │
                    │  └──────────────────────────────┘   │
                    │                                      │
                    └──────────────────────────────────────┘
```

---

## ۳. فرمت Workflow (YAML)

```yaml
id: "wf-campaign-approval"
name: "کمپین تأیید و انتشار"
version: "2.0.0"
description: "بررسی، تأیید و انتشار کمپین بازاریابی"
created_by: "marketing-01"
created_at: "2026-07-01"
executions: 45
avg_duration: "12m 34s"

triggers:
  - type: "manual"        # دستی توسط کاربر
  - type: "event"         # رویداد: کمپین جدید ساخته شد
    event: "campaign.created"
  - type: "scheduled"     # زمان‌بندی شده
    schedule: "0 9 * * 1"

steps:
  - id: "validate-content"
    name: "بررسی محتوا"
    type: "agent"                   # اجرا توسط یک Agent
    agent_role: "legal"             # Legal Agent محتوا را بررسی کند
    input:
      campaign_id: "$trigger.campaign_id"
      check_rules: ["copyright", "claims", "compliance"]
    timeout_ms: 300000              # 5 دقیقه
    on_success: "next"
    on_failure: "notify-creator"

  - id: "human-approval"
    name: "تأیید انسانی"
    type: "human"                   # نیاز به تأیید انسان
    assignee_role: "marketing_manager"
    input:
      campaign_summary: "$steps.validate-content.result"
    timeout_ms: 86400000            # 24 ساعت
    on_approve: "parallel-publish"
    on_reject: "notify-creator"
    on_timeout: "escalate-to-ceo"

  - id: "parallel-publish"
    name: "انتشار همزمان"
    type: "parallel"
    steps:
      - id: "publish-email"
        name: "ایمیل به ۵۰۰۰ مشتری"
        type: "tool"
        tool: "email-sender"
        params:
          campaign_id: "$trigger.campaign_id"
          segment: "all_active"
        timeout_ms: 600000

      - id: "publish-instagram"
        name: "پست اینستاگرام"
        type: "agent"
        agent_role: "publisher"
        input:
          platform: "instagram"
          campaign_id: "$trigger.campaign_id"
        timeout_ms: 300000

      - id: "publish-telegram"
        name: "کانال تلگرام"
        type: "tool"
        tool: "telegram-bot"
        params:
          channel: "@on4net"
          campaign_id: "$trigger.campaign_id"
        timeout_ms: 120000

  - id: "notify-creator"
    name: "اطلاع به سازنده"
    type: "notification"
    notification_type: "in_app"
    message: "کمپین نیاز به ویرایش دارد"
    targets: ["$trigger.created_by"]

  - id: "escalate-to-ceo"
    name: "ارجاع به CEO"
    type: "agent"
    agent_role: "ceo"
    input:
      campaign_id: "$trigger.campaign_id"
      reason: "تأیید انسانی پس از ۲۴ ساعت انجام نشد"
    priority: "critical"

conditions:
  - step: "validate-content"
    on_result:
      - if: "result.status == 'approved'"
        then: "human-approval"
      - if: "result.status == 'rejected'"
        then: "notify-creator"
      - if: "result.status == 'needs_revision'"
        then: "notify-creator"
        params:
          revision_notes: "$result.notes"
```

---

## ۴. State Machine

### وضعیت‌های یک Workflow:

```
                    ┌──────────┐
                    │ PENDING  │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │ RUNNING   │
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
         │ PAUSED │ │SUCCESS │ │ FAILED │
         │(Human  │ │        │ │        │
         │ Wait)  │ └────────┘ └────────┘
         └────┬───┘
              │
         ┌────▼─────┐
         │ RESUMED   │
         │ → RUNNING │
         └──────────┘
```

### وضعیت‌های یک Step:

```yaml
states:
  - pending:     "در صف انتظار"
  - running:     "در حال اجرا"
  - completed:   "موفق"
  - failed:      "ناموفق"
  - skipped:     "رد شدن (شرط برقرار نبود)"
  - waiting:     "منتظر تأیید انسانی"
  - retrying:    "تلاش مجدد"
  - timed_out:   "مهلت تمام شده"
```

---

## ۵. انواع Step

### ۵.۱ Agent Step
اجرا توسط یک Agent مشخص
```yaml
- id: "step-1"
  type: "agent"
  agent_role: "legal"
  input:
    document: "contract_v3.pdf"
  output: "approval_status"
  timeout_ms: 300000
```

### ۵.۲ Tool Step
اجرای یک Tool یا API
```yaml
- id: "step-2"
  type: "tool"
  tool: "email-sender"
  params:
    to: "customer@example.com"
    subject: "خوش آمدید"
    template: "welcome-email-v2"
```

### ۵.۳ Human Step
نیاز به تأیید انسانی
```yaml
- id: "step-3"
  type: "human"
  assignee_role: "manager"
  input:
    summary: "قرارداد به ارزش $۵۰,۰۰۰ نیاز به تأیید دارد"
  timeout_ms: 86400000
  on_approve: "step-4"
  on_reject: "step-5"
```

### ۵.４ Parallel Step
اجرای همزمان چند Step
```yaml
- id: "step-4"
  type: "parallel"
  steps:
    - id: "parallel-1"
      type: "agent"
      agent_role: "designer"
    - id: "parallel-2"
      type: "agent"
      agent_role: "copywriter"
  wait_for: "all"         # all | any | custom
```

### ۵.۵ Condition Step
شاخه‌بندی شرطی
```yaml
- id: "step-5"
  type: "condition"
  conditions:
    - if: "$result.amount > 10000"
      then: "approval-needed"
    - if: "$result.amount <= 10000"
      then: "auto-approve"
    - else: "error-handler"
```

### ۵.۶ Loop Step
تکرار
```yaml
- id: "step-6"
  type: "loop"
  for_each: "$result.items"
  as: "item"
  steps:
    - id: "process-item"
      type: "tool"
      tool: "crm-update"
      params:
        item_id: "$item.id"
```

### ۵.۷ Notification Step
ارسال اعلان
```yaml
- id: "step-7"
  type: "notification"
  notification_type: "in_app"    # in_app | email | sms | telegram
  message: "کمپین با موفقیت منتشر شد"
  targets: ["marketing-01", "user:soroush"]
```

---

## ۶. Workflow Template Library

### Templates آماده:

| نام | توضیح | steps | مدت تخمینی |
|-----|-------|-------|-----------|
| **کمپین بازاریابی** | طراحی + تأیید + انتشار | ۸ | ۲ ساعت |
| **استخدام کارمند** | بررسی رزومه + مصاحبه + پیشنهاد | ۱۲ | ۳ روز |
| **تولید محتوا** | تحقیق + نوشتن + ویرایش + انتشار | ۶ | ۴ ساعت |
| **مدیریت پروژه** | برنامه‌ریزی + اجرا + گزارش | ۱۰ | متغیر |
| **پشتیبانی تیکت** | دریافت + دسته‌بندی + پاسخ + پیگیری | ۵ | ۳۰ دقیقه |
| **گزارش هفتگی** | جمع‌آوری داده + تحلیل + ارسال | ۴ | ۱۰ دقیقه |
| **قرارداد فروش** | پیشنهاد + مذاکره + تأیید + امضا | ۷ | ۲ روز |

### Example Template Usage:
```yaml
# کاربر یک "کمپین بازاریابی" را از template library انتخاب می‌کند
use_template: "marketing-campaign"
params:
  campaign_name: "تخفیف تابستونه"
  budget: 5000
  channels: ["email", "instagram", "telegram"]
  deadline: "2026-07-15"

# Workflow Engine template را باز کرده و اجرا می‌کند
```

---

## ۷. Error Handling & Retry

```yaml
global_error_policy:
  retry:
    max_retries: 3
    backoff: "exponential"
    initial_delay_ms: 5000
    multiplier: 3
    max_delay_ms: 60000
    
  on_exhausted:
    action: "fail_step"
    
  on_step_failure:
    - if: "step.type == 'agent'"
      action: "escalate_to_manager"
    - if: "step.type == 'tool'"
      action: "notify_admin"
    - if: "step.type == 'human'"
      action: "wait_and_retry"
```

---

## ۸. Performance & Limits

| شاخص | مقدار هدف |
|------|-----------|
| شروع Workflow | < ۵۰ms |
| هر Step | < ۱۰۰ms overhead |
| Workflow همزمان | ۱۰۰۰+ |
| Step در هر Workflow | ≤ ۱۰۰ |
| Workflow طولانی | تا ۳۰ روز |
| State تغییرات | < ۵ms |

---

## ۹. Visual Workflow Builder

```
┌──────────────────────────────────────────────────┐
│  Workflow: کمپین بازاریابی                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ بررسی    │───▶│ تأیید    │───▶│ انتشار   │  │
│  │ محتوا    │    │ انسانی   │    │ همزمان   │  │
│  └──────────┘    └──────────┘    └──────────┘  │
│       │                              │          │
│       ▼                              ▼          │
│  ┌──────────┐                 ┌──────────┐     │
│  │ اطلاع به │                 │ ایمیل    │     │
│  │ سازنده   │                 ├──────────┤     │
│  └──────────┘                 │ اینستا   │     │
│                               ├──────────┤     │
│                               │ تلگرام   │     │
│                               └──────────┘     │
│                                                  │
│  [+ Add Step]  [Save]  [Run]  [History]         │
└──────────────────────────────────────────────────┘
```

---

> **خلاصه:** Workflow Engine O₂N یک موتور قدرتمند DAG-based است که انواع stepها (Agent, Tool, Human, Parallel, Condition, Loop) را پشتیبانی می‌کند. با Template Library شروع به کار سریع است و Visual Builder برای کاربران غیرفنی طراحی شده.
