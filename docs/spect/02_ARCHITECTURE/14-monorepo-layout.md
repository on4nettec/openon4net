# Monorepo Layout (Implementation Structure) — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/14-monorepo-layout.md
> **نسخه:** 2.0 | **تاریخ:** July 2026
> **تغییر نسبت به نسخه ۱.۰:** ساختار بر اساس روابط واقعی بین ۴ Plane که در جلسه‌ی معماری مشخص شد، بازنویسی شد؛ تناقض با `08_CODING_STANDARD/01-standards.md` برطرف شد (آن سند اکنون به این فایل ارجاع می‌دهد).

---

## ۱) هدف

این سند ساختار monorepo را برای پیاده‌سازی O₂N مشخص می‌کند تا:
- مرزبندی ۴ Plane در کد هم واضح باشد
- تیم/Claude بداند هر چیز کجا باید پیاده شود
- نام‌گذاری سرویس‌ها و اپ‌ها یکدست باشد
- مدل دیپلوی هر Plane (کی، کجا، چطور نصب/اجرا می‌شود) روشن باشد

ارجاع معماری: `02_ARCHITECTURE/13-four-plane-architecture.md`

**این فایل تنها منبع مرجع (single source of truth) برای ساختار پوشه‌هاست.** هیچ سند دیگری (از جمله `08_CODING_STANDARD/01-standards.md`) نباید ساختار متفاوتی پیشنهاد بدهد.

---

## ۲) مدل دیپلوی — چرا ساختار plane-محور است، نه سرویس‌محور

هر Plane یک واحد دیپلوی مستقل با مالکیت متفاوت است، نه یک ماژول از یک محصول واحد:

| Plane | کجا اجرا می‌شود؟ | مدل مالی |
|---|---|---|
| **Runtime** (Plane 1) | روی سیستم/سرور خود کاربر (self-hosted) | رایگان — نصب و اکتیو رایگان است |
| **Control Plane** (Plane 2) | زیرساخت مرکزی شرکت on4net | فروش پلن pay-as-you-go / subscription + اکتیو رایگان Runtime |
| **Memory** (Plane 3) | زیرساخت مرکزی شرکت on4net (اختیاری) | فقط برای کاربرانی که پلن خریده‌اند |
| **Marketplace** (Plane 4) | زیرساخت مرکزی شرکت on4net | تسویه/پرداخت از طریق کیف‌پول Control Plane |

چون Runtime روی سرور مشتری نصب می‌شود ولی بقیه‌ی Planeها روی زیرساخت شرکت اجرا می‌شوند، **هرکدام docker-compose و migration جدای خودشان را دارند** — یک docker-compose واحد برای کل سیستم غلط است.

---

## ۳) روابط بین Planeها (Contract سطح بالا)

