# Memory Engine — Open on4net

> **فایل:** 00_VISION/03-memory-engine.md
> **نسخه:** 1.0
> **اولویت:** بحرانی — قلب سیستم

---

## ۱. چرا Memory Engine مهم‌ترین بخش O₂N است؟

هیچ AI Operating System شرکتی حافظه واقعی ندارد.

ChatGPT جلسه قبل رو یادش میاد. Claude می‌تونه یه پروژه رو بشناسه. اما هیچکدوم:
- نمی‌دونن "این مشتری کیست و تاریخچه‌اش چیه"
- یادشون نمیاد "دیروز چه تصمیمی برای کدوم پروژه گرفته شد"
- نمی‌تونن بین "دانش شخصی من" و "دانش شرکت" تفاوت بذارن
- نمی‌دونن "این فایل مال کدوم پروژه‌ست و کی اون رو آپلود کرده"

**O₂N با ۶ لایه حافظه + Memory Graph این مشکل را حل می‌کند.**

---

## ۲. معماری ۶ لایه حافظه (6-Layer Memory Architecture)

### لایه ۱: Short Memory (حافظه کوتاه‌مدت)

| ویژگی | مقدار |
|-------|--------|
| **مدت نگهداری** | یک مکالمه (تا ۳۰ دقیقه inactivity) |
| **ذخیره‌سازی** | Redis (in-memory) |
| **ظرفیت** | آخرین ۵۰ پیام |
| **پاکسازی** | خودکار بعد از ۳۰ دقیقه یا پایان مکالمه |

**کاربرد:** Agent بداند در همین مکالمه چه过去了.

### لایه ۲: Conversation Memory (حافظه مکالمه)

| ویژگی | مقدار |
|-------|--------|
| **مدت نگهداری** | دائمی (تا ۶ ماه خلاصه می‌شود) |
| **ذخیره‌سازی** | PostgreSQL + خلاصه در Vector DB |
| **ساختار** | متن کامل + خلاصه + topic tags |
| **پاکسازی** | خلاصه‌سازی بعد از ۶ ماه |

**کاربرد:** Agent بداند "سه جلسه پیش در مورد بودجه چی گفتیم؟"

### لایه ۳: Project Memory (حافظه پروژه)

| ویژگی | مقدار |
|-------|--------|
| **مدت نگهداری** | طول عمر پروژه |
| **ذخیره‌سازی** | PostgreSQL + Neo4j (graph) |
| **ساختار** | اهداف، تسک‌ها، تصمیم‌ها، فایل‌ها، افراد |
| **رابطه** | این فایل مال پروژه X و توسط Y آپلود شده |

**کاربرد:** Agent بداند "این API key مال کدوم پروژه‌ست و کی ساخته شده"

### لایه ۴: Company Knowledge (دانش شرکت)

| ویژگی | مقدار |
|-------|--------|
| **مدت نگهداری** | طول عمر شرکت |
| **ذخیره‌سازی** | Vector DB + Graph DB |
| **ساختار** | محصولات، مشتریان، قراردادها، رویه‌ها، سیاست‌ها |
| **دسترسی** | همه Agentهای آن شرکت |

**کاربرد:** Agent بداند "خط‌مشی مرجوع کالا در این شرکت چیه"

### لایه ۵: Personal Knowledge (دانش شخصی)

| ویژگی | مقدار |
|-------|--------|
| **مدت نگهداری** | طول عمر کاربر |
| **ذخیره‌سازی** | Vector DB + Graph DB |
| **ساختار** | ترجیحات، سبک کار، دانش تخصصی |
| **حریم خصوصی** | فقط خود کاربر (حتی شرکت نمی‌بیند) |

**کاربرد:** Agent بداند "کاربر فلانی کدنویسی رو با tabs دوست داره و همیشه تست می‌نویسه"

### لایه ۶: Global Knowledge (دانش جهانی)

| ویژگی | مقدار |
|-------|--------|
| **مدت نگهداری** | همیشه |
| **ذخیره‌سازی** | Vector DB |
| **ساختار** | دانش عمومی، best practices, patterns |
| **منبع** | Pre-loaded + یادگیری از همه شرکت‌ها (anonymous) |

**کاربرد:** Agent بداند "بهترین معماری برای یه microservice چیه حتی اگه شرکت قبلاً استفاده نکرده"

---

## ۳. Memory Graph (حافظه گرافی)

این جایی است که O₂N به طور کامل از رقبا جدا می‌شود.

### به جای "کیف مکالمات"
```
"کاربر X گفت: 'نیاز به داکر داریم' در تاریخ Y"
```

### Memory Graph:
```
[کاربر X] ────تصمیم گرفت────▶ [استقرار با Docker]
    │                              │
    │                              │
    ├───مدیر پروژه───▶ [پروژه Alpha] ◀───تاثیر گذاشت─── [تیم بکند]
    │                              │
    │                              │
    └───استفاده کرد───▶ [فایل docker-compose.yml]
                                   │
                                   │
                                   └───ذخیره شد─── [Repository: on4net/infra]
```

