# Connectors, Tools & Plugins (Extensibility Spec) — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/07-connectors-and-tools.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف این بخش

O₂N باید طوری طراحی شود که:

- اگر کاربر کاری خواست و **Tool/Integration وجود نداشت**، سیستم بتواند آن را **پیشنهاد** دهد و کاربر/توسعه‌دهنده آن را به شکل **Plugin/Tool** بسازد.
- ابزار ساخته‌شده بتواند:
  - برای همان کاربر/سازمان قابل استفاده باشد (Private)
  - یا در Marketplace منتشر شود (Public)
- همه استفاده‌ها:
  - **قابل حسابرسی** (audit + trace)
  - **قابل کنترل** (permissions + budget + approvals)
  - و **قابل درآمدزایی** (credits + revenue share)
    باشد.

---

## ۲) تعاریف (Terminology)

### ۲.۱) Tool

یک «عمل» قابل اجرا که Agent/Workflow صدا می‌زند.
نمونه‌ها: `send-email`, `post-instagram`, `query-crm`, `read-google-drive-file`

### ۲.۲) Connector (Integration)

یک بسته‌ی Toolها برای یک سرویس خارجی + احراز هویت + sync/job.
نمونه‌ها: Google Drive, Slack, HubSpot, Meta/Instagram, Google Ads, Mailchimp

### ۲.۳) Plugin

واحد توزیع/نصب (Marketplace) که می‌تواند Tool و Action و Prompt و UI assets داشته باشد.

---

## ۳) Capability Model

هر Tool/Connector باید capabilities خودش را اعلام کند:

- `tool.execute` (اجرای یک action)
- `connector.auth` (OAuth/API key)
- `connector.sync` (job-based sync)
- `connector.webhook` (event ingestion)
- `data.read` / `data.write`
- `social.post`
- `marketing.campaign`
- `files.read` / `files.write`

این capabilityها روی governance و permission enforcement اثر مستقیم دارد.

---

## ۴) Permission Model (قابل enforce)

permissions باید:

- در `manifest` تعریف شوند
- در زمان install تأیید شوند
- در زمان اجرا enforce شوند

نمونه permissions (سطح پلتفرم):

```yaml
permissions: http:read
  http:send
  oauth:connect
  files:read
  files:write
  memory:read
  memory:write
  social:post
  marketing:ads:read
  marketing:ads:write
  admin:config
```

قانون: اگر Tool permission لازم را ندارد → اجرا **رد** می‌شود یا به approval queue می‌رود (policy-based).

---

## ۵) Auth & Secrets (OAuth / API Keys)

### ۵.۱) Supported Auth Types

- OAuth2 (Authorization Code + refresh token)
- API Key
- Service Account (Enterprise)

### ۵.۲) Storage Rules (حداقل‌ها)

- secrets به صورت encrypted-at-rest ذخیره شوند (KMS/Envelope encryption)
- refresh token rotation پشتیبانی شود
- revoke/disable از UI و API

### ۵.۳) Workspace Scope

Connector می‌تواند در scopeهای زیر نصب شود:

- organization-wide
- workspace
- agent-specific (اختیاری)

---

## ۶) Tool/Connector Lifecycle

### ۶.۱) Install

1. انتخاب plugin
2. review permissions
3. connect auth (OAuth/API key)
4. configure (scopes, defaults)
5. enable

#### Sourceهای نصب (MVP)

- **Marketplace:** نصب از registry رسمی (signed/verified).
- **Manual Upload (ZIP):** ادمین یک فایل فشرده‌ی plugin را از UI/API آپلود می‌کند و سیستم بعد از validate/signature (یا حالت «trusted local») آن را نصب می‌کند.
- **Manual / Local (Developer):** اضافه‌کردن plugin به‌صورت دستی در مسیر مشخص (برای توسعه/On-prem)، با require کردن flagهای امنیتی و audit.

> نکته امنیتی: نصب دستی/ZIP باید به‌صورت پیش‌فرض **غیرفعال** باشد و فقط با policy/feature flag برای محیط‌های self-hosted فعال شود.

### ۶.۲) Execute

1. governance check (permission + budget + approval)
2. create `trace_id`
3. execute
4. write `audit_logs` + `usage_events`
5. return result + metadata (cost, latency, provider)

### ۶.۳) Update / Rollback

- هر نسخه‌ی plugin باید versioned باشد
- update ممکن است نیاز به re-approve permissions داشته باشد
- rollback باید به نسخه قبل ممکن باشد

