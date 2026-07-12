# Skill Engine & Plugin SDK — Open on4net

> **فایل:** 02_ARCHITECTURE/03-skill-engine.md
> **نسخه:** 1.0

> **وضعیت پیاده‌سازی (2026-07-12):** §۲/§۳/§۴/§۷ (چرخه عمر Skill، معماری،
> فرمت، Auto-Skill Detection) در `apps/openon4net-runtime` پیاده‌سازی شد
> (RT-032, RT-033) با چند محدودسازی عمدی v1:
>
> - فقط `steps[].type: 'tool'` پشتیبانی می‌شود (`query`/`prompt` step types
>   — دسترسی مستقیم DB / فراخوانی LLM — نیاز به بررسی امنیتی جدا دارند،
>   موکول به بعد).
> - فقط `trigger.type: 'manual'` (اجرای صریح از طریق API) — `scheduled`/`event`
>   موکول به بعد.
> - Auto-detection فقط ۲ شرط (Frequency + Similarity) را چک می‌کند، نه ۴
>   شرط سند — `audit_logs` (تنها سیگنال موجود) فیلد duration ندارد، و
>   "complexity/generality" هیچ سیگنال قابل‌اتکایی ندارد.
> - §۵/§۶/§۸ (Plugin SDK، مدل اقتصادی، WASM Sandbox) هنوز پیاده‌سازی نشده —
>   عمداً به یک session بعدی موکول شد، جزئیات:
>   `docs/spect/06_MEETINGS/02-skills-plugins-marketplace-model.md`.
>
> جزئیات کامل تست‌شده/نشده: `docs/spect/DONE.md`.

---

## ۱. Skill Engine چیست؟

وقتی یک Agent کاری را ۱۰ بار انجام می‌دهد، باید پیشنهاد دهد:

> **"این کار را ۱۰ بار انجام دادم. می‌خواهی به عنوان یک Skill ذخیره شود؟ دفعه بعد در ۲ ثانیه انجامش می‌دهم."**

Skill Engine مغز یادگیری O₂N است. Agentها از تجربه یاد می‌گیرند و مهارت می‌سازند.

---

## ۲. چرخه عمر یک Skill (Skill Lifecycle)

```
┌─────────────────────────────────────────────────────────┐
│                   SKILL LIFECYCLE                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ۱. Detection ──── Agent کاری را تکرار می‌کند            │
│       │                                                  │
│       ▼                                                  │
│  ۲. Proposal ──── Agent پیشنهاد Skill می‌دهد             │
│       │                                                  │
│       ▼                                                  │
│  ۳. Review ──── کاربر یا CEO Agent تأیید می‌کند           │
│       │                                                  │
│       ▼                                                  │
│  ۴. Training ──── Agent مراحل را مستند می‌کند             │
│       │                                                  │
│       ▼                                                  │
│  ۵. Activation ──── Skill فعال و قابل استفاده            │
│       │                                                  │
│       ▼                                                  │
│  ۶. Improvement ──── Agent Skill را بهینه می‌کند          │
│       │                                                  │
│       ▼                                                  │
│  ۷. Sharing ──── می‌تواند در Marketplace منتشر شود       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## ۲.۱) مالکیت، ارتقا و دسترسی (MVP)

قواعد محصول:

- **کاربر می‌تواند Skill جدید بسازد** (manual) یا Skillهای موجود را **ارتقا/بهبود** دهد (version bump / fork).
- Agentها فقط می‌توانند از Skillهایی استفاده کنند که:
  1. در سازمان/Workspace موجود است
  2. ادمین به آن Agent **اجازه دسترسی** داده است (grant)
- Auto-skill detection می‌تواند «proposal» بسازد، اما **فعال‌سازی نهایی** باید تحت کنترل کاربر/ادمین باشد (review/approve).

مدل پیشنهادی:

- `Skill` به‌عنوان artifact سازمانی (قابل اشتراک/نسخه‌بندی)
- `SkillGrant` برای اتصال Skill به Agent (قابل audit و قابل revoke)
- `SkillProposal` برای پیشنهادهای سیستم/Agent (نیازمند approval)

## ۳. معماری Skill Engine

```
┌─────────────────────────────────────────────────────────┐
│                    SKILL ENGINE                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │ Pattern Detector │  │  Skill Registry             │   │
│  │ - تکرار کارها   │  │  - ثبت Skill                │   │
│  │ - الگوهای مشترک │  │  - ورژن‌بندی                │   │
│  │ - time-based     │  │  - dependency management    │   │
│  └─────────────────┘  └─────────────────────────────┘   │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │ Skill Executor   │  │  Skill Validator            │   │
│  │ - اجرای Skill   │  │  - تست Skill                │   │
│  │ - context注入    │  │  - validation rules         │   │
│  │ - parallel exec  │  │  - safety check             │   │
│  └─────────────────┘  └─────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## ۴. فرمت یک Skill

