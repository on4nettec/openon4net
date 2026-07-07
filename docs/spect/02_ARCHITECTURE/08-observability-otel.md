# Observability & OpenTelemetry Spec — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/08-observability-otel.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف

O₂N یک سیستم چندلایه (API → Orchestration → AI Gateway → Memory → Tools/Plugins) است. بدون tracing استاندارد:
- دیباگ سخت می‌شود
- هزینه/latency قابل کنترل نیست
- audit و governance ناقص می‌شود

بنابراین OpenTelemetry در O₂N باید **پایه و اجباری** باشد.

---

## ۲) اصول

- هر request ورودی یک `trace_id` و `request_id` دارد.
- `trace_id` باید در همه سرویس‌ها propagate شود.
- هر action قابل هزینه‌کرد (LLM call / tool call / plugin execution / workflow step) باید **span** داشته باشد.
- هر span باید **attributes استاندارد** داشته باشد تا گزارش‌گیری و alerting ممکن شود.

---

## ۳) Trace Context Propagation

### ۳.۱) ورودی HTTP
- Headerهای ورودی:
  - `traceparent` (W3C)
  - `tracestate` (اختیاری)
  - `x-request-id` (اگر نبود، تولید شود)
  - `x-trace-id` (اختیاری؛ اما منبع اصلی، OTel است)

### ۳.۲) بین سرویس‌ها
- HTTP/RPC داخلی:
  - `traceparent` + `x-request-id` باید منتقل شود
- Queue/event:
  - `traceparent` در metadata پیام ذخیره شود

### ۳.۳) ذخیره‌سازی
برای correlation:
- `audit_logs` باید `trace_id` داشته باشد (یا در `action_data`/metadata)
- `usage_events` باید `trace_id` داشته باشد

---

## ۴) Span Naming Convention

قانون: نام span باید stable و قابل گروه‌بندی باشد.

### ۴.۱) API
- `http.server` span (auto instrumentation)
- نام:
  - `HTTP {method} {route}`  
  مثال: `HTTP POST /agents/{agent_id}/chat`

### ۴.۲) Orchestration
- `o2n.agent.chat`
- `o2n.workflow.run`
- `o2n.workflow.step`
- `o2n.governance.check`
- `o2n.approval.enqueue`

### ۴.۳) AI Gateway
- `o2n.ai.route`
- `o2n.ai.call`
- `o2n.ai.fallback`
- `o2n.ai.cache.lookup`

### ۴.۴) Memory Engine
- `o2n.memory.read`
- `o2n.memory.write`
- `o2n.memory.search`
- `o2n.memory.graph.query`
- `o2n.memory.ingest`

### ۴.۵) Tools/Plugins
- `o2n.tool.execute`
- `o2n.plugin.execute`
- `o2n.connector.sync`

---

## ۵) Required Attributes (Minimum Set)

این attributes باید روی spanهای کلیدی ثبت شوند:

### ۵.۱) Tenant Context
- `o2n.organization_id`
- `o2n.workspace_id` (اختیاری)
- `o2n.user_id` (اختیاری)
- `o2n.agent_id` (اختیاری)
- `o2n.agent_role` (اختیاری)

### ۵.۲) Governance/Budget
- `o2n.requires_approval` (bool)
- `o2n.approval_id` (اختیاری)
- `o2n.budget.remaining_credits` (اختیاری)

### ۵.۳) Cost
برای هر LLM/tool/plugin step:
- `o2n.cost.estimated_credits`
- `o2n.cost.final_credits`
- `o2n.cost.provider` (openai/anthropic/local/…)
- `o2n.cost.model` (gpt-4o/…)
- `o2n.tokens.input` (اختیاری)
- `o2n.tokens.output` (اختیاری)

### ۵.۴) Workflow/Skill
- `o2n.workflow_id` / `o2n.workflow_run_id`
- `o2n.workflow_step_id`
- `o2n.skill_id`

### ۵.۵) Plugin/Tool
- `o2n.plugin_id`
- `o2n.plugin_install_id`
- `o2n.tool_id`
- `o2n.idempotency_key`

---

## ۶) Error Policy

قواعد:
- هر خطا باید روی span ثبت شود (`status=ERROR`) + `exception.*`
- برای خطاهای provider:
  - `o2n.provider.error_code`
  - `o2n.provider.http_status`
  - `o2n.provider.retryable` (bool)

---

## ۷) Sampling Strategy (پیشنهادی)

برای کنترل هزینه/حجم:
- head sampling: 5% برای ترافیک عادی
- tail sampling: 100% برای:
  - `status=ERROR`
  - `o2n.requires_approval=true`
  - `o2n.cost.final_credits > threshold`
  - `p95 latency` بالا

---

## ۸) Export Pipeline (Reference Architecture)

### ۸.۱) Traces
- OTel SDK → OTel Collector → (Jaeger / Tempo / Honeycomb / OTLP endpoint)

### ۸.۲) Metrics
- Prometheus scrape یا OTLP metrics → Prometheus/Grafana

### ۸.۳) Logs
- JSON logs با `trace_id` → Loki/Elastic

---

## ۹) Implementation Notes (برای تیم سازنده)

حداقل الزامات پیاده‌سازی:
- در API Gateway و سرویس‌ها auto-instrumentation فعال باشد
- برای LLM calls و tool/plugin execution instrumentation دستی اضافه شود (span + attrs)
- `trace_id` در پاسخ‌های کلیدی API برگردد (برای پشتیبانی/دیباگ)

---

> **خلاصه:** O₂N باید OpenTelemetry را به‌عنوان ستون فقرات observability اجرا کند: trace propagation، spanهای استاندارد برای agent/workflow/model/plugin، و attributes اجباری برای cost/governance/tenant.

