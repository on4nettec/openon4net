# Secrets & Key Management (KMS Strategy) — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/11-secrets-and-key-management.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف

O₂N با چند نوع secret کار می‌کند:

- API keys مدل‌ها
- OAuth refresh tokens برای connectorها (Google Drive, Social, CRM)
- JWT signing keys
- encryption keys برای داده‌های حساس

این سند strategy عملی برای ذخیره/چرخش/ممیزی secrets است.

---

## ۲) طبقه‌بندی Secrets

| نوع                 | مثال                 | محل استفاده      | حساسیت |
| ------------------- | -------------------- | ---------------- | ------ |
| Model Provider Key  | OpenAI key           | AI Gateway       | بالا   |
| OAuth Tokens        | Google refresh token | Connectors       | بالا   |
| JWT Keys            | RS256 private key    | API Gateway/Auth | بالا   |
| DB Passwords        | postgres/redis       | runtime          | بالا   |
| Webhook Secrets     | signature secret     | webhooks         | متوسط  |
| Plugin Signing Keys | publisher signing    | marketplace      | بالا   |

---

## ۳) Storage Strategy (Environment-first)

### ۳.۱) MVP (dev)

- `.env` فقط برای dev
- هرگز در git ذخیره نشود

### ۳.۲) Production (SaaS)

الگوی پیشنهادی:

- Secret Store (Vault / cloud secret manager)
- services secrets را در startup fetch می‌کنند
- rotation با minimal downtime

### ۳.۳) Enterprise (On-Prem)

- پشتیبانی از Vault یا secret manager داخلی مشتری
- گزینه: integrate با HSM/KMS سازمانی

---

## ۴) Encryption at Rest (Envelope Encryption)

برای secrets ذخیره‌شده در DB (مثل connector_credentials):

- `data_key` per record یا per install
- `master_key` در KMS/Vault
- در DB فقط ciphertext ذخیره شود

Minimum fields:

- `encrypted_secret` (BYTEA)
- `secret_metadata` (scopes/expiry/rotated_at)

---

## ۴.۱) انتخاب Provider با `.env` (Multi-Active / قابل تنظیم)

### هدف

کاربر Runtime اگر خواست بتواند **چند provider را همزمان فعال کند** (برای backward-compat / migration / rotate)، ولی برای encrypt کردن داده‌های جدید یک provider «اصلی» داشته باشد.

### قرارداد env پیشنهادی

```env
# Comma-separated list of enabled providers
SECRETS_KMS_ENABLED_PROVIDERS=env,vault

# Provider used for *new* encrypt/write operations
SECRETS_KMS_PRIMARY_PROVIDER=vault

# Safety: in production, disallow env-based master keys unless explicitly allowed
SECRETS_ALLOW_ENV_KMS_IN_PROD=false
```

Provider-specific settings:

```env
# --- env provider (MVP/dev) ---
# Existing Runtime key (AES-256-GCM master key used for encrypting stored secrets)
CONFIG_ENCRYPTION_KEY=change-me-generate-with-openssl-rand-hex-32

# --- vault provider (production self-hosted) ---
VAULT_ADDR=http://vault:8200
VAULT_TOKEN=change-me
VAULT_TRANSIT_KEY=o2n-config
```

### Multi-active یعنی چه؟

- **Encrypt (write):** همیشه با `SECRETS_KMS_PRIMARY_PROVIDER` انجام می‌شود.
- **Decrypt (read):** از `provider_id` ذخیره‌شده در metadata هر secret استفاده می‌شود.
  - اگر record قدیمی metadata ندارد، می‌توان به‌صورت کنترل‌شده fallback کرد (به ترتیب `SECRETS_KMS_ENABLED_PROVIDERS`) و در صورت موفقیت، re-encrypt انجام داد.

### Metadata حداقلی پیشنهادی

در کنار ciphertext (یا داخل یک JSON wrapper)، این فیلدها لازم است:

- `provider_id` (env / vault / aws_kms / …)
- `key_id` (مثل نام کلید Vault Transit یا KMS key ARN)
- `version` (برای سازگاری آینده و مهاجرت)

> نکته: این طراحی باعث می‌شود «چند روش همزمان فعال» باشد بدون اینکه ambiguity در decrypt پیش بیاید.

---

## ۵) Rotation Policies

### ۵.۱) Model Keys

- rotate دوره‌ای (مثلاً ماهانه)
- rotate فوری در صورت leak

### ۵.۲) OAuth Tokens

- refresh token rotation support
- revoke و re-auth flow

### ۵.۳) JWT Keys

- key rotation با `kid` در JWT header
- پذیرش همزمان old+new در window مشخص

---

## ۶) Access Controls

قواعد:

- فقط serviceهایی که نیاز دارند به secret دسترسی دارند (least privilege)
- secrets به client-side ارسال نمی‌شوند
- audit برای access/rotation

---

## ۷) Operational Hooks

هر rotation باید:

- یک audit event ثبت کند (action_type=`rotate_secret`)
- یک trace_id داشته باشد
- و در monitoring alert تعریف شود (مثلاً: “rotation failed”)

ارجاع: `09_TASKS/07-security-ops-runbook.md`

---

> **خلاصه:** KMS strategy در O₂N بر پایه secret store + envelope encryption + rotation + audit است؛ تا connectorها و providers امن و قابل مدیریت باشند.