```
┌─────────────────────────┐
│  openon4net-runtime      │  رایگان، روی سرور/سیستم خود کاربر
│  (نصب محلی مشتری)         │
│                          │
│  gateway (Fastify) ──────┼──── حالت BYOK: مستقیم به LLM با کلید خود کاربر
│    - Agents/Chat/        │      (بدون routing پیچیده؛ سوییچ هم‌زمان با حالت managed ندارد)
│      Workflow/Skill      │
│    - Short/Conversation/ │
│      Project Memory      ├──── فعال‌سازی (رایگان) ──────┐
│    - Personal Knowledge  │                              │
│    - Governance/Audit    ├──── حالت Managed (پولی) ─────┤
│    - Plugin sandbox      │      از طریق Control Plane    │
│                          │                              ▼
│  web (Next.js)           │                  ┌────────────────────────────┐
│  mobile (Flutter/Dart)   │                  │  openon4net-control-plane   │  SaaS مرکزی
└─────────────────────────┘                  │                              │
                                              │  gateway:                   │
                                              │   - activation/license      │
                                              │     (رایگان)                 │
┌─────────────────────────┐                  │   - billing/wallet/plans    │
│  openon4net-marketplace  │                  │     (pay-as-you-go/sub)     │
│                          │                  │   - managed AI Gateway:     │
│  gateway:                │◄── نصب/اجرا در    │     چندین LLM را مدیریت     │
│   - publisher portal     │    Runtime sandbox│     می‌کند، بر اساس درخواست  │
│   - review/signing       │    - تسویه از      │     یا انتخاب کاربر روت    │
│   - registry             │      طریق wallet   │     می‌کند (fallback/cost)   │
│  web: فروشگاه/لیستینگ     │      Control-Plane │                              │
└─────────────────────────┘                  │  web: پنل پلن/اکتیویشن/کردیت │
                                              └──────────────┬───────────────┘
                                                             │ provision می‌کند
                                                             ▼
                                              ┌────────────────────────────┐
                                              │  openon4net-memory          │  SaaS اختیاری
                                              │  (فقط برای کاربران پولی)     │
                                              │                              │
                                              │  gateway:                   │
                                              │   - Company Knowledge       │
                                              │   - Global Knowledge        │
                                              │   - storage/index/search    │
                                              │     بلندمدت                  │
                                              └────────────────────────────┘
```

نکته‌ی مهم: عبارت «gateway» در این سند به معنای **سرویس بک‌اند/API همان Plane** است (مثل یک نام مستعار برای «api»)، نه یک مفهوم سراسری واحد. «AI Gateway» (روتینگ بین چند LLM) فقط داخل `openon4net-control-plane/gateway` پیاده می‌شود؛ `openon4net-runtime/gateway` صرفاً یک کانکتور ساده‌ی مستقیم به یک LLM (BYOK) دارد.

---

## ۴) ساختار پوشه‌ها

```
openon4net/
├── apps/
│   ├── openon4net-runtime/            # Plane 1 — نصب رایگان روی سرور/سیستم مشتری
│   │   ├── gateway/                   # بک‌اند اصلی (Fastify) — «مغز» سیستم
│   │   ├── web/                       # داشبورد وب (Next.js)
│   │   ├── mobile/                    # کلاینت چندسکویی (Flutter/Dart)
│   │   ├── migrations/                # SQL migrations مخصوص Runtime (DB محلی مشتری)
│   │   └── docker-compose.yml         # بسته‌ی نصب مستقل: postgres + redis + minio + gateway + web
│   │
│   ├── openon4net-control-plane/      # Plane 2 — SaaS مرکزی on4net
│   │   ├── gateway/                   # activation + billing/wallet + managed AI Gateway
│   │   ├── web/                       # پنل مدیریت پلن/اکتیویشن/کردیت
│   │   ├── migrations/                # SQL migrations مخصوص Control Plane
│   │   └── docker-compose.yml         # بسته‌ی دیپلوی مرکزی
│   │
│   ├── openon4net-memory/             # Plane 3 — SaaS مرکزی، اختیاری (فاز بعد از MVP)
│   │   ├── gateway/                   # Company/Global Knowledge — storage/index/search
│   │   └── migrations/
│   │
│   └── openon4net-marketplace/        # Plane 4 — SaaS مرکزی
│       ├── gateway/                   # publisher portal + review/signing + registry
│       ├── web/                       # فروشگاه/لیستینگ
│       └── migrations/
│
├── packages/
│   ├── shared/                        # types/zod schemas مشترک بین Planeها (قرارداد بین‌سرویسی)
│   ├── plugin-sdk/                    # SDK ساخت skill/plugin (مصرف‌کننده: Runtime اجرا می‌کند، Marketplace منتشر می‌کند)
│   ├── llm-providers/                 # آداپتورهای خام هر LLM (سطح پایین)؛ هم در Runtime (BYOK) هم در Control-Plane (managed) استفاده می‌شود
│   ├── memory-core/                   # منطق مشترک query/embedding؛ هر Plane سرویس خودش را روی این می‌سازد
│   ├── governance/                    # policy/budget/approval helpers (مصرف‌کننده: Runtime)
│   └── plugin-host/                   # sandbox اجرای پلاگین Level 0 (in-process) — مصرف‌کننده: Runtime
│
├── ops/
│   └── observability/                 # قالب پایه OTel/Prometheus/Grafana برای Planeهای مرکزی (control-plane/memory/marketplace)؛ Runtime پیکربندی سبک‌تر خودش را همراه نصب می‌برد
│
└── docs/
    └── spect/                         # CTO specs
```

