# Security Operations Runbook — Open on4net (O₂N)

> **فایل:** 09_TASKS/07-security-ops-runbook.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف

این runbook برای مدیریت عملیاتی امنیت است:
- incident response
- key/secret rotation
- plugin kill switch
- webhook/connector compromise
- forensic با audit/tracing

---

## ۲) Incident Severity Levels

- **P0**: data breach / wallet compromise / cross-tenant leak
- **P1**: auth bypass / plugin sandbox escape / critical vuln
- **P2**: suspicious activity / excessive costs / connector abuse
- **P3**: minor security bugs

---

## ۳) Incident Response (Checklist)

### ۳.۱) Detect
- alert از monitoring (errors/spikes)
- anomaly در usage/credits
- report کاربر

### ۳.۲) Contain
- disable affected connector installs
- disable affected plugin installs (kill switch)
- rotate secrets
- rate limit / block IPs

### ۳.۳) Eradicate
- patch vulnerability
- revoke leaked tokens
- invalidate sessions/JWT keys (rotate)

### ۳.۴) Recover
- restore services
- validate data integrity
- monitor closely (tail sampling 100% for affected tenants)

### ۳.۵) Postmortem
- timeline با trace_id/audit_logs
- root cause
- action items + ADR update

---

## ۴) Secret Rotation Runbook

### ۴.۱) Model Provider Keys
1) create new key
2) update secret store
3) reload services (no downtime preferred)
4) revoke old key
5) audit: record rotation event

### ۴.۲) Connector OAuth Tokens
1) revoke connector access
2) force re-auth for affected installs
3) verify scopes/allowlist
4) re-run delta sync

---

## ۵) Plugin Kill Switch

### ۵.۱) وقتی لازم است؟
- suspicious network activity
- cost runaway
- reported malware

### ۵.۲) اقدام
1) disable plugin at org/workspace level
2) block host functions for that install
3) invalidate cached plugin package
4) notify org admins
5) preserve evidence (logs + traces + manifests hash)

---

## ۶) Forensics (Audit + Tracing)

برای بررسی یک رخداد:
1) پیدا کردن `trace_id` (از UI/API response)
2) جستجو در `audit_logs` برای همان بازه
3) correlate با `usage_events` (credits/model/plugin)
4) استخراج timeline

---

## ۷) Cross-tenant Leak Response (P0)

1) immediately block read endpoints (feature flag)
2) identify query path causing leak
3) run tenant isolation verification script/tests
4) notify affected customers (policy)
5) hotfix + retro audit

---

> **خلاصه:** این runbook مسیر عملیاتی برای مدیریت incidentها، rotation، kill switch و forensics را تعریف می‌کند تا امنیت فقط “نظری” نباشد.

