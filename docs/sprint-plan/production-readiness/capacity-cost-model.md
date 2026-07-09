# Capacity & Cost Model — ظرفیت، هزینه، و Guardrails

هدف: قبل از production/scale بدانیم «چه چیزی هزینه‌ساز است»، «کجا می‌شکند»، و چه محدودیت‌هایی باید enforce شود.

مراجع:

- AI Gateway: `docs/spect/02_ARCHITECTURE/02-ai-gateway.md`
- Observability: `docs/spect/02_ARCHITECTURE/08-observability-otel.md`
- Performance: `docs/spect/09_TASKS/04-performance.md`
- Billing schema: `docs/spect/03_DATABASE/02-billing-schema.md`

---

## 1) واحدهای ظرفیت (Capacity units)

- **RPS / RPM**: درخواست‌ها در ثانیه/دقیقه (chat، memory query، ingestion)
- **Concurrency**: تعداد درخواست هم‌زمان (خصوصاً stream)
- **Tokens**: ورودی/خروجی LLM (driver اصلی هزینه)
- **Ingestion throughput**: اسناد/MB در دقیقه
- **Storage**: پیام‌ها، embeddingها، graph

---

## 2) مدل هزینه (Cost drivers)

### LLM cost (تقریب)

- `LLM_cost = (input_tokens * in_price + output_tokens * out_price) / 1e6`
- `Total_LLM_cost = Σ LLM_cost(request)`

### Infra cost (تقریب)

- Compute: سرویس‌های API/Gateway/Workers (CPU/RAM) + (در صورت نیاز) GPU
- Storage: PostgreSQL/Redis/Neo4j/MinIO + backups
- Network: egress (خصوصاً اگر multi-region/enterprise)

---

## 3) Budgeting و سهم هزینه (Cost allocation)

برای اینکه enterprise/SMB هر دو قابل مدیریت باشند، باید هزینه حداقل در این سطوح قابل نسبت دادن باشد:

- Tenant / Organization
- Workspace
- Agent
- Feature (chat, memory, ingestion, marketplace)
- Model provider

> خروجی این بخش باید به billing/ledger متصل شود (در فازهای Marketplace/Enterprise).

---

## 4) Guardrails (محدودیت‌ها و کنترل‌ها)

### Limits پیشنهادی (MVP → GA)

- Rate limits: per-tenant و per-user
- Concurrency limits: هم‌زمانی stream per-tenant
- Token limits: max input/output tokens per request
- Budget caps: سقف هزینه روزانه/ماهانه per-tenant
- Data limits: سقف ingestion/day و سقف storage

### رفتار سیستم هنگام عبور از حد

- Soft limit: اخطار + degrade (مدل ارزان‌تر / context کوتاه‌تر)
- Hard limit: block با پیام قابل فهم + مسیر افزایش سقف (upgrade/admin approval)

---

## 5) Capacity planning (حداقل)

### سه مسیر کلیدی برای capacity

1. **Chat path (stream)**: bottleneck معمولاً concurrency و time-to-first-token است.
2. **Retrieval path**: bottleneck معمولاً query latency و index health است.
3. **Ingestion path**: bottleneck معمولاً batch sizes و queue backlog است.

### شاخص‌های لازم برای مانیتورینگ

- tokens/request، tokens/minute، cost/minute
- concurrent streams
- queue depth (ingestion/jobs)
- DB pool utilization، slow queries
- cache hit rate (Redis)

---

## 6) Pricing hooks (برای محصول)

> این سند قیمت‌گذاری را تعیین نمی‌کند، ولی «قلاب‌های لازم» را مشخص می‌کند.

- پلن‌ها باید بتوانند روی همین واحدها limit بگذارند:
  - seats/users
  - token budget
  - storage/embedding
  - number of agents
  - marketplace installs

---

## 7) سناریوهای تست هزینه/ظرفیت (برای قبل از GA)

- **Spike test**: 5× ترافیک معمول برای 15 دقیقه
- **Soak test**: ترافیک ثابت برای 4–8 ساعت
- **Provider failover**: قطع provider A و ادامه با B
- **Budget enforcement**: رسیدن به سقف هزینه و block/degrade صحیح

---

## 8) خروجی‌های مورد انتظار (Artifacts)

- داشبورد cost/capacity (MVP)
- policy/limits قابل تنظیم (config + admin UI در آینده)
- گزارش ماهانه هزینه per-tenant (برای فروش/enterprise)
