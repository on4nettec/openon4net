# Four-Part (4-Plane) Architecture — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/13-four-plane-architecture.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) خلاصه

O₂N به‌صورت رسمی از **۴ بخش/Plane** تشکیل می‌شود تا هم برای **Self-host/On‑Prem** قابل نصب باشد و هم اکوسیستم و اقتصاد و مدیریت AI را در سطح کل پلتفرم ممکن کند.

این ۴ Plane:
1) **Customer Runtime (Core / On‑Prem)**
2) **AI Control Plane (AI Management + Credits + Optional Compute Network)**
3) **Long‑Term Memory Plane (Storage/Index/Retention - Managed یا Self‑host)**
4) **Marketplace Plane (Publish/Review/Registry/Monetization)**

---

## ۲) چرا ۴ Plane؟

این تفکیک برای حل هم‌زمان ۴ نیاز است:
- شرکت‌ها می‌خواهند “سیستم” را روی زیرساخت خودشان اجرا کنند (کنترل داده/امنیت)
- شما می‌خواهید مدیریت و هزینه AI را “مرکزی و قابل کنترل” کنید (مثل n8n activation + credits)
- حافظه بلندمدت باید قابل انتخاب باشد: self-host برای Enterprise، managed برای SMB
- اکوسیستم plugin/connector باید استاندارد و درآمدزا باشد

---

## ۳) نمودار کلی

```
┌──────────────────────────────────────────────────────────────┐
│                         PLANE 4                              │
│   Marketplace (publish/review/registry/signing/pricing)       │
└───────────────┬──────────────────────────────────────────────┘
                │  (artifacts + metadata)
┌───────────────▼──────────────────────────────────────────────┐
│                         PLANE 2                              │
│   AI Control Plane (activation/license, credits, routing)     │
│   + Optional Compute Provider Network (future/opt-in)         │
└───────────────┬──────────────────────────────────────────────┘
                │  (policy + credits + model endpoints)
┌───────────────▼──────────────────────────────────────────────┐
│                         PLANE 1                              │
│   Customer Runtime (agents, skills, workflows, connectors)    │
│   governance + audit + OTel + plugin sandbox                  │
└───────────────┬──────────────────────────────────────────────┘
                │  (encrypted data / indexes)
┌───────────────▼──────────────────────────────────────────────┐
│                         PLANE 3                              │
│   Long-term Memory Plane (managed/self-host storage+index)    │
└──────────────────────────────────────────────────────────────┘
```

---

## ۴) Plane 1 — Customer Runtime (Core / On‑Prem)

این همان بخشی است که “هر کسی می‌تواند روی سیستم خودش نصب کند”.

### مسئولیت‌ها
- Organization/Workspace/User/Agent
- Agent Framework + Workflow Engine + Skill Engine
- Governance (RBAC/Policy + approvals + budgets)
- Connectors/Tools/Plugins execution
- Plugin Sandbox (WASM/capabilities)
- Observability (OTel traces/metrics/logs)
- Memory L1/L2 و memory orchestration (نوشتن/خواندن/ingest)

### دیتاستورها (پیش‌فرض)
- PostgreSQL + Redis + Neo4j + MinIO (طبق schema)

### خروجی اصلی
API محلی برای UI و اتوماسیون + اجرای کارهای سازمانی.

---

## ۵) Plane 2 — AI Control Plane (Activation + Credits + AI Management)

این بخش برای این است که کاربران self-host:
- یک **کلید فعال‌سازی/License** داشته باشند
- و اگر خواستند، “AI را به‌صورت managed” مصرف کنند تا درگیر پرداخت مستقیم/کلید providerها نشوند

### ۵.۱) Activation / Licensing (مثل n8n)
- runtime (Plane 1) با یک activation key به control plane وصل می‌شود
- control plane سیاست‌ها را برمی‌گرداند:
  - plan/limits
  - credit balance
  - allowed models/providers
  - governance thresholds

### ۵.۲) Credits (Coin داخلی)
- credits ledger و settlement
- جلوگیری از سوءاستفاده (idempotency + audit)

### ۵.۳) Managed AI Gateway (v1)
دو حالت برای مشتری:
- **BYOK**: مشتری کلید OpenAI/Claude/… را خودش می‌دهد و AI Gateway محلی از آن استفاده می‌کند
- **Managed**: مشتری credits می‌خرد و runtime درخواست را به AI endpoints شما می‌فرستد

