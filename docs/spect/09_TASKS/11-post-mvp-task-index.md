# Post-MVP Task Index — Open on4net (O₂N)

> **هدف:** یک نمای واحد برای همه‌ی تسک‌هایی که بعد از MVP می‌آیند تا بتوانی
> بدون جستجو در چند فایل، کل نقشه‌ی پس از MVP را بررسی کنی.
>
> **دامنه:** فقط تسک‌های تعریف‌شده‌ی فعلی در `docs/spect/09_TASKS/*.md`
> که عمداً بعد از MVP یا خارج از MVP-lite قرار می‌گیرند.
>
> **نکته:** تسک‌های انجام‌شده در این فایل تکرار نشده‌اند؛ آن‌ها در `docs/spect/DONE.md`
> ثبت شده‌اند. این فایل روی موارد باقی‌مانده و قابل‌بررسی تمرکز دارد.

---

## 1) Plane 1 — Runtime / Customer Runtime

| Task   | عنوان                                 | چرا post-MVP است؟                                   | منبع                                    |
| ------ | ------------------------------------- | --------------------------------------------------- | --------------------------------------- |
| RT-021 | صفحه Chat مطابق UI مرجع + RTL/LTR     | polish و تکمیل تجربه کاربری بعد از هسته چت          | `docs/spect/TODO-openon4net-runtime.md` |
| RT-022 | Session management در UI              | مدیریت چند session برای هر Agent بعد از core chat   | `docs/spect/TODO-openon4net-runtime.md` |
| RT-023 | Agent picker + ساخت Agent با modal    | بهبود UX ساخت Agent بعد از CRUD پایه                | `docs/spect/TODO-openon4net-runtime.md` |
| RT-025 | Workspace فایل‌محور per-agent         | ساخت workspace اختصاصی و جداسازی فایل‌ها            | `docs/spect/TODO-openon4net-runtime.md` |
| RT-026 | Skill grants per-agent                | کنترل اعطای skill/tool به هر Agent                  | `docs/spect/TODO-openon4net-runtime.md` |
| RT-027 | نصب ابزار/پلاگین از Marketplace + ZIP | extensibility واقعی بعد از MVP core                 | `docs/spect/TODO-openon4net-runtime.md` |
| RT-028 | Feature gating برای skills توسعه      | کنترل licensing/availability برای skills ویژه       | `docs/spect/TODO-openon4net-runtime.md` |
| RT-030 | Settings: branding / logo             | سفارشی‌سازی سازمانی بعد از core product             | `docs/spect/TODO-openon4net-runtime.md` |
| RT-031 | Context Contract + Prompt Builder     | تبدیل context به artifact رسمی و ورودی فشرده به LLM | `docs/spect/TODO-openon4net-runtime.md` |

### موارد runtime که قبلاً از MVP عبور کرده‌اند

- RT-013: حافظه معنایی لایه‌های ۳-۶ + Memory Graph

---

## 2) Plane 2 — Control Plane / Monetization & Governance

| Task   | عنوان                               | چرا post-MVP است؟                         | منبع                                     |
| ------ | ----------------------------------- | ----------------------------------------- | ---------------------------------------- |
| CP-006 | Observability فراتر از trace-id     | نیاز به monitoring جدی‌تر بعد از MVP-lite | `docs/spect/TODO-openon4net-platform.md` |
| CP-007 | مستندسازی/بهبود rate limiter        | hardening برای مقیاس بالاتر               | `docs/spect/TODO-openon4net-platform.md` |
| CP-011 | Admin auth واقعی‌تر                 | چند admin و audit کامل‌تر                 | `docs/spect/TODO-openon4net-platform.md` |
| CP-012 | Managed AI Gateway                  | routing/failover/cost tracking مدیریت‌شده | `docs/spect/TODO-openon4net-platform.md` |
| CP-013 | Billing واقعی                       | payment provider + ledger + settlement    | `docs/spect/TODO-openon4net-platform.md` |
| CP-014 | رفع race در `turbo.json`            | hardening build pipeline و workflow       | `docs/spect/TODO-openon4net-platform.md` |
| CP-015 | fix اعتبارسنجی UUID در admin routes | bugfix کیفیتی قبل از scale-up             | `docs/spect/TODO-openon4net-platform.md` |
| CP-016 | تست‌های واقعی برای `web/`           | پوشش سطح UI/interaction                   | `docs/spect/TODO-openon4net-platform.md` |
| CP-017 | healthcheck واقعی برای compose      | اطمینان از readiness سرویس‌ها             | `docs/spect/TODO-openon4net-platform.md` |
| CP-018 | CORS allowlist صریح                 | کاهش ریسک امنیتی در deployment            | `docs/spect/TODO-openon4net-platform.md` |

