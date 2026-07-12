# Architecture Decision Records — Open on4net

> **فایل:** 05_DECISIONS/01-adr-index.md
> **نسخه:** 1.0

---

## ADR Index

| #   | عنوان                                                           | وضعیت                   | تاریخ     |
| --- | --------------------------------------------------------------- | ----------------------- | --------- |
| 001 | انتخاب PostgreSQL + pgvector برای Vector Store                  | ✅ پذیرفته              | July 2026 |
| 002 | Neo4j برای Memory Graph                                         | ✅ پذیرفته              | July 2026 |
| 003 | 6-Layer Memory Architecture                                     | ✅ پذیرفته              | July 2026 |
| 004 | TypeScript + Fastify برای Backend                               | ✅ پذیرفته              | July 2026 |
| 005 | Plugin SDK با WASM Sandbox                                      | ↩️ جایگزین شد (ADR-009) | July 2026 |
| 006 | Monorepo با Turborepo                                           | ✅ پذیرفته              | July 2026 |
| 007 | Auto-Skill Detection با Frequency Analysis                      | ✅ پذیرفته              | July 2026 |
| 008 | Credits/Coin داخلی + Revenue Share برای Marketplace             | ✅ پذیرفته              | July 2026 |
| 009 | Plugin Sandbox: WASM + Capability-based Host Functions          | ✅ پذیرفته              | July 2026 |
| 010 | Marketplace Architecture: Module (MVP) → Service (v0.2+)        | ✅ پذیرفته              | July 2026 |
| 011 | Four-Plane Architecture (Runtime/AI Control/Memory/Marketplace) | ✅ پذیرفته              | July 2026 |
| 012 | Marketplace Access Model: Activation-gated Installs             | ✅ پذیرفته              | July 2026 |

---

## ADR-001: Vector Store

### وضعیت: ✅ پذیرفته

### Context

نیاز به vector database برای semantic search در Memory Engine و Company Knowledge.

### گزینه‌ها

| گزینه        | مزایا                              | معایب                        |
| ------------ | ---------------------------------- | ---------------------------- |
| **pgvector** | یک دیتابیس کمتر، ACID, backup ساده | محدودیت در مقیاس خیلی بالا   |
| **Qdrant**   | performance عالی, مقیاس‌پذیر       | سرویس جدا, مدیریت بیشتر      |
| **Pinecone** | managed, ساده                      | وابستگی به cloud, هزینه بالا |
| **Weaviate** | full-featured                      | سنگین، پیچیده                |

### تصمیم

pgvector روی PostgreSQL تا ۱M embedding. اگر مقیاس بیشتر شد → Qdrant.

### پیامدها

- ✅ یک دیتابیس کمتر برای مدیریت
- ✅ backup یکپارچه
- ❌ محدودیت در ۱M embedding (قابل ارتقا)

---

## ADR-002: Memory Graph Database

### وضعیت: ✅ پذیرفته

### Context

Memory Graph نیاز به queryهای عمیق گراف دارد: "چه کسی چه تصمیمی برای کدام پروژه گرفته؟"

### گزینه‌ها

| گزینه                | مزایا                                | معایب                        |
| -------------------- | ------------------------------------ | ---------------------------- |
| **Neo4j**            | Cypher query, community, performance | سرویس جدا                    |
| **PostgreSQL + CTE** | یک دیتابیس                           | performance افت در گراف عمیق |
| **ArangoDB**         | multi-model                          | community کوچک‌تر            |

### تصمیم

Neo4j با sync به PostgreSQL برای backup.

### پیامدها

- ✅ queryهای عمیق و سریع
- ✅ Cypher ساده و خوانا
- ❌ سرویس جدا → management overhead

---

## ADR-003: 6-Layer Memory

### وضعیت: ✅ پذیرفته

### Context

Agentها نیاز به حافظه در سطوح مختلف با retention و access control متفاوت دارند.

### گزینه‌ها

| گزینه      | توضیح                                                        |
| ---------- | ------------------------------------------------------------ |
| **1 لایه** | ساده اما ناقص                                                |
| **3 لایه** | short + long + global                                        |
| **6 لایه** | Short + Conversation + Project + Company + Personal + Global |

### تصمیم

۶ لایه. هر لایه retention policy, storage backend, و access control مجزا دارد.

### پیامدها

