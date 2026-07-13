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

| #      | تسک                                                                                              | یادداشت                                                                                                                                                                                                                                                                                                      | وضعیت |
| ------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---: |
| RT-007 | اجرای زمان‌بندی‌شده‌ی Agent (`agents.schedule`)                                                  | ✅ انجام شد — scheduler درون‌فرآیندی 30 ثانیه‌ای، جزئیات در `DONE.md`                                                                                                                                                                                                                                        |  ✅   |
| RT-008 | ABAC Policy Layer (§6 سند `10-rbac-and-policy.md`) — جدول `policies` + شرایط cost/layer/tag/time | ✅ انجام شد (subset: `cost_gt_cents`, `outside_hours`) — condition typeهای بیشتر (layer/tag/environment) هنوز نیست، جزئیات در `DONE.md`                                                                                                                                                                      |  ✅   |
| RT-009 | نمایش بودجه/هزینه در داشبورد                                                                     | ✅ انجام شد — `BudgetBar` در صفحه Agents، جزئیات در `DONE.md`                                                                                                                                                                                                                                                |  ✅   |
| RT-010 | نمایش وضعیت rate limit                                                                           | ✅ انجام شد — badge در صفحه چت، جزئیات در `DONE.md`                                                                                                                                                                                                                                                          |  ✅   |
| RT-021 | صفحه Chat مطابق UI مرجع (۳ پنل: Control/Chat/Workspace) + پشتیبانی RTL/LTR بر اساس زبان انتخابی  | شامل mirror صحیح layout در RTL، انتخاب زبان، و هم‌تراز شدن اجزا (پنل‌ها/پیام‌ها/تاریخ‌ها)                                                                                                                                                                                                                    |  ❌   |
| RT-022 | Session management در UI (هر Agent چند session + `+ New session` + Recent)                       | API بر اساس `conversations`؛ ساخت/rename/archive، و اتصال `conversation_id` در chat                                                                                                                                                                                                                          |  ❌   |
| RT-023 | Agent picker + دکمه `+` کنار لیست Agentها برای ساخت Agent (modal)                                | دکمه فقط برای admin نمایش داده شود؛ ساخت Agent + ساخت workspace اختصاصی Agent (۱:۱)                                                                                                                                                                                                                          |  ❌   |
| RT-024 | Agent Access (grant/revoke) — کاربر به یک یا چند Agent دسترسی داشته باشد                         | ✅ انجام شد — `agent_access_bindings` + enforce روی list/get/chat/tools/memory (نه فقط visibility)، جزئیات در `DONE.md`                                                                                                                                                                                      |  ✅   |
| RT-025 | Workspace فایل‌محور per-agent (نمایش پنل Files و جداسازی workspaceها)                            | هر Agent workspace خودش را داشته باشد و در پنل Workspace فقط همان نمایش داده شود (هم‌راستا با `agents.workspace_id`)                                                                                                                                                                                         |  ❌   |
| RT-026 | Skill grants per-agent (admin اجازه Skill/Tool به Agent بدهد)                                    | ✅ انجام شد — `agent_skill_grants` + `SkillGrantService` + UI (`/skills` صفحه) + audit (`skill-grant`/`skill-revoke`)، جزئیات در `DONE.md`                                                                                                                                                                   |  ✅   |
| RT-027 | نصب ابزارها/پلاگین‌ها از Marketplace + ZIP + حالت دستی (self-hosted)                             | ✅ انجام شد (subset: مسیر Marketplace) — پروکسی نصب Skill/Plugin از Marketplace با activation gating + audit، جزئیات در RT-035/RT-036 و `DONE.md`. Upload ZIP دستی هنوز نیست (`❌`، موکول به بعد)                                                                                                            |  ✅   |
| RT-028 | Feature gating برای Programmer Agent/Development skills بر اساس لایسنس AI Gateway                | مخفی/غیرفعال‌سازی role `programmer` و skill/pluginهای Development بدون لایسنس + خطای `feature_not_available` + audit                                                                                                                                                                                         |  ❌   |
| RT-029 | Auto-migrate روی startup (اولین بالا آمدن سیستم + upgradeها)                                     | ✅ انجام شد — `schema_migrations` + advisory lock + fail-fast + `DB_AUTO_MIGRATE=false` + `pnpm run migrate` دستی، جزئیات در `DONE.md`                                                                                                                                                                       |  ✅   |
| RT-030 | Settings: شخصی‌سازی لوگو (Branding)                                                              | آپلود لوگو (Light/Dark اختیاری) + ذخیره در S3/MinIO + enforce `branding:update` + audit + نمایش در UI (login/sidebar)                                                                                                                                                                                        |  ❌   |
| RT-031 | Context Contract + Prompt Builder (identity/task/workspace/memory/tools/permissions/language)    | context باید artifact رسمی شود؛ Prompt Builder فقط context فشرده و مرتبط با task فعلی را به LLM بدهد، نه همه فایل‌ها/همه memory                                                                                                                                                                              |  ❌   |
| RT-032 | Skill Engine Core (`skills` CRUD + Skill Executor) — فاز ۲ roadmap                               | ✅ انجام شد — `SkillService`+`routes/skills.ts` (CRUD)، `tool-dispatcher.ts`+`skill-executor.ts` (اجرای واقعی روی webhook-send/telegram-send). v1: فقط `steps[].type: 'tool'` و `trigger.type: 'manual'` — `query`/`prompt` step types و scheduled/event trigger موکول به بعد. جزئیات در `DONE.md`           |  ✅   |
| RT-033 | Auto-Skill Detection + Proposal Review — فاز ۲ roadmap                                           | ✅ انجام شد — `skill-pattern-detector.ts` (Frequency+Similarity روی `audit_logs`، ۲ از ۴ شرط سند — Duration/Complexity سیگنال ندارن) + `skill_proposals` + `routes/skill-proposals.ts` (approve/reject) + صفحه `/skill-proposals`. جزئیات در `DONE.md`                                                       |  ✅   |
| RT-034 | Activation Client سمت Runtime (T-CP-007) — فاز ۲ تکمیلی                                          | ✅ انجام شد — `activation-client.ts` (`checkIn()`، best-effort)، `activation-state.ts` (`ActivationState.isActivated()` — بدون پیکربندی همیشه `true`، grace window ۲۴ ساعته بعد از پیکربندی)، `activation-scheduler.ts` (poller ساعتی). ۴ تست vitest با `http.createServer` محلی. جزئیات در `DONE.md`        |  ✅   |
| RT-035 | Marketplace install-proxy routes (Skills + Plugins) — فاز ۲ تکمیلی                               | ✅ انجام شد — `services/marketplace-client.ts` + `routes/marketplace.ts`: `GET /v1/marketplace/{plugins,skills}`، `POST .../install` (activation-gated برای هر دو، رایگان و پولی یکسان — ببینید ADR-012)، نصب Skill کپی `definition` را در یک ردیف local `skills` می‌ریزد. ۵ تست vitest. جزئیات در `DONE.md` |  ✅   |
| RT-036 | Plugin Settings UI (schema-driven config form) — فاز ۲ تکمیلی                                    | ✅ انجام شد — `PATCH /v1/marketplace/installs/:installId/config` (پروکسی به Marketplace)، صفحه `web/app/marketplace/page.tsx` (لیست Skill/Plugin + Install + فرم تنظیمات بر اساس `manifest.configSchema`). فرم فقط write (بدون GET تک‌نصب، مقدار قبلی pre-populate نمی‌شود). جزئیات در `DONE.md`             |  ✅   |
| RT-037 | Plugin SDK + CLI (`@o2n/plugin-sdk`, `create-o2n-plugin`) — فاز ۲ تکمیلی                         | ✅ انجام شد — `packages/plugin-sdk` (`createPlugin`/`defineTool`/`defineAction`، فقط type/manifest-building، بدون sandboxed execution) + `packages/create-o2n-plugin` (CLI اسکلت‌ساز، `pnpm create o2n-plugin <name>`). ۳ تست vitest برای CLI. جزئیات در `DONE.md`                                           |  ✅   |
| RT-038 | Organization CRUD واقعی — فاز ۳ (هفته ۲۵-۲۶)                                                     | ✅ انجام شد — `OrgService.getById`/`update` + `GET`/`PATCH /v1/organization` (بدون :id در URL، فقط سازمان همون session)؛ `plan`/`status` عمداً غیرقابل‌ویرایش (کار Control-Plane/activation است). بخش Organization در `web/app/settings/page.tsx`. جزئیات در `DONE.md`                                       |  ✅   |
| RT-039 | Workspace CRUD تکمیل (update + archive) — فاز ۳ (هفته ۲۵-۲۶)                                     | ✅ انجام شد — ستون `workspaces.status` (migration 0016)؛ `PATCH`/`POST .../archive`. حذف واقعی عمداً جایگزین نشد چون `agents.workspace_id` `ON DELETE CASCADE` داره — آرشیو، نه delete. ساخت agent در workspace آرشیوشده رد می‌شه. UI ادیت/آرشیو در `/workspaces`. جزئیات در `DONE.md`                       |  ✅   |
| RT-040 | تکمیل RBAC: تخصیص نقش سفارشی + binding به workspace انتخابی — فاز ۳ (هفته ۲۷-۲۸)                 | ✅ انجام شد — `UserCreateSchema`/`UserUpdateSchema`'s `role` از enum ۴تایی به هر نام نقش موجود در سازمان باز شد (DB از قبل همینو اجازه می‌داد، فقط Zod محدود بود)؛ `workspaceId` اختیاری اضافه شد. UI: `/users`'s role select از `GET /v1/roles` می‌خونه. جزئیات در `DONE.md`                                |  ✅   |
| RT-041 | سیستم دعوت با ایمیل (Invitation) — فاز ۳ (هفته ۲۵-۲۶)                                            | ✅ انجام شد — جدول `invitations` (migration 0017)، `InvitationService` (همون الگوی hashed-token مگ‌لینک، TTL هفت‌روزه)، `POST/GET /v1/invitations`، `POST /v1/auth/invitations/:token/accept` (public)، صفحه `/accept-invite`. ایمیل با همون `nodemailer` مگ‌لینک. جزئیات در `DONE.md`                       |  ✅   |
| RT-042 | تعمیم صف تأیید (Approval Queue) — فاز ۳ (هفته ۲۷-۲۸)                                             | ✅ انجام شد — `ApprovalService.create()` عمومی (نه فقط از داخل chat)، `expireStale()` + `approval-expiry-scheduler.ts` (sweep هر ۵ دقیقه)، صفحه `/approvals`. تریگر فعلی هنوز فقط chat-cost/policy است — این batch زیرساخت رو عمومی کرد، نه سطح جدید trigger. جزئیات در `DONE.md`                            |  ✅   |
| RT-043 | بودجه سازمان/workspace با جدول `wallets` — فاز ۳ (هفته ۲۷-۲۸)                                    | ✅ انجام شد — `WalletService` (credit/debit روی `wallets` که تا الان schema-only بود)، `GET /v1/wallet` + `POST /v1/wallet/credit`، budget gate سوم در `chat-service.ts` (اگه wallet ساخته شده باشه). اختیاری/opt-in — سازمان بدون wallet یعنی بدون سقف. جزئیات در `DONE.md`                                 |  ✅   |

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

