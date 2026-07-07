# Plugin Sandbox (Isolation & Runtime) — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/09-plugin-sandbox.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف

O₂N باید اجازه دهد توسعه‌دهندگان plugin/tool بسازند، اما:
- بدون اینکه plugin بتواند به داده‌های غیرمجاز دسترسی بگیرد
- بدون اینکه بتواند شبکه/فایل/سیستم را سوءاستفاده کند
- و بدون اینکه بتواند هزینه را از کنترل خارج کند

بنابراین اجرای plugin باید **sandboxed** باشد.

---

## ۲) Threat Model (حداقل)

تهدیدهای اصلی:
- **Data exfiltration**: خواندن Memory/Secrets بدون مجوز
- **Privilege escalation**: دور زدن RBAC/permissions
- **Abuse of network**: ارسال درخواست به مقصدهای غیرمجاز
- **Infinite loops / resource exhaustion**: CPU/RAM/time
- **Duplicate side-effects**: دوبار ارسال پیام/پست/خرید

---

## ۳) Sandbox Levels (Roadmap-based)

### Level 0 — In-process (فقط برای first-party)
برای MVP اولیه، فقط pluginهای first-party اجازه اجرا دارند و در process اصلی اجرا می‌شوند؛
اما همچنان باید:
- permission checks
- budget caps
- audit logs
اجرا شود.

### Level 1 — Isolated Process
plugin runtime در یک process جدا اجرا می‌شود:
- محدودیت CPU/RAM/time
- ارتباط فقط از طریق RPC محدود

### Level 2 — WASM Sandbox (هدف اصلی)
pluginها در WASM runtime اجرا می‌شوند:
- no direct filesystem
- no direct network مگر از طریق host functions کنترل‌شده
- deterministic resource limits

> هدف O₂N برای third-party plugins: Level 2 (WASM).

---

## ۴) Runtime Choice (Reference)

برای Node.js backend، گزینه‌های قابل قبول:
- Wasmtime (WASM runtime)
- Wasmer

انتخاب نهایی می‌تواند در پیاده‌سازی تغییر کند، اما contractها ثابت می‌مانند:
- host functions مشخص
- permissions enforce
- metering
- timeouts

---

## ۵) Host Functions (Capabilities API)

plugin در WASM فقط از طریق host functions می‌تواند کاری انجام دهد.

نمونه host functions:
- `o2n.http.request(...)`  (با allowlist + rate limit)
- `o2n.memory.read(...)` / `o2n.memory.write(...)`
- `o2n.files.get_presigned_url(...)` (MinIO)
- `o2n.audit.log(...)`
- `o2n.crypto.random(...)` (امن)

هر host function باید:
- permission check کند
- budget check کند (credits)
- trace_id را propagate کند
- audit/usage event ثبت کند

---

## ۶) Network Policy

قواعد پیشنهادی:
- default deny
- allowlist per plugin install (domain/IP)
- محدودیت نرخ درخواست
- محدودیت payload size

اگر plugin `http:send` ندارد → هر network call رد شود.

---

## ۷) Filesystem Policy

در WASM:
- دسترسی مستقیم filesystem ممنوع
- فقط “object storage” از طریق MinIO (presigned URL) و policy-based

---

## ۸) Resource Limits (Metering)

حداقل محدودیت‌ها:
- `max_execution_ms` (مثلاً 5s)
- `max_memory_mb` (مثلاً 64MB)
- `max_cpu_ms` (metered)
- `max_http_calls` per execution

---

## ۹) Idempotency & Side Effects

برای tool/pluginهایی که side-effect دارند (send-email, post-social, purchase):
- `idempotency_key` اجباری
- host function باید idempotent باشد (ledger + external id caching)

---

## ۱۰) Observability & Audit (اجباری)

برای هر execution:
- یک span: `o2n.plugin.execute`
- attributes: `o2n.plugin_id`, `o2n.plugin_install_id`, `o2n.cost.*`
- ثبت `audit_logs`
- ثبت `usage_events`

ارجاع: `02_ARCHITECTURE/08-observability-otel.md`

---

## ۱۱) Security Review & Publishing Policy

برای انتشار در Marketplace:
- static checks (manifest/permissions)
- signature verification
- (اختیاری v1) manual review
- verified publisher program

ارجاع: `08_CODING_STANDARD/02-security.md`

---

> **خلاصه:** Sandbox در O₂N یک سیستم isolation + capability-based execution است که برای third-party plugins نهایتاً باید WASM باشد؛ با permission enforcement، metering، idempotency، audit و tracing استاندارد.