- ✅ separation of concerns
- ✅ granular access control
- ❌ پیچیدگی بیشتر در پیاده‌سازی

---

## ADR-004: Backend Stack

### وضعیت: ✅ پذیرفته

### Context

نیاز به backend سریع، type-safe و با ecosystem غنی.

### گزینه‌ها

| گزینه            | مزایا                      | معایب                        |
| ---------------- | -------------------------- | ---------------------------- |
| **Fastify + TS** | speed, plugins, validation | community کوچک‌تر از Express |
| **Express + TS** | community بزرگ             | slower, less modern          |
| **Hono**         | ultra-fast, Edge-ready     | newer, smaller ecosystem     |
| **NestJS**       | structured, DI             | heavy, opinionated           |

### تصمیم

Fastify + TypeScript برای API. Hono برای Edge functions.

### پیامدها

- ✅ performance بالا
- ✅ type safety
- ✅ validation خودکار (Zod)

---

## ADR-005: Plugin Sandbox

### وضعیت: ↩️ جایگزین شد

### Context

Pluginهای第三方 باید امن اجرا شوند.

### گزینه‌ها

| گزینه                       | توضیح                  |
| --------------------------- | ---------------------- |
| **WASM Sandbox**            | امن، سریع، محدود       |
| **Docker Container**        | امن، اما سنگین         |
| **VM**                      | بسیار امن، بسیار سنگین |
| **Sandboxed Node.js (vm2)** | سبک، اما امنیت کمتر    |

### یادداشت

این ADR با ADR-009 جایگزین شده است و تصمیم نهایی Sandbox در `02_ARCHITECTURE/09-plugin-sandbox.md` آمده است.

---

## ADR-006: Project Structure

### وضعیت: ✅ پذیرفته

### Context

نیاز به مدیریت چندین package و app در یک repository.

### گزینه‌ها

| گزینه               | مزایا                      | معایب             |
| ------------------- | -------------------------- | ----------------- |
| **Turborepo**       | cache عالی, parallel build | وابستگی به Vercel |
| **Nx**              | full-featured              | سنگین، پیچیده     |
| **pnpm workspaces** | ساده                       | محدود             |

### تصمیم

Turborepo + pnpm workspaces.

### پیامدها

- ✅ build سریع با cache
- ✅ dependency management یکپارچه
- ✅ code sharing بین packages

---

## ADR-007: Auto-Skill Detection

### وضعیت: ✅ پذیرفته

### Context

Agentها باید بعد N بار تکرار، پیشنهاد Skill بدهند.

### گزینه‌ها

| گزینه               | روش                       |
| ------------------- | ------------------------- |
| **Frequency-based** | بعد X بار تکرار → پیشنهاد |
| **Pattern-based**   | تحلیل قدم‌های مشابه       |
| **ML-based**        | مدل تشخیص الگو            |

### تصمیم

Frequency-based + Pattern-based (روش ترکیبی). ML-based در v2.

### پیامدها

- ✅ پیاده‌سازی ساده و سریع
- ✅ دقت قابل قبول (۸۵٪+)
- ❌ نیاز به ML برای دقت >۹۵٪

---

> **خلاصه:** هر ADR یک تصمیم معماری مستند با context, گزینه‌ها, دلیل انتخاب و پیامدها است. این فایل随着 پروژه بزرگتر می‌شود.

---

## ADR-008: Credits/Coin داخلی + Revenue Share

### وضعیت: ✅ پذیرفته

### Context

می‌خواهیم:

- مصرف‌کننده برای استفاده از مدل‌ها/ابزارها/پلاگین‌ها یک واحد هزینه ساده داشته باشد (Credits/Coin)
- هزینه‌ها قابل کنترل/حسابرسی باشد (budget/governance/audit)
- سازنده‌های tool/plugin از مصرف منتفع شوند (revenue share)

### گزینه‌ها

| گزینه                      | مزایا                                             | معایب                                                     |
| -------------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| **Credits داخلی (ledger)** | ساده، قابل حسابرسی، ریسک حقوقی کمتر، enforce ساده | انتقال آزاد محدود، نیاز به سیستم پرداخت داخلی             |
| **توکن عمومی/کریپتو**      | انتقال‌پذیر، اکوسیستم بیرونی                      | ریسک حقوقی/تنظیم‌گری، پیچیدگی بالا، نیاز به امنیت/کیف پول |

