# Phase Expectations — Open on4net (O₂N)

> این سند می‌گوید در هر فاز، **انتظار ما از سیستم چیست** و کدام backlogها
> آن فاز را پوشش می‌دهند.

---

## 1) Phase 0 — Core Engine

**انتظار از سیستم:**

- یک Runtime قابل اجرا داشته باشیم که Agent بسازد، چت کند، history پایه را نگه دارد و از UI ساده قابل استفاده باشد.
- Docker Compose، CI، DB پایه و اولین integration مدل بالا آمده باشند.

**Backlogهای اصلی:**

- `docs/sprint-plan/03_sprint-plan.md` → `T-001..T-008`
- `docs/spect/TODO-openon4net-runtime.md` → `RT-001..RT-010`
- `docs/spect/TODO-openon4net-platform.md` → `CP-001..CP-005`

---

## 2) Phase 1 — Memory

**انتظار از سیستم:**

- سیستم فقط session کوتاه‌مدت نداشته باشد؛ conversation، project و knowledge را بتواند بازیابی و خلاصه کند.
- context باید به‌تدریج از history خام به memory layerهای ساخت‌یافته تبدیل شود.

**Backlogهای اصلی:**

- `docs/sprint-plan/03_sprint-plan.md` → `T-027..T-050`
- `docs/spect/TODO-openon4net-memory.md` → `MEM-001..MEM-013`

---

## 3) Phase 2 — Skills

**انتظار از سیستم:**

- Agent بتواند skill/tool اجرا کند، permission داشته باشد، approval بگیرد و از pluginها استفاده کند.
- extensibility به‌صورت کنترل‌شده وارد محصول شود.

**Backlogهای اصلی:**

- `docs/sprint-plan/03_sprint-plan.md` → `T-051..T-076`
- `docs/spect/TODO-openon4net-runtime.md` → `RT-025..RT-031`
- `docs/spect/TODO-openon4net-marketplace.md` → `MKT-001..MKT-011`
- `docs/spect/TODO-openon4net-platform.md` → `CP-006..CP-018`

---

## 4) Phase 3 — Organization

**انتظار از سیستم:**

- سیستم multi-tenant شود: org/workspace/user/role روشن باشد.
- governance واقعی داشته باشیم: audit، approval queue، budget control، و مدل employee/team/workflow.

**Backlogهای اصلی:**

- `docs/sprint-plan/03_sprint-plan.md` → `T-077..T-104`
- `docs/spect/TODO-openon4net-runtime.md` → بخش‌های workspace/agent access/branding/context
- `docs/spect/TODO-openon4net-platform.md` → policy/budget/approval/admin hardening

---

## 5) Phase 4 — Ecosystem

**انتظار از سیستم:**

- Marketplace و integration hub به‌صورت واقعی کار کنند.
- revenue share، checkout/settlement، BI، report و connectorهای خارجی وارد محصول شوند.

**Backlogهای اصلی:**

- `docs/sprint-plan/03_sprint-plan.md` → `T-105..T-132`
- `docs/spect/TODO-openon4net-marketplace.md` → `MKT-012..MKT-016`
- `docs/spect/TODO-openon4net-platform.md` → `CP-019..CP-024`

---

## 6) Phase 5 — Enterprise

**انتظار از سیستم:**

- سیستم enterprise-ready شود: SSO/SAML/OIDC، encryption at rest، sharding/scale، multi-region، DR، SLA monitoring و launch readiness.

**Backlogهای اصلی:**

- `docs/sprint-plan/03_sprint-plan.md` → `T-133..T-160`
- `docs/spect/TODO-openon4net-platform.md` → security/ops/readiness tasks

---

## 7) جمع‌بندی

- **Phase 0** = سیستم کار می‌کند.
- **Phase 1** = سیستم به خاطر می‌سپارد.
- **Phase 2** = سیستم قابل توسعه می‌شود.
- **Phase 3** = سیستم سازمانی می‌شود.
- **Phase 4** = سیستم اکوسیستم می‌سازد.
- **Phase 5** = سیستم enterprise-ready می‌شود.
