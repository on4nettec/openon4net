# SLO / SLA — معیارهای تولید

هدف: تعیین معیارهای **قابل اندازه‌گیری** برای کیفیت سرویس (Availability/Latency/Error rate/Cost) تا بتوانیم:

1. تصمیم درست برای انتشار بگیریم، 2) روی production پایدار بمانیم، 3) در enterprise قابل دفاع باشیم.

---

## تعریف‌ها

- **SLI**: شاخص اندازه‌گیری (مثلاً P95 latency، درصد خطا).
- **SLO**: هدف داخلی تیم روی SLI (مثلاً 99.9%).
- **SLA**: تعهد قراردادی به مشتری (معمولاً برابر یا پایین‌تر از SLO).

---

## سطح بلوغ (Targets by stage)

| Stage              | هدف                   | SLA پیشنهادی      | نکته                                 |
| ------------------ | --------------------- | ----------------- | ------------------------------------ |
| MVP / Private demo | قابل دمو و قابل دیباگ | ندارد             | تمرکز روی traceability و کنترل هزینه |
| Beta (SMB)         | پایدار + self-serve   | 99.5% (پیشنهادی)  | نیاز به alerting و runbook حداقلی    |
| GA (SMB)           | رشد پایدار            | 99.9% (پیشنهادی)  | error budget + regression suite      |
| Enterprise Ready   | قرارداد سازمانی       | 99.9%+ (پیشنهادی) | DR، SSO، audit evidence              |

---

## SLOهای حداقلی (Service-level)

> ابزار اندازه‌گیری: `docs/spect/02_ARCHITECTURE/08-observability-otel.md`

### 1) API / Gateway (Chat path)

| SLI                          | SLO (GA)     | اندازه‌گیری                            |
| ---------------------------- | ------------ | -------------------------------------- |
| Availability                 | 99.9% ماهانه | موفقیت درخواست‌های 2xx/stream-complete |
| Latency (non-stream)         | P95 < 2s     | از request تا اولین پاسخ               |
| Time-to-first-token (stream) | P95 < 1.5s   | شروع stream تا اولین chunk             |
| Error rate                   | < 1%         | خطای سرویس (5xx) و timeouts            |

### 2) Memory (Read path)

| SLI                    | SLO (GA)    | اندازه‌گیری                         |
| ---------------------- | ----------- | ----------------------------------- |
| Memory query latency   | P95 < 200ms | queryهای L1/L2/L3                   |
| Retrieval success rate | > 99%       | درصد queryهای موفق                  |
| Data loss              | 0           | پیام‌های conversation نباید گم شوند |

### 3) Marketplace / Plugins

| SLI                  | SLO (GA)   | اندازه‌گیری                 |
| -------------------- | ---------- | --------------------------- |
| Install success rate | > 99%      | نصب/فعال‌سازی موفق          |
| Sandbox violations   | 0 critical | escape/privilege escalation |

### 4) Cost & Limits (FinOps SLO)

| SLI                | SLO         | اندازه‌گیری                           |
| ------------------ | ----------- | ------------------------------------- |
| Cost overrun       | < 5% ماهانه | هزینه واقعی نسبت به بودجه             |
| Budget enforcement | 100%        | درخواست خارج از budget باید block شود |

---

## Severity و سیاست incident (Minimal)

| Sev   | تعریف                                      | هدف پاسخ                 |
| ----- | ------------------------------------------ | ------------------------ |
| Sev-1 | سرویس اصلی down / data loss / امنیت بحرانی | اعلام + mitigation فوری  |
| Sev-2 | اختلال جدی/کندی شدید برای بخش بزرگی        | triage سریع + workaround |
| Sev-3 | باگ/کُندی محدود                            | در backlog + زمان‌بندی   |

---

## SLA پیشنهادی (قابل مذاکره)

> SLA را بعد از حداقل 4 هفته داده تولید (production telemetry) نهایی کنید.

- **SMB (GA):** 99.9% ماهانه برای API، credit در صورت نقض.
- **Enterprise:** 99.9%+ + تعهد RTO/RPO (طبق `docs/spect/09_TASKS/05-disaster-recovery.md`).
