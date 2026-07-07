# Claude Build Pack (CTO Spec) — Open on4net (O₂N)

> **فایل:** 09_TASKS/00-claude-build-pack.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف این سند

این سند برای این است که یک LLM (مثل Claude) بتواند پروژه را **درست و قابل اجرا** بسازد.
یعنی از “مستندات Vision” به “کد قابل deploy” برسیم.

---

## ۲) Definition of Done برای MVP (v0.1)

MVP زمانی Done است که:
1) **Organization/Workspace** ساخته شود (multi-tenant پایه)
2) **Agent CRUD** انجام شود (create/list/update/pause)
3) **Chat API** با یک Agent کار کند (REST + SSE)
4) **AI Gateway** حداقل ۱ provider را پشتیبانی کند + fallback chain تعریف شود
5) **Memory L1/L2** (Redis + PostgreSQL) پیاده شود (conversations/messages)
6) **Governance پایه**:
   - budget enforcement
   - audit log هر درخواست/اکشن
   - approval queue برای درخواست‌های پرهزینه
7) **Dashboard ساده**:
   - login
   - agent list/create
   - chat UI
   - wallet/credits view (read-only)
8) **Developer Extensibility (MVP)**:
   - یک “Tool” نمونه از طریق registry
   - یک “Plugin” نمونه (local) با manifest و permission check

---

## ۳) ترتیب ساخت (Implementation Order)

### مرحله A — Repo & Tooling
1) Monorepo (pnpm + turborepo)
2) TypeScript configs (shared)
3) Lint/format/test setup
4) docker compose: postgres + redis + minio

### مرحله B — Data layer
1) schema migrations برای tables:
   - organizations, workspaces, users
   - agents
   - conversations, messages
   - audit_logs, approval_queue
   - wallets, credit_transactions (اختیاری v0.1: فقط wallet + topup mock)

### مرحله C — API Service (Fastify)
1) Auth middleware (JWT placeholder در v0.1)
2) Agents endpoints
3) Chat endpoints (sync + stream)
4) Memory endpoints (write/search پایه)
5) Governance endpoints (audit list, approvals list/approve/reject)
6) Billing endpoints (wallet/transactions read-only)

### مرحله D — AI Gateway Service
1) provider connector
2) routing rules (intent-based ساده)
3) cost tracker
4) failover + retry

### مرحله E — Web Dashboard (Next.js)
1) login UI (mock ok)
2) agent list/create
3) chat view
4) wallet/audit basic view

### مرحله F — Plugin/Tool MVP
1) Tool registry (server-side)
2) Plugin manifest + permissions
3) Execution sandbox (v0.1: محدود/غیر-WASM؛ v0.2: WASM)

---

## ۴) قراردادهای مهم (Contracts)

### ۴.۱) Trace IDs
هر request یک `trace_id` می‌گیرد و در:
- logs
- audit_logs
- usage_events (آینده)
ثبت می‌شود.

### ۴.۲) Cost & Credits
هر LLM call باید:
- estimated cost
- final cost
را برگرداند و در audit log ثبت کند.

### ۴.۳) Approval chain
اگر `estimated_credits > threshold`:
- status=202
- approval_queue entry
- بعد از approve اجرا شود

---

## ۵) Minimal Tech Decisions (برای جلوگیری از ambiguity)

- Backend: Node.js + TypeScript + Fastify
- DB: PostgreSQL + Redis
- Streaming: SSE برای chat
- Queue: در MVP اختیاری (می‌توان in-process انجام داد)
- Auth: در MVP می‌تواند ساده باشد، اما multi-tenant headers باید enforce شوند

---

## ۶) فایل‌های مرجع داخل docs/spect

- Vision: `docs/spect/00_VISION/01-executive-summary.md`
- Differentiation: `docs/spect/00_VISION/07-competitive-positioning.md`
- Architecture: `docs/spect/02_ARCHITECTURE/01-system-overview.md`
- AI Gateway: `docs/spect/02_ARCHITECTURE/02-ai-gateway.md`
- OpenTelemetry: `docs/spect/02_ARCHITECTURE/08-observability-otel.md`
- Sandbox: `docs/spect/02_ARCHITECTURE/09-plugin-sandbox.md`
- RBAC/Policy: `docs/spect/02_ARCHITECTURE/10-rbac-and-policy.md`
- Secrets/KMS: `docs/spect/02_ARCHITECTURE/11-secrets-and-key-management.md`
- Memory: `docs/spect/00_VISION/03-memory-engine.md`
- DB master: `docs/spect/03_DATABASE/01-schema-master.md`
- Billing: `docs/spect/03_DATABASE/02-billing-schema.md`
- API: `docs/spect/04_API/01-rest-api-spec.md`
- OpenAPI: `docs/spect/04_API/00-openapi-v0.1.yaml`
- Billing API: `docs/spect/04_API/02-billing-and-marketplace-api.md`
- Connectors API: `docs/spect/04_API/03-connectors-memory-ingestion-api.md`
- Economy: `docs/spect/02_ARCHITECTURE/06-economy-and-marketplace.md`
- Connectors Spec: `docs/spect/02_ARCHITECTURE/07-connectors-and-tools.md`
- Marketplace Service: `docs/spect/02_ARCHITECTURE/12-marketplace-service.md`
- Four-Plane Architecture: `docs/spect/02_ARCHITECTURE/13-four-plane-architecture.md`
- Monorepo Layout: `docs/spect/02_ARCHITECTURE/14-monorepo-layout.md`
- MVP Guardrails: `docs/spect/09_TASKS/08-scope-guardrails-mvp.md`
- Production Artifacts: `docs/spect/09_TASKS/10-production-artifacts.md`
- i18n/l10n: `docs/spect/00_VISION/08-i18n-l10n.md`
- RBAC Defaults: `docs/spect/02_ARCHITECTURE/15-rbac-default-matrix.md`

---

> **خلاصه:** اگر Claude طبق این Build Pack مرحله‌به‌مرحله جلو برود، خروجی یک MVP قابل deploy است که “Digital Employee + Memory + Governance + Budget + Extensibility” را واقعاً اجرا می‌کند.
