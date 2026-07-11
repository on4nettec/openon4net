# TODO — openon4net-runtime (Plane 1)

> فایل تصمیم‌گیری، نه صف اجرا. من (Claude) هیچ‌کدوم از این ردیف‌ها رو خودم
> شروع نمی‌کنم — منتظر می‌مونم بگی کدوم رو انجام بدم (تک‌تک یا گروهی).
> بعد از هر تسک، وضعیتش اینجا و خلاصه‌اش در `docs/spect/DONE.md` به‌روز می‌شه.
>
> **محدوده:** همه‌ی ردیف‌ها (مگر خلافش نوشته شده) فقط داخل
> `apps/openon4net-runtime/` اجرا می‌شن، با کامیت جفتی (submodule + bump
> pointer در روت). ردیف‌هایی که به فایل ریشه‌ی مونوریپو نیاز دارن
> (`pnpm-workspace.yaml` و غیره) صراحتاً علامت‌گذاری شدن — که برای این Plane
> عملاً پیش نمیاد چون از قبل ثبت شده.
>
> این فایل خواهر `TODO-openon4net-memory.md` است، همون فرمت.

---

## بخش A — کم‌ریسک، خلأهای مشخص و مجزا (هر کدوم مستقل قابل انجامه)

| #      | تسک                                                                              | یادداشت                                                                     |    وضعیت     |
| ------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | :----------: |
| RT-001 | Audit log viewer (`GET /v1/audit` + صفحه داشبورد)                                | ✅ انجام شد — جزئیات در `DONE.md`                                           |      ✅      |
| RT-002 | Workspace CRUD (`POST`/`GET /v1/workspaces`)                                     | ✅ انجام شد — جزئیات در `DONE.md`                                           |      ✅      |
| RT-003 | ساخت/حذف نقش سفارشی (`POST`/`DELETE /v1/roles`)                                  | ✅ انجام شد — جزئیات در `DONE.md`                                           |      ✅      |
| RT-004 | تغییر نقش کاربر بعد از ساخت + غیرفعال/حذف کاربر (`PATCH`/`DELETE /v1/users/:id`) | ✅ انجام شد — جزئیات در `DONE.md`                                           |      ✅      |
| RT-005 | تست واقعی ارسال تلگرام                                                           | کد کامله، فقط نیاز به یک bot token واقعی از طرف شما (بلاک شده، نه فنی)      | ⏸️ منتظر شما |
| RT-006 | یک connector دیگه علاوه بر تلگرام (مثلاً email یا generic webhook)               | ✅ انجام شد — generic webhook connector با محافظت SSRF، جزئیات در `DONE.md` |      ✅      |

## بخش B — دامنه‌ی متوسط، قابلیت جدید واقعی (هنوز کاملاً داخل Runtime)

