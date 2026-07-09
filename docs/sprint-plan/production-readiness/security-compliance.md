# Security & Compliance — امنیت و آماده‌سازی Enterprise

هدف: تبدیل مباحث امنیتی موجود در Spec به «کنترل‌های اجرایی + شواهد» که برای production/enterprise لازم است.

مراجع:

- `docs/spect/08_CODING_STANDARD/02-security.md`
- `docs/spect/08_CODING_STANDARD/04-threat-model.md`
- `docs/spect/02_ARCHITECTURE/10-rbac-and-policy.md`
- `docs/spect/02_ARCHITECTURE/11-secrets-and-key-management.md`
- `docs/spect/02_ARCHITECTURE/09-plugin-sandbox.md`

---

## 1) اصول پایه (Non-negotiables)

- **Least privilege**: هر user/plugin فقط مجوز لازم را داشته باشد.
- **Tenant isolation**: داده هر tenant جدا و enforce شده باشد.
- **Secure by default**: تنظیمات پیش‌فرض امن (RBAC، logging، keys).
- **Auditability**: هر اکشن حساس traceable باشد.

---

## 2) کنترل‌های اجرایی (Controls)

### Identity & Access

- Auth: session/token سخت‌گیرانه + rotation
- RBAC: ماتریس پیش‌فرض + policy rules
- Admin actions: نیازمند approval (HITL) در اکشن‌های حساس

### Secrets & Key Management

- ذخیره امن secrets (بدون hardcode)
- rotation policy + حداقل یک مسیر automation در enterprise

### Data Protection

- encryption in transit (TLS)
- encryption at rest برای داده‌های حساس (در enterprise الزامی)
- data retention / deletion policy (برای قراردادها)

### Audit & Governance

- audit log مرکزی برای:
  - تغییر role/policy
  - تغییر keys
  - نصب/فعال‌سازی plugin
  - عملیات billing

### Plugin Security

- sandboxing (WASM/capabilities)
- permission prompts + metering
- supply chain controls برای plugin packages (امضا/verify در فازهای بالاتر)

---

## 3) شواهد (Evidence) برای Enterprise

این‌ها چیزهایی هستند که تیم فروش/امنیت مشتری می‌خواهد ببیند:

- نمودار معماری + data flow
- threat model به‌روز + لیست mitigations
- RBAC matrix و نمونه‌های enforce
- گزارش لاگ/تریس (بدون PII در log)
- سیاست retention و export/delete
- runbookهای incident + گزارش تمرین DR/backup

---

## 4) حداقل‌های پذیرش (Definition of Secure Done)

- مسیرهای اصلی (chat/memory/auth) بدون secrets leak
- خطاها PII را log نکنند
- role checks در server-side enforce شود (نه فقط UI)
- حداقل یک فرآیند rotation کلید وجود داشته باشد
