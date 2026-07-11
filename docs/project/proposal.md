# Proposal — Open on4net (O₂N)

> نسخه: 0.1 (Draft)  
> تاریخ: July 2026  
> هدف: یک پروپوزال اجرایی/فنی برای ادامه‌ی توسعه و آماده‌سازی MVP → Production

---

## 1) Scope

این پروپوزال پروژه را به صورت Plane-based تعریف می‌کند:

- **Plane 1 (Runtime):** self-hosted، UI + gateway، اجرای agent و کنترل‌ها
- **Plane 2 (Control Plane):** مدیریت مرکزی (اختیاری/managed)
- **Plane 3 (Memory):** later (پس از چند مشتری واقعی)
- **Plane 4 (Marketplace):** private/local MVP، public later

---

## 2) Goals (Success Criteria)

- نصب و اجرای قابل اعتماد برای مشتری self-hosted
- امنیت پایه: auth واقعی، secrets management، audit
- تجربه کاربری: onboarding قابل فهم + مسیر ساخت اولین Agent
- قابلیت توسعه: plugin/connector قابل مدیریت و قابل کنترل

---

## 3) Non-Goals (برای MVP)

- Memory Graph کامل و سرویس managed پرهزینه
- Public marketplace با review pipeline/payout واقعی
- Enterprise compliance کامل (SOC2 evidence، SAML، …) قبل از نیاز واقعی

---

## 4) Deliverables

### 4.1) Runtime

- Authentication: multi-method و قابل تنظیم با env (password/SSO/…)
- Secrets/KMS: معماری provider-based (env + vault + …) با امکان multi-active برای migration
- Observability: trace_id، structured logs، health endpoints
- Governance: approvals/budget + audit log

### 4.2) Control Plane

- مدیریت activation key و billing hooks (بر اساس backlog)

### 4.3) Marketplace

- private/local install، checksum verification، permission diff

---

## 5) Architecture Notes

- هر Plane deployment و DB/compose مستقل دارد (طبق مستندات monorepo layout)
- API contracts و data formats باید versioned باشند (خصوصاً secrets metadata و auth identities)
- مسیر مهاجرت: dev-only flows باید به‌صورت safe در production disable شوند

---

## 6) Execution Plan (Draft)

### Phase 0 — تثبیت و آماده‌سازی (1–2 هفته)

- lint/typecheck/test/build پایدار برای هر app
- Docker build/run قابل اعتماد + onboarding doc

### Phase 1 — Security foundations (2–4 هفته)

- RT-012: auth واقعی per-user (password به عنوان baseline)
- RT-011: KMS provider registry + Vault integration (اختیاری)

### Phase 2 — Product polish (2–4 هفته)

- onboarding و UX بهتر
- connectorهای بیشتر + محدودیت‌ها (SSRF/allowlist)
- hardening rate-limits + audit completeness

---

## 7) Dependencies & Assumptions

- Node/TS + Postgres/Redis/MinIO مبنای Runtime
- برای روش‌های بیرونی (SSO/Email/Vault) باید config و runbook داشته باشیم
- Runtime باید بدون هیچ سرویس بیرونی هم «حداقل قابل استفاده» باشد (password + env-kms)

---

## 8) Open Decisions

- RT-011: Vault به‌صورت profile اختیاری در docker-compose یا external-only؟
- RT-012: روش‌های رسمی MVP: password + (اختیاری) oauth + (اختیاری) magic-link؟
- policy defaults و مسیر bootstrap admin در self-hosted