> اصل امنیتی: Managed باید opt‑in باشد و برچسب‌های data sensitivity رعایت شود (confidential data ممکن است فقط BYOK/on‑prem).

### ۵.۴) Optional Compute Provider Network (Future)
اگر بخواهید “مثل بلاکچین/بازار VM” داشته باشید:
- providerها nodeهای inference/compute ارائه می‌کنند
- settlement با credits انجام می‌شود
- اما **برای Enterprise** باید گزینه “عدم خروج داده” همیشه وجود داشته باشد.

این بخش در MVP به عنوان **اختیاری/خاموش** تعریف می‌شود تا ریسک حقوقی/امنیتی/کیفی کنترل شود.

---

## ۶) Plane 3 — Long‑Term Memory Plane (Managed یا Self‑host)

هدف: حافظه بلندمدت، retention، indexing و جستجو را به شکل قابل انتخاب ارائه کنیم.

### ۶.۱) مدل‌ها
- **Self‑host Memory** (Enterprise): همه چیز داخل زیرساخت مشتری
- **Managed Memory** (SMB): ذخیره/ایندکس در سرویس مدیریت‌شده
- **Hybrid**: داده حساس self-host، داده عمومی/غیرحساس managed

### ۶.۲) اصل کلیدی: Data Ownership و Encryption
در حالت managed:
- داده باید **encrypt‑then‑store** باشد
- کلیدها و policyها تحت کنترل customer runtime باشند (envelope encryption)

> اگر در آینده “شبکه ذخیره‌سازی با incentivization” بخواهید، باید فقط ciphertext و metadata محدود ذخیره شود و leakage risk مدل‌سازی شود.

---

## ۷) Plane 4 — Marketplace Plane

Marketplace مسئول “توزیع و درآمدزایی” است، نه اجرای کد.

### مسئولیت‌ها
- publisher accounts
- submit/review/approve
- artifact registry + signing
- pricing models
- revenue share + payout queue
- moderation + kill switch

### اجرای plugin کجا انجام می‌شود؟
- همیشه در Plane 1 (customer runtime) و در sandbox

ارجاع: `02_ARCHITECTURE/12-marketplace-service.md`

---

## ۸) Deployment Modes

### ۸.۱) Fully Self‑Host (Enterprise-friendly)
- Plane 1 + Plane 3 self-host
- Plane 2 فقط activation (یا کاملاً offline license)
- Plane 4 optional (یا private marketplace)

### ۸.۲) Hybrid (پیشنهادی برای MVP فروش)
- Plane 1 self-host
- Plane 2 managed credits + managed AI endpoints (opt‑in)
- Plane 3 self-host یا managed (policy-based)
- Plane 4 managed

### ۸.۳) Fully Managed SaaS (بعداً)
- همه planeها managed
- برای SMB

---

## ۹) Mapping به اسناد موجود

- Runtime/Core: `02_ARCHITECTURE/01-system-overview.md`
- AI Management: `02_ARCHITECTURE/02-ai-gateway.md` + `02_ARCHITECTURE/06-economy-and-marketplace.md`
- Memory: `00_VISION/03-memory-engine.md` + `02_ARCHITECTURE/11-secrets-and-key-management.md`
- Marketplace: `02_ARCHITECTURE/12-marketplace-service.md`
- Connectors: `02_ARCHITECTURE/07-connectors-and-tools.md` + `04_API/03-connectors-memory-ingestion-api.md`
- Sandbox/OTel: `02_ARCHITECTURE/09-plugin-sandbox.md` + `02_ARCHITECTURE/08-observability-otel.md`

---

## ۱۰) MVP پیشنهاد‌شده بر اساس ۴ Plane

برای اینکه Claude/تیم سریع و درست بسازد:
- Plane 1: کامل (agent/workflow/memory L1/L2/governance/audit)
- Plane 2: activation + credits پایه + managed AI (اختیاری)
- Plane 3: در MVP می‌تواند self-host باشد (Postgres/Neo4j/MinIO)؛ managed memory فاز بعد
- Plane 4: marketplace اولیه (publish/install) + signing ساده

ارجاع اصلی ساخت: `09_TASKS/00-claude-build-pack.md`

---

> **خلاصه:** ۴ Plane شدن معماری باعث می‌شود هم self-host واقعی داشته باشید، هم مدیریت مرکزی AI/credits، هم گزینه‌های حافظه بلندمدت، و هم marketplace درآمدزا—بدون اینکه core پلتفرم برای هر سناریو شکسته شود.

