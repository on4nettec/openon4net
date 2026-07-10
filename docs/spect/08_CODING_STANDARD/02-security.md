# Security Bible — Open on4net

> **فایل:** 08_CODING_STANDARD/02-security.md
> **نسخه:** 1.0

---

## ۱. اصول امنیتی

| اصل                    | توضیح                                     |
| ---------------------- | ----------------------------------------- |
| **Least Privilege**    | هر Agent و Plugin حداقل دسترسی لازم       |
| **Defense in Depth**   | چند لایه امنیتی                           |
| **Zero Trust**         | هیچ درخواستی پیش‌فرض قابل اعتماد نیست     |
| **Encrypt Everything** | داده در حال انتقال و در حال ذخیره رمز شود |
| **Audit Everything**   | همه چیز لاگ شود                           |

## ۲. Authentication & Authorization

```
User/Agent Request
    │
    ▼
API Gateway:
├── JWT Validation
├── API Key Check
├── Rate Limiting (۱۰۰ req/min free, ۱۰۰۰ paid)
├── IP Whitelist (Enterprise)
└── CORS Policy
    │
    ▼
Workspace Service:
├── Organization Check: آیا این Agent متعلق به این Org است؟
├── Role Check: آیا این نقش مجاز است؟
├── Budget Check: آیا budget کافی است؟
└── Permission Check: آیا action مجاز است؟
```

### API Key Format:

```
o2n_xxxxx_xxxxxxxxxxxxxxxxxxxxxxx
├── prefix: o2n_
├── org_id: 5 chars
└── key: 24 chars (random)
```

## ۳. Plugin Security

| لایه            | تدبیر امنیتی                                    |
| --------------- | ----------------------------------------------- |
| **Sandbox**     | WASM Sandbox برای اجرای Pluginها                |
| **Permissions** | Manifest-based: Plugin فقط دسترسی‌های اعلام شده |
| **Validation**  | Static analysis قبل از انتشار                   |
| **Rate Limit**  | محدودیت درخواست برای هر Plugin                  |
| **Kill Switch** | غیرفعالسازی لحظه‌ای توسط Admin                  |
| **Audit**       | همه فعالیت‌های Plugin لاگ می‌شود                |

> Spec اجرایی Sandbox (levels, host functions, metering, network policy) در: `02_ARCHITECTURE/09-plugin-sandbox.md`
> Threat Model (STRIDE) در: `08_CODING_STANDARD/04-threat-model.md`
> RBAC/Policy model در: `02_ARCHITECTURE/10-rbac-and-policy.md`
> Secrets/KMS strategy در: `02_ARCHITECTURE/11-secrets-and-key-management.md`
> Authentication modes (multi-method, env-driven) در: `02_ARCHITECTURE/16-authentication-modes.md`

### Permission Levels:

```yaml
permissions:
  http:read:       # GET requests
  http:send:        # POST/PUT requests
  memory:read       # خواندن حافظه
  memory:write      # نوشتن در حافظه
  files:read        # خواندن فایل‌ها
  files:write       # نوشتن فایل‌ها
  admin:config      # تغییر تنظیمات
```

## ۴. Data Security

| داده                | روش رمزنگاری                    |
| ------------------- | ------------------------------- |
| API Keys            | Encrypted at rest (AES-256-GCM) |
| Passwords           | Argon2id hash                   |
| Tokens              | JWT with RS256                  |
| Messages in transit | TLS 1.3                         |
| Database            | Encryption at rest              |
| Files in MinIO      | Server-side encryption          |

## ۵. Network Security

```
Internet
    │
    ▼
Cloudflare / WAF
    │
    ▼
API Gateway (rate limit, auth)
    │
    ▼
Internal Network (VPC)
    ├── API Service
    ├── Agent Service
    ├── Database (non-public)
    └── MinIO (non-public)
```

## ۶. Governance Security

- **Audit Log غیرقابل تغییر:** Audit logها append-only
- **Human-in-the-Loop:** Actionهای حساس نیاز به تأیید انسانی
- **Budget Control:** سقف هزینه و هشدار
- **Rollback:** قابلیت برگرداندن تصمیمات
- **Session Management:** timeout خودکار بعد ۳۰ دقیقه

## ۷. Compliance

| استاندارد | وضعیت هدف  |
| --------- | ---------- |
| SOC 2     | تا v1.0    |
| GDPR      | از روز اول |
| HIPAA     | Enterprise |
| ISO 27001 | v2.0       |

---

> امنیت O₂N چندلایه است: از encryption و authentication گرفته تا sandbox و governance. همه چیز لاگ می‌شود و قابل برگشت است.
