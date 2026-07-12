# Connectors & Memory Ingestion API — Open on4net (O₂N)

> **فایل:** 04_API/03-connectors-memory-ingestion-api.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) هدف

این APIها سه نیاز اصلی را پوشش می‌دهند:

1. اتصال سرویس‌های خارجی (Google Drive / CRM / Social / ...)
2. اجرای sync/job و ingest داده به Memory Engine
3. مدیریت دستی حافظه (import/export, reindex, delete) به‌صورت قابل حسابرسی

پیش‌نیازهای معماری:

- permissions + governance enforcement
- audit_logs برای همه عملیات
- trace_id برای correlation با logs/tracing

---

## ۲) Connector Install & Auth

### ۲.۱) لیست connectorهای نصب‌شده

```
GET /connectors/installs
→ { "installs": [ ... ] }
```

### ۲.۲) نصب یک connector (از یک plugin install)

```
POST /connectors/installs
{
  "workspace_id": "ws-xxx",
  "plugin_install_id": "pi-xxx",
  "connector_type": "google_drive",
  "config": {
    "default_layer": 4,
    "tags": ["knowledge", "drive"]
  }
}
→ { "install_id": "ci-xxx", "status": "created" }
```

### ۲.۳) شروع OAuth (redirect)

```
POST /connectors/installs/{install_id}/oauth/start
→ { "auth_url": "https://accounts.google.com/o/oauth2/..." }
```

### ۲.۴) OAuth callback (server-side)

```
POST /connectors/oauth/callback
{
  "install_id": "ci-xxx",
  "code": "oauth_code",
  "state": "..."
}
→ { "status": "connected" }
```

### ۲.۵) revoke/disable

```
POST /connectors/installs/{install_id}/disable
POST /connectors/installs/{install_id}/revoke
```

---

## ۳) Sync Jobs (Full/Delta)

### ۳.۱) اجرای sync

```
POST /connectors/installs/{install_id}/sync
{ "mode": "delta" }   // delta | full
→ { "job_id": "job-xxx", "status": "queued" }
```

### ۳.۲) وضعیت job

```
GET /connectors/sync-jobs/{job_id}
→ {
  "status": "running",
  "stats": { "files_scanned": 120, "chunks_written": 3400 },
  "started_at": "...",
  "trace_id": "trace_..."
}
```

### ۳.۳) لیست jobها

```
GET /connectors/installs/{install_id}/sync-jobs?limit=50
```

---

## ۴) Memory Ingestion Controls

### ۴.۱) تنظیم مقصد حافظه (layer mapping)

```
PUT /connectors/installs/{install_id}/ingestion-policy
{
  "rules": [
    { "if": { "path_prefix": "/Projects/Alpha" }, "then": { "layer": 3, "tags": ["project:alpha"] } },
    { "if": { "mime": "application/pdf" }, "then": { "layer": 4, "tags": ["policy"] } }
  ],
  "default": { "layer": 4, "tags": ["company-knowledge"] }
}
```

### ۴.۲) re-index / re-embed

```
POST /memory/reindex
{
  "scope": "organization",
  "layers": [3,4],
  "filters": { "tags": ["project:alpha"] }
}
→ { "job_id": "memjob-xxx", "status": "queued" }
```

### ۴.۳) وضعیت reindex job (پیاده‌سازی‌شده در `apps/openon4net-memory`، ۲۰۲۶-۰۷-۱۲)

```
GET /memory/reindex/{job_id}
→ { "id": "memjob-xxx", "organizationId": "...", "scope": "organization", "layers": [3,4], "status": "queued|running|completed|failed", "stats": {...}, "error": null, "createdAt": "...", "completedAt": null }
```

404 اگر job پیدا نشود یا متعلق به سازمان دیگری باشد.

---

## ۵) Manual Memory Management (API)

> این‌ها مکمل endpointهای موجود در `04_API/01-rest-api-spec.md` هستند.

### ۵.۱) import فایل/متن (بدون connector)

```
POST /memory/import
{
  "layer": 4,
  "title": "HR Policy",
  "content": "....",
  "tags": ["policy","hr"],
  "source": { "type": "manual" }
}
→ { "memory_id": "mem-xxx" }
```

### ۵.۲) export

```
POST /memory/export
{
  "layers": [3,4],
  "filters": { "tags": ["policy"] },
  "format": "jsonl"
}
→ { "export_id": "exp-xxx", "status": "queued" }
```

### ۵.۲.۱) وضعیت export job + دانلود (پیاده‌سازی‌شده، ۲۰۲۶-۰۷-۱۲)

```
GET /memory/export/{export_id}
→ { "id": "exp-xxx", "organizationId": "...", "layers": [3,4], "format": "jsonl", "status": "queued|running|completed|failed", "filePath": null, "error": null, "createdAt": "...", "completedAt": null }

GET /memory/export/{export_id}/download
→ 409 اگر status هنوز completed نشده؛ در غیر این صورت فایل serialize‌شده (jsonl/json/csv) با header `Content-Disposition: attachment`.
```