### ۶.۴) Disable / Uninstall

- disable: قطع اجرا، حفظ config
- uninstall: حذف install + revoke tokens (اختیاری با گزینه)

---

## ۷) Tool Gap Detection (وقتی tool وجود ندارد)

وقتی Agent/Workflow به این نتیجه برسد که برای اجرای یک step ابزار لازم است ولی وجود ندارد:

1. سیستم یک **Tool Gap** ثبت می‌کند:
   - نیازمندی (مثلاً: “پست اینستاگرام”)
   - سرویس هدف (Meta/Instagram)
   - permissions پیشنهادی
2. به کاربر پیشنهاد می‌دهد:
   - نصب یک plugin آماده از Marketplace
   - یا “Generate Plugin Skeleton” برای توسعه‌دهنده
3. بعد از install/enable، همان workflow دوباره قابل اجرا می‌شود.

> خروجی این مسیر باید به صورت یک چرخه قابل پیگیری در UI و API باشد (proposals).

---

## ۸) Connectors برای مدیریت حافظه (Memory Ingestion)

برای اضافه کردن دانش سازمانی از بیرون (مثل Google Drive):

- فایل‌ها pull شوند
- متن استخراج شود
- chunk + embed شود
- به layer مناسب نوشته شود:
  - اسناد پروژه → layer 3
  - دانش شرکت/Policy → layer 4

این چرخه باید:

- incremental sync داشته باشد (delta)
- delete propagation داشته باشد
- و permission inheritance رعایت کند (چه کسی اجازه خواندن این دانش را دارد؟)

APIهای این بخش در `04_API/03-connectors-memory-ingestion-api.md` آمده.

---

## ۹) Social/Marketing Connectors (اجرای عملیات بازاریابی)

برای اینکه سیستم بتواند social media و ابزارهای marketing را مدیریت کند، Connectorهای زیر (حداقل) پیشنهاد می‌شوند:

- Meta/Instagram
- Telegram
- Email provider
- CRM (HubSpot/Salesforce)
- Ads (Google Ads/Meta Ads)

قواعد governance پیشنهادی:

- `social:post` همیشه audit level = full
- `marketing:ads:write` نیاز به approval بالای یک threshold دارد (credits یا amount)
- هر execution باید idempotent باشد (برای جلوگیری از دوبار پست/دوبار هزینه)

---

## ۱۰) اقتصاد/درآمد سازنده

هر execution از plugin/tool:

- credits مصرف می‌کند (طبق pricing model)
- usage event ثبت می‌کند
- سهم publisher را محاسبه می‌کند

جزئیات در:

- `02_ARCHITECTURE/06-economy-and-marketplace.md`
- `04_API/02-billing-and-marketplace-api.md`

---

## ۱۱) Minimal Data Model (برای پیاده‌سازی)

> این بخش یک حداقل دیتامدل پیشنهادی است؛ می‌تواند در migrations پیاده شود.

```sql
-- تعریف یک Integration/Connector در marketplace (در سطح plugin)
-- plugins table موجود است.

-- نصب/پیکربندی Connector در workspace/org
CREATE TABLE connector_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  plugin_install_id UUID REFERENCES plugin_installs(id) ON DELETE CASCADE,
  connector_type VARCHAR(100) NOT NULL, -- google_drive | instagram | hubspot | ...
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active | paused | revoked
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- توکن‌ها/credentialها (encrypted at rest)
CREATE TABLE connector_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_install_id UUID REFERENCES connector_installs(id) ON DELETE CASCADE,
  auth_type VARCHAR(20) NOT NULL, -- oauth | api_key | service_account
  encrypted_secret BYTEA NOT NULL,
  secret_metadata JSONB DEFAULT '{}', -- scopes, expiry, rotated_at
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- jobهای sync
CREATE TABLE connector_sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_install_id UUID REFERENCES connector_installs(id) ON DELETE CASCADE,
  job_type VARCHAR(30) NOT NULL, -- full | delta
  status VARCHAR(20) NOT NULL DEFAULT 'queued', -- queued | running | success | failed
  cursor JSONB DEFAULT '{}', -- delta cursor / page token
  stats JSONB DEFAULT '{}',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);
```

---

> **خلاصه:** Connectors/Tools/Plugins در O₂N یک سیستم extensibility کامل است: نصب، احراز هویت، permission enforcement، اجرا، audit، economics، و sync برای افزودن حافظه و مدیریت عملیات مثل social/marketing.
