# Production Readiness — شاخص‌های تولید

این پوشه برای تبدیل «Spec/Plan» به «قابل‌تولید (Production-ready)» است؛ یعنی معیارهای قابل‌سنجش، گیت‌های انتشار، امنیت/کامپلاینس، عملیات، و مدل ظرفیت/هزینه.

## فایل‌ها

- `SLO-SLA.md`: تعریف SLI/SLO/SLA و هدف‌های قابل اندازه‌گیری برای سرویس‌ها.
- `release-gates.md`: چک‌لیست گیت‌های لازم برای PR/Staging/Production و شرایط عبور.
- `security-compliance.md`: کنترل‌های امنیتی و مسیر آماده‌سازی enterprise (SSO، audit، encryption، evidence).
- `ops-runbooks-index.md`: فهرست runbookها (با لینک به runbookهای موجود در `docs/spect/09_TASKS/`).
- `capacity-cost-model.md`: مدل ظرفیت/هزینه + guardrails و بودجه/کوتا.

## ارتباط با مستندات موجود

- Observability: `docs/spect/02_ARCHITECTURE/08-observability-otel.md`
- RBAC/Policy: `docs/spect/02_ARCHITECTURE/10-rbac-and-policy.md`, `docs/spect/02_ARCHITECTURE/15-rbac-default-matrix.md`
- Secrets: `docs/spect/02_ARCHITECTURE/11-secrets-and-key-management.md`
- Security/Threat model: `docs/spect/08_CODING_STANDARD/02-security.md`, `docs/spect/08_CODING_STANDARD/04-threat-model.md`
- Ops tasks: `docs/spect/09_TASKS/02-deployment.md`, `docs/spect/09_TASKS/03-monitoring.md`, `docs/spect/09_TASKS/05-disaster-recovery.md`, `docs/spect/09_TASKS/07-security-ops-runbook.md`
