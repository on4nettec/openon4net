# Default Roles & Permission Matrix (MVP) — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/15-rbac-default-matrix.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف

این سند یک **ماتریس اجرایی** است تا هنگام پیاده‌سازی، ambiguity نداشته باشیم:

- کدام نقش‌ها چه permissionهایی دارند؟
- کدام actionها نیاز به approval دارند؟

این سند مکمل `02_ARCHITECTURE/10-rbac-and-policy.md` است.

---

## ۲) نقش‌های پیش‌فرض (MVP)

- `org_admin`
- `workspace_admin`
- `manager`
- `member`
- `viewer`
- `billing_admin`
- `security_admin`

> سازمان می‌تواند roleهای سفارشی بسازد؛ اما این‌ها defaults هستند.

---

## ۳) Permission Groups

برای ساده‌سازی، permissionها را گروه‌بندی می‌کنیم:

- **Agents**: `agents:*`
- **Memory**: `memory:*`
- **Skills**: `skills:*`
- **Governance**: `audit:*`, `approvals:*`
- **Billing**: `billing:*`
- **Plugins/Marketplace**: `plugins:*`, `marketplace:*`, `publisher:*`
- **Connectors**: `connectors:*`

---

## ۴) Matrix (MVP)

کلید:

- ✅ مجاز
- ⚠️ مجاز با policy/approval (بسته به threshold)
- ❌ غیرمجاز

| Permission                  | org_admin | workspace_admin | manager | member | viewer | billing_admin | security_admin |
| --------------------------- | :-------: | :-------------: | :-----: | :----: | :----: | :-----------: | :------------: |
| `agents:create`             |    ✅     |       ✅        |   ❌    |   ❌   |   ❌   |      ❌       |       ✅       |
| `agents:read`               |    ✅     |       ✅        |   ✅    |   ✅   |   ✅   |      ❌       |       ✅       |
| `agents:update`             |    ✅     |       ✅        |   ❌    |   ❌   |   ❌   |      ❌       |       ✅       |
| `agents:pause`              |    ✅     |       ✅        |   ❌    |   ❌   |   ❌   |      ❌       |       ✅       |
| `memory:read`               |    ✅     |       ✅        |   ✅    |   ✅   |   ✅   |      ❌       |       ✅       |
| `memory:write`              |    ✅     |       ✅        |   ✅    |   ✅   |   ❌   |      ❌       |       ✅       |
| `memory:delete`             |    ✅     |       ✅        |   ⚠️    |   ❌   |   ❌   |      ❌       |       ✅       |
| `memory:export`             |    ✅     |       ✅        |   ⚠️    |   ❌   |   ❌   |      ❌       |       ✅       |
| `skills:create`             |    ✅     |       ✅        |   ✅    |   ✅   |   ❌   |      ❌       |       ✅       |
| `skills:execute`            |    ✅     |       ✅        |   ✅    |   ✅   |   ❌   |      ❌       |       ✅       |
| `audit:read`                |    ✅     |       ✅        |   ✅    |   ❌   |   ❌   |      ❌       |       ✅       |
| `approvals:read`            |    ✅     |       ✅        |   ✅    |   ❌   |   ❌   |      ❌       |       ✅       |
| `approvals:approve`         |    ✅     |       ✅        |   ⚠️    |   ❌   |   ❌   |      ❌       |       ✅       |
| `approvals:reject`          |    ✅     |       ✅        |   ⚠️    |   ❌   |   ❌   |      ❌       |       ✅       |
| `billing:wallet:read`       |    ✅     |       ❌        |   ❌    |   ❌   |   ❌   |      ✅       |       ✅       |
| `billing:topup:create`      |    ✅     |       ❌        |   ❌    |   ❌   |   ❌   |      ✅       |       ❌       |
| `billing:transactions:read` |    ✅     |       ❌        |   ❌    |   ❌   |   ❌   |      ✅       |       ✅       |
| `plugins:install`           |    ✅     |       ✅        |   ✅    |   ❌   |   ❌   |      ❌       |       ✅       |
| `plugins:enable`            |    ✅     |       ✅        |   ✅    |   ❌   |   ❌   |      ❌       |       ✅       |
| `publisher:submit`          |    ✅     |       ✅        |   ✅    |   ✅   |   ❌   |      ❌       |       ✅       |
| `connectors:install`        |    ✅     |       ✅        |   ✅    |   ❌   |   ❌   |      ❌       |       ✅       |
| `connectors:sync`           |    ✅     |       ✅        |   ✅    |   ❌   |   ❌   |      ❌       |       ✅       |
| `connectors:revoke`         |    ✅     |       ✅        |   ⚠️    |   ❌   |   ❌   |      ❌       |       ✅       |
| `branding:update`           |    ✅     |       ✅        |   ❌    |   ❌   |   ❌   |      ❌       |       ✅       |
| `social:post`               |    ✅     |       ✅        |   ⚠️    |   ❌   |   ❌   |      ❌       |       ✅       |
| `marketing:ads:write`       |    ✅     |       ✅        |   ⚠️    |   ❌   |   ❌   |      ❌       |       ✅       |

---

## ۵) Default Policies (MVP)

### ۵.۱) Approval thresholds

- `estimated_credits > 500` → requires approval
- `social:post` → requires approval + audit_level=full
- `marketing:ads:write` → requires approval + daily cap

### ۵.۲) Sensitive memory layers

- `layer=5` (Personal Knowledge) فقط توسط owner user قابل خواندن/نوشتن است.

---

> **خلاصه:** این ماتریس، نقطه شروع اجرایی برای پیاده‌سازی RBAC/Policy در MVP است و مانع تضاد بین UI/API/governance می‌شود.
