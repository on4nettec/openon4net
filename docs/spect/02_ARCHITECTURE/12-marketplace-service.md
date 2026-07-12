# Marketplace Service Architecture — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/12-marketplace-service.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف

Marketplace در O₂N برای این است که:

- توسعه‌دهندگان بتوانند **Plugin/Connector/Tool** بسازند و منتشر کنند
- مصرف‌کنندگان بتوانند نصب/فعال‌سازی کنند
- استفاده‌ها **قابل قیمت‌گذاری** و **قابل حسابرسی** باشد
- سازندگان **منتفع** شوند (revenue share / payouts)

---

## ۲) آیا Marketplace “سیستم جدا” است؟

### تصمیم معماری (پیشنهادی)

- **MVP (v0.1):** Marketplace به‌صورت یک **ماژول داخل API Service** پیاده می‌شود (ساده‌تر، سریع‌تر).
- **بعد از MVP (v0.2+):** Marketplace به یک **Marketplace Service** مستقل استخراج می‌شود (برای مقیاس، امنیت، و تیم‌بندی).

این سند boundaryها و مسیر مهاجرت را مشخص می‌کند تا از ابتدا coupling بیش از حد ایجاد نشود.

---

## ۳) Domain Boundaries (مرزبندی دامنه)

### ۳.۱) Marketplace Domain (مالکیت Marketplace)

- Publisher accounts (verified/pending/suspended)
- Plugin submissions (draft/submitted/approved/rejected)
- Review pipeline + moderation
- Plugin artifacts registry (package storage)
- Plugin signing / integrity
- Listing/search/ranking
- Pricing models (per-call/subscription/freemium)
- Revenue share ledger integration

### ۳.۲) Core Platform Domain (مالکیت هسته)

- Organizations / Workspaces / Users / Agents
- Governance / approvals
- Execution runtime (Agent/Workflow/Tool/Plugin execute)
- Memory Engine
- AI Gateway

اصل: Marketplace **کد را می‌فروشد/توزیع می‌کند**؛ Core **کد را اجرا می‌کند** (در sandbox).

---

## ۴) Components (اجزای Marketplace)

### ۴.۱) Publisher Portal

- ثبت publisher
- ارسال plugin
- مشاهده درآمد/usage
- مدیریت نسخه‌ها و change log

### ۴.۲) Review & Security Pipeline

- manifest validation (permissions/pricing/id)
- static checks (SAST/dep scan)
- signature verification
- manual review (اختیاری v1)
- verified publisher program

### ۴.۳) Package Registry (Artifacts)

- ذخیره artifact نسخه‌ها (tarball/wasm bundle)
- immutable artifacts (no overwrite)
- checksum + signature
- CDN distribution (optional)

### ۴.۴) Marketplace API (Discovery/Install)

- list/search plugins
- plugin details
- install/enable/disable
- update/rollback

### ۴.۵) Economics

- credits charging per usage (ledger)
- revenue share calculation
- payout queue (credits payout در v1، cash payout برای verified بعداً)

---

## ۵) Data Flow های کلیدی

### ۵.۱) Publish Flow (Publisher → Marketplace)

1. publisher `POST /publisher/plugins` (metadata + manifest + pricing)
2. upload artifact (registry)
3. automated review (policy + scans)
4. approval/reject
5. plugin listed

### ۵.۲) Install Flow (Consumer → Core)

1. user/org admin plugin را از marketplace انتخاب می‌کند
2. `POST /marketplace/plugins/{id}/install`
3. install در scope workspace/org ثبت می‌شود
4. permissions approve می‌شود
5. connector auth/config (اگر لازم)
6. enable

### ۵.۳) Execute Flow (Core Runtime)

1. Agent/Workflow یک tool/plugin را صدا می‌زند
2. core runtime: governance check (permission + budget + approval)
3. sandbox execution (WASM)
4. usage event + audit log + tracing ثبت می‌شود
5. billing: credits settle
6. revenue share accrual برای publisher

---

## ۶) Security & Integrity

### ۶.۱) Signing

- هر artifact باید امضا شود
- install باید signature + checksum را verify کند

### ۶.۲) Permission Diff on Update

- اگر نسخه جدید permissions بیشتری می‌خواهد:
  - install باید re-approve شود
  - در غیر این صورت update رد شود

### ۶.۳) Kill Switch

- org-level: disable install
- platform-level: global disable (malware)

ارجاع: `09_TASKS/07-security-ops-runbook.md`

---

## ۷) Observability (OTel)

spanهای استاندارد:

- `o2n.marketplace.publish`
- `o2n.marketplace.review`
- `o2n.marketplace.install`
- `o2n.plugin.execute`

attributes:

- `o2n.plugin_id`, `o2n.publisher_id`, `o2n.organization_id`

ارجاع: `02_ARCHITECTURE/08-observability-otel.md`

---

## ۸) Minimal Data Model (تکمیلی)

DB پایه pluginها/publisherها در:

- `03_DATABASE/01-schema-master.md`
- `03_DATABASE/02-billing-schema.md`
  وجود دارد.

برای Marketplace service معمولاً به این جدول‌ها هم نیاز می‌شود (پیشنهادی):

```sql
CREATE TABLE plugin_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  artifact_url TEXT NOT NULL,
  checksum_sha256 VARCHAR(64) NOT NULL,
  signature TEXT,
  permissions TEXT[],
  pricing JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'submitted', -- submitted | approved | rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plugin_id, version)
);

CREATE TABLE plugin_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_version_id UUID REFERENCES plugin_versions(id) ON DELETE CASCADE,
  reviewer_user_id UUID REFERENCES users(id),
  status VARCHAR(20) NOT NULL, -- approved | rejected | needs_changes
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ۹) Migration Path (از ماژول به سرویس مستقل)

برای اینکه استخراج آسان باشد:

- Marketplace API در یک namespace جدا باشد (`/marketplace`, `/publisher`, `/billing`)
- core runtime فقط با “registry interface” کار کند:
  - `getPluginVersion(pluginId, version)`
  - `verifySignature(...)`
  - `resolvePricing(...)`
- artifact storage از ابتدا immutable باشد

---

## ۱۰) Skills به‌عنوان یک Marketplace Entity (موازی با Plugins)

علاوه بر Plugin، از این نسخه به بعد **Skill** هم یک entity قابل‌انتشار/نصب در Marketplace است — اما با مدل داده و pipeline ساده‌تر، چون یک Skill فقط یک `definition` از نوع JSONB است (دنباله‌ای از tool-call step)، نه یک artifact باینری امضاشده.

### ۱۰.۱) تفاوت با Plugin

|                    | Plugin                                                               | Skill                                     |
| ------------------ | -------------------------------------------------------------------- | ----------------------------------------- |
| جدول‌ها            | `plugins` + `plugin_versions` + `plugin_installs` + `plugin_reviews` | `marketplace_skills` + `skill_installs`   |
| نسخه‌بندی          | چندنسخه‌ای، هرکدام artifact جدا                                      | یک ردیف، upsert روی هر submit             |
| checksum/signature | دارد (MKT-009/MKT-014)                                               | ندارد — چیزی برای verify کردن باینری نیست |
| review pipeline    | خودکار + دستی (MKT-013)                                              | ندارد — بلافاصله `status: 'listed'`       |
| قیمت               | `pricing` JSONB روی هر نسخه                                          | `price_cents` ساده (۰ = رایگان)           |

### ۱۰.۲) API

- `POST /publisher/skills`, `GET /publisher/skills` — انتشار/مشاهده‌ی Skillهای یک publisher (upsert بر اساس `slug`)
- `GET /marketplace/skills` — کشف عمومی (فقط `status = 'listed'`)
- `POST /marketplace/skills/:id/install` — نصب برای یک organization؛ idempotent (upsert در `skill_installs`)

### ۱۰.۳) مسیر نصب از Runtime

Runtime مستقیم به Marketplace وصل نمی‌شود؛ از طریق پروکسی خودش عبور می‌کند:
`POST /v1/marketplace/skills/:id/install` (Runtime) → activation check (`ActivationState.isActivated()`, ببینید ADR-012) → `POST /marketplace/skills/:id/install` (این سرویس) → کپی‌شدن `definition` در یک ردیف local ownerless در جدول `skills` خود Runtime (`source: 'marketplace'`)، تا بلافاصله مثل یک Skill دستی قابل مشاهده/اجرا/grant باشد.

### ۱۰.۴) بدون revenue-share برای Skill پولی (فعلاً)

`revenue_share_accruals` به `plugin_version_id` گره خورده؛ گسترش آن برای Skillهای پولی یک follow-up مستند‌شده است، نه چیزی که در این پاس ساخته شده باشد — نصب یک Skill پولی امروز ثبت می‌شود اما هیچ ledger entry ای برای publisher تولید نمی‌کند.

ارجاع: `apps/openon4net-marketplace/migrations/0003_marketplace_skills.sql`, `service/src/services/{publisher-skill-service,marketplace-skill-service}.ts`, `05_DECISIONS/01-adr-index.md#adr-012`

---

> **خلاصه:** Marketplace در MVP می‌تواند داخل API باشد، اما از نظر boundary و contract باید از ابتدا مثل یک سرویس مستقل طراحی شود: publish/review/registry/economy/kill-switch.