### تصمیم

در v1، “Coin” را به‌صورت **credits داخلی** (ledger-based) پیاده می‌کنیم:

- Top-up با پرداخت معمولی
- مصرف برای AI + tools/plugins
- revenue share برای publisherها
- payout در v1: credits (و بعداً payout پولی برای ناشر verified)

### پیامدها

- ✅ پیاده‌سازی سریع‌تر و قابل اتکا
- ✅ گزارش‌گیری/حسابرسی دقیق
- ✅ کنترل بودجه و approval chain ساده‌تر
- ❌ در صورت نیاز به token عمومی، باید به‌عنوان ماژول جدا طراحی شود

---

## ADR-009: Plugin Sandbox (WASM + Capabilities)

### وضعیت: ✅ پذیرفته

### Context

می‌خواهیم اکوسیستم plugin/tool داشته باشیم، اما اجرای third-party باید امن باشد:

- دسترسی‌ها قابل کنترل (permissions)
- شبکه/فایل محدود
- منابع محدود (CPU/RAM/time)
- همه چیز audit/tracing داشته باشد

### گزینه‌ها

| گزینه                    | مزایا                                          | معایب                                                 |
| ------------------------ | ---------------------------------------------- | ----------------------------------------------------- |
| **WASM Sandbox**         | قابلیت‌محور، محدودسازی دقیق، مناسب marketplace | نیاز به طراحی host functions، پیچیده‌تر از in-process |
| **Docker per plugin**    | isolation قوی                                  | سنگین، latency بالا، هزینه اجرا                       |
| **vm2 / sandboxed Node** | ساده‌تر برای JS                                | ریسک‌های امنیتی بیشتر، escape risk                    |

### تصمیم

هدف برای third-party plugins: **WASM sandbox با capability-based host functions**.  
برای MVP خیلی اولیه، فقط plugins first-party ممکن است in-process اجرا شوند؛ اما مسیر مهاجرت به WASM باید از ابتدا در contractها لحاظ شود.

### پیامدها

- ✅ امنیت و کنترل بهتر برای marketplace
- ✅ امکان metering و محدودسازی دقیق
- ✅ هم‌راستا با governance/audit
- ❌ نیازمند پیاده‌سازی runtime و host APIs

ارجاع: `02_ARCHITECTURE/09-plugin-sandbox.md`

---

## ADR-010: Marketplace Module → Service

### وضعیت: ✅ پذیرفته

### Context

Marketplace برای plugin/connector/tool نیاز به:

- review pipeline
- artifact registry + signing
- pricing + revenue share
- security controls (kill switch)
  دارد؛ و این حوزه معمولاً به مرور بزرگ و جدا می‌شود.

### گزینه‌ها

| گزینه                                | مزایا                               | معایب                                 |
| ------------------------------------ | ----------------------------------- | ------------------------------------- |
| **از ابتدا سرویس جدا**               | مرزبندی واضح، مقیاس‌پذیری بهتر      | هزینه MVP بالا، پیچیدگی deployment    |
| **ماژول داخل API (MVP) سپس استخراج** | سریع‌تر برای v0.1، migration تدریجی | ریسک coupling اگر contract رعایت نشود |

### تصمیم

در v0.1 به شکل **ماژول داخل API** پیاده می‌شود، اما:

- namespaceهای جدا (`/marketplace`, `/publisher`, `/billing`)
- interfaceهای registry/signing جدا
  تا در v0.2+ به **Marketplace Service** مستقل استخراج شود.

### پیامدها

- ✅ سرعت MVP
- ✅ مسیر مقیاس‌پذیری مشخص
- ❌ نیاز به discipline در boundaryها

ارجاع: `02_ARCHITECTURE/12-marketplace-service.md`

---

## ADR-011: Four-Plane Architecture

### وضعیت: ✅ پذیرفته

### Context

O₂N باید هم‌زمان:

- قابل نصب روی سرور مشتری (self-host/on-prem) باشد
- هزینه/مدیریت AI را به شکل مرکزی و ساده ارائه کند (activation + credits)
- حافظه بلندمدت را به صورت self-host یا managed ارائه کند
- اکوسیستم plugin/connector و marketplace درآمدزا داشته باشد