| #      | تسک                                                                                              | یادداشت                                                                                                                                 | وضعیت |
| ------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | :---: |
| RT-007 | اجرای زمان‌بندی‌شده‌ی Agent (`agents.schedule`)                                                  | ✅ انجام شد — scheduler درون‌فرآیندی 30 ثانیه‌ای، جزئیات در `DONE.md`                                                                   |  ✅   |
| RT-008 | ABAC Policy Layer (§6 سند `10-rbac-and-policy.md`) — جدول `policies` + شرایط cost/layer/tag/time | ✅ انجام شد (subset: `cost_gt_cents`, `outside_hours`) — condition typeهای بیشتر (layer/tag/environment) هنوز نیست، جزئیات در `DONE.md` |  ✅   |
| RT-009 | نمایش بودجه/هزینه در داشبورد                                                                     | ✅ انجام شد — `BudgetBar` در صفحه Agents، جزئیات در `DONE.md`                                                                           |  ✅   |
| RT-010 | نمایش وضعیت rate limit                                                                           | ✅ انجام شد — badge در صفحه چت، جزئیات در `DONE.md`                                                                                     |  ✅   |
| RT-021 | صفحه Chat مطابق UI مرجع (۳ پنل: Control/Chat/Workspace) + پشتیبانی RTL/LTR بر اساس زبان انتخابی  | شامل mirror صحیح layout در RTL، انتخاب زبان، و هم‌تراز شدن اجزا (پنل‌ها/پیام‌ها/تاریخ‌ها)                                               |  ❌   |
| RT-022 | Session management در UI (هر Agent چند session + `+ New session` + Recent)                       | API بر اساس `conversations`؛ ساخت/rename/archive، و اتصال `conversation_id` در chat                                                     |  ❌   |
| RT-023 | Agent picker + دکمه `+` کنار لیست Agentها برای ساخت Agent (modal)                                | دکمه فقط برای admin نمایش داده شود؛ ساخت Agent + ساخت workspace اختصاصی Agent (۱:۱)                                                     |  ❌   |
| RT-024 | Agent Access (grant/revoke) — کاربر به یک یا چند Agent دسترسی داشته باشد                         | صفحه/مدال مدیریت دسترسی + enforce در API؛ کاربران فقط Agentهایی که دسترسی دارند را ببینند                                               |  ❌   |
| RT-025 | Workspace فایل‌محور per-agent (نمایش پنل Files و جداسازی workspaceها)                            | هر Agent workspace خودش را داشته باشد و در پنل Workspace فقط همان نمایش داده شود (هم‌راستا با `agents.workspace_id`)                    |  ❌   |
| RT-026 | Skill grants per-agent (admin اجازه Skill/Tool به Agent بدهد)                                    | مدل `agent_skill_grants` + UI برای assign/revoke + audit؛ کاربر می‌تواند Skill بسازد/ارتقا دهد ولی اتصال به Agent کنترل‌شده باشد        |  ❌   |
| RT-027 | نصب ابزارها/پلاگین‌ها از Marketplace + ZIP + حالت دستی (self-hosted)                             | UI/API برای upload ZIP (با validate/flag امنیتی) + install از marketplace + ثبت audit                                                   |  ❌   |
| RT-028 | Feature gating برای Programmer Agent/Development skills بر اساس لایسنس AI Gateway                | مخفی/غیرفعال‌سازی role `programmer` و skill/pluginهای Development بدون لایسنس + خطای `feature_not_available` + audit                    |  ❌   |
| RT-029 | Auto-migrate روی startup (اولین بالا آمدن سیستم + upgradeها)                                     | ✅ انجام شد — `schema_migrations` + advisory lock + fail-fast + `DB_AUTO_MIGRATE=false` + `pnpm run migrate` دستی، جزئیات در `DONE.md`  |  ✅   |
| RT-030 | Settings: شخصی‌سازی لوگو (Branding)                                                              | آپلود لوگو (Light/Dark اختیاری) + ذخیره در S3/MinIO + enforce `branding:update` + audit + نمایش در UI (login/sidebar)                   |  ❌   |

## بخش C — ⚠️ تصمیمات بزرگ‌تر معماری (نیاز به تأیید آگاهانه قبل از شروع)

| #      | تسک                                                                         | یادداشت                                                                                                                                                                                                                                             |
| ------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RT-011 | یکپارچگی واقعی Vault/secret manager (T-009)                                 | ✅ تصمیم گرفته شد و طراحی مشخص در `02_ARCHITECTURE/11-secrets-and-key-management.md` §4.1 — تفصیلی شده به **RT-019/RT-020** پایین                                                                                                                   |
| RT-012 | per-user credential واقعی (پسورد/توکن جدا به‌جای یک API key مشترک org-wide) | ✅ انجام شد — RT-014..RT-018 پایین همه ✅. `DEV_API_KEY` مشترک هنوز وجود داره اما حالا یکی از چند provider هست و پیش‌فرض production بی‌خطره (RT-018)                                                                                                |
| RT-013 | حافظه معنایی لایه‌های ۳-۶ + Memory Graph (Neo4j)                            | **این عملاً به‌جای اینجا، توی `TODO-openon4net-memory.md` بخش C (MEM-008/009/010) پیگیری می‌شه** — طبق `03-memory-engine.md` §8، لایه‌های بلندمدت می‌تونن به سرویس مدیریت‌شده (Plane 3) منتقل بشن. اینجا فقط برای یادآوری لینک شده، کار تکراری نیست |

---

## بخش D — Authentication Modes (از `02_ARCHITECTURE/16-authentication-modes.md`، 2026-07-10 اضافه شد)

> طراحی: یک Auth Method Registry provider-based — چند روش ورود می‌تونن هم‌زمان فعال باشن
> (`AUTH_METHODS_ENABLED` در env)، خروجی همه یکی‌ست (session/JWT واحد + همون RBAC فعلی).
> RT-014 زیرساخت پایه‌ست و بقیه بهش وابسته‌ن — ترتیب منطقی همون ترتیب شماره‌هاست.