---

## فازبندی سریع

### MVP / MVP-lite

- `RT-001..RT-010`
- `RT-011..RT-018`
- `RT-024`
- `RT-029`

### Post-MVP / Phase 2+

- `RT-019..RT-020`
- `RT-021..RT-023`
- `RT-025..RT-028`
- `RT-030..RT-031`
- `RT-032..RT-033` — roadmap Phase 2 (Skills): Skill Engine Core + Auto-Skill Detection, ✅ انجام شد ۲۰۲۶-۰۷-۱۲
- `RT-034..RT-037` — تکمیل roadmap Phase 2: Activation Client + Marketplace install-proxy (Skills/Plugins) + Plugin Settings UI + Plugin SDK/CLI، ✅ انجام شد ۲۰۲۶-۰۷-۱۲
- `RT-038..RT-043` — roadmap Phase 3 (هفته ۲۵-۲۸ فقط): Organization/Workspace CRUD تکمیل + Invitation + تکمیل RBAC + تعمیم Approval Queue + بودجه Wallet، ✅ انجام شد ۲۰۲۶-۰۷-۱۳. هفته ۲۹-۳۲ (Digital Employee KPI engine + Agent Teams) عمداً موکول شد — جزئیات در `DONE.md`

### وضعیت خاص

- `RT-005` هنوز منتظر bot token واقعی از طرف شماست.
- `RT-013` عملاً به Plane 3 منتقل شده و باید در memory دنبال شود.

> فازها و انتظار سیستم: `docs/spect/09_TASKS/13-phase-expectations.md`

---

## فاز 3 تا 5 در Runtime

### Phase 3 — Organization

- `RT-021..RT-031`, `RT-038..RT-043`
- هفته ۲۵-۲۸ (Org/Workspace CRUD + Invitation + RBAC + Approval + Wallet) ✅ انجام شد ۲۰۲۶-۰۷-۱۳؛ هفته ۲۹-۳۲ (Digital Employee KPI engine + Agent Teams) موکول شد
- وابستگی‌های roadmap: `T-077..T-104`

### Phase 4 — Ecosystem

- runtime touchpoints: `RT-027`, `RT-030`, `RT-031`
- وابستگی‌های roadmap: `T-105..T-132`

### Phase 5 — Enterprise

- runtime touchpoints: آماده‌سازی UI/Branding/Context برای enterprise
- وابستگی‌های roadmap: `T-133..T-160`
