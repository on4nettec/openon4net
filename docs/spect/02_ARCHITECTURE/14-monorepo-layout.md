# Monorepo Layout (Implementation Structure) — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/14-monorepo-layout.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف

این سند ساختار پیشنهادی monorepo را برای پیاده‌سازی O₂N مشخص می‌کند تا:
- مرزبندی ۴ Plane در کد هم واضح باشد
- تیم/Claude بداند هر چیز کجا باید پیاده شود
- نام‌گذاری سرویس‌ها و اپ‌ها یکدست باشد

ارجاع معماری: `02_ARCHITECTURE/13-four-plane-architecture.md`

---

## ۲) ساختار پوشه‌ها (پیشنهادی)

```
openon4net/
├── apps/
│   ├── openon4net-runtime/        # Plane 1 (Customer Runtime / On-Prem)
│   ├── openon4net-control-plane/  # Plane 2 (AI Control Plane)
│   ├── openon4net-memory/         # Plane 3 (Managed Memory Plane - optional)
│   └── openon4net-marketplace/    # Plane 4 (Marketplace Plane)
│
├── packages/
│   ├── shared/                    # types, utils, zod schemas, constants
│   ├── sdk/                       # plugin/tool SDK (developer-facing)
│   ├── ai-router/                 # model routing logic (shared)
│   ├── memory-engine/             # memory logic (shared)
│   ├── governance/                # policy/budget/approval helpers
│   └── plugin-host/               # sandbox host functions + runtime adapters
│
├── tools/
│   └── migrations/                # SQL migrations (PostgreSQL)
│
├── ops/
│   └── observability/             # otel collector / prometheus / grafana
│
└── docs/
    └── spect/                     # CTO specs
```

---

## ۳) Mapping سرویس‌ها به Planeها

### ۳.۱) `apps/openon4net-runtime` (Plane 1)
مسئول:
- API اصلی (Agents/Chat/Memory/Governance/Connectors)
- UI/Dashboard (اگر با هم deploy می‌شود)
- اجرای workflow/skills/tools/plugins (runtime)
- audit logs + approvals

### ۳.۲) `apps/openon4net-control-plane` (Plane 2)
مسئول:
- activation/license
- credits ledger و billing control
- managed AI routing endpoints (opt-in)

### ۳.۳) `apps/openon4net-memory` (Plane 3)
مسئول (اگر managed memory ارائه می‌دهید):
- storage/index/search برای لایه‌های بلندمدت
- retention/export/delete در سطح سرویس managed

### ۳.۴) `apps/openon4net-marketplace` (Plane 4)
مسئول:
- publisher portal + submissions
- review pipeline + signing
- artifact registry
- listings/search/ranking

---

## ۴) نکته اجرایی درباره همین ریپو

در این ریپو فعلاً تمرکز روی **مستندات** است و `.gitignore` ممکن است پوشه‌های `app/` یا `apps/` را ignore کند.

برای شروع پیاده‌سازی واقعی:
- یا `.gitignore` را اصلاح کنید تا `apps/` track شود
- یا کد را در یک ریپوی جدا نگه دارید و این ریپو را به عنوان “spec/docs repo” حفظ کنید

---

> **خلاصه:** این layout، پیاده‌سازی را با معماری ۴ Plane هم‌راستا می‌کند و اجازه می‌دهد MVP را از Plane 1 شروع کنید و Planeهای 2/3/4 را مرحله‌ای اضافه کنید.

