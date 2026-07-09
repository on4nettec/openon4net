# Release Gates — گیت‌های انتشار (PR → Staging → Production)

هدف: هر انتشار قبل از رفتن به production از یک سری «شرط عبور» بگذرد تا ریسک کاهش یابد.

---

## Gate 0 — PR Gate (قبل از merge)

**بایدها**

- lint + typecheck پاس شود
- unit tests (حداقل سرویس‌های تغییر کرده) پاس شود
- migrationها (اگر هست) review شود
- تغییرات config و secrets بدون hardcode باشد

**خروجی**

- artifactهای build قابل تولید
- changelog کوتاه یا خلاصه تغییرات

---

## Gate 1 — Staging Gate (قبل از production)

**بایدها**

- integration tests و smoke tests پاس شود (chat path + auth + memory read/write)
- health checks همه سرویس‌ها سبز
- observability: log/trace/metrics برای مسیرهای اصلی فعال
- load smoke (حداقل 10–20 دقیقه) بدون error spike
- rollback plan مشخص (feature flag یا نسخه قبل)

**خروجی**

- لینک دمو در staging + سناریوی تست دستی

---

## Gate 2 — Production Gate (قبل از GA)

**بایدها**

- SLO dashboard آماده (حداقل Availability/Error/Latency)
- alerting و on-call ownership مشخص
- runbookهای حیاتی موجود و تمرین‌شده
- security review برای تغییرات حساس (auth, RBAC, plugins, billing)
- DR/backup حداقلی فعال (حداقل backup + restore test)

**خروجی**

- release note + شماره نسخه + زمان‌بندی rollout

---

## Gateهای اختصاصی (Enterprise)

**برای قرارداد سازمانی**

- SSO (OIDC/SAML) + audit evidence
- key management/rotation automation
- data retention و export/delete policy
- دسترسی‌ها: RBAC matrix enforce شده و access review دوره‌ای
- گزارش‌های امنیتی/کامپلاینس آماده (SOC2-ready checklist)

---

## قالب چک‌لیست انتشار (کپی/پیست)

```md
## Release X.Y.Z

- [ ] PR gate pass
- [ ] Staging smoke pass
- [ ] Migration reviewed + safe rollback
- [ ] SLO dashboards updated
- [ ] Alerts in place
- [ ] Runbooks updated
- [ ] Security review (if needed)
- [ ] Rollout plan (canary/gradual)
- [ ] Rollback plan validated
```