### چه فرقی می‌کند؟
وقتی Agent بعداً بپرسد: "چرا از Docker استفاده کردیم؟"
- **ChatGPT:** "شما گفتید از داکر استفاده کنیم 😊"
- **O₂N Agent:** "در تاریخ ۵ July ۲۰۲۶، کاربر X (مدیر پروژه) تصمیم گرفت به خاطر scalability و CI/CD ساده‌تر، کل پروژه Alpha را Dockerize کند. فایل docker-compose.yml در on4net/infra ذخیره شد. تیم بکند تحت تأثیر این تصمیم workflow خود را تغییر داد."

### تکنولوژی Memory Graph
```
┌─────────────────────────────────────┐
│         MEMORY GRAPH STACK          │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Neo4j (Graph Database)     │   │
│  │  - Nodes: People, Projects, │   │
│  │    Files, Decisions, Tasks  │   │
│  │  - Edges: Relationships     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  pgvector (Vector Store)    │   │
│  │  - Embeddings for search    │   │
│  │  - Semantic similarity      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  PostgreSQL (Relational)    │   │
│  │  - Structured memory data  │   │
│  │  - Metadata, timestamps    │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## ۴. جریان حافظه (Memory Flow)

### زمان نوشتن (Write Flow):
```
Agent دریافت پاسخ
    │
    ▼
Memory Engine فعال می‌شود
    │
    ├──▶ لایه ۱ (Short Memory): ذخیره در Redis
    ├──▶ لایه ۲ (Conversation Memory): ذخیره در PostgreSQL
    │
    ▼
Extractor اطلاعات را تحلیل می‌کند:
    ├──▶ این تصمیم است؟ → ذخیره در Memory Graph
    ├──▶ این دانش پروژه است؟ → لایه ۳
    ├──▶ این دانش شرکت است؟ → لایه ۴
    ├──▶ این دانش شخصی است؟ → لایه ۵
    └──▶ این دانش عمومی است؟ → لایه ۶
```

### زمان خواندن (Read Flow):
```
Agent نیاز به Context دارد
    │
    ▼
Memory Engine Query:
    │
    ├──▶ لایه ۱ (Short): "مکالمه فعلی چی بود؟"
    ├──▶ لایه ۲ (Conversation): "مکالمات مرتبط"
    ├──▶ لایه ۳ (Project): "این پروژه چیه؟"
    ├──▶ لایه ۴ (Company): "رویه شرکت چیه؟"
    ├──▶ لایه ۵ (Personal): "کاربر چطور کار می‌کند؟"
    └──▶ لایه ۶ (Global): "best practice چیه؟"
    │
    ▼
Memory Ranking:
    ├──▶ Relevance scoring
    ├──▶ Time decay
    ├──▶ Relationship strength
    └──▶ Context compression
    │
    ▼
Context Package → Prompt Builder
```

---

## ۵. Memory Pruning (هرس حافظه)

حافظه نامحدود نیست. هرس هوشمند انجام می‌دهیم:

| لایه | زمان هرس | روش |
|------|----------|------|
| Short Memory | ۳۰ دقیقه inactivity | حذف کامل |
| Conversation Memory | ۶ ماه | خلاصه‌سازی + حذف متن اصلی |
| Project Memory | بعد از اتمام پروژه | بایگانی + خلاصه |
| Company Knowledge | سالانه | review + cleanup |
| Personal Knowledge | ۶ ماه کاربر inactive | خلاصه‌سازی |
| Global Knowledge | مداوم | aggregate + prune |

---

## ۶. API حافظه (Memory API)

```
// Write
POST /memory/write
{
  "agentId": "marketing-01",
  "layer": 2,
  "content": { ... },
  "context": {
    "project": "alpha",
    "relatedTo": ["decision-123", "file-456"]
  }
}

// Read
POST /memory/read
{
  "agentId": "marketing-01",
  "query": "بودجه تبلیغات ۱۴۰۵",
  "layers": [2, 3, 4],
  "maxTokens": 4000
}

// Graph Query
POST /memory/graph
{
  "query": "چه کسی تصمیم به Docker گرفت؟",
  "depth": 2,
  "startNodes": ["decision-docker"]
}

// Prune
POST /memory/prune
{
  "layers": [1, 2],
  "olderThan": "2026-01-01"
}
```

---

## ۷. تصمیمات معماری (Architecture Decisions)

### ADR-001: چرا Neo4j برای Memory Graph؟
- **گزینه‌ها:** Neo4j vs ArangoDB vs PostgreSQL recursive CTE
- **تصمیم:** Neo4j
- **دلیل:** performance در گراف‌های عمیق، Cypher Query ساده، community بزرگ

### ADR-002: چرا pgvector برای Vector؟
- **گزینه‌ها:** pgvector vs Qdrant vs Pinecone
- **تصمیم:** pgvector (با قابلیت مهاجرت به Qdrant در مقیاس بالا)
- **دلیل:** یک دیتابیس کمتر برای مدیریت، قابلیت کافی برای ۱M embedding

### ADR-003: چرا ۶ لایه؟
- **دلیل:** separation of concerns. هر لایه retention policy و access control متفاوت دارد. mixing آنها باعث پیچیدگی و نشت اطلاعات می‌شود.

---

> **خلاصه:** Memory Engine قلب O₂N است. ۶ لایه حافظه + Memory Graph به Agentها می‌دهد که نه فقط "مکالمه قبل رو یادشونه" بلکه "شرکت، پروژه، افراد، تصمیم‌ها و روابط بینشان را می‌دانند". این است که Agent را از یک chatbot به یک Digital Employee تبدیل می‌کند.
