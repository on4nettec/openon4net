# Architecture Decision Records — Open on4net

> **فایل:** 05_DECISIONS/01-adr-index.md
> **نسخه:** 1.0

---

## ADR Index

| # | عنوان | وضعیت | تاریخ |
|---|-------|--------|------|
| 001 | انتخاب PostgreSQL + pgvector برای Vector Store | ✅ پذیرفته | July 2026 |
| 002 | Neo4j برای Memory Graph | ✅ پذیرفته | July 2026 |
| 003 | 6-Layer Memory Architecture | ✅ پذیرفته | July 2026 |
| 004 | TypeScript + Fastify برای Backend | ✅ پذیرفته | July 2026 |
| 005 | Plugin SDK با WASM Sandbox | ⏳ پیشنهاد | July 2026 |
| 006 | Monorepo با Turborepo | ✅ پذیرفته | July 2026 |
| 007 | Auto-Skill Detection با Frequency Analysis | ✅ پذیرفته | July 2026 |

---

## ADR-001: Vector Store

### وضعیت: ✅ پذیرفته

### Context
نیاز به vector database برای semantic search در Memory Engine و Company Knowledge.

### گزینه‌ها
| گزینه | مزایا | معایب |
|-------|-------|-------|
| **pgvector** | یک دیتابیس کمتر، ACID, backup ساده | محدودیت در مقیاس خیلی بالا |
| **Qdrant** | performance عالی, مقیاس‌پذیر | سرویس جدا, مدیریت بیشتر |
| **Pinecone** | managed, ساده | وابستگی به cloud, هزینه بالا |
| **Weaviate** | full-featured | سنگین، پیچیده |

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
| گزینه | مزایا | معایب |
|-------|-------|-------|
| **Neo4j** | Cypher query, community, performance | سرویس جدا |
| **PostgreSQL + CTE** | یک دیتابیس | performance افت در گراف عمیق |
| **ArangoDB** | multi-model | community کوچک‌تر |

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
| گزینه | توضیح |
|-------|--------|
| **1 لایه** | ساده اما ناقص |
| **3 لایه** | short + long + global |
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
| گزینه | مزایا | معایب |
|-------|-------|-------|
| **Fastify + TS** | speed, plugins, validation | community کوچک‌تر از Express |
| **Express + TS** | community بزرگ | slower, less modern |
| **Hono** | ultra-fast, Edge-ready | newer, smaller ecosystem |
| **NestJS** | structured, DI | heavy, opinionated |

### تصمیم
Fastify + TypeScript برای API. Hono برای Edge functions.

### پیامدها
- ✅ performance بالا
- ✅ type safety
- ✅ validation خودکار (Zod)

---

## ADR-005: Plugin Sandbox

### وضعیت: ⏳ پیشنهاد (نیاز به بررسی)

### Context
Pluginهای第三方 باید امن اجرا شوند.

### گزینه‌ها
| گزینه | توضیح |
|-------|--------|
| **WASM Sandbox** | امن، سریع، محدود |
| **Docker Container** | امن، اما سنگین |
| **VM** | بسیار امن، بسیار سنگین |
| **Sandboxed Node.js (vm2)** | سبک، اما امنیت کمتر |

### تصمیم اولیه
WASM Sandbox با fallback به Docker برای pluginهای سنگین.

---

## ADR-006: Project Structure

### وضعیت: ✅ پذیرفته

### Context
نیاز به مدیریت چندین package و app در یک repository.

### گزینه‌ها
| گزینه | مزایا | معایب |
|-------|-------|-------|
| **Turborepo** | cache عالی, parallel build | وابستگی به Vercel |
| **Nx** | full-featured | سنگین، پیچیده |
| **pnpm workspaces** | ساده | محدود |

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
| گزینه | روش |
|-------|------|
| **Frequency-based** | بعد X بار تکرار → پیشنهاد |
| **Pattern-based** | تحلیل قدم‌های مشابه |
| **ML-based** | مدل تشخیص الگو |

### تصمیم
Frequency-based + Pattern-based (روش ترکیبی). ML-based در v2.

### پیامدها
- ✅ پیاده‌سازی ساده و سریع
- ✅ دقت قابل قبول (۸۵٪+)
- ❌ نیاز به ML برای دقت >۹۵٪

---

> **خلاصه:** هر ADR یک تصمیم معماری مستند با context, گزینه‌ها, دلیل انتخاب و پیامدها است. این فایل随着 پروژه بزرگتر می‌شود.
