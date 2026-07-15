# Database Sharding Strategy — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/17-database-sharding-strategy.md
> **نسخه:** 1.0 | **تاریخ:** July 2026
> **وضعیت:** سند طراحی (design doc) — **هیچ کد/زیرساختی از این سند هنوز پیاده‌سازی نشده.** RT-073، roadmap فاز ۵ (هفته ۴۳-۴۴). طبق تصمیم صریح کاربر، این آیتم عمداً فقط سند است، نه کد اجرایی — شاردینگ واقعی با حجم داده‌ی فعلی این پروژه توجیه ندارد؛ این سند برای وقتی است که واقعاً لازم بشه.

---

## ۱) وضعیت فعلی

Runtime (Plane 1) یک instance واحد Postgres است (`DATABASE_URL` در `env.ts`،
بدون read replica، بدون partitioning، بدون connection pooler جدا مثل
PgBouncer). این سند فرض می‌کنه این معماری برای مقیاس فعلی/نزدیک کافیه —
مثل هر سند دیگه‌ای در `02_ARCHITECTURE`، اینجا صرفاً یک استراتژی برای _وقتی_
که کافی نبود مستند می‌شه، نه توجیهی برای شروع زودهنگام.

## ۲) چرا `organization_id` کلید شارد طبیعیه

تقریباً هر جدول اصلی این schema از قبل با `organization_id` اسکوپ شده —
این یک تصمیم معماری جدید نیست، فقط تأیید یک الگوی از قبل موجوده:

- `agents`, `workflows`, `skills`, `audit_logs`, `agent_kpi_snapshots`,
  `webhook_endpoints`, `sso_configs`, `wallets`, `policies` و تقریباً هر
  migration دیگه‌ای در `apps/openon4net-runtime/migrations/*.sql` یک ستون
  `organization_id` دارن (مستقیم یا از طریق `agents`/`workflows` transitive).
- هیچ query چندسازمانی (cross-org) در کدبیس فعلی وجود نداره — هر route
  همیشه با `request.auth.organizationId` فیلتر می‌کنه (`lib/require-permission.ts`
  و تقریباً هر service).
- یعنی یک الگوی شاردینگ tenant-based (هر شارد = زیرمجموعه‌ای از
  organizationها) با **صفر تغییر منطق کوئری** جواب می‌ده — برخلاف
  شاردینگ بر اساس یک کلید دیگه (مثلاً `id` خطی) که نیاز به بازنویسی
  عمده‌ی join/foreign-key داره.

## ۳) رویکرد مرحله‌ای پیشنهادی (نه فوری)

### مرحله ۰ — همین الان (بدون تغییر)

Instance واحد. کافیه تا وقتی connection pool/CPU/disk IO زیر فشار واقعی
نرفته باشه — امروز هیچ سیگنالی از این فشار نیست.

### مرحله ۱ — Read Replica (اولین قدم واقعی، نه شاردینگ)

قبل از هر شاردینگ، اولین گلوگاه معمولاً read-heavy بودنه (dashboard‌ها،
`GET /v1/audit`، `GET /v1/agents/:id/kpi-outcomes`). یک read replica با
routing دستی (کوئری‌های `GET`-غالب به replica) معمولاً ماه‌ها/سال‌ها این
مشکل رو بدون پیچیدگی شاردینگ حل می‌کنه.

### مرحله ۲ — Logical sharding بر اساس `organization_id` (فقط اگه لازم شد)

- **کلید شارد:** `organization_id` (هر سازمان همیشه روی یک شارد ثابت
  می‌مونه — no cross-shard join لازم نیست چون هیچ query چندسازمانی نداریم).
- **روش:** یا Citus (افزونه‌ی Postgres، کمترین تغییر کد چون همچنان یک
  اتصال SQL واحده) یا logical sharding دستی در لایه‌ی اپلیکیشن (یک
  registry که `organization_id → shard connection` رو نگه می‌داره،
  `db.ts`'s `Queryable` abstraction از قبل این تغییر رو تسهیل می‌کنه چون
  همه‌ی serviceها فقط `Queryable`/`Db` می‌گیرن، نه اتصال هاردکد).
- **Trigger مشخص برای شروع این مرحله** (نه یک تاریخ دلخواه): وقتی یکی از
  این‌ها واقعاً اتفاق بیفته —
  - اندازه‌ی دیتابیس از یک آستانه‌ی مشخص (مثلاً ~۵۰۰GB، بسته به منابع
    instance واقعی وقت تصمیم) رد بشه، یا
  - تعداد سازمان‌های فعال طوری زیاد بشه که یک سازمان بزرگ بتونه
    performance بقیه رو تحت تأثیر قرار بده (noisy neighbor)، یا
  - نیاز کسب‌وکاری واقعی برای data residency جدا به ازای هر مشتری
    enterprise پیش بیاد (که خودش می‌تونه یک driver زودتر از فشار فنی باشه).

### مرحله ۳ — Migration اجرایی (وقتی مرحله ۲ تصمیم شد)

- بدون downtime: dual-write موقت به instance قدیم + شارد جدید برای
  سازمان‌های در حال مهاجرت، بعد cutover، مطابق الگوی استاندارد
  online-migration (نه ابداع این سند — یک تکنیک شناخته‌شده).
- migrations/*.sql فعلی (schema واحد) باید روی هر شارد یکسان اجرا بشه —
  `migrator.ts`'s advisory-lock تک‌instance مدل فعلی نیاز به تعمیم برای
  چند اتصال داره؛ خارج از scope این سند، جزئیاتش وقت اجرا مشخص می‌شه.

## ۴) چیزی که این سند نیست

- توجیهی برای شروع شاردینگ حالا — امروز هیچ سیگنال فشار واقعی نیست.
- یک قرارداد API یا تغییر schema — هیچ migration/کدی از این سند نمی‌آد.
- جایگزین چیزهای ساده‌تر (index بهتر، query optimization، read replica)
  که معمولاً _قبل_ از شاردینگ باید امتحان بشن، نه بعدش.