```yaml
name: 'send-weekly-report'
version: '2.1.0'
description: 'ارسال گزارش هفتگی عملکرد به ایمیل تیم'
created_by: 'marketing-agent-01'
created_at: '2026-07-01'
executions: 127

trigger:
  type: 'scheduled' # scheduled | manual | event
  schedule: '0 9 * * 1' # هر دوشنبه ساعت ۹

steps:
  - id: 'fetch-data'
    type: 'query'
    source: 'database'
    query: 'SELECT * FROM weekly_kpi WHERE week = $week'

  - id: 'generate-report'
    type: 'prompt'
    model: 'gpt-4o'
    template: 'weekly-report-prompt-v2'
    input: '$fetch-data.result'

  - id: 'send-email'
    type: 'tool'
    tool: 'email-sender'
    params:
      to: 'team@company.com'
      subject: 'Weekly Report - Week $week'
      body: '$generate-report.result'

conditions:
  - if: 'fetch-data.count == 0'
    action: 'skip'
    message: 'No data for this week'

errors:
  - type: 'email-failed'
    action: 'retry'
    max_retries: 3
    fallback: 'save-to-draft'

metrics:
  - avg_duration: 45s
  - success_rate: 98.7%
  - last_improved: '2026-07-05'
```

---

## ۵. Plugin SDK (مثل WordPress)

### چرا Plugin SDK؟

- هر برنامه‌نویسی می‌تواند Plugin بنویسد
- شرکت‌ها می‌توانند نیازهای خاص خود را پیاده کنند
- Marketplace برای فروش Pluginها
- اکوسیستم مانند WordPress

### ساختار یک Plugin:

```
my-plugin/
├── manifest.json        # اطلاعات Plugin
├── main.ts              # کد اصلی
├── actions/
│   ├── send-sms.ts
│   └── check-status.ts
├── prompts/
│   └── system-prompt.md
├── assets/
│   └── icon.svg
└── README.md
```

### manifest.json:

```json
{
  "id": "com.on4net.sms-sender",
  "name": "SMS Sender",
  "version": "1.0.0",
  "description": "ارسال SMS از طریق Kavenegar",
  "author": "on4net",
  "license": "MIT",
  "permissions": ["http:send", "memory:read"],
  "models": ["gpt-4o-mini"],
  "hooks": ["after:agent-response"],
  "configSchema": [{ "key": "apiKey", "label": "Kavenegar API Key", "type": "string" }]
}
```

> **`configSchema` (اضافه‌شده ۲۰۲۶-۰۷-۱۲):** اختیاری — آرایه‌ای از
> `{key, label, type}` که فیلدهای تنظیماتِ per-install یک Plugin رو declare
> می‌کنه (مثل API key یک connector کانال). صفحه‌ی تنظیمات داشبورد
> (`web/app/marketplace/page.tsx`) این آرایه رو می‌خونه و یک فرم عمومی
> schema-driven رندر می‌کنه — نه هاردکد به‌ازای هر پلاگین. مقدارها در
> `plugin_installs.config JSONB` ذخیره می‌شن (`PATCH /marketplace/installs/:id/config`
> در Marketplace، از طریق `PATCH /v1/marketplace/installs/:installId/config`
> در Runtime پروکسی می‌شه).

> **نام واقعی پکیج‌ها (اضافه‌شده ۲۰۲۶-۰۷-۱۲):** پیاده‌سازی SDK زیر
> `@on4net/sdk` را با نام واقعی مونوریپو `@o2n/plugin-sdk` (در
> `packages/plugin-sdk`) منتشر می‌کند — چون تمام packageهای دیگر این
> مونوریپو با scope `@o2n/*` هستند، نه `@on4net/*`. یک CLI هم به‌عنوان
> `create-o2n-plugin` (در `packages/create-o2n-plugin`) اضافه شده که ساختار
> پوشه‌ی بالا (`manifest.json`, `main.ts`, `actions/`, `prompts/`,
> `assets/`, `README.md`) را با `pnpm create o2n-plugin <name>` می‌سازد.
> این CLI فقط scaffold تولید می‌کند — type/manifest-building است، نه
> sandboxed execution (که همچنان طبق `09-plugin-sandbox.md` به‌تعویق افتاده).