| #      | تسک                                                                                                                                                                              | یادداشت                                                                                                                                                     | وضعیت |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | :---: |
| RT-014 | Auth Method Registry (`AUTH_METHODS_ENABLED`/`AUTH_METHODS_DEFAULT`/`AUTH_ALLOW_DEV_METHODS` + provider interface + fail-fast اگه لیست خالیه + audit `auth_method` روی هر login) | ✅ انجام شد — `gateway/src/auth/registry.ts` + `env.ts`'s `superRefine`؛ `/v1/auth/methods` هم اضافه شد. جزئیات در `DONE.md`                                |  ✅   |
| RT-015 | Password provider (`argon2id`, `PASSWORD_MIN_LENGTH`, rate-limit/lockout روی login، مسیر `set-password` برای کاربرهای قدیمی بدون پسورد)                                          | ✅ انجام شد — `@node-rs/argon2`، Redis-backed lockout (۵ تلاش/۱۵ دقیقه)، جزئیات در `DONE.md`                                                                |  ✅   |
| RT-016 | Magic Link provider (`SMTP_*`, `EMAIL_FROM`, توکن یک‌بارمصرف کوتاه‌عمر قابل revoke)                                                                                              | ✅ انجام شد و end-to-end با یک MailHog واقعی تست شد (نه فقط کد) — جزئیات در `DONE.md`. پیش‌فرض غیرفعال چون SMTP واقعی نداریم                                |  ✅   |
| RT-017 | OAuth/OIDC provider (`OAUTH_PROVIDERS=google,github` + callback + map به user داخلی با email+subject)                                                                            | ✅ کد کامل، تست شده تا حدی که بدون یک Google/GitHub app واقعی ممکنه (مسیر start/state/callback واقعاً به Google زده شد) — همون بلاک RT-005، پیش‌فرض غیرفعال |  ✅   |
| RT-018 | سخت‌گیری Dev API Key (فقط با `AUTH_ALLOW_DEV_METHODS=true` و `NODE_ENV=development`؛ برای prod یا حذف کامل یا bootstrap-admin یک‌بارمصرف بعد disable)                            | ✅ انجام شد — یک باگ واقعی همینجا پیدا و فیکس شد (`z.coerce.boolean()` رو "false" رو `true` می‌خوند)، جزئیات در `DONE.md`                                   |  ✅   |

---

## بخش E — KMS Multi-Provider (از `02_ARCHITECTURE/11-secrets-and-key-management.md` §4.1، 2026-07-10 اضافه شد)

> طراحی: چند KMS provider می‌تونن هم‌زمان فعال باشن (`SECRETS_KMS_ENABLED_PROVIDERS`)، ولی نوشتن‌های
> جدید همیشه با provider «اصلی» (`SECRETS_KMS_PRIMARY_PROVIDER`) رمزنگاری می‌شن؛ خوندن بر اساس
> `provider_id` ذخیره‌شده در متادیتای خودِ هر secret انجام می‌شه (+ مسیر مهاجرت re-encrypt-on-read).

| #      | تسک                                                                                                                                     | یادداشت                                                                                                                                                                                             | وضعیت |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---: |
| RT-019 | KMS Provider Registry (env config + متادیتای `provider_id`/`key_id`/`version` روی هر secret رمزنگاری‌شده + fallback/re-encrypt-on-read) | زیرساخت پایه — provider «env» فعلی (`CONFIG_ENCRYPTION_KEY`, AES-256-GCM) باید به این الگو منتقل بشه تا provider بعدی (RT-020) قابل‌اضافه‌شدن بشه، بدون دست‌زدن به secrets قدیمی                    |  ❌   |
| RT-020 | ⚠️ Vault provider واقعی (HashiCorp Vault Transit — `VAULT_ADDR`/`VAULT_TOKEN`/`VAULT_TRANSIT_KEY`)                                      | نیاز به یک **container جدید در `docker-compose.yml`** (وابستگی زیرساختی جدید برای یک محصول self-hosted) — این یکی هنوز نیاز به تأیید صریح داره قبل از شروع، چون نصب کاربر نهایی رو پیچیده‌تر می‌کنه |  ❌   |

---

## نحوه استفاده

بهم بگو کدوم شماره‌(ها) رو انجام بدم (مثلاً «RT-001 و RT-002 رو برو انجام بده»).
اگه چیزی این‌جا نیست ولی لازمشه، بگو تا اضافه‌اش کنم.