### موارد control-plane که قبلاً از MVP عبور کرده‌اند

- CP-008: Runtime activation client
- CP-009: commit کردن repo جداگانه control-plane
- CP-010: submodule/repo integration

---

## 3) Plane 3 — Memory / Long-term Memory

> **۲۰۲۶-۰۷-۱۲: این بخش دیگر post-MVP نیست.** کاربر صریحاً guardrail را عبور
> داد و MEM-008..013 را همین حالا انجام دادیم (self-host واقعی: Postgres/pgvector
>
> - Neo4j اختصاصی، نه یک ارائه‌دهنده‌ی managed). جدول زیر فقط برای تاریخچه نگه
>   داشته شده؛ وضعیت واقعی و جزئیات تست‌شده/نشده در `docs/spect/TODO-openon4net-memory.md`
>   بخش C است.

| Task    | عنوان                            | چرا post-MVP بود                            | وضعیت                                          | منبع                                   |
| ------- | -------------------------------- | ------------------------------------------- | ---------------------------------------------- | -------------------------------------- |
| MEM-008 | اتصال واقعی Postgres             | metadata و storage واقعی برای memory layers | ✅ انجام شد                                    | `docs/spect/TODO-openon4net-memory.md` |
| MEM-009 | pgvector semantic search         | جستجوی معنایی واقعی برای `/memory/search`   | ✅ کد آماده، مسیر semantic (Ollama) تست نشده   | `docs/spect/TODO-openon4net-memory.md` |
| MEM-010 | Neo4j graph queries واقعی        | query گرافی برای `/memory/graph`            | ✅ انجام و تست شد                              | `docs/spect/TODO-openon4net-memory.md` |
| MEM-011 | envelope encryption / BYOK       | امنیت managed data قبل از production        | ✅ Layer 5 انجام و تست شد؛ BYOK مشتری هنوز نه  | `docs/spect/TODO-openon4net-memory.md` |
| MEM-012 | import/export/reindex واقعی      | ingest و reindex عملیاتی                    | ✅ ایجاد job تست شد؛ خود پردازش async تست نشده | `docs/spect/TODO-openon4net-memory.md` |
| MEM-013 | retention/deletion + audit trail | lifecycle governance و compliance           | ✅ انجام و تست شد                              | `docs/spect/TODO-openon4net-memory.md` |

### موارد memory که قبلاً از MVP عبور کرده‌اند

- MEM-001..MEM-007: اسکلت، CI، auth ساده، trace propagation، و مستندسازی پایه

---

## 4) Plane 4 — Marketplace / Extensibility

| Task    | عنوان                                   | چرا post-MVP است؟                        | منبع                                        |
| ------- | --------------------------------------- | ---------------------------------------- | ------------------------------------------- |
| MKT-012 | Public marketplace واقعی                | رفتن از local/private به ecosystem عمومی | `docs/spect/TODO-openon4net-marketplace.md` |
| MKT-013 | Review pipeline خودکار + manual review  | governance برای publisherها و artifactها | `docs/spect/TODO-openon4net-marketplace.md` |
| MKT-014 | Signing سخت‌گیرانه + verified publisher | زنجیره اعتماد برای distribution عمومی    | `docs/spect/TODO-openon4net-marketplace.md` |
| MKT-015 | Revenue share ledger + payout queue     | monetization واقعی برای marketplace      | `docs/spect/TODO-openon4net-marketplace.md` |
| MKT-016 | Kill switch platform-level + CDN        | عملیات production در مقیاس بزرگ          | `docs/spect/TODO-openon4net-marketplace.md` |

### موارد marketplace که قبلاً از MVP عبور کرده‌اند

- MKT-001..MKT-011: اسکلت سرویس، local/private install، routes پایه، و hardening سطح اول

---

## 5) جمع‌بندی سریع برای بررسی CTO

- **هسته MVP** در Plane 1 می‌ماند.
- **post-MVP واقعی** بیشتر روی 4 چیز است: `Context Contract`, `Managed AI/Billing`, `Memory واقعی`, `Marketplace عمومی`.
- اگر بخواهی، قدم بعدی این است که همین index را به **Roadmap اجرایی ۱۲ ماهه** وصل کنیم تا هر task دقیقاً به sprint و epic خودش map شود.
