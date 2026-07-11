# System Features — Open on4net (O₂N)

> نسخه: 0.1 (Draft)  
> تاریخ: July 2026  
> هدف: لیست فیچرهای سیستم (آنچه داریم + آنچه باید داشته باشیم) به تفکیک Plane

---

## 1) Cross-cutting (سراسری)

- Multi-tenant: Organization / Workspace
- Identity & Access:
  - Authentication (چند روش، قابل تنظیم با env)
  - Authorization: RBAC + policy layer (ABAC-lite)
- Governance:
  - Budget / approvals (human-in-the-loop)
  - Audit log (append-only semantics در سطح طراحی)
- Observability:
  - health endpoints
  - trace_id propagation
  - structured logging
- Security:
  - secrets at rest (envelope encryption)
  - rate limiting
  - SSRF protections برای connectors/webhooks

---

## 2) Plane 1 — Runtime (Self-hosted)

### 2.1) Gateway (API)

- Auth endpoints (dev bootstrap → auth واقعی)
- Agent chat API (SSE/stream)
- Workspace CRUD
- Roles/Users management (RBAC bindings)
- Audit log endpoints + viewer UI
- Provider configs:
  - runtime-wide LLM provider fallback
  - per-org BYOK overrides (encrypted at rest)

### 2.2) Web (Dashboard)

- Login
- Workspace/Org setup
- Agent creation + management
- Settings (LLM provider config per org)
- Audit log viewer

### 2.3) Connectors / Tools (در Runtime)

- Connector framework (OAuth/API key)
- Webhook connector (با کنترل امنیتی)
- Telegram tool (وابسته به token واقعی)

### 2.4) Secrets & KMS (Runtime)

- Env-first MVP (CONFIG_ENCRYPTION_KEY)
- Multi-provider registry (env/vault/…)
- Multi-active decrypt + primary encrypt برای migration/rotation

---

## 3) Plane 2 — AI Control Plane (Managed/Optional)

- Activation keys / tenant provisioning
- Billing & wallet (credits)
- Admin console برای مدیریت سازمان‌ها/پلن‌ها
- Enterprise hooks (SSO policies, audit evidence) — later

---

## 4) Plane 3 — Memory (Managed/Later)

- Layered memory model (layers 1–6)
- Ingestion API برای connectors
- Vector search (pgvector) — planned
- Memory graph (Neo4j یا معادل) — planned
- Retention / deletion / export / reindex — planned
- BYOK/envelope encryption برای داده‌های managed — planned

---

## 5) Plane 4 — Marketplace

### 5.1) Private/Local Marketplace (MVP)

- Submit/list/discover packages
- Install flow با:
  - checksum verification
  - permission diff & re-approval
- API docs + test coverage

### 5.2) Public Marketplace (Later)

- Review pipeline (SAST/dependency scanning) + manual review workflow
- Strong signing/verified publishers (PKI/cosign)
- Global kill switch + artifact distribution/CDN
- Revenue share ledger + payout queue (پول واقعی)

---

## 6) Roadmap Tags (اختیاری برای توسعه)

برای هر فیچر می‌توان tag زد:

- `mvp` / `should` / `later`
- `self-hosted` / `managed`
- `security-critical`
