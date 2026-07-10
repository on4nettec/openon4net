# Done Log

> به‌روزرسانی می‌شود بعد از هر تسک تکمیل‌شده. هدف: تصویر سریع از اینکه چقدر
> پروژه واقعاً ساخته شده، بدون نیاز به مرور کل تاریخچه commitها.
>
> **Scope:** فقط `apps/openon4net-runtime` (Plane 1) — طبق تصمیم صریح کاربر،
> کار روی سه Plane دیگر (`control-plane`/`memory`/`marketplace`) شروع نشده
> مگر جایی که به‌صراحت خواسته بشه. برای نقشه کامل ۱۲ماهه/۴-Plane به
> `docs/sprint-plan/*.md` نگاه کن.
>
> **ستون «تست»:**
>
> - ✅ = واقعاً end-to-end روی زیرساخت واقعی اجرا و تأیید شده (curl/مرورگر واقعی، نه فقط build/typecheck)
> - ⚠️ = کد کامل و build/typecheck سبز، ولی رفتار واقعی‌اش مستقیماً چک نشده
> - ❌ = اصلاً پیاده‌سازی/تست نشده

**آخرین به‌روزرسانی:** 2026-07-10

---

## خلاصه وضعیت

| بخش                               | وضعیت                                                |
| --------------------------------- | ---------------------------------------------------- |
| Runtime — Sprint 0 (T-001..T-008) | ۸ از ۸ تکمیل، همه تست‌شده به‌جز نکته CI زیر          |
| Runtime — کارهای بعد از Sprint 0  | ۷ فیچر تکمیل، همه تست‌شده به‌جز ارسال واقعی تلگرام   |
| Control Plane (Plane 2)           | شروع نشده — فقط README                               |
| Memory (Plane 3)                  | فقط اسکلت اولیه `service/` (Fastify+Zod، روت‌ها 501) |
| Marketplace (Plane 4)             | شروع نشده — فقط README                               |

---

## Sprint 0 — `docs/spect/09_TASKS/01-current-sprint.md`

| #     | تسک                                                                   | وضعیت                                            | تست                                                                 |
| ----- | --------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| T-001 | Monorepo Setup (pnpm+turbo، packages/shared،governance،llm-providers) | ✅                                               | ✅ build/typecheck/lint سبز                                         |
| T-002 | Docker Compose Dev Environment (Postgres/Redis/MinIO/migrations)      | ✅                                               | ✅ 8 جدول ساخته شده، سرویس‌ها healthy                               |
| T-003 | AI Gateway — اولین اتصال مدل (BYOK, یک provider)                      | ✅                                               | ✅ تماس واقعی با Ollama                                             |
| T-004 | Basic Chat API (sync + SSE stream)                                    | ✅                                               | ✅ هر دو مسیر با پیام واقعی                                         |
| T-005 | Next.js Dashboard MVP                                                 | ✅                                               | ✅ login→list→create→chat با Playwright واقعی                       |
| T-006 | GitHub CI/CD                                                          | ✅ (فایل‌ها موجود: `ci.yml`, `docker-build.yml`) | ⚠️ در این نشست push واقعی برای تأیید سبز بودن روی Actions انجام نشد |
| T-007 | Memory Layer 1 (Redis) & 2 (Postgres)                                 | ✅                                               | ✅ پیام‌ها/summary در DB و session در Redis تأیید شد                |
| T-008 | Agent Lifecycle (CRUD + pause/resume/terminate)                       | ✅                                               | ✅ از طریق API و داشبورد                                            |

---

## بعد از Sprint 0 (بدون شناسه رسمی — از تحلیل شکاف sprint-plan)

| فیچر                                                          | وضعیت      | تست                                                                                                            |
| ------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| Approval queue (تأیید/رد + اجرای مجدد بعد از تأیید)           | ✅         | ✅ شامل حالت با provider override شده                                                                          |
| Telegram send tool (اسکلت + اتصال واقعی به Telegram Bot API)  | ✅ کد کامل | ❌ ارسال واقعی تست نشده (نیاز به bot token واقعی — به تعویق افتاده)                                            |
| داشبورد: pause/resume/terminate/test-connection               | ✅         | ✅ با Playwright واقعی                                                                                         |
| SSE reconnect handling (قطع اتصال وسط استریم)                 | ✅         | ✅ شبیه‌سازی قطع با Playwright                                                                                 |
| ONBOARDING.md                                                 | ✅         | n/a (مستندسازی)                                                                                                |
| Observability — Prometheus `/metrics` (معادل T-020)           | ✅         | ✅ HTTP + LLM metrics، هم مسیر sync هم stream                                                                  |
| BYOK config قابل‌ویرایش per-organization (رمزنگاری‌شده در DB) | ✅         | ✅ شامل: 403 برای non-admin، 400 برای payload نامعتبر، تعامل با approval queue، رمزنگاری واقعی در DB تأیید شده |

---

## صریحاً انجام‌نشده (شناخته‌شده، نه فراموش‌شده)

- **T-009 (Secrets/KMS واقعی):** فقط نسخه MVP env-first + رمزنگاری envelope در DB برای BYOK per-org ساخته شده؛ یکپارچگی با Vault/secret manager واقعی (برای production/enterprise) ساخته نشده.
- **RBAC کامل:** نقش‌ها/دسترسی‌ها هنوز hardcoded در `packages/governance/src/permissions.ts`؛ جدول‌های `roles`/`policies` در DB وجود ندارد.
- **حافظه معنایی/vector search:** فقط L1(Redis)/L2(Postgres) با جستجوی متنی ساده؛ لایه‌های 3-6 و embeddings ساخته نشده.
- **اجرای پلاگین/marketplace:** خارج از scope فعلی.
- **Control Plane / Memory / Marketplace:** طبق تصمیم صریح کاربر، شروع نشده مگر درخواست جداگانه.

---

## نحوه به‌روزرسانی این فایل

بعد از هر تسک/فیچر تکمیل‌شده: یک ردیف جدید یا تغییر وضعیت یک ردیف موجود،
با ستون تست دقیق (✅/⚠️/❌ — نه خوش‌بینانه). اگر تسکی نیمه‌کاره موند، همینجا
با ⚠️ یا یادداشت کوتاه مشخص بشه، نه اینکه حذف بشه.