---

## ۵) Mapping سرویس‌ها به Planeها (جزئیات مسئولیت)

### ۵.۱) `apps/openon4net-runtime` (Plane 1)
مسئول:
- `gateway`: Agents/Chat/Workflow/Skill/Plugin execution، Governance/Audit/Approvals
- حافظه‌ی محلی: **فقط** Short Memory + Conversation Memory + Project Memory + Personal Knowledge (نه Company/Global Knowledge — آن مال Plane 3 است)
- اتصال مستقیم BYOK به یک LLM (بدون routing/fallback پیچیده)
- `web` و `mobile`: دو کلاینت روی همان API

### ۵.۲) `apps/openon4net-control-plane` (Plane 2)
مسئول:
- activation/license (رایگان) برای Runtime
- credits ledger / wallet / billing (پولی — pay-as-you-go یا subscription)
- **Managed AI Gateway**: تنها جایی که routing/fallback/cost-tracking بین چند LLM پیاده می‌شود (طبق `02-ai-gateway.md`)؛ یا بر اساس نوع درخواست خودکار انتخاب می‌کند یا کاربر مستقیم مدل را مشخص می‌کند

### ۵.۳) `apps/openon4net-memory` (Plane 3)
مسئول (سرویس مدیریت‌شده، اختیاری، بعد از MVP):
- Company Knowledge + Global Knowledge — به‌ازای هر شرکت/کاربر توسط Control Plane پروویژن می‌شود
- storage/index/search برای لایه‌های بلندمدت حافظه
- فقط برای کاربرانی در دسترس است که از طریق Control Plane پلن خریده‌اند

### ۵.۴) `apps/openon4net-marketplace` (Plane 4)
مسئول:
- publisher portal + submissions
- review pipeline + signing
- artifact registry + listings/search/ranking
- **اجرای واقعیِ** پلاگین/اسکیلِ نصب‌شده همیشه داخل sandbox خود Runtime اتفاق می‌افتد؛ Marketplace فقط توزیع/تأیید/تسویه‌حساب (از طریق wallet در Control Plane) را مدیریت می‌کند

---

## ۶) نکته اجرایی درباره همین ریپو

در این ریپو فعلاً تمرکز روی **مستندات** است و `.gitignore` ممکن است پوشه‌های `apps/` را ignore کند. برای شروع پیاده‌سازی واقعی:
- `.gitignore` را اصلاح کنید تا `apps/` و `packages/` track شوند
- MVP (طبق `09_TASKS/08-scope-guardrails-mvp.md`) فقط `apps/openon4net-runtime` را کامل می‌سازد؛ Control Plane در MVP به‌صورت حداقلی (activation ساده + wallet read-only، بدون managed AI Gateway واقعی) پیاده می‌شود؛ Memory و Marketplace در MVP ساخته نمی‌شوند

---

> **خلاصه:** این layout بر اساس روابط واقعی بین ۴ Plane است: هرکدام واحد دیپلوی مستقل با مالکیت/مدل مالی متفاوت، Runtime رایگان و self-hosted با اتصال مستقیم BYOK به LLM، و Control Plane تنها جایی که routing مدیریت‌شده‌ی چند-LLM و billing واقعی اتفاق می‌افتد. MVP از Plane 1 شروع می‌شود و بقیه‌ی Planeها مرحله‌ای اضافه می‌شوند.
