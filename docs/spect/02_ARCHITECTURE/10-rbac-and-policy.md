# RBAC/Policy Model (Enterprise Authorization) — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/10-rbac-and-policy.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف

O₂N سازمان‌محور است؛ پس authorization باید:
- multi-tenant و قابل enforce باشد
- برای انسان و agent و plugin یکپارچه باشد
- budget/approval را هم به عنوان policy در نظر بگیرد

---

## ۲) Scopes (حوزه‌ها)

| Scope | توضیح |
|------|-------|
| Organization | tenant اصلی |
| Workspace | زیرمجموعه‌ی org |
| Agent | Digital Employee |
| Plugin Install | instance از plugin داخل workspace |
| Connector Install | اتصال خارجی در scope workspace/org |

---

## ۳) Principals (فاعل‌ها)

فاعل‌ها:
- `user` (انسان)
- `agent` (Digital Employee)
- `plugin` (کد ثالث، همیشه در context یک install)
- `service` (internal)

هر principal باید یک identity داشته باشد و audit شود.

---

## ۴) RBAC پایه (Minimum)

### ۴.۱) نقش‌های انسانی پیشنهادی
- `org_admin`
- `workspace_admin`
- `manager`
- `member`
- `viewer`
- `billing_admin`
- `security_admin`

### ۴.۲) نقش‌های agent
- `ceo`
- `marketing`
- `sales`
- `support`
- `finance`
- `legal`
- `programmer`

> نقش agent به تنهایی کافی نیست؛ permissions باید جدا تعریف شود.

---

## ۵) Permission Model

permissionها به شکل string تعریف می‌شوند و هم برای user و هم agent/plugin استفاده می‌شوند:

نمونه‌ها:
- `agents:create`, `agents:read`, `agents:update`, `agents:pause`
- `memory:read`, `memory:write`, `memory:delete`, `memory:export`
- `audit:read`
- `approvals:read`, `approvals:approve`, `approvals:reject`
- `billing:wallet:read`, `billing:topup:create`, `billing:transactions:read`
- `plugins:install`, `plugins:enable`, `plugins:publish`
- `connectors:install`, `connectors:sync`, `connectors:revoke`
- `social:post`, `marketing:ads:write`

قانون: **plugin** فقط permissionهایی را دارد که:
1) در manifest درخواست کرده
2) در install approve شده

---

## ۶) Policy Layer (ABAC سبک)

RBAC کافی نیست. Policyها باید بتوانند شرایط اضافه کنند:
- `cost` (credits)
- `layer` (memory layer)
- `resource tags` (confidential)
- `time` (schedule window)
- `environment` (on-prem only)

نمونه policy:
```yaml
policy:
  id: "social-post-approval"
  when:
    permission: "social:post"
  then:
    requires_approval: true
    audit_level: "full"

policy:
  id: "high-cost-approval"
  when:
    estimated_credits_gt: 500
  then:
    requires_approval: true

policy:
  id: "personal-memory-protect"
  when:
    memory_layer: 5
  then:
    allow_only_user_id: "$resource.owner_user_id"
```

---

## ۷) Enforcement Points (کجا enforce می‌شود؟)

Enforcement باید server-side باشد:
- API Gateway: authn + rate limit
- Service handlers: org/workspace ownership + permission check
- Governance service/module: budget + approval policy
- Plugin host functions: capability enforcement
- Connector layer: scope enforcement + allowlist + quotas

---

## ۸) Minimal Database Tables (پیشنهادی)

> این‌ها برای پیاده‌سازی دقیق لازم‌اند (می‌تواند در v0.1 ساده‌تر شود).

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  scope VARCHAR(20) NOT NULL, -- org | workspace
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission VARCHAR(200) NOT NULL,
  UNIQUE(role_id, permission)
);

CREATE TABLE user_role_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Policyها می‌توانند در JSONB نگهداری شوند:
```sql
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  definition JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

> **خلاصه:** O₂N از RBAC برای پایه و از policy layer برای شرایط (cost/layer/tags/env) استفاده می‌کند. enforce باید در gateway+services+governance+plugin host functions انجام شود.

