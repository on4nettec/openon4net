# Billing & Marketplace API — Open on4net (O₂N)

> **فایل:** 04_API/02-billing-and-marketplace-api.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) اصول

- همه endpointها زیر: `https://api.on4net.com/v1`
- Auth: JWT Bearer
- Tenant headers:
  - `X-Organization-Id`
  - `X-Workspace-Id` (اختیاری)

---

## ۲) Wallet & Credits

### ۲.۱) مشاهده کیف پول
```
GET /billing/wallet
→ {
  "currency": "O2N",
  "balance_credits": 125000,
  "updated_at": "2026-07-07T14:30:00Z"
}
```

### ۲.۲) لیست تراکنش‌ها
```
GET /billing/transactions?limit=50
→ { "transactions": [ ... ] }
```

### ۲.۳) Top-up (شروع پرداخت)
```
POST /billing/topup
{
  "amount_credits": 50000,
  "payment_method": "card"
}
→ {
  "status": "pending",
  "payment_url": "https://payments.on4net.com/...",
  "topup_id": "..."
}
```

> در v1 می‌توان این مسیر را mock کرد یا با یک provider پرداخت داخلی پیاده کرد.

---

## ۳) Cost Estimation (قبل از اجرا)

### ۳.۱) تخمین هزینه یک درخواست به Agent
```
POST /cost/estimate
{
  "type": "agent_chat",
  "agent_id": "agent-xxx",
  "payload": { "message": "..." }
}
→ {
  "estimated_credits": 120,
  "breakdown": {
    "model": { "credits": 90, "model": "gpt-4o-mini" },
    "tools": [{ "id": "web-search", "credits": 30 }]
  },
  "requires_approval": false
}
```

---

## ۴) Marketplace — Discovery

### ۴.۱) لیست پلاگین‌ها
```
GET /marketplace/plugins?category=productivity&query=crm
→ { "plugins": [ ... ], "total": 123 }
```

### ۴.۲) جزئیات یک پلاگین
```
GET /marketplace/plugins/{plugin_id}
→ {
  "id": "...",
  "name": "SMS Sender",
  "version": "1.0.0",
  "publisher": { "display_name": "on4net" },
  "pricing": { "model": "per_call", "price_credits": 10 },
  "permissions": ["http:send", "memory:read"]
}
```

---

## ۵) Marketplace — Install/Enable

### ۵.۱) نصب پلاگین
```
POST /marketplace/plugins/{plugin_id}/install
{
  "workspace_id": "ws-xxx",
  "config": { "api_key": "..." }
}
→ { "install_id": "...", "status": "installed" }
```

### ۵.۲) فعال/غیرفعال
```
POST /marketplace/installs/{install_id}/enable
POST /marketplace/installs/{install_id}/disable
```

---

## ۶) Publisher APIs (برای سازندگان)

### ۶.۱) ساخت حساب publisher
```
POST /publisher
{ "display_name": "Pouya Dev" }
→ { "publisher_id": "...", "status": "pending" }
```

### ۶.۲) انتشار پلاگین (MVP)
```
POST /publisher/plugins
{
  "package_name": "com.on4net.sms-sender",
  "name": "SMS Sender",
  "version": "1.0.0",
  "manifest": { ... },
  "pricing": { "model": "per_call", "price_credits": 10 }
}
→ { "plugin_id": "...", "status": "submitted" }
```

> انتشار واقعی باید review + security scan داشته باشد (ارجاع به 08_CODING_STANDARD/02-security.md).

> معماری کامل Marketplace و مسیر “ماژول در MVP → سرویس مستقل” در: `02_ARCHITECTURE/12-marketplace-service.md`

### ۶.۳) درآمد/گزارش سازنده
```
GET /publisher/earnings?from=2026-07-01&to=2026-07-07
→ {
  "currency": "O2N",
  "total_earned_credits": 12000,
  "breakdown": [{ "plugin_id": "...", "earned_credits": 8000 }]
}
```

---

## ۷) Error Codes (افزوده)

| کد | HTTP | توضیح |
|----|------|-------|
| `insufficient_credits` | 402 | اعتبار کافی نیست |
| `pricing_not_configured` | 400 | قیمت‌گذاری plugin مشخص نیست |
| `publisher_not_verified` | 403 | ناشر هنوز verified نیست (برای payout/انتشار خاص) |

---

> **خلاصه:** این APIها کنترل credits، تخمین هزینه، نصب/مدیریت marketplace، و مسیرهای publisher را فراهم می‌کند تا «سازنده منتفع شود» و مصرف‌کننده با credits داخلی مصرف کند.
