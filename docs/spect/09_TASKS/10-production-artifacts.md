# Production Artifacts Checklist (MVP+) — Open on4net (O₂N)

> **فایل:** 09_TASKS/10-production-artifacts.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف

این سند لیست artefactهای اجرایی را کنار docs می‌آورد تا پیاده‌سازی “قابل اجرا” شود:
- OpenAPI قرارداد دقیق
- migrations واقعی دیتابیس
- observability configs (OTel/Prometheus/Grafana)
- RBAC defaults
- i18n/l10n baseline

---

## ۲) OpenAPI (Source of Truth)

- `docs/spect/04_API/00-openapi-v0.1.yaml`

---

## ۳) Database Migrations (SQL)

- `tools/migrations/README.md`
- `tools/migrations/0001_core.sql`
- `tools/migrations/0002_plugins_connectors.sql`
- `tools/migrations/0003_billing.sql`
- `tools/migrations/0004_rbac_policies.sql`
- `tools/migrations/0005_marketplace_registry.sql` (اختیاری)

---

## ۴) Observability (OTel + Prometheus + Grafana)

- `ops/observability/README.md`
- `ops/observability/otel-collector.yaml`
- `ops/observability/prometheus-alerts.yaml`
- `ops/observability/grafana-dashboard-o2n.json`

---

## ۵) RBAC Default Matrix

- `docs/spect/02_ARCHITECTURE/15-rbac-default-matrix.md`

---

## ۶) Multilingual (i18n/l10n)

- `docs/spect/00_VISION/08-i18n-l10n.md`

---

> **خلاصه:** با این artefactها، docs از “شرح” به “قرارداد و فایل‌های اجرایی” نزدیک می‌شود و پیاده‌سازی کم‌ابهام‌تر خواهد بود.

