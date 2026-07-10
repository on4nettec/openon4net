# Authentication Modes (Multi-Method Auth) — Open on4net (O₂N)

> **فایل:** 02_ARCHITECTURE/16-authentication-modes.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) مسئله

Runtime (Plane 1) در مسیر production-ready باید **authentication واقعی per-user** داشته باشد، اما در عین حال:

- پروژه **self-hosted و رایگان** است ⇒ نباید کاربر را مجبور به سرویس بیرونی (cloud/SSO/email) کنیم.
- برخی مشتری‌ها **چند روش ورود** را همزمان می‌خواهند (مثلاً Password + SSO).
- تغییر مسیر auth بعداً پرهزینه است ⇒ باید از اول به شکل provider-based طراحی شود.

---

## ۲) هدف‌ها

- امکان فعال‌کردن **چند روش ورود به‌صورت همزمان** (multi-active) با تنظیمات.
- خروجی همه روش‌ها یکسان باشد: در پایان یک **session/jwt واحد** صادر شود و RBAC همان مدل فعلی بماند.
- روش‌های dev فقط در dev قابل استفاده باشد (نه accidental در production).

---

## ۳) مدل پیشنهادی: Auth Method Registry

### ۳.۱) مفاهیم

- `AuthMethod`: یک provider مستقل (password / magic_link / oauth / dev_api_key / …)
- `AUTH_METHODS_ENABLED`: لیست روش‌های فعال در این deployment
- `AUTH_METHODS_DEFAULT`: روش پیش‌فرض UI (اختیاری)

### ۳.۲) قرارداد env (برای multi-active)

نمونه `.env`:

```env
# Comma-separated list. Example: password,oauth,magic_link
AUTH_METHODS_ENABLED=password,oauth
AUTH_METHODS_DEFAULT=password

# Hard safety: dev auth should never be enabled in prod by mistake
AUTH_ALLOW_DEV_METHODS=false
```

قواعد:

1. اگر `AUTH_ALLOW_DEV_METHODS=false` باشد، حتی اگر `dev_api_key` در لیست باشد باید startup fail کند (در production).
2. اگر `AUTH_METHODS_ENABLED` خالی باشد ⇒ startup fail (امن‌تر از default مبهم).

---

## ۴) روش‌ها (پیشنهادی)

> نکته: هدف این سند «قابل‌پیاده‌سازی و قابل‌پیکربندی» بودن است، نه اینکه همه روش‌ها از روز اول کامل شوند.

### ۴.۱) Password (پیشنهادی برای self-hosted)

```env
AUTH_METHODS_ENABLED=password
PASSWORD_HASHER=argon2id
PASSWORD_MIN_LENGTH=10
```

- ذخیره پسورد فقط به شکل hash (`argon2id`) + salt.
- rate limit و lockout روی endpointهای login.

### ۴.۲) Magic Link (وابسته به email)

```env
AUTH_METHODS_ENABLED=password,magic_link

EMAIL_FROM=no-reply@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

- magic-link token کوتاه‌عمر، یک‌بارمصرف، قابل revoke.

### ۴.۳) OAuth/OIDC (برای SSO سبک)

```env
AUTH_METHODS_ENABLED=password,oauth
OAUTH_PROVIDERS=google,github

OAUTH_GOOGLE_CLIENT_ID=...
OAUTH_GOOGLE_CLIENT_SECRET=...
OAUTH_GITHUB_CLIENT_ID=...
OAUTH_GITHUB_CLIENT_SECRET=...

OAUTH_CALLBACK_URL=https://runtime.example.com/auth/oauth/callback
```

- خروجی OIDC/OAuth در نهایت باید به user داخلی map شود (email + provider subject).

### ۴.۴) Dev API Key (فقط dev / bootstrap)

```env
AUTH_METHODS_ENABLED=dev_api_key,password
AUTH_ALLOW_DEV_METHODS=true
DEV_API_KEY=change-me
```

قواعد سخت‌گیرانه:

- `dev_api_key` فقط وقتی `AUTH_ALLOW_DEV_METHODS=true` و `NODE_ENV=development` است.
- برای production: یا حذف کامل این روش، یا محدود به **bootstrap admin** (یک‌بارمصرف) و سپس disable.

---

## ۵) UX پیشنهادی (Multi-Active Login)

وقتی چند روش فعال است:

- صفحه login باید **همه گزینه‌ها** را نشان دهد (مثلاً دکمه Google + فرم Password).
- `AUTH_METHODS_DEFAULT` فقط تعیین می‌کند کدام گزینه ابتدا focus/expand باشد.

---

## ۶) مهاجرت از وضعیت فعلی (بدون پسورد)

اگر قبلاً کاربرها با `DEV_API_KEY` ساخته شده‌اند:

- مسیر `set-password` یا `admin-invite` برای ایجاد credential واقعی لازم است.
- توصیه: در اولین login بعد از فعال شدن Password، اگر کاربر پسورد ندارد ⇒ مجبور به set-password شود.

---

## ۷) Observability / Audit

برای هر login:

- ثبت `auth_method` (password/magic_link/oauth/…)
- ثبت `user_id`, `org_id`, `ip`, `user_agent`, `trace_id`

---

## ۸) نکته‌ی اجرایی برای Runtime فعلی (July 2026)

در کد فعلی Runtime، `DEV_API_KEY` در `apps/openon4net-runtime/gateway/src/env.ts` اجباری است و login صرفاً dev-mode است.

برای پیاده‌سازی این سند:

- schema env باید اجازه دهد برخی روش‌ها اختیاری باشند (مثلاً `DEV_API_KEY` فقط وقتی dev روش فعال است).
- routeهای auth باید بر اساس `AUTH_METHODS_ENABLED` ثبت/گارد شوند.