اگر این‌ها در یک توده‌ی واحد بدون boundary تعریف شوند، نتیجه:

- coupling زیاد
- امنیت/اعتماد مبهم
- و توسعه/استخراج سرویس‌ها سخت
  خواهد بود.

### گزینه‌ها

| گزینه                                               | مزایا                                              | معایب                                                       |
| --------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| **یک سیستم واحد (بدون plane)**                      | ساده در ظاهر                                       | مرزبندی نامشخص، سخت در self-host + marketplace + managed AI |
| **۴ Plane (Runtime/AI Control/Memory/Marketplace)** | trust boundary واضح، مرحله‌بندی آسان، امکان hybrid | نیاز به تعریف contractها و ownership                        |

### تصمیم

معماری رسمی O₂N به صورت **۴ Plane** پذیرفته شد:

1. Customer Runtime (Core / On‑Prem)
2. AI Control Plane (activation + credits + optional managed AI)
3. Long‑Term Memory Plane (managed یا self-host)
4. Marketplace Plane (publish/review/registry/pricing)

شبکه “Compute Providers / VM incentives” و شبکه “Memory providers” به عنوان **فاز آینده و opt‑in** تعریف می‌شوند تا الزامات Enterprise (عدم خروج داده) نقض نشود.

### پیامدها

- ✅ self-host و enterprise story قوی‌تر
- ✅ اقتصاد و marketplace قابل توسعه و امن‌تر
- ✅ جداسازی مسئولیت‌ها (ownership) واضح
- ❌ نیاز به اجرای دقیق contractها (API namespaces، signing، tracing، billing)

ارجاع: `02_ARCHITECTURE/13-four-plane-architecture.md`

---

## ADR-012: Marketplace Access Model (Activation-gated Installs)

### وضعیت: ✅ پذیرفته

### Context

Marketplace هم Skill رایگان دارد و هم Plugin/Skill قابل‌فروش. باید مشخص شود نصب هرکدام چه پیش‌شرطی دارد — به‌خصوص برای Runtimeهای self-host که ممکن است اصلاً به Control Plane وصل نباشند.

### گزینه‌ها

| گزینه                                                 | توضیح                                                                                    |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **فقط موارد رایگان activation-gate شوند**             | موارد پولی نیاز به مسیر پرداخت جدا دارند، پس گیت فقط روی رایگان‌ها                       |
| **همه‌ی نصب‌ها (رایگان و پولی) activation-gate شوند** | بدون رابطه‌ی activation، هیچ wallet/billing context ای برای شارژ مورد پولی هم وجود ندارد |

### تصمیم

همه‌ی نصب‌ها از مسیر `POST /v1/marketplace/{plugins,skills}/:id/install` در Runtime، پیش از پروکسی به Marketplace، از `ActivationState.isActivated()` عبور می‌کنند (پیاده‌سازی: T-CP-007). `price_cents` فقط تعیین می‌کند نصب فوری تمام می‌شود یا منطق entitlement/revenue-share جداگانه‌ی Marketplace وارد عمل می‌شود؛ پیش‌شرط activation برای هر دو یکسان است.

`isActivated()` وقتی `CONTROL_PLANE_URL`/`ACTIVATION_KEY` اصلاً تنظیم نشده باشند (self-host خالص، بدون هیچ اتصالی به Control Plane) `true` برمی‌گرداند — چون self-host-first هدف MVP این پروژه است و یک Runtime پیکربندی‌نشده نباید به‌عنوان «فعال‌نشده» تلقی شود. وقتی کلیدی تنظیم شده باشد، بعد از ۲۴ ساعت بدون check-in موفق، `false` می‌شود (grace window در برابر قطعی موقت Control Plane، نه قفل فوری).

### پیامدها

- ✅ یک enforcement point واحد (`routes/marketplace.ts`) برای هر دو نوع نصب
- ✅ self-host بدون Control Plane هم کار می‌کند (رفتار پیش‌فرض باز)
- ✅ مسیر روشن برای افزودن پرداخت واقعی روی موارد پولی بدون تغییر گیت activation
- ❌ نیاز به نگه‌داشتن state (`ActivationState`, poller ساعتی) در Runtime

ارجاع: `services/activation-client.ts`, `services/activation-state.ts`, `routes/marketplace.ts`, `06_MEETINGS/02-skills-plugins-marketplace-model.md`