### ۵.۳) delete (با audit + approval — همیشه async، هرگز synchronous)

```
POST /memory/delete
{
  "layers": [4],
  "filters": { "tags": ["policy"], "created_before": "2026-01-01" }
}
→ { "status": "pending_approval", "approval_id": "aprv-xxx" }
```

### ۵.۳.۱) مدیریت approval (پیاده‌سازی‌شده در `apps/openon4net-memory`، ۲۰۲۶-۰۷-۱۲)

```
GET /memory/approvals
→ { "approvals": [{ "id": "aprv-xxx", "organizationId": "...", "layers": [4], "filters": {...}, "status": "pending", "resolvedBy": null, "resolvedAt": null, "createdAt": "..." }] }

POST /memory/approvals/{id}/approve
→ حذف واقعی روی store مطابق layer اجرا می‌شود، approval به‌روزرسانی و برگردانده می‌شود (status: "approved").
   نکته: این عملیات گراف Neo4j را پاک نمی‌کند — چون node/edgeهای گراف با FK سخت به ردیف حافظه وصل نیستند،
   پاک‌سازی گراف عملیات جدا و صریح است، نه چیزی که این‌جا استنتاج شود.

POST /memory/approvals/{id}/reject
→ approval به‌روزرسانی می‌شود (status: "rejected")، ردیف‌ها دست‌نخورده می‌مانند.
```

### ۵.۴) prune (پیاده‌سازی‌شده در `apps/openon4net-memory`، ۲۰۲۶-۰۷-۱۲ — دقیقاً مطابق شکل مستندشده در `docs/spect/00_VISION/03-memory-engine.md` §۵/§۶)

```
POST /memory/prune
{
  "layers": [3, 4],
  "older_than": "2026-01-01T00:00:00.000Z"
}
→ { "approvals_created": [{ "organizationId": "...", "layer": 4, "approvalId": "aprv-xxx" }], "deleted_count": 0 }
```

لایه‌های ۳/۴/۵ (مالک‌دار — سازمان یا کاربر) هرگز خودکار حذف نمی‌شوند؛ به‌جایش
یک `memory_approvals` معلق ساخته می‌شود (همون human-in-the-loop مسیر
`/memory/delete`) — چون "review" و "summarize" در جدول retention سند
memory-engine هر دو یعنی تصمیم انسانی. لایه ۶ (Global Knowledge) هیچ
مالک/بازبین‌کننده‌ای ندارد، پس تنها لایه‌ای است که بلافاصله حذف می‌شود
(`deleted_count`).
یک sweep زمان‌بندی‌شده (`startPruneWorker`, `PRUNE_CHECK_INTERVAL_MS` پیش‌فرض
۲۴ ساعت) همین منطق را با آستانه‌های پیش‌فرض هر لایه
(`PRUNE_PROJECT_MEMORY_DAYS`=۱۸۰, `PRUNE_COMPANY_KNOWLEDGE_DAYS`=۳۶۵,
`PRUNE_PERSONAL_KNOWLEDGE_DAYS`=۱۸۰, `PRUNE_GLOBAL_KNOWLEDGE_DAYS`=۳۶۵)
برای همه‌ی سازمان‌ها اجرا می‌کند.

```

---

## ۶) Social/Marketing Execution (از طریق connectors)

### ۶.۱) نمونه: publish social post
```

POST /tools/execute
{
"tool_id": "instagram.post",
"connector_install_id": "ci-instagram-xxx",
"params": { "caption": "...", "media_url": "s3://..." }
}
→ { "status": "completed", "platform_post_id": "..." }

```

قواعد:
- `social:post` همیشه audit_level=full
- idempotency_key اجباری برای جلوگیری از دوبار پست

---

## ۷) Skill Manual Create (افزوده پیشنهادی)

برای اینکه کاربر بتواند Skill را دستی تعریف کند (نه فقط approve پیشنهاد):
```

POST /skills
{
"agent_id": "agent-xxx",
"name": "weekly-report",
"description": "ارسال گزارش هفتگی",
"definition": { "...": "YAML/JSON skill definition" }
}
→ { "skill_id": "skill-xxx", "status": "created" }

```

---

## ۸) Error Codes (افزوده)

| کد | HTTP | توضیح |
|----|------|-------|
| `connector_not_connected` | 400 | connector نصب هست ولی auth نشده |
| `connector_revoked` | 403 | دسترسی revoke شده |
| `sync_in_progress` | 409 | job قبلی هنوز تمام نشده |
| `ingestion_policy_invalid` | 400 | ruleها معتبر نیستند |

---

> **خلاصه:** این APIها امکان اتصال سرویس‌های خارجی، sync و ingest داده به حافظه سازمانی، و اجرای عملیات social/marketing تحت governance را فراهم می‌کند؛ و مسیر رسمی برای ساخت دستی Skill را هم اضافه می‌کند.

```