### Plugin SDK API:

```typescript
import { createPlugin, Action, Tool } from '@o2n/plugin-sdk';

const plugin = createPlugin({
  id: 'sms-sender',
  name: 'SMS Sender',
});

// تعریف یک Tool
plugin.defineTool('send-sms', {
  description: 'ارسال SMS',
  parameters: {
    to: { type: 'string', required: true },
    message: { type: 'string', required: true },
  },
  execute: async (params, context) => {
    const api = new KavenegarAPI(context.config.apiKey);
    return api.send(params.to, params.message);
  },
});

// تعریف یک Action
plugin.defineAction('verify-phone', {
  description: 'ارسال کد تأیید',
  execute: async (params, context) => {
    const code = Math.random().toString().slice(2, 8);
    await context.tools['send-sms']({
      to: params.phone,
      message: `کد تأیید: ${code}`,
    });
    await context.memory.write('verification-codes', {
      phone: params.phone,
      code,
      expiresAt: Date.now() + 300000,
    });
    return { success: true };
  },
});

export default plugin;
```

---

## ۶. Marketplace

### برای مصرف‌کنندگان:

```
Marketplace
├── Productivity (۲۳ Plugin)
├── Communication (۱۵ Plugin)
├── Analytics (۱۲ Plugin)
├── Development (۳۴ Plugin)
├── Marketing (۴۲ Plugin)
└── Custom (۸۷ Plugin)
```

### برای توسعه‌دهندگان:

- ۷۰٪ درآمد فروش Plugin به توسعه‌دهنده
- ۳۰٪ به O₂N
- امکان Free + Premium
- Verified Publisher Program

> جزئیات Credits/Coin داخلی، ledger و مدل قیمت‌گذاری پلاگین‌ها در `02_ARCHITECTURE/06-economy-and-marketplace.md` آمده است.

---

## ۷. Auto-Skill Detection

### الگوریتم تشخیص:

```
Pattern Detector:
├── Frequency Analysis ──── کار > ۵ بار در هفته؟ → Candidate
├── Similarity Analysis ──── قدم‌های مشابه هر بار؟ → Candidate
├── Duration Analysis ──── زمان ثابت هر بار؟ → Candidate
└── Complexity Check ──── آیا به اندازه کافی general است؟ → Skill

اگر ۳ از ۴ شرط ✅ → Proposal به کاربر
```

### مثال:

```
Pattern Detected:
├── Action: "گرفتن گزارش فروش از دیتابیس"
├── Frequency: ۱۲ بار در ۳ روز
├── Steps: همیشه یکسان
├── Duration: ~۱۰ ثانیه
└── Confidence: ۹۵٪

Proposal:
▶ "کاربر گرامی، 'گرفتن گزارش فروش' را ۱۲ بار تکرار کرده‌اید.
   می‌خواهم آن را به Skill تبدیل کنم؟
   مزیت: دفعه بعد در ۱ ثانیه انجام می‌شود"
```

---

## ۸. Security & Sandbox

| ویژگی                 | توضیح                                              |
| --------------------- | -------------------------------------------------- |
| **WASM Sandbox**      | Pluginها در WebAssembly Sandbox اجرا می‌شوند       |
| **Permission System** | هر Plugin فقط دسترسی‌هایی که در manifest گفته دارد |
| **Rate Limit**        | محدودیت درخواست برای هر Plugin                     |
| **Audit**             | همه فعالیت‌های Plugin لاگ می‌شود                   |
| **Kill Switch**       | قابلیت غیرفعال کردن لحظه‌ای                        |

> توضیح اجرایی: هدف نهایی برای third-party plugins اجرای WASM است، اما در MVP خیلی اولیه ممکن است plugins first-party به‌صورت محدود in-process اجرا شوند. spec کامل sandbox و مسیر مهاجرت در `02_ARCHITECTURE/09-plugin-sandbox.md` آمده است.

---

> **خلاصه:** Skill Engine + Plugin SDK = اکوسیستم. Agentها یاد می‌گیرند، مهارت می‌سازند، و توسعه‌دهندگان Plugin می‌نویسند. مثل WordPress اما برای AI Agentها.
