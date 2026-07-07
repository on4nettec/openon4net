# Database migrations (PostgreSQL)

این پوشه شامل migrationهای SQL برای ساخت اسکیمای MVP است.

## ترتیب اجرا
1) `0001_core.sql`
2) `0002_plugins_connectors.sql`
3) `0003_billing.sql`
4) `0004_rbac_policies.sql`
5) `0005_marketplace_registry.sql` (اختیاری برای MVP)

## پیش‌نیازها
- PostgreSQL 16+
- Extensions:
  - `pgcrypto` (برای UUID)
  - `vector` (pgvector) در صورت استفاده از embedding columns

## نکته اجرایی
SQLها تا حد ممکن idempotent نوشته شده‌اند، اما در محیط‌های واقعی بهتر است با یک ابزار migration (مثل `node-pg-migrate`/Flyway/Liquibase) اجرا شوند.

