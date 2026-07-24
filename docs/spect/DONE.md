# Done Log

> به‌روزرسانی می‌شود بعد از هر تسک تکمیل‌شده. هدف: تصویر سریع از اینکه چقدر
> پروژه واقعاً ساخته شده، بدون نیاز به مرور کل تاریخچه commitها.
>
> **Scope:** `apps/openon4net-runtime` (Plane 1) + از 2026-07-09 به‌صراحت
> `apps/openon4net-Platform` (Plane 2) هم شروع شد. از 2026-07-10
> `apps/openon4net-marketplace` (Plane 4) هم شروع شد (فقط MKT-002..MKT-006،
> با درخواست صریح). از 2026-07-12 `apps/openon4net-memory` (Plane 3) هم با
> درخواست صریح کاربر برای عبور از guardrail کامل شد (MEM-008..013). برای نقشه کامل ۱۲ماهه/۴-Plane به
> `docs/sprint-plan/*.md` نگاه کن (Control Plane مشخصاً:
> `docs/sprint-plan/04_control-plane-backlog.md`).
>
> **ستون «تست»:**
>
> - ✅ = واقعاً end-to-end روی زیرساخت واقعی اجرا و تأیید شده (curl/مرورگر واقعی، نه فقط build/typecheck)
> - ⚠️ = کد کامل و build/typecheck سبز، ولی رفتار واقعی‌اش مستقیماً چک نشده
> - 🔧 = کد کامل نوشته شده، ولی حتی build/typecheck هم اجرا نشده (پایین‌تر از ⚠️ — فقط برای Control Plane، چون هنوز در `pnpm-workspace.yaml` ثبت نیست؛ ریسک باگ ساده تایپ/import هنوز هست)
> - ❌ = اصلاً پیاده‌سازی/تست نشده

**آخرین به‌روزرسانی:** 2026-07-15

---

## خلاصه وضعیت

| بخش                               | وضعیت                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime — Sprint 0 (T-001..T-008) | ۸ از ۸ تکمیل، همه تست‌شده                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Runtime — کارهای بعد از Sprint 0  | ۳۲ فیچر تکمیل (RT-001..RT-004 + RT-006..RT-010 + RT-014..RT-018 + RT-024 + RT-026..RT-027 + RT-029 + RT-032..RT-043)، همه تست‌شده به‌جز ارسال واقعی تلگرام و OAuth با یک app واقعی Google/GitHub؛ جزئیات RT-038..043 پایین‌تر (Organization/Workspace CRUD تکمیل + Invitation + RBAC + Approval Queue تعمیم‌یافته + Wallet)                                                                                                                                                                                         |
| Runtime — فاز ۴ (Ecosystem)       | ✅ RT-057..067 کامل (Marketplace payment debit + Outcome Engine + BI Dashboard + Smart Features + Integration Hub) — روadmap فاز ۴ حالا ۱۶/۱۶؛ ۲۷ تست vitest جدید (۱۲۷/۱۲۷ کل سوییت gateway سبز)؛ جزئیات پایین‌تر                                                                                                                                                                                                                                                                                                   |
| Runtime — فاز ۵ (Enterprise)      | ✅ RT-068..075 — SSO سازمانی (OIDC+SAML per-org) + K8s manifests + backup/restore + SLA monitoring + DB sharding سند + Swagger docs + ۴ tutorial واقعی. SOC2/VPC/multi-region/CDN/case-studies/sales-kit صراحتاً خارج scope (نه کد، نیاز به منبع خارجی). ۱۹ تست vitest جدید (۱۴۶/۱۴۶ + ۳ skip)؛ ۲ باگ واقعی پیدا/فیکس شد (YAML syntax در API spec، `skills:*` غایب از seed پیش‌فرض admin)؛ جزئیات پایین‌تر                                                                                                          |
| Control Plane (Plane 2)           | CP-SP-01+02 کامل، curl واقعی (CP-001) + ۲۳ تست vitest (CP-003/005) + Docker واقعی (CP-004، ۲ باگ preexisting فیکس شد) + صفحه‌بندی/جستجو (CP-005) + T-CP-007 (کلاینت activation سمت Runtime، ۲۰۲۶-۰۷-۱۲) + CP-006/007/015..018 (۲۰۲۶-۰۷-۱۵، امروز با curl زنده دوباره تأیید شد)؛ مونده: تعامل واقعی مرورگر با `web/` (CP-002)                                                                                                                                                                                        |
| Memory (Plane 3)                  | ✅ backend واقعی Layers 3-6 + Memory Graph (MEM-008..013) + Extractor/Ranking/Pruning/Compression/Benchmark (MEM-014..018) — «فاز ۱: Memory» روadmap حالا ۱۰۰٪. guardrail با تأیید صریح کاربر عبور داده شد (۲۰۲۶-۰۷-۱۲). ۲۶/۲۶ تست vitest روی Postgres (pgvector) + Neo4j + Ollama واقعی سبز. MEM-005/006 (auth + trace_id) امروز (۲۰۲۶-۰۷-۱۵) با curl زنده روی instance واقعی تأیید شد؛ جزئیات پایین‌تر                                                                                                            |
| Marketplace (Plane 4)             | اسکلت واقعی `service/` (Fastify+pg، نه فقط 501) — migration (publishers/plugins/plugin_versions/plugin_reviews/plugin_installs)، submit/list/discover/install routes، ۱۴ تست vitest روی DB واقعی، CI + Docker واقعی build/run شد (✅ end-to-end تأیید شده با curl؛ جزئیات: MKT-002..MKT-006) + Skills entity + Plugin config PATCH (MKT-017..019، ۲۰۲۶-۰۷-۱۲، ۹ تست vitest جدید) + بخش B کامل (MKT-007..011، ۲۰۲۶-۰۷-۱۵ — auth/trace_id/checksum/permission-diff از قبل بودن، `API.md` امروز واقعاً گسترش پیدا کرد) |

---

## Sprint 0 — `docs/spect/09_TASKS/01-current-sprint.md`

| #     | تسک                                                                   | وضعیت                             | تست                                                                    |
| ----- | --------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| T-001 | Monorepo Setup (pnpm+turbo، packages/shared،governance،llm-providers) | ✅                                | ✅ build/typecheck/lint سبز                                            |
| T-002 | Docker Compose Dev Environment (Postgres/Redis/MinIO/migrations)      | ✅                                | ✅ 8 جدول ساخته شده، سرویس‌ها healthy                                  |
| T-003 | AI Gateway — اولین اتصال مدل (BYOK, یک provider)                      | ✅                                | ✅ تماس واقعی با Ollama                                                |
| T-004 | Basic Chat API (sync + SSE stream)                                    | ✅                                | ✅ هر دو مسیر با پیام واقعی                                            |
| T-005 | Next.js Dashboard MVP                                                 | ✅                                | ✅ login→list→create→chat با Playwright واقعی                          |
| T-006 | GitHub CI/CD                                                          | ✅ (`ci.yml`, `docker-build.yml`) | ✅ push واقعی (2026-07-10) — هر دو workflow روی GitHub Actions سبز شدن |
| T-007 | Memory Layer 1 (Redis) & 2 (Postgres)                                 | ✅                                | ✅ پیام‌ها/summary در DB و session در Redis تأیید شد                   |
| T-008 | Agent Lifecycle (CRUD + pause/resume/terminate)                       | ✅                                | ✅ از طریق API و داشبورد                                               |

---

## بعد از Sprint 0 (بدون شناسه رسمی — از تحلیل شکاف sprint-plan)

| فیچر                                                                                                             | وضعیت      | تست                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Approval queue (تأیید/رد + اجرای مجدد بعد از تأیید)                                                              | ✅         | ✅ شامل حالت با provider override شده                                                                                                                                                                                                                                                                                                                                                                                    |
| Telegram send tool (اسکلت + اتصال واقعی به Telegram Bot API)                                                     | ✅ کد کامل | ❌ ارسال واقعی تست نشده (نیاز به bot token واقعی — به تعویق افتاده)                                                                                                                                                                                                                                                                                                                                                      |
| داشبورد: pause/resume/terminate/test-connection                                                                  | ✅         | ✅ با Playwright واقعی                                                                                                                                                                                                                                                                                                                                                                                                   |
| SSE reconnect handling (قطع اتصال وسط استریم)                                                                    | ✅         | ✅ شبیه‌سازی قطع با Playwright                                                                                                                                                                                                                                                                                                                                                                                           |
| ONBOARDING.md                                                                                                    | ✅         | n/a (مستندسازی)                                                                                                                                                                                                                                                                                                                                                                                                          |
| Observability — Prometheus `/metrics` (معادل T-020)                                                              | ✅         | ✅ HTTP + LLM metrics، هم مسیر sync هم stream                                                                                                                                                                                                                                                                                                                                                                            |
| BYOK config قابل‌ویرایش per-organization (رمزنگاری‌شده در DB)                                                    | ✅         | ✅ شامل: 403 برای non-admin، 400 برای payload نامعتبر، تعامل با approval queue، رمزنگاری واقعی در DB تأیید شده                                                                                                                                                                                                                                                                                                           |
| DB-backed RBAC («minimum» مدل `10-rbac-and-policy.md` §4/§8: `roles`/`role_permissions`/`user_role_bindings`)    | ✅         | ✅ backfill برای orgهای موجود تأیید شد؛ سناریوی کامل زنده: نقش `editor` ویرایش شد (حذف `agents:chat`) و همون JWT بدون logout مجدد فوراً 403 گرفت                                                                                                                                                                                                                                                                         |
| جستجوی معنایی حافظه (pgvector، Layer 2 — `03-memory-engine.md` ADR-002)                                          | ✅         | ✅ دو کوئری بدون هیچ overlap کلمه‌ای با پیام هدف («which software dev tool…» → پیام Python، «hot climate in Iranian cities» → پیام آب‌وهوای تهران) درست پیدا شدن؛ همون کوئری‌ها روی ILIKE صفر نتیجه دادن (اثبات semantic بودن)؛ حالت غیرفعال (fallback به ILIKE) هم جدا تست شد                                                                                                                                           |
| صفحه Roles & Permissions در داشبورد (UI برای RBAC بالا، قبلاً فقط curl)                                          | ✅         | ✅ با Playwright واقعی: چک‌باکس `agents:chat` روی نقش `editor` برداشته و ذخیره شد، بعد از reload صفحه هنوز غیرفعال بود (persist شدن تأیید شد)، بعد به حالت اول برگردونده شد و با query مستقیم DB مطابقت کامل با baseline تأیید شد                                                                                                                                                                                        |
| مدیریت کاربران (`POST`/`GET /v1/users` + صفحه Users) — تکمیل RBAC با امکان ساخت کاربر دوم و sign-in به‌عنوان اون | ✅         | ✅ با Playwright واقعی: کاربر `viewer` جدید ساخته شد، با email همون کاربر (همون API key مشترک) لاگین شد، nav لینک‌های admin-only مخفی بودن، تلاش برای چت با پیام «Missing permission: agents:chat» درست رد شد — یعنی binding واقعی برای یک کاربر غیر از admin bootstrap هم کار می‌کنه                                                                                                                                    |
| Audit log viewer (RT-001: `GET /v1/audit` + صفحه Audit Log)                                                      | ✅         | ✅ با Playwright واقعی: یک چت واقعی فرستاده شد، همون لحظه ردیف `agent-chat` با نام agent (نه uuid خام)، status/model/cost درست، بالای لاگ ظاهر شد؛ pagination با شمارش واقعی (۱–۲۵ از ۳۱) روی تاریخچه‌ی واقعی این نشست کار کرد                                                                                                                                                                                           |
| Workspace CRUD (RT-002: `GET`/`POST /v1/workspaces` + صفحه Workspaces + انتخاب‌گر workspace در فرم ساخت agent)   | ✅         | ✅ با Playwright واقعی: workspace دوم ساخته شد، توی picker فرم ساخت agent ظاهر شد، یک agent باهاش ساخته شد، و با join مستقیم DB تأیید شد `workspace_id` واقعاً به workspace جدید اشاره می‌کنه نه پیش‌فرض                                                                                                                                                                                                                 |
| ساخت/حذف نقش سفارشی (RT-003: `POST`/`DELETE /v1/roles`)                                                          | ✅         | ✅ با Playwright + curl مستقیم: نقش سفارشی ساخته و حذف شد از UI؛ هر دو guard سمت سرور مستقیماً تست شد (نه فقط مخفی‌شدن دکمه) — حذف نقش سیستمی → 400، حذف نقش با binding فعال → 400، بعد از حذف binding → 204                                                                                                                                                                                                             |
| تغییر نقش کاربر + غیرفعال‌سازی (RT-004: `PATCH`/`DELETE /v1/users/:id`)                                          | ✅         | ✅ با Playwright: نقش کاربر تست عوض شد (viewer→editor)، غیرفعال شد، تلاش لاگین رد شد با پیام «This user account has been deactivated»، دوباره فعال شد و لاگین با نقش جدید موفق بود. هر دو self-modification guard مستقیم با curl هم تست شد (نه فقط مخفی‌شدن UI) — admin نمی‌تونه نقش خودش رو عوض کنه یا خودش رو غیرفعال کنه، هر دو 400                                                                                   |
| Webhook connector (RT-006: `POST /v1/agents/:id/tools/webhook-send` + محافظت SSRF)                               | ✅         | ✅ curl واقعی: ارسال موفق به `https://postman-echo.com/post` (`{"statusCode":200}`, audit `status=success`)؛ سه حالت SSRF مسدود شد و در audit با `status=failed` ثبت شد — IP loopback (`127.0.0.1`)، هاست `localhost`، و رنج خصوصی (`192.168.1.1`)                                                                                                                                                                       |
| اجرای زمان‌بندی‌شده agent (RT-007: فیلد `agents.schedule` + scheduler درون‌فرآیندی 30 ثانیه‌ای)                  | ✅         | ✅ روی agent واقعی فعال شد، در همون tick بعدی (~۳ ثانیه) اجرا شد: `schedule.lastRunAt` آپدیت شد، ردیف `agent-chat` در `audit_logs` با `user_id = NULL` ثبت شد، پیام واقعی در `messages` ذخیره شد. غیرفعال‌سازی هم تست شد (بعد از disable، ۶۵ ثانیه صبر شد، هیچ اجرای اضافه‌ای ثبت نشد — بدون double-fire)                                                                                                                |
| ABAC Policy Layer (RT-008: جدول `policies` + `PolicyService.evaluate` + صفحه Policies)                           | ✅         | ✅ هر دو نوع condition تست شد: `outside_hours` از طریق چت واقعی (HTTP 202 + `matchedPolicyNames` در `approval_queue.action_data`)؛ `cost_gt_cents` مستقیماً روی `PolicyService.evaluate()` کامپایل‌شده با DB واقعی (چون مدل محلی Ollama همیشه cost تخمینی صفر داره، از مسیر چت قابل تست نبود) — ۵۰¢ رد شد، ۵۰۰¢ درست match شد. صفحه UI هم با Playwright: ساخت policy از فرم، ظاهر شدن در جدول، Disable/Delete کار می‌کنن |
| نمایش بودجه/هزینه در داشبورد (RT-009: `BudgetBar` در صفحه Agents)                                                | ✅         | ✅ با Playwright: نوار پیشرفت با رنگ آبی/زرد/قرمز بر اساس درصد مصرف درست رندر شد (۸۴٪ مصرف → رنگ زرد، تأیید بصری با اسکرین‌شات)                                                                                                                                                                                                                                                                                          |
| نمایش وضعیت rate-limit در داشبورد (RT-010: `GET /v1/agents/:id/rate-limit` + badge در صفحه چت)                   | ✅         | ✅ با Playwright: badge «X/100 req/min» بعد از هر پیام واقعی زنده آپدیت شد (۰→۱ بلافاصله بعد از ارسال پیام از UI)                                                                                                                                                                                                                                                                                                        |

> **یادداشت CI — ریشه‌ی واقعی پیدا شد (2026-07-10):** چهار بار همین خطای ظاهری افتاد
> («`@o2n/gateway` has no exported member ...») و هر بار پیش‌فرض غلطی گرفتیم که «flake
> گذرا»ست. ریشه‌ی واقعی خیلی ساده‌تر بود: توی این نشست، الگوی همیشگی این بود که اول
> commit داخل submodule (`openon4net-runtime`) push بشه، بعد جداگانه commit روت
> (`openon4net`, که export جدید `packages/shared`/`packages/llm-providers` توش هست) push
> بشه. چون CI با push به submodule تریگر می‌شه و اون لحظه هنوز parent repo روی GitHub
> export جدید رو نداره، CI واقعاً و به‌درستی fail می‌کرد — نه یک race توی scheduler.
> retrigger «های موفق» قبلی صرفاً به این خاطر سبز می‌شدن که تا اون لحظه commit روت هم
> push شده بود، نه به خاطر اینکه چیزی «حل» شده بود. تغییر `ci.yml` (`511a4e3`، جدا کردن
> build از lint/typecheck/test) یک بهبود بی‌ضرر بود ولی مشکل واقعی رو حل نکرده بود —
> بار چهارم (`fd5949b`، RT-003) با همون علت دقیق دوباره fail کرد، و با یک retrigger _بعد_
> از push شدن commit روت (`7b98906`) سبز شد که همین فرضیه رو تأیید کرد.
>
> **قاعده‌ی درست از این به بعد:** وقتی یک تسک export جدیدی به `packages/*` اضافه می‌کنه
> که همون submodule commit مصرفش می‌کنه، commit روت باید **قبل از** push کردن submodule
> push بشه، نه بعدش.

---

## Auth Method Registry — RT-014..RT-018 (2026-07-10، از `docs/spect/TODO-openon4net-runtime.md` بخش D)

> طراحی از `02_ARCHITECTURE/16-authentication-modes.md` (اضافه شده توسط کاربر همین روز):
> یک provider registry که چند روش ورود می‌تونن هم‌زمان فعال باشن (`AUTH_METHODS_ENABLED`)،
> همه به یک session/JWT یکسان ختم می‌شن. `routes/auth.ts` قدیمی حذف و به
> `gateway/src/auth/{registry,session,types,providers/*}.ts` منتقل شد.

| #      | تسک                                                                                              | وضعیت | تست                                                                                                                                                                                                                                                                                                                                                      |
| ------ | ------------------------------------------------------------------------------------------------ | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RT-014 | Auth Method Registry + `/v1/auth/methods` + fail-fast در `env.ts`                                | ✅    | ✅ `/v1/auth/methods` واقعی برگردوند `{enabled:["dev_api_key","password"],default:"password"}`؛ فایل login audit (`user-login`) با `authMethod`/`ip`/`userAgent` واقعی تأیید شد                                                                                                                                                                          |
| RT-015 | Password provider (`@node-rs/argon2`، `/v1/auth/password/{login,set}`، lockout با Redis)         | ✅    | ✅ set-password → login موفق؛ رمز غلط → پیام عمومی «Invalid email or password» (هم برای org ناموجود هم user ناموجود، ضد enumeration)؛ ۵ تلاش ناموفق → قفل ۱۵ دقیقه‌ای، حتی رمز درست هم رد شد (429)؛ audit هم موفق هم ناموفق (با `reason`) ثبت شد                                                                                                         |
| RT-016 | Magic Link provider (`nodemailer`، توکن ۳۲بایتی هش‌شده، انقضای ۱۵ دقیقه)                         | ✅    | ✅ end-to-end واقعی با یک container موقت MailHog: request → ایمیل واقعی با توکن رسید (استخراج از quoted-printable body) → verify → session صادر شد؛ استفاده مجدد از همون توکن رد شد؛ درخواست برای ایمیل ناموجود پیام یکسان داد و **هیچ ایمیلی نفرستاد** (ضد enumeration)                                                                                 |
| RT-017 | OAuth/OIDC provider (google/github، state در Redis، `/v1/auth/oauth/:provider/{start,callback}`) | ✅    | ✅ `/start` واقعاً redirect کرد به `accounts.google.com` با `redirect_uri` درستِ per-provider؛ state در Redis ذخیره شد؛ `/callback` با state نامعتبر/تکراری/mismatch رد شد؛ با client id/secret فیک واقعاً به Google زده شد و HTTP 401 واقعی برگشت (نه mock) — تست کامل با app واقعی Google/GitHub بلاک هست (نیاز به client id/secret واقعی، مثل RT-005) |
| RT-018 | سخت‌گیری Dev API Key (`AUTH_ALLOW_DEV_METHODS` + `NODE_ENV`)                                     | ✅    | ✅ ۶ سناریو تست شد (جدول پایین) — شامل یک **باگ واقعی که همینجا پیدا و فیکس شد**                                                                                                                                                                                                                                                                         |

**باگ واقعی پیدا و فیکس شد (RT-018 تست):** `AUTH_ALLOW_DEV_METHODS: z.coerce.boolean().default(false)` —
`z.coerce.boolean()` فقط `Boolean(value)` صدا می‌زنه، و در جاوااسکریپت `Boolean("false")` هم `true`
است (چون رشته‌ی غیرخالیه)! یعنی نوشتن `AUTH_ALLOW_DEV_METHODS=false` توی `.env` واقعاً این فلگ امنیتی
حیاتی رو **فعال** می‌کرد، نه غیرفعال. با یک `boolEnv()` helper که `"true"`/`"false"` رو literal پارس
می‌کنه فیکس شد (همون فیکس برای `SMTP_SECURE` هم اعمال شد چون همون الگو رو داشت). تست ماتریس بعد از فیکس:

| #   | سناریو                                                                    | نتیجه                                               |
| --- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| 1   | `AUTH_ALLOW_DEV_METHODS="false"` + `NODE_ENV=development`                 | ✅ startup fail (قبل از فیکس: اشتباهاً start می‌شد) |
| 2   | `AUTH_ALLOW_DEV_METHODS` unset (پیش‌فرض false) + `NODE_ENV=development`   | ✅ startup fail                                     |
| 3   | `AUTH_ALLOW_DEV_METHODS="true"` + `NODE_ENV=production`                   | ✅ startup fail                                     |
| 4   | `AUTH_ALLOW_DEV_METHODS="true"` + `NODE_ENV` unset (پیش‌فرض production)   | ✅ startup fail                                     |
| 5   | `AUTH_ALLOW_DEV_METHODS="true"` + `NODE_ENV=development` (تنها ترکیب امن) | ✅ start موفق                                       |
| 6   | `AUTH_METHODS_ENABLED=""`                                                 | ✅ startup fail                                     |

**side note دیگه (نه باگ، طراحی):** یک fetch به `oauth2.googleapis.com` یک بار با DNS failure واقعی
مواجه شد (شبکه/DNS این محیط، نه کد ما) و بدون try/catch به یک 500 خام تبدیل می‌شد. اضافه‌شدن `safeFetch()`
همون خطا رو به یک `ValidationError` (400) واضح تبدیل می‌کنه — همون الگوی موجود در
`connectors/webhook-connector.ts` برای خطاهای شبکه‌ی بیرونی.

پس‌زمینه دیگه تست‌شده: backward-compat کامل — `dev_api_key` (مسیر قدیمی `/v1/auth/token`) با
Playwright واقعی از صفحه login تا صفحه Agents تأیید شد که هیچ رگرسیونی نداشت.

### باقی‌مانده

- RT-016/RT-017 پیش‌فرض غیرفعال‌ان (نیاز به SMTP/OAuth-app واقعی برای production دارن) — کد کامل و تست‌شده تا جایی که بدون credential واقعی ممکنه.
- OAuth real end-to-end (با یک app واقعی ثبت‌شده در Google/GitHub console و مرورگر واقعی از مسیر consent) هنوز تست نشده — دقیقاً همون بلاک RT-005 (نیاز به credential از کاربر).
- Login UI (`web/app/(auth)/login/page.tsx`) هنوز فقط `dev_api_key` رو پشتیبانی می‌کنه — یک صفحه‌ی چندروشی (که از `/v1/auth/methods` بخونه) جزو scope این batch نبود، فالو-آپ طبیعیه.
- `set-password` فقط self-service است؛ مسیر `admin-invite` سند (بخش ۶) ساخته نشده.

---

## Auto-migrate — RT-029 (2026-07-11، از `docs/spect/TODO-openon4net-runtime.md` بخش B)

> طراحی از `09_TASKS/02-deployment.md` («Database Migrations — Runtime first-run»): gateway در
> startup migrationهای `migrations/*.sql` را با ترتیب اجرا می‌کند، در جدول `schema_migrations`
> track می‌کند (چون فایل‌های این پروژه idempotent نوشته نشده‌اند — بر خلاف
> `openon4net-Platform`'s `migrate.mjs`)، و زیر یک Postgres advisory lock (برای چند-replica).

| #      | تسک                                                                                                                                         | وضعیت | تست                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| RT-029 | `gateway/src/migrator.ts` (core) + `gateway/scripts/migrate.mjs` (CLI wrapper روی `dist/`) + `DB_AUTO_MIGRATE` env + وایر شدن در `index.ts` | ✅    | ✅ روی یک دیتابیس **کاملاً تازه** (`o2n_migrate_test`) از صفر تست شد: هر ۱۲ migration واقعی اعمال شد (۰۰۰۸ به‌درستی skip شد چون pgvector نصب نیست — تشخیص عمومی با `pg_available_extensions`، نه hardcode «۰۰۰۸»)؛ اجرای مجدد بدون تغییر → no-op کامل؛ یک migration خراب عمداً اضافه شد → fail-fast واقعی (exit 1) + rollback تمیز (نه ردیف در `schema_migrations`، نه جدول نصفه‌ساخته‌شده)؛ `DB_AUTO_MIGRATE=false` غیرفعالش کرد (بدون لاگ `[migrate]` در استارتاپ) و `pnpm run migrate` دستی جدا کار کرد؛ روی DB مشترک واقعی (`postgresdb`) هم با backfill دستی `schema_migrations` (چون schema‌اش قبلاً دستی ساخته شده بود) و rebuild container تأیید شد که استارتاپ سالم می‌مونه |

### باقی‌مانده

- Endpoint دستی (مثلاً `POST /v1/admin/migrate`) ساخته نشده — فقط CLI (`pnpm run migrate`)؛ سند این رو هم به‌عنوان گزینه ذکر کرده بود، CLI برای MVP کافی دیده شد.

---

## Roadmap Phase ۰ audit (2026-07-11، از `docs/spect/01_ROADMAP/01-roadmap-12-months.md`)

> کاربر خواست Phase ۰ («Core Engine») کامل چک بشه و اگه خلأی هست یک تسک ساخته
> بشه. آیتم‌به‌آیتم چک شد: تقریباً همه‌چیز از قبل تحویل شده بود (Sprint 0 +
> کارهای بعدیش، بالا). سه مورد بدون checkbox (Model Router چند-مدلی همزمان،
> Circuit Breaker، WebSocket) خلأ نبودن — یا از قبل عمداً به Control Plane
> واگذار شده بودن (مستند در خودِ `gateway/src/services/llm-service.ts`)، یا
> جایگزین معادل (SSE به‌جای WebSocket) داشتن. کاربر تأیید کرد این تصمیم قبلی
> درسته و نیازی به کار جدید نیست — فقط checkbox‌های roadmap به‌روز شدن که با
> واقعیت match کنن (بدون تسک جدید، چون کاری برای Runtime باقی نمونده بود).

---

## Agent Access — RT-024 (2026-07-11، از `docs/spect/TODO-openon4net-runtime.md` بخش B)

> طراحی از `03_DATABASE/01-schema-master.md` §2.2 (`agent_access_bindings`) و
> `02_ARCHITECTURE/10-rbac-and-policy.md` (`agents:access:grant/revoke`). admin همیشه
> bypass می‌کنه (نیازی به binding نداره)؛ برای بقیه نقش‌ها (manager/editor/viewer)
> دسترسی به یک Agent خاص حالا یک بُعد جدا از permission نقشی (`agents:*`) شده —
> صرفاً «نقشت اجازه چت دادن» کافی نیست، باید برای همون Agent هم grant شده باشی.
> ساخت/حذف/ویرایش Agent هنوز admin-only می‌مونه (بدون تغییر).

| #      | تسک                                                                                                                                                                                                                           | وضعیت | تست                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RT-024 | `agent_access_bindings` + `AgentAccessService` + `requireAgentAccessible` + enforce روی list/get/update/pause/resume/delete/chat(sync+stream)/tools/memory + auto-grant owner روی ساخت Agent + UI پنل «Access» در صفحه Agents | ✅    | ✅ end-to-end واقعی: agent جدید ساخته شد → admin خودکار `owner` گرفت (تأیید DB)؛ یک کاربر manager بدون binding نه توی لیست agent می‌دید نه با GET مستقیم (404) نه می‌تونست چت کنه (404، نه 403 — تا وجود agent هم لو نره)؛ grant شد (curl) → همون لحظه هم توی لیست دید هم چت موفق شد (پاسخ واقعی از مدل)؛ revoke شد → چت/`tools/webhook-send`/`memory/search` هر سه دوباره 404 دادن؛ پنل UI هم با Playwright واقعی تست شد — باز شدن پنل، انتخاب کاربر از dropdown (فقط کاربرهای بدون binding نشون داده می‌شن)، Grant از طریق فرم، بلافاصله توی جدول ظاهر شد با دکمه Revoke |

### باقی‌مانده

- Enforcement فقط روی مسیرهایی اعمال شده که مستقیماً یک agent مشخص رو لمس می‌کنن (agents CRUD، chat، tools، memory) — مسیرهای دیگه‌ای که بعداً agent-scoped بشن (مثلاً RT-026 skill grants) باید همین الگو (`requireAgentAccessible`) رو تکرار کنن.
- UI فقط یک پنل ساده‌ست (لیست + grant/revoke) — چیزی شبیه یک صفحه‌ی اختصاصی مدیریت دسترسی (که سند به‌عنوان «صفحه/مدال» اشاره کرده) ساخته نشده؛ برای MVP این کافی دیده شد.
- Backfill مهاجرت فقط سازنده‌ی هر Agent موجود رو (از `audit_logs`) owner می‌کنه؛ کاربرهای دیگه‌ای که قبلاً (بدون این مدل) به یک Agent دسترسی داشتن، بعد از این migration باید صریحاً grant بشن — کاهش دسترسی عمدیه (secure-by-default)، نه باگ.

---

## Skill Engine + Auto-Skill Detection — RT-026, RT-032, RT-033 (2026-07-12، فاز ۲ roadmap)

> کاربر پرسید فاز ۲ (Skills) رو کامل کنیم؛ چون کار واقعی فاز ۲ کامل (Skill
> Engine + Auto-Detection + Plugin SDK + Marketplace Skills-listing +
> activation-gating + CLI) حدود ۱۳ فاز روی ۳ ریپو بود، کاربر صریحاً scope
> رو به «فقط هسته‌ی Runtime: Skill Engine + Auto-Detection» محدود کرد.
> جزئیات تصمیم و بخش‌های موکول‌شده: `docs/spect/06_MEETINGS/02-skills-plugins-marketplace-model.md`.
> **اولین تست‌های vitest واقعی در Runtime** — قبل از این، RT-001..029 همه
> فقط با curl/Playwright تست شده بودن (هیچ `*.test.ts` ای در `gateway/src`
> وجود نداشت)؛ این batch `test-support/{db,env,context,fixtures}.ts` رو هم
> اضافه کرد.

| #      | تسک                                                                                                                                                                                                                                     | وضعیت | تست                                                                                                                                                                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RT-032 | Skill Engine Core — migration (`skills`/`agent_skill_grants`/`skill_proposals`) + `SkillService` (CRUD) + `SkillGrantService` + `tool-dispatcher.ts` + `skill-executor.ts`                                                              | ✅    | ✅ ۳ تست vitest روی Postgres واقعی (CRUD کامل، grant/revoke، `recordExecution`)؛ ✅ اجرای واقعی یک webhook-send step روی `postman-echo.com` (نه mock) در `skill-executor.test.ts`، هم مسیر موفق هم مسیر شکست (telegram بدون token) تست شد                     |
| RT-026 | Skill grants per-agent — همون `SkillGrantService` بالا + UI (`/skills` صفحه)                                                                                                                                                            | ✅    | ✅ همون تست‌های RT-032 (grant/revoke)؛ UI با build واقعی Next.js تأیید شد (صفحه build شد)، تعامل مرورگر (Playwright) هنوز مستقیماً تست نشده                                                                                                                   |
| RT-033 | Auto-Skill Detection — `skill-pattern-detector.ts` (Frequency+Similarity روی `audit_logs`) + `skill-proposal-scheduler.ts` (poller ۱۰ دقیقه‌ای) + `skill_proposals` review flow (`routes/skill-proposals.ts`) + صفحه `/skill-proposals` | ✅    | ✅ ۶ تست vitest روی Postgres واقعی: پیدا کردن proposal با ۶ occurrence مشابه، رد کردن با ۴ occurrence (زیر threshold)، رد کردن وقتی url هر بار فرق می‌کنه (similarity fail)، جلوگیری از duplicate proposal، approve→ساخت skill واقعی، reject→دست‌نخورده موندن |

**تصمیم‌های طراحی مهم (مستند در کد):**

- `steps[].type` فقط `'tool'` (v1) — `query`/`prompt` step types (دسترسی مستقیم DB / فراخوانی LLM) نیاز به بررسی امنیتی جدا دارن، موکول به بعد.
- `trigger.type` فقط `'manual'` (v1) — `scheduled`/`event` موکول به بعد.
- Auto-detection فقط ۲ شرط (Frequency+Similarity) نه ۴ شرط سند — `audit_logs` فیلد duration نداره، "complexity" سیگنال قابل‌اتکا نداره.
- Skill execution از approval-queue جدا نمی‌ره — چون فقط اکشن‌هایی که Agent از قبل مجاز بوده (tool-level permission) رو دوباره اجرا می‌کنه، مسیر escalation جدیدی باز نمی‌شه.
- Synthesize شدن proposal از `audit_logs` فقط `url`/`chatId` رو داره (نه `message`/`payload` واقعی — چون توی audit trail ذخیره نمی‌شن) — یک محدودیت داده‌ای واقعی، نه سهل‌انگاری؛ کاربر باید قبل از approve این فیلدها رو تکمیل کنه.

### باقی‌مانده

- ~~Plugin SDK، Plugin CLI، Marketplace Skills-listing (فروشی/رایگان)، activation-gated free tier~~ — ✅ همه در ۲۰۲۶-۰۷-۱۲ تکمیل شدن، ببینید بخش «Phase 2 تکمیلی — Activation Client + Marketplace + Plugin SDK/CLI — T-CP-007, RT-034..037, MKT-017..019» پایین‌تر.
- Skill versioning (bump/fork) و یک ماژول جدای Skill Validator (فراتر از اعتبارسنجی شکلی Zod) ساخته نشده.
- Playwright واقعی روی صفحات `/skills`/`/skill-proposals` هنوز اجرا نشده (فقط build موفق تأیید شده).

---

## Phase 2 تکمیلی — Activation Client + Marketplace + Plugin SDK/CLI — T-CP-007, RT-034..037, MKT-017..019 (2026-07-12)

> کاربر خواست فاز ۲ (Skills) کامل تکمیل بشه: بخش‌های موکول‌شده‌ی بالا
> (`Plugin SDK`, `Plugin CLI`, `Marketplace Skills-listing`,
> `activation-gated free tier`) که به `06_MEETINGS/02-skills-plugins-marketplace-model.md`
> ارجاع داده شده بودن. این کار روی ۳ ریپو/پلین پخش شد: Control Plane،
> Marketplace، و Runtime، به‌علاوه ۲ package جدید در ریشه‌ی مونوریپو.

| #                  | تسک                                                                                                                                                                                                                                                                                              | ریپو            | وضعیت | تست                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T-CP-007 (=CP-008) | Runtime activation client — `services/activation-client.ts` (`checkIn()`، best-effort، هرگز throw نمی‌کنه)، `services/activation-state.ts` (`ActivationState.isActivated()`)، `services/activation-scheduler.ts` (poller ساعتی + یک بار روی boot)                                                | Runtime         | ✅    | ✅ ۴ تست vitest با `http.createServer` محلی (چون Control Plane واقعی cross-repo dependency می‌شد) — عدم‌پیکربندی، موفقیت با Bearer صحیح، ۴۰۱، connection refused                                                                         |
| MKT-017            | migration `marketplace_skills` + `skill_installs` — موازی با `plugins`/`plugin_versions`/`plugin_installs`، بدون versions/checksum/signature/review pipeline (چون Skill یک JSONB definition است، نه artifact باینری)                                                                             | Marketplace     | ✅    | ✅ اجرای واقعی migration روی `o2n_marketplace`، تأیید ستون‌ها با `\d`                                                                                                                                                                    |
| MKT-018            | `publisher-skill-service.ts` (`submitSkill` — upsert publisher+skill بر اساس slug) + `marketplace-skill-service.ts` (`listMarketplaceSkills`, `installMarketplaceSkill` — idempotent) + routeهای `POST/GET /publisher/skills`, `GET /marketplace/skills`, `POST /marketplace/skills/:id/install` | Marketplace     | ✅    | ✅ ۹ تست vitest روی Postgres واقعی: upsert، تداخل publisher، صفحه‌بندی، نصب idempotent، رد کردن نصب delisted، `NotFoundError` برای id ناموجود                                                                                            |
| MKT-019            | `PATCH /marketplace/installs/:id/config` — بستن یک gap مستند قدیمی (`plugin_installs.config` در `04_API/02-billing-and-marketplace-api.md` بود ولی نه در جدول migration 0001 نه در `installPlugin()`)                                                                                            | Marketplace     | ✅    | ✅ پوشش داده شده در `src/app.test.ts` (route-level) + تأیید migration 0004 روی DB واقعی                                                                                                                                                  |
| RT-034             | Runtime-side activation client wiring — `context.ts`+`index.ts` (`ActivationState` construction + `startActivationScheduler`)، `env.ts` (`CONTROL_PLANE_URL`/`ACTIVATION_KEY` اختیاری)                                                                                                           | Runtime         | ✅    | همون تست‌های T-CP-007 بالا                                                                                                                                                                                                               |
| RT-035             | `services/marketplace-client.ts` (fetch wrapper با Bearer، `listPlugins`/`listSkills`/`installPlugin`/`installSkill`/`updatePluginInstallConfig`) + `routes/marketplace.ts` (`GET/POST /v1/marketplace/{plugins,skills}[...]`) — activation-gated روی هر install، رایگان یا پولی یکسان (ADR-012) | Runtime         | ✅    | ✅ ۵ تست vitest با `http.createServer` محلی (auth header، body نصب، خطای remote، PATCH config)؛ نصب Skill هم با `SkillService.create()` واقعی تست شد (کپی `definition` در یک ردیف local)                                                 |
| RT-036             | Plugin Settings UI — `web/app/marketplace/page.tsx` (لیست Skill/Plugin از Marketplace، دکمه Install، فرم schema-driven برای Pluginهایی که `manifest.configSchema` دارن) + لینک ناوبری «Marketplace» به هر ۹ صفحه‌ی موجود                                                                         | Runtime         | ✅    | ✅ build/lint/typecheck واقعی Next.js سبز (۱۵ صفحه، شامل `/marketplace`)؛ تعامل مرورگر (Playwright) تست نشده                                                                                                                             |
| RT-037             | `packages/plugin-sdk` (`@o2n/plugin-sdk` — `createPlugin`/`defineTool`/`defineAction`، فقط type/manifest-building) + `packages/create-o2n-plugin` (CLI اسکلت‌ساز، `pnpm create o2n-plugin <name>`)                                                                                               | ریشه‌ی مونوریپو | ✅    | ✅ build/typecheck/lint سبز برای `plugin-sdk`؛ ۳ تست vitest برای CLI (اسکلت کامل + manifest معتبر، خطا بدون نام، رد نصب روی پوشه‌ی غیرخالی)؛ اجرای دستی واقعی هم تأیید شد (`node bin/create-o2n-plugin.mjs "SMS Sender"` در یک temp dir) |

**تصمیم‌های طراحی مهم (مستند در کد/ADR-012):**

- Activation همه‌ی نصب‌ها را گیت می‌کند (رایگان و پولی)، نه فقط رایگان — بدون رابطه‌ی activation، هیچ wallet/billing context ای برای شارژ مورد پولی هم وجود نداره.
- `isActivated()` بدون پیکربندی (`CONTROL_PLANE_URL`/`ACTIVATION_KEY` تنظیم‌نشده) همیشه `true` است — self-host خالص نباید «فعال‌نشده» تلقی بشه. بعد از پیکربندی، grace window ۲۴ ساعته‌ی بدون check-in موفق قبل از `false` شدن.
- Skills marketplace entity عمداً بدون versions/checksum/signature/review pipeline — چون این‌ها فقط برای artifact باینری معنا دارن، نه JSONB definition.
- بدون revenue-share برای Skill پولی در این پاس — `revenue_share_accruals` به `plugin_version_id` گره خورده؛ گسترشش برای Skills یک follow-up مستندشده است.
- Plugin Settings UI فقط write است — چون endpoint «یک نصب را بگیر» وجود نداره، فرم مقدار قبلی را pre-populate نمی‌کنه، فقط مقدار جدید را PATCH می‌کنه.
- Plugin SDK/CLI فقط scaffold/type تولید می‌کنن — بدون sandboxed execution؛ Runtime هنوز یک Plugin ساخته‌شده رو واقعاً اجرا نمی‌کنه (طبق `09-plugin-sandbox.md` که همچنان موکول به بعده).

### باقی‌مانده

- Upload ZIP دستی برای Plugin (self-hosted، بدون Marketplace) — بخشی از RT-027 اصلی که هنوز نساخته شده.
- Revenue-share برای Skill پولی.
- Playwright واقعی روی `/marketplace` (فقط build تأیید شده، نه تعامل مرورگر).
- یک end-to-end واقعی با activation key واقعی از Control Plane (issue → check-in → `isActivated()` تغییر حالت) هنوز اجرا نشده — فقط رفتار HTTP client با سرور محلی تست شده.

---

## Phase 3 (Organization) — هفته ۲۵-۲۸ — RT-038..043 (2026-07-13)

> کاربر خواست فاز ۳ roadmap (`01_ROADMAP/01-roadmap-12-months.md` §5) کامل بشه.
> یک audit (Explore agent) نشون داد از ۱۹ آیتم فاز ۳: ۴ تا از قبل کامل
> بودن (RBAC baseline، Agent schedule، multi-tenant scoping، Audit Log
> plumbing)، ۸ تا نیمه‌کاره، ۷ تا کاملاً خالی. کاربر صریحاً scope رو به
> **فقط هفته ۲۵-۲۸** (Org/Workspace completion + Governance refinement)
> محدود کرد و هفته ۲۹-۳۲ (Digital Employee KPI engine + کل «Agent Teams»:
> ارتباط agent-to-agent + workflow DAG + team assignment + task delegation)
> رو به یک batch بعدی موکول کرد — این‌ها بزرگ‌ترین/پرریسک‌ترین بخش‌ها بودن و
> توی `09_TASKS/08-scope-guardrails-mvp.md` هم «Should»/«Later» علامت
> خورده بودن، نه «Must».

| #      | تسک                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | وضعیت | تست                                                                                                                                                                    |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RT-038 | Organization CRUD — `OrgService.getById`/`update` + `GET`/`PATCH /v1/organization` (بدون `:id`، فقط سازمان خودِ session). `plan`/`status` عمداً غیرقابل‌ویرایش (کار Control-Plane). بخش «Organization» در `web/app/settings/page.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | ✅    | ✅ ۴ تست vitest روی Postgres واقعی (get/update/۴۰۴ برای id ناموجود/آپدیت جزئی settings)                                                                                |
| RT-039 | Workspace CRUD تکمیل — migration `0016_workspace_status.sql` (ستون `status`)، `WorkspaceService.update`/`archive`، `PATCH`/`POST .../archive`. حذف واقعی عمداً _archive_ شد نه DELETE — چون `agents.workspace_id` دارای `ON DELETE CASCADE` است و یک DELETE واقعی هر agent توی اون workspace رو بی‌صدا پاک می‌کرد. ساخت agent در workspace آرشیوشده رد می‌شه (`routes/agents.ts`). UI ادیت/آرشیو در `/workspaces`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | ✅    | ✅ ۴ تست vitest (update، ۴۰۴ کراس-org، archive از list پیش‌فرض حذف می‌شه، `isActive()`)                                                                                |
| RT-040 | تکمیل RBAC — `UserCreateSchema`/`UserUpdateSchema`'s `role`: از `z.enum(4تایی)` به `z.string()` باز شد؛ کشف شد که DB از اول این محدودیت رو نداشت (`users.role` یک `VARCHAR(50)` ساده است، `roles` table از قبل نقش سفارشی پشتیبانی می‌کنه، و permission resolution کاملاً از `user_role_bindings`→`role_permissions` میاد، نه از `users.role` مستقیم — فقط چند چک `=== 'admin'` بود که با نقش سفارشی هم درست کار می‌کنه). `workspaceId` اختیاری هم اضافه شد (پیش‌فرض: اولین workspace فعال سازمان، دقیقاً رفتار قبلی). `UserService`'s تکراری‌شده منطق resolve-role/resolve-workspace به `role-workspace-resolver.ts` مشترک منتقل شد (بین `UserService` و `InvitationService`). UI: `/users`'s role select حالا از `GET /v1/roles` می‌خونه (نه لیست هاردکد ۴تایی) + یک workspace select اگه سازمان بیش از یک workspace فعال داشته باشه                                                                                                                             | ✅    | ✅ ۵ تست vitest (نقش سفارشی، workspace انتخابی، رد نقش ناموجود، ایمیل تکراری، جابه‌جایی workspace بدون تغییر نقش)                                                      |
| RT-041 | Invitation system — migration `0017_invitations.sql` (جدول `invitations`، دقیقاً هم‌شکل `magic_link_tokens`: hashed token + TTL)، `InvitationService` (`create`/`listPending`/`revoke`/`accept` — `accept` کاربر واقعی می‌سازه + پسورد ست می‌کنه با همون `argon2Hash` که `/v1/auth/password/set` استفاده می‌کنه + session واقعی برمی‌گردونه)، `POST/GET /v1/invitations`، `DELETE /v1/invitations/:id`، `POST /v1/auth/invitations/:token/accept` (public route، اضافه شد به `PUBLIC_ROUTES`). ایمیل با همون الگوی `nodemailer.createTransport` مگ‌لینک ارسال می‌شه (env جدید: `WEB_URL` اختیاری برای ساخت لینک کلیک‌پذیر، وگرنه fallback به توکن خام مثل مگ‌لینک). UI: فرم «Invite by email» + لیست pending + revoke در `/users`، صفحه‌ی عمومی جدید `/accept-invite` (name+password، auto-login)                                                                                                                                                                  | ✅    | ✅ ۷ تست vitest (رد نقش ناموجود، create→list، accept واقعی با تأیید هش پسورد از طریق `argon2Verify`، رد double-accept، رد توکن منقضی، revoke، رد revoke نامعتبر)       |
| RT-042 | تعمیم Approval Queue — `ApprovalService.create()` عمومی (قبلاً فقط یک INSERT inline داخل `ChatService.enqueueApproval` بود که حالا از این متد استفاده می‌کنه)، `expireStale()` (`UPDATE ... SET status='expired' WHERE status='pending' AND expires_at < NOW()`)، `approval-expiry-scheduler.ts` (همون الگوی `setInterval`+disposer، sweep هر ۵ دقیقه). `enqueueApproval` حالا یک `expires_at` واقعی (۲۴ ساعت) ست می‌کنه که قبلاً همیشه `NULL` بود با اینکه ستونش از اول بود. صفحه‌ی جدید `/approvals` (لیست + Approve/Reject). تریگر واقعی فعلاً فقط همون chat-cost/policy است — این batch زیرساخت رو عمومی/قابل‌استفاده‌ی مجدد کرد، نه اینکه trigger جدیدی اضافه کنه (که scope creep می‌شد)                                                                                                                                                                                                                                                                      | ✅    | ✅ ۳ تست vitest (`create()` عمومی، عدم‌sweep بدون `expiresAt`، sweep واقعی گذشته‌ها بدون دست‌زدن به آینده‌ها)                                                          |
| RT-043 | بودجه Wallet سازمان/workspace — `WalletService` (`find`/`getOrCreate`/`credit`/`debit`) روی جدول `wallets` که از Sprint 0 فقط schema بود («No API is built on it»)؛ هر mutation یک `audit_logs` entry می‌سازه (نه یک ledger جدا — اون کار Control-Plane است، از قبل اونجا ساخته شده). `GET /v1/wallet` + `POST /v1/wallet/credit` (`billing:wallet:credit` جدید، `billing:wallet:read` از قبل seed شده بود ولی هیچ route ای نداشت). `ChatService.prepare()` یک budget gate سوم گرفت: اگه سازمان wallet داشته باشه و balance کمتر از هزینه‌ی تخمینی باشه، `WalletInsufficientBalanceError` (402، کد `INSUFFICIENT_BUDGET` مشترک با `BudgetExceededError`). **Opt-in واقعی** — سازمانی که هیچ‌وقت wallet نساخته (`find()` → `null`) هیچ سقفی نداره؛ `persistTurn` هم فقط دبیت می‌کنه اگه wallet از قبل وجود داشته باشه، نه auto-provision. یادداشت واحد: هیچ نرخ تبدیل credits↔cents جایی تعریف نشده، این سرویس فرض می‌کنه ۱ credit = ۱ cent (مستند شده در کامنت کد) | ✅    | ✅ ۶ تست vitest (`find()` قبل از ساخت، `getOrCreate` idempotent، credit+audit log، debit+audit log، رد شدن debit بیش از balance بدون تغییر balance، رد مقادیر غیرمثبت) |

**تصمیم‌های طراحی مهم (مستند در کد):**

- Workspace «حذف» = آرشیو، نه DELETE واقعی — به‌خاطر `ON DELETE CASCADE` روی `agents.workspace_id`.
- تعمیم RBAC هیچ migration ای نمی‌خواست — محدودیت فقط توی لایه‌ی Zod/TypeScript بود، DB از اول اجازه می‌داد.
- Invitation یک مسیر ساخت **جدا** از `POST /v1/users` است، نه جایگزینش — تا وقتی invitation قبول نشه هیچ ردیف `users` ای ساخته نمی‌شه (برخلاف direct-add که فوراً یک کاربر بدون credential می‌سازه).
- Approval queue همچنان فقط یک trigger واقعی داره (chat-cost/policy) — این batch فقط زیرساخت رو عمومی و expiry-aware کرد.
- Wallet هیچ ledger/`credit_transactions` جدیدی توی Runtime نساخت — فقط `audit_logs`، چون یک ledger کامل از قبل توی Control-Plane هست.
- در طول کار یک باگ زیرساخت تست پیدا و فیکس شد: `test-support/fixtures.ts`'s `cleanupTestFixture()` هیچ‌وقت `approval_queue` رو پاک نمی‌کرد (`organization_id` روی اون table `ON DELETE CASCADE` نداره، دقیقاً همون الگوی از قبل شناخته‌شده برای `audit_logs`/`skills`/`skill_proposals`/`users`) — قبلاً هیچ تستی مستقیم توی این جدول نمی‌نوشت پس دیده نشده بود.

### باقی‌مانده

- Playwright واقعی روی `/organization`/`/workspaces`/`/users`/`/invitations`/`/approvals` — فقط build تأیید شده.
- ارسال واقعی یک ایمیل invitation از طریق SMTP واقعی (نه فقط build/typecheck) هنوز تست نشده — همون وضعیت مگ‌لینک.
- تست end-to-end واقعی budget gate سوم از مسیر `ChatService.chat()` (نه فقط `WalletService` مجزا).

---

## Phase 3 (Organization) — هفته ۲۹-۳۲ — RT-044..048 (2026-07-13)

> کاربر «همه‌ی هفته ۲۹-۳۲ با هم» رو انتخاب کرد (Digital Employee + کل
> Agent Teams)، بعد از اینکه صادقانه بهش گفته شد Workflow Engine به‌تنهایی
> در مقیاس یک mini orchestration engine است، نه یک batch CRUD معمولی.
> `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` که از قبل «Workflow
> Engine با YAML ساده (بدون Visual Builder)» رو «Should Have» و Visual
> Builder رو «Later» علامت زده بود، مبنای v1-scoping این batch شد — همون
> الگویی که قبلاً برای Skill Engine استفاده شده بود.

| #      | تسک                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | وضعیت | تست                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RT-044 | Role Catalog (آیتم ۱۲) — `packages/shared/src/constants/agent-roles.ts` (`AGENT_ROLE_CATALOG`، ۱۲ نقش هم‌راستا با `00_VISION/04-digital-employee.md`). `agents.role` همچنان `VARCHAR` آزاد است (بدون migration) — کاتالوگ فقط UI رو راهنمایی می‌کنه. `web/app/agents/page.tsx`'s فیلد role از input آزاد به `<select>` + گزینه‌ی «Other…» تغییر کرد.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | ✅    | ✅ build/lint/typecheck سبز؛ تست جدا نداره (فقط داده‌ی ثابت + UI select)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| RT-045 | Agent Hierarchy + Team (آیتم‌های ۱۳، ۱۸) — `AgentService.assertNoReportsToCycle()` (رد self-reference و هر تغییری که چرخه بسازه)، `listReports()`/`listTeam()` (زیردرخت transitive، بدون جدول جدید `agent_teams` — «team assignment» دقیقاً همینه). `GET /v1/agents/:id/{reports,team}`. UI: org-chart تو-رفته (indented، نه گرافیکی، هم‌راستا با guardrail «no Visual Builder»).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | ✅    | ✅ ۶ تست vitest روی Postgres واقعی (رد self-reference، رد چرخه، `listReports`، `listTeam`، `updateKpis`، `findByRole`) — **یک باگ واقعی همینجا پیدا و فیکس شد:** `AgentService.update()` چک چرخه رو انجام می‌داد ولی اصلاً ستون `reports_to` رو توی `SET` نمی‌نوشت، پس تغییر مدیر همیشه بی‌اثر می‌موند؛ تست چرخه دقیقاً همین رو لو داد.                                                                                                                                                                                                                                                                                                                         |
| RT-046 | Agent KPI tracking (آیتم ۱۵) — `KpiDefinitionSchema`/`AgentKpisUpdateSchema`، `AgentService.updateKpis()` (merge روی `kpi_config` JSONB)، `PATCH /v1/agents/:id/kpis`. UI: پنل KPI تو صفحه‌ی Agents (name/target/current + افزودن/حذف). **مستند، نه ساخته‌شده:** مقدار خودکار/تحلیل روند KPI («Outcome Engine») مال فاز ۴ روadmap است، نه این batch.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | ✅    | ✅ همون ۶ تست RT-045 (`updateKpis` جزوشونه)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| RT-047 | Agent-to-Agent messaging (آیتم ۱۶) — migration `0018_agent_messages.sql`، `AgentMessageService` (`send`/`listForAgent`/`listPending`/`markDelivered`/`markFailed`)، `agent-message-scheduler.ts` (همون الگوی `setInterval`+disposer، poll هر ۳۰ ثانیه، `markDelivered` **قبل از** اجرا تا double-fire نشه، تحویل با `ChatService.chat({userId:null})`). عمداً async/fire-and-forget — برخلاف Workflow Engine's `agent` step (RT-048) که sync است و نتیجه رو فوری لازم داره. `POST/GET /v1/agents/:id/messages`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | ✅    | ✅ ۴ تست vitest روی Postgres واقعی (`send`→`listForAgent`، `markDelivered`، `markFailed`، `listPending` فقط pendingها رو برمی‌گردونه) — تحویل واقعی از طریق scheduler تست نشده (نیاز به LLM provider واقعی، همون بلاک RT-005/چت)                                                                                                                                                                                                                                                                                                                                                                                                                                |
| RT-048 | Workflow Engine v1 (آیتم ۱۷، پوشش‌دهنده‌ی آیتم ۱۹ «task delegation») — `packages/shared/src/schemas/workflow.ts` (DAG با `agent`/`tool`/`human`/`parallel`/`condition`، **بدون** `loop`/`notification`/Visual Builder/template library/trigger زمان‌بندی‌شده — فقط اجرای دستی، **بدون** زبان expression رشته‌ای برای condition، فقط مقایسه‌ی ساختاریافته). migration `0019_workflows.sql` (`workflows`/`workflow_runs`/`workflow_run_steps`). `WorkflowService` (CRUD، هم‌شکل `SkillService`)، `WorkflowRunService`، `WorkflowExecutor` — سه زیرسیستم از قبل ساخته‌شده رو مستقیم استفاده می‌کنه: `executeTool()` برای step نوع `tool`، `ChatService.chat()` برای `agent`، `ApprovalService.create()` برای `human` (با discriminator `actionData.workflowRunId` که `routes/approvals.ts` رو آگاه می‌کنه یک workflow run رو resume کنه، نه چت). صفحه‌ی جدید `/workflows` (لیست، ساخت/ادیت با JSON textarea برای definition — عمداً بدون Visual Builder، دکمه‌ی Run، تاریخچه‌ی run). لینک ناوبری «Workflows» به هر ۱۰ صفحه‌ی dashboard دیگه اضافه شد. | ✅    | ✅ ۴ تست vitest CRUD (`workflow-service.test.ts`) + ۶ تست executor روی Postgres واقعی (`workflow-executor.test.ts`: اجرای ترتیبی، شاخه‌ی `condition` که شاخه‌ی دیگه رو کامل رد می‌کنه، `parallel` واقعی، `human` step که pause می‌کنه و با approve واقعاً resume/کامل می‌شه، همون مسیر با reject، شکست step نوع `agent` وقتی نقش موردنظر agent فعالی نداره) — **یک باگ واقعی دوم هم همینجا پیدا و فیکس شد:** `WorkflowRunService.logStep()`'s کوئری SQL از یک placeholder (`$3`) هم به‌عنوان مقدار ستون و هم داخل `CASE WHEN` استفاده می‌کرد و Postgres با خطای «inconsistent types deduced for parameter $3» رد می‌کرد — با cast صریح (`$3::varchar`) فیکس شد. |

**تصمیم‌های طراحی مهم (مستند در کد):**

- آیتم ۱۱ («Agent → Employee transformation») و آیتم ۱۹ («task delegation») عمداً **feature جدا نساختن** — ۱۱ حاصل جمع role catalog + hierarchy + KPI + schedule/budget از قبل موجوده (agent از قبل هر ویژگی‌ای که `04-digital-employee.md` برای Employee لیست کرده رو داره)؛ ۱۹ همون step نوع `agent` توی Workflow Engine است (روتینگ کار به یک agent دیگه دقیقاً delegation است).
- «Team assignment» (آیتم ۱۸) از `reports_to` موجود استفاده کرد (تیم یک مدیر = زیردرخت transitive‌ش) — نه یک جدول `agent_teams` جدید، چون کامنت migration اولیه‌ی Sprint 0 صریحاً گفته بود این جدول لازم نیست.
- Workflow Engine v1 سه زیرسیستم از قبل ساخته‌شده (ChatService، `executeTool`، `ApprovalService) رو مستقیم دوباره استفاده کرد به‌جای زیرساخت موازی — ریسک این batch رو به‌شدت کم کرد.
- در طول این batch **دو باگ واقعی پیدا و فیکس شد** (بالا توضیح داده شد): `AgentService.update()`'s فراموشیِ `reports_to` توی SET clause، و `WorkflowRunService.logStep()`'s تایپ ناسازگار پارامتر Postgres.

### باقی‌مانده

- Digital Employee/Agent Teams روی صفر نیست، ولی این‌ها هنوز نساخته شدن: Outcome Engine (تحلیل خودکار روند KPI/business intelligence — مال فاز ۴ روadmap)، scheduled/event trigger برای Workflow (فقط اجرای دستی v1)، Visual Builder، template library.
- Playwright واقعی روی `/agents` (org-chart، KPI panel)، `/workflows` (ساخت/اجرا/تاریخچه) — فقط build تأیید شده.
- تحویل واقعی یک agent-to-agent message از طریق scheduler (نیاز به LLM provider واقعی تنظیم‌شده، همون بلاک RT-005).
- اجرای موفق واقعی یک step نوع `agent` توی Workflow (نیاز به همون LLM provider) — فقط مسیر شکست (نبود agent فعال با نقش موردنظر) تست شده.

---

## فاز ۲/۳ — باقی‌مانده‌های Skills + Governance — RT-049..056, MKT-020..022 (2026-07-14)

> کاربر خواست همه‌چیز از فاز ۰ تا فاز ۳ روadmap کامل بشه، «هیچی نمونه».
> فاز ۰ و ۱ از قبل ۱۰۰٪ بودن. فاز ۳ فقط دو آیتم Governance (Audit
> کامل/HITL عمومی) کم داشت. فاز ۲ (Skills) ۶ آیتم کم داشت. کاربر صریحاً
> WASM Sandbox رو (که یکی از آیتم‌های فاز ۲ است) کنار گذاشت — طبق
> `09-plugin-sandbox.md` نیازمند طراحی امنیتی جدا. تحقیق نشون داد Publisher
> Dashboard/Analytics اصلاً توی Runtime نیستن — یک پلن سوم و مستقل هستن:
> `apps/openon4net-marketplace` (git-ignored از ریشه، نه submodule، DB و
> سرویس جدا) — کاربر صریحاً اجازه‌ی کار روی این پلن رو هم داد (خارج از
> محدودیت معمول «فقط Runtime»).

| #               | تسک                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | وضعیت | تست                                                                                                                                                                                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RT-049          | Skill versioning + fork — `SkillService.update()` روی تغییر `definition` نسخه رو patch-bump می‌کنه (`version` ستون از قبل بود، فقط نوشته نمی‌شد)؛ `SkillService.fork()` (کپی با id/version تازه) + `POST /v1/skills/:id/fork`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | ✅    | ✅ ۲ تست vitest جدید (bump روی تغییر definition، بدون bump روی rename‌تنها؛ fork با نام پیش‌فرض و سفارشی)                                                                                                                                                                                                            |
| RT-050          | Skill validation module — `services/skill-validator.ts` (شناسه‌ی تکراری step رد می‌شه، سقف ۲۰ step، و SSRF guard وب‌هوک — استخراج‌شده از `webhook-connector.ts` به `assertSafeWebhookUrl()` — حالا در زمان _ذخیره_ هم اجرا می‌شه، نه فقط اجرا). `query`/`prompt` step types همچنان بیرون v1 (بدون تغییر).                                                                                                                                                                                                                                                                                                                                                                                                                                                  | ✅    | ✅ ۵ تست vitest جدید (شناسه‌ی تکراری، سقف step، URL خصوصی/داخلی رد می‌شه، localhost رد می‌شه، تعریف سالم قبول می‌شه) — **یک باگ واقعی همینجا پیدا و فیکس شد:** خطای `ToolExecutionError`'s پیام همیشه ژنریک «Tool X failed to execute» بود؛ دلیل واقعی توی `.details` بود نه `.message` — پیام‌رسانی اشتباه فیکس شد. |
| MKT-020, RT-051 | Marketplace: permission-diff consent — `listMarketplacePlugins()` حالا `permissions` نسخه‌ی تأییدشده رو برمی‌گردونه (قبلاً هرگز نشون داده نمی‌شد). Runtime: `acknowledgePermissionDiff` تا انتهای مسیر (client → route → UI) وایر شد؛ خطای marketplace's `PermissionDiffRequiredError` (409) با همون شکل سمت Runtime دوباره throw می‌شه. UI مارکت‌پلیس permissions رو نشون می‌ده + دیالوگ تأیید روی upgrade که دسترسی بیشتر می‌خواد.                                                                                                                                                                                                                                                                                                                       | ✅    | ✅ پوشش MKT-020 در `marketplace-service.test.ts` (permissions فقط از نسخه‌ی approved میاد، پیش‌فرض آرایه‌ی خالی)                                                                                                                                                                                                     |
| MKT-021, RT-052 | Marketplace: analytics (downloads/ratings) — migration جدید `0005_marketplace_ratings.sql` (`plugin_ratings`/`skill_ratings`، upsert بر اساس (item, org)). `installCount` از `COUNT(*)` روی جدول‌های installs موجود میاد (بدون ستون جدید). `ratePlugin`/`rateSkill` + route های `POST /marketplace/{plugins,skills}/:id/rate`. Runtime: proxy route ها + UI (نمایش دانلود/امتیاز + فرم rating برای موارد نصب‌شده).                                                                                                                                                                                                                                                                                                                                         | ✅    | ✅ ۷ تست vitest جدید در `marketplace-service.test.ts` + ۴ تست در `marketplace-skill-service.test.ts` (installCount، پیش‌فرض بدون امتیاز، upsert امتیاز، رد امتیاز خارج از ۱-۵، ۴۰۴ برای plugin/skill ناموجود)                                                                                                        |
| MKT-022, RT-053 | Marketplace: publisher dashboard — Runtime `organizations.settings.publisherSlug`/`publisherDisplayName` (بدون migration). Runtime routeهای جدید proxy روی `/publisher/{plugins,skills}` که از قبل کامل ساخته شده بودن سمت marketplace ولی هیچ‌وقت از Runtime صدا زده نمی‌شدن. permission جدید `marketplace:publish` (admin-only). صفحه‌ی جدید `web/app/marketplace/publisher/page.tsx` (فرم submit + جدول «my submissions»)، لینک از صفحه‌ی اصلی مارکت‌پلیس (نه رول‌اوت nav به ۱۱ صفحه‌ی دیگه — تصمیم UX ساده‌تر).                                                                                                                                                                                                                                        | ✅    | ✅ build/lint/typecheck سبز؛ **یک gap واقعی پیدا و فیکس شد:** `marketplace:read`/`marketplace:install` اصلاً توی seed پیش‌فرض نقش admin نبودن (از RT-035 به بعد) — یعنی سازمان تازه‌بوت‌شده اصلاً نمی‌تونست مارکت‌پلیس رو ببینه/نصب کنه؛ همراه با اضافه‌کردن `marketplace:publish` فیکس شد.                          |
| RT-054          | Audit Log: export + retention — `AuditService.listAll()` (بدون pagination، سقف ۵۰هزار ردیف) + `GET /v1/audit/export?format=csv\|json` + دکمه‌ی Export در UI. Retention: `organizations.settings.auditRetentionDays` (override سازمانی) + `AUDIT_RETENTION_DAYS` env (پیش‌فرض کلی، اختیاری) + `audit-retention-scheduler.ts` (روزانه، همون الگوی `setInterval`+disposer). فیلد UI در Settings.                                                                                                                                                                                                                                                                                                                                                              | ✅    | ✅ پوشش در `audit-service.test.ts` (لیست کامل، purge فقط ردیف‌های قدیمی‌تر از سقف رو حذف می‌کنه)                                                                                                                                                                                                                     |
| RT-055          | Audit Log: tamper-evidence — migration `0020_audit_chain.sql` (`prev_hash`/`row_hash`، nullable برای ردیف‌های قدیمی). `logAction()` هر ردیف رو به‌صورت زنجیره‌ای SHA-256 هش می‌کنه (`organizationId\|actionType\|action_data::text\|created_at::text\|prevHash`، همیشه از خودِ ستون‌های ذخیره‌شده خونده می‌شه، نه ورودی JS، تا insert/verify هیچ‌وقت روی فرمت اختلاف نداشته باشن). `verifyChain()` زنجیره رو دوباره محاسبه می‌کنه. `purgeExpired()` قبل از حذف، جدیدترین hash در حال حذف رو در `organizations.settings.auditChainGenesis` checkpoint می‌کنه تا retention و tamper-evidence با هم تناقض نداشته باشن. **محدودیت مستندشده:** race احتمالی روی نوشتن هم‌زمان (بدون transaction lock، چون `AuditService` فقط `Queryable` می‌گیره نه `Db` کامل). | ✅    | ✅ ۸ تست vitest در `audit-service.test.ts` (زنجیره‌ی معتبر، پیوند `prev_hash`، تشخیص دستکاری، ردیف‌های legacy بدون hash رد می‌شن نه شکسته، checkpoint بعد از purge زنجیره رو معتبر نگه می‌داره)                                                                                                                      |
| RT-056          | Human-in-the-Loop عمومی — `PolicyConditionSchema`'s نوع جدید `action_type_in` (`packages/shared`). `PolicyService.evaluate()`'s context یک `actionType` اختیاری گرفت. `routes/tools.ts`'s دو route مستقیم (`telegram-send`/`webhook-send`) قبل از اجرا policy رو چک می‌کنن؛ اگه match بشه، `ApprovalService.create()` با `actionData.pendingToolCall` صدا زده می‌شه و بجای اجرا `{status:'pending_approval', approvalId}` برمی‌گرده. `routes/approvals.ts` یک شاخه‌ی سوم گرفت (کنار `workflowRunId`) که روی approve واقعاً tool رو اجرا می‌کنه. UI صفحه‌ی Policies یک نوع condition سوم گرفت. **عمداً Workflow Engine's خودِ step های `tool`/`agent` رو نگرفت** — scope محدود، نه فراموشی.                                                                 | ✅    | ✅ پوشش در `policy-service.test.ts` (بدون actionType هیچ‌وقت match نمی‌شه، actionType نامرتبط match نمی‌شه، actionType منطبق match می‌شه)                                                                                                                                                                            |

**تصمیم‌های طراحی مهم (مستند در کد):**

- «Permission system» (فاز ۲) به‌جای sandboxing واقعی، یک consent gate در زمان install/upgrade شد — چون اصلاً هیچ Plugin execution engine ای نیست (خودِ WASM Sandbox که پیش‌نیازش بود، عمداً کنار گذاشته شد). این تفاوت صریحاً در roadmap مستند شد تا بعداً به اشتباه «کامل» خونده نشه.
- Audit tamper-evidence و retention عمداً با هم هماهنگ شدن (`auditChainGenesis` checkpoint) — بدون این هماهنگی، هر purge باعث می‌شد `verifyChain()` همیشه از نقطه‌ی purge به بعد «شکسته» گزارش بده، که خودِ retention feature رو با تازه‌ساخته‌شده‌ی tamper-evidence در تناقض می‌ذاشت.
- HITL عمومی‌شده عمداً محدود به دو route مستقیم tool موند، نه Workflow Engine's steps — نگه‌داشتن scope این batch.
- در طول این batch **سه باگ/gap واقعی پیدا و فیکس شد** (بالا توضیح داده شد): پیام اشتباه `ToolExecutionError` در validator، نبود `marketplace:read/install` در seed پیش‌فرض admin، و (مستندشده به‌عنوان محدودیت نه باگ) race احتمالی hash chain بدون lock.

### باقی‌مانده

- WASM Sandbox و اجرای واقعی Plugin (فاز ۲) — عمداً کنار گذاشته شد، طبق `09-plugin-sandbox.md`.
- Playwright واقعی روی `/marketplace`، `/marketplace/publisher`، `/audit` (export/verify buttons)، `/policies` (نوع condition جدید) — فقط build تأیید شده.
- تست end-to-end واقعی مسیر HITL جدید از طریق یک درخواست HTTP واقعی (approve → اجرای tool واقعی) — فقط سطح service (`PolicyService`) تست شده؛ این repo هیچ‌وقت تست HTTP-level (app.inject) نداشته، پس این batch هم الگوی موجود رو نشکست.
- Race احتمالی روی نوشتن هم‌زمان hash chain برای یک org (مستندشده، نه فیکس‌شده — نیازمند refactor بزرگ‌تر `AuditService`'s constructor برای گرفتن `Db` کامل به‌جای `Queryable`).

---

## فاز ۴ (Ecosystem) — هفته ۳۳-۴۰ — RT-057..067, MKT-023 (2026-07-14)

> کاربر خواست بعد از فاز ۰-۳، فاز ۴ روadmap هم با هم ساخته بشه («طبق الگوی
> قبلی»). تحقیق نشون داد هفته‌های ۳۳-۳۴ (Marketplace پیشرفته) تقریباً ۸۰٪
> از قبل ساخته شده بودن زیر شناسه‌های دیگه (MKT-013..016) و فقط
> `TODO-openon4net-marketplace.md` هیچ‌وقت به‌روز نشده بود؛ گپ واقعی این
> بود که نصب آیتم پولی هیچ‌وقت کیف‌پول رو کسر نمی‌کرد. کاربر صریحاً پرداخت
> واقعی (Stripe/درگاه) رو کنار گذاشت — فقط debit موجود روی نصب پولی وایر شد.
> هفته‌های ۳۵-۳۸ (Outcome Engine + Smart Features) هیچ طراحی‌ای نداشتن —
> فقط prose/mockup در `00_VISION/04-digital-employee.md`؛ این batch از صفر
> طراحی شد، با هیوریستیک‌های صریحاً v1 به‌جای ML واقعی (پایین‌تر توضیح داده
> شده). هفته‌های ۳۹-۴۰ (Integration Hub) بخشی از قبل بود (Workflow Engine's
> DAG، ۲۲+ فایل route) — چیزی که واقعاً کم بود: webhook ورودی، trigger
> زمان‌بندی/webhook برای workflow، و export/import.

| #               | تسک                                                                                                                                                                                                                                                                                                                                                                                                                                 | وضعیت   | تست                                                                                                                                                                                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RT-057, MKT-023 | Payment debit روی نصب پولی — Marketplace: `getMarketplacePlugin`/`getMarketplaceSkill` (لوکاپ تک‌آیتمی جدید) + `priceCredits` روی خلاصه‌ی پلاگین. Runtime: قبل از صدا زدن install، قیمت رو می‌پرسه؛ اگه >۰، `WalletService.debit()` صدا زده می‌شه **قبل از** نصب — یعنی هیچ‌وقت نیازی به rollback/جبران نیست (نه نصب رایگان روی خطای debit، نه نیاز به معکوس‌کردن روی خطای نصب).                                                    | ✅      | ✅ build/lint/typecheck سبز؛ منطق debit-قبل-از-نصب دستی رصد شد (کد review) — تست HTTP سطح route نداره چون این ریپو هیچ‌وقت `app.inject` نداشته (پایین‌تر توضیح داده شده)                                                                                                         |
| RT-058          | KPI computation engine — `KpiDefinitionSchema` گرفت `metricType`/`windowDays` (پیش‌فرض `manual`/۷، سازگار با عقب). migration جدید `agent_kpi_snapshots`. `kpi-computation-service.ts` (`computeMetric` per-agent + `computeOrgMetric` org-wide، هر دو aggregate روی `audit_logs`). `kpi-snapshot-scheduler.ts` (روزانه).                                                                                                            | ✅      | ✅ ۶ تست vitest جدید در `kpi-computation-service.test.ts` روی DB واقعی (هر سه metric type، اسکوپ per-agent/org درست، صفر بدون ردیف، تاریخچه‌ی oldest-first)                                                                                                                      |
| RT-059          | BI Dashboard — صفحه‌ی جدید `/outcomes`؛ sparkline دست‌ساز SVG (بدون کتابخانه‌ی جدید). روت `GET /v1/agents/:id/kpi-outcomes` عمداً insights+anomalies+prediction رو یکجا برمی‌گردونه (سه روت جدا نه، چون هر سه تابع خالص روی همون آرایه‌ی snapshot هستن).                                                                                                                                                                            | ✅      | ✅ build سبز (صفحه در خروجی Next.js لیست شده)؛ تست UI مرورگر واقعی نشده (Playwright نداره این ریپو)                                                                                                                                                                              |
| RT-060          | Automated insights — `insight-generator.ts`: جمله‌ی template وقتی `                                                                                                                                                                                                                                                                                                                                                                 | %change | > 15`نسبت به`lookback` snapshot عقب‌تر — **هیوریستیک آستانه‌ای صریح، نه NLG واقعی**، بدون تماس LLM.                                                                                                                                                                              | ✅  | ✅ ۶ تست vitest خالص در `insight-generator.test.ts` (زیر آستانه هیچی، بالای آستانه جمله، جهت افزایش/کاهش، baseline صفر رد می‌شه، `lookback` سفارشی) |
| RT-061          | Auto-reporting — opt-in (`organizations.settings.reportingEnabled`/`reportingFrequency`). `report-service.ts` (aggregate مشترک، `computeOrgMetric` رو دوباره استفاده می‌کنه). `report-scheduler.ts`: فقط اگه SMTP تنظیم شده باشه ایمیل می‌فرسته (همون nodemailer الگوی magic-link/invitation)، وگرنه گزارش فقط از `GET /v1/reports/latest?period=daily\|weekly` در دسترسه — **بدون SMTP هم feature ساکت شکست نمی‌خوره**.            | ✅      | ✅ build/lint/typecheck سبز؛ تست end-to-end واقعی ایمیل نشده (SMTP سرور واقعی این محیط نداره) — مسیر on-demand (بدون ایمیل) کد review شد                                                                                                                                         |
| RT-062          | Anomaly detection — `anomaly-detector.ts`: Z-score نسبت به میانگین/انحراف‌معیار baseline (نقطه‌ی تست از baseline خودش مستثنی)، حداقل ۳ نقطه لازم، در غیر این‌صورت هیچ‌وقت flag نمی‌کنه. **هیوریستیک آماری ساده، نه مدل آموزش‌دیده.**                                                                                                                                                                                                | ✅      | ✅ ۴ تست vitest خالص (کمتر از ۳ نقطه هیچ‌وقت flag نمی‌شه، انحراف بزرگ flag می‌شه، واریانس نرمال flag نمی‌شه، baseline صفر-واریانس بدون تقسیم‌بر‌صفر)                                                                                                                             |
| RT-063          | Predictive analytics — `trend-predictor.ts`: رگرسیون خطی OLS ساده روی نقاط اخیر، برمی‌گردونه `null` با کمتر از ۲ نقطه یا خط منحط. **برون‌یابی خطی صریح، نه پیش‌بینی واقعی.**                                                                                                                                                                                                                                                        | ✅      | ✅ ۴ تست vitest خالص (کمتر از ۲ نقطه null، x یکسان null، روند خطی کامل دقیق، نقاط پرنویز best-fit)                                                                                                                                                                               |
| RT-064          | Natural-language data query — `nl-query-service.ts`: دو تماس LLM از طریق `packages/llm-providers` مستقیم (نه `ChatService` کامل). اول: سوال به یک intent ثابت Zod-validated ترجمه می‌شه (`{metric, agentId, windowDays}`) — **LLM هیچ‌وقت SQL/کوئری آزاد تولید نمی‌کنه**؛ `agentId` هم چک می‌شه که واقعاً توی همون سازمان باشه. دوم: مقدار عددی به جمله تبدیل می‌شه. روت `POST /v1/insights/ask` + جعبه‌ی سوال در `/outcomes`.      | ⚠️      | ✅ ۶ تست vitest با provider جعلی (LLM واقعی در CI نیست — همون محدودیت‌کلاس RT-005's توکن تلگرام) — پارس JSON با prose اضافه، رد schema نامعتبر، رد agentId خارج از سازمان، `phraseAnswer` trim می‌شه. مسیر LLM واقعی دستی تست نشده.                                              |
| RT-065          | Inbound webhooks — migration جدید `webhook_endpoints` (token فقط hash‌شده ذخیره می‌شه، مثل magic-link/invitation). روت PUBLIC `POST /v1/webhooks/:token` (بدون JWT — خودِ token اعتبارسنجیه)؛ هدف workflow یا agent رو صدا می‌زنه. rate-limit با همون fixed-window شمارنده‌ی چت (استخراج شد به `checkFixedWindowRateLimit` مشترک). CRUD routes + صفحه‌ی جدید `/webhooks`.                                                           | ✅      | ✅ ۶ تست vitest در `webhook-endpoint-service.test.ts` روی DB واقعی (token فقط یک‌بار plaintext برمی‌گرده، لوکاپ با token خام، لوکاپ token ناموجود null، delete + دیگه پیدا نمی‌شه، delete خارج از سازمان رد می‌شه، `markTriggered`) — **یک باگ واقعی پیدا و فیکس شد** (پایین‌تر) |
| RT-066          | Workflow triggers — ستون جدید `workflows.trigger` (JSONB، پیش‌فرض `{type:'manual'}`، کاملاً سازگار با عقب). `{type:'scheduled', intervalMinutes}` همون شکل `agents.schedule` رو دوباره استفاده می‌کنه (بدون کتابخانه‌ی cron). `workflow-trigger-scheduler.ts` (همون الگوی interval). Webhook-triggered نیاز به کد جدا نداشت — روت RT-065 مستقیم `target_type:'workflow'` رو پوشش می‌ده. UI: انتخاب‌گر trigger در فرم ساخت workflow. | ✅      | ✅ ۴ تست vitest موجود `workflow-service.test.ts` بعد از اضافه‌شدن `trigger` همچنان سبز (fixture‌ها به‌روز شدن)                                                                                                                                                                   |
| RT-067          | Import/Export — `GET /v1/skills/:id/export` / `GET /v1/workflows/:id/export` (فقط `{name, description, definition}` — بدون id/version/آمار اجرا). «import» یعنی همون `POST` ایجاد موجود با همین شکل — **عمداً بدون روت import جدا**. UI: دکمه‌ی Export (دانلود JSON) + حالت paste-JSON برای import روی هر دو صفحه‌ی Skills/Workflows.                                                                                               | ✅      | ✅ build/lint/typecheck سبز؛ export/import دستی از طریق UI کد review شد (بدون Playwright)                                                                                                                                                                                        |

**تصمیم‌های طراحی مهم (مستند در کد):**

- Debit-قبل-از-نصب (RT-057): چون نصب و کسر کیف‌پول دو عملیات جدا روی دو سرویس/DB جدا هستن (Runtime + Marketplace)، ترتیب «اول debit، بعد نصب» انتخاب شد نه برعکس — این‌جوری هیچ‌وقت نیاز به rollback/جبران نیست (نه نصب رایگان روی خطای debit، نه نیاز به معکوس‌کردن accrual سهم درآمد روی خطای نصب).
- `GET /v1/agents/:id/kpi-outcomes` عمداً insights+anomalies+prediction رو در یک روت تجمیع می‌کنه (نه سه روت تقریباً یکسان) — چون هر سه تابع خالص روی همون آرایه‌ی snapshot هستن که dashboard به‌هرحال لازم داره.
- webhook token فقط hash (SHA-256) ذخیره می‌شه، مثل magic-link/invitation — نه plaintext؛ خام فقط یک‌بار در پاسخ create برمی‌گرده.
- برای BI dashboard عمداً کتابخانه‌ی نموداری جدید اضافه نشد — یک SVG sparkline دست‌ساز کوچیک کافیه برای v1.
- هر هیوریستیک این batch (anomaly=Z-score، prediction=رگرسیون خطی، insight=آستانه‌ی template) صریحاً در کد و اینجا مستند شده که چی _نیست_ (نه ML، نه پیش‌بینی واقعی، نه NLG واقعی).

**باگ واقعی پیدا و فیکس شد:** `webhook_endpoints.created_by_user_id` (مثل `workflows.created_by_user_id` قبلش) `ON DELETE CASCADE` نداره — یعنی `test-support/fixtures.ts`'s `cleanupTestFixture()` قبل از فیکس با خطای FK روی `DELETE FROM users` fail می‌شد. فیکس: `DELETE FROM webhook_endpoints WHERE organization_id = $1` قبل از حذف کاربران اضافه شد (همون الگوی قبلی برای workflows).

### باقی‌مانده (این بخش)

- تست HTTP سطح route (مثلاً واقعاً `POST /v1/marketplace/plugins/:id/install` رو با insufficient balance صدا زدن و ۴۰۲ گرفتن) اصلاً وجود نداره — این ریپو هیچ‌وقت `app.inject`/supertest نداشته، فقط تست سطح service روی DB واقعی؛ این batch هم همون الگوی موجود رو حفظ کرد نه شکست.
- RT-061 (auto-reporting) مسیر واقعی ارسال ایمیل (SMTP سرور واقعی) end-to-end تست نشده — این محیط SMTP سرور نداره.
- RT-064 (NL query) مسیر LLM واقعی (نه provider جعلی) end-to-end تست نشده — همون محدودیت‌کلاس RT-005 (توکن تلگرام واقعی).
- Playwright واقعی روی صفحات جدید (`/outcomes`, `/webhooks`, دکمه‌های Export/Import) اجرا نشده — فقط build/typecheck تأیید شده.
- پرداخت واقعی (Stripe/درگاه) همچنان ساخته نشده — طبق تصمیم صریح کاربر، عمداً stub/دستی موند (RT-043 از قبل).

---

## فاز ۵ (Enterprise) — هفته ۴۱-۴۸ — RT-068..075 (2026-07-15)

> کاربر خواست هرچی از فاز ۵ واقعاً «کد» است ساخته بشه، شامل SAML. فاز ۵ با
> فازهای قبلی فرق کیفی داره: بخشی از آیتم‌هاش اصلاً کد نیستن — SOC2 یه
> گواهی رسمی خارجیه، VPC/multi-region/CDN واقعی زیرساخت هاست/cloud account
> می‌خوان، case studies به مشتری واقعی نیاز داره، sales kit محتوای
> مارکتینگ/تصمیم کسب‌وکاریه. کاربر صریحاً این چهارتا رو تأیید کرد که فقط
> اینجا مستند بشن، نه ساخته/جعل بشن. DB sharding هم طبق تصمیم صریح کاربر
> فقط سند طراحی شد، نه کد.

| #      | تسک                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | وضعیت | تست                                                                                                                                                                                                                                                                                       |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RT-068 | SSO سازمانی — OIDC عمومی، per-org — جدول جدید `sso_configs` (secret فقط برای OIDC، رمزنگاری envelope با همون `lib/crypto.ts` که `llm_configs` استفاده می‌کنه). `auth/providers/oidc.ts`: discovery واقعی (`.well-known/openid-configuration`)، بدون کتابخونه‌ی `openid-client` — دقیقاً همون الگوی دستی `oauth.ts` (google/github) با یک تفاوت مهم: token exchange واقعاً `application/x-www-form-urlencoded` می‌فرسته (RFC 6749)، نه JSON مثل oauth.ts (که فقط چون Google/GitHub سخت‌گیر نیستن کار می‌کنه). عمداً auto-provision نمی‌کنه — همون قرارداد oauth.ts. UI: کارت SSO جدید در `/settings`. | ✅    | ✅ ۵ تست vitest واقعی در `oidc.test.ts` روی یک `http.createServer` محلی که نقش IdP رو بازی می‌کنه (discovery واقعی، فرمت form-urlencoded تأیید شد، خطای بدون-ایمیل، خطای token رد شده) + ۷ تست `sso-config-service.test.ts` روی DB واقعی (encryption round-trip, upsert, مسک‌کردن secret) |
| RT-069 | SSO سازمانی — SAML، per-org — از `@node-saml/node-saml` استفاده می‌کنه (تنها جای این کدبیس که به‌جای fetch دستی از یه کتابخونه استفاده می‌کنه — چون hand-roll کردن XML signature verification ریسک امنیتی واقعیه). `RelayState` نقش همون `state` رو بازی می‌کنه. `POST /v1/auth/saml/acs` عمومیه (اضافه شد به `PUBLIC_ROUTES` با exact-match، همون الگوی سایر start/callback routeها — برخلاف RT-074's `/docs` که با prefix match عمومی شد).                                                                                                                                                         | ⚠️    | ✅ ۳ تست vitest واقعی (assertion امضانشده رد می‌شه، XML نامعتبر رد می‌شه) — مسیر IdP واقعی امضادار end-to-end تست نشده، نیاز به یه IdP واقعی (Okta/Azure trial) داره، همون بلاک‌کلاس RT-005/RT-017                                                                                        |
| RT-070 | Health check سخت‌تر + Kubernetes manifests — `/health` حالا واقعاً Postgres (`SELECT 1`) و Redis (`PING`) رو چک می‌کنه، ۵۰۳ با اسم dependency خراب. `Dockerfile.gateway`/`Dockerfile.web` گرفتن `HEALTHCHECK`. پوشه‌ی جدید `k8s/` (namespace/configmap/secret.example/gateway+web deployment+service/HPA/ingress/README).                                                                                                                                                                                                                                                                            | ✅    | ✅ ۳ تست vitest واقعی روی DB/Redis واقعی (ok، DB خراب، Redis خراب — هرکدوم جدا تشخیص داده می‌شن) + همه‌ی manifestها با `js-yaml` واقعاً parse شدن (کلاستر Kubernetes واقعی این محیط نداره، `kubectl apply --dry-run` هم نیاز به کلاستر داشت)                                              |
| RT-071 | Backup/restore — `services/backup-service.ts` (`pg_dump -Fc` / `pg_restore --clean --if-exists`)، `backup-scheduler.ts` (opt-in، کل DB نه per-org، فقط دیسک محلی — آپلود S3/GCS واقعی TODO مستندشده چون این محیط credential ابری نداره)، CLI (`pnpm run backup`/`restore`). سند `09_TASKS/05-disaster-recovery.md` به‌روز شد با یک بخش صریح «چی واقعاً ساخته شد» جدا از معماری هدف قدیمی اون سند (WAL-G/multi-region/…).                                                                                                                                                                             | ⚠️    | ✅ کد کامل، دستی تست شد (`pg_dump is not on PATH` واقعاً گرفته شد چون این محیط ابزار Postgres CLI نداره) — تست vitest با `describe.skipIf` نوشته شده که وقتی `pg_dump`/`pg_restore` باشن واقعاً round-trip می‌کنه، این محیط skip می‌شه با دلیل مشخص                                       |
| RT-072 | SLA monitoring — Gauge جدید `o2n_uptime_seconds` + `o2n_health_check_status` (۱/۰، از `/health` آپدیت می‌شه). `ops/observability/prometheus-alerts.yaml` گرفت دو alert جدید (availability budget بر اساس هدف ۹۹.۹٪، و health-check-down).                                                                                                                                                                                                                                                                                                                                                            | ✅    | ✅ build/lint/typecheck سبز؛ `o2n_health_check_status` توسط `health.test.ts` غیرمستقیم پوشش داده می‌شه؛ alert rules با `js-yaml` parse شدن                                                                                                                                                |
| RT-073 | DB sharding strategy — فقط سند طراحی (`02_ARCHITECTURE/17-database-sharding-strategy.md`)، طبق تصمیم صریح کاربر — بدون کد. `organization_id` به‌عنوان کلید شارد طبیعی مستند شد (تقریباً هر جدول از قبل org-scoped هست).                                                                                                                                                                                                                                                                                                                                                                              | ✅    | N/A — سند است، نه کد                                                                                                                                                                                                                                                                      |
| RT-074 | Public API docs — `docs/spect/04_API/00-openapi-v0.1.yaml` (۲۵ path از قبل) به‌روز نشد با تولید خودکار (route ها `schema:` فستیفای ندارن، فقط generics+Zod دستی — تولید خودکار یعنی دست‌زدن به ۲۴ فایل route، خارج از scope این batch)؛ به‌جاش `@fastify/swagger` (static mode) + `@fastify/swagger-ui` روی همون فایل دست‌نویس، سرو شده در `/docs`. **یک باگ واقعی پیدا و فیکس شد:** خودِ فایل YAML یه syntax error داشت (خط ۴۱، colon داخل پرانتز بدون quote) که هیچ‌وقت کشف نشده بود چون قبلاً هیچی این فایل رو parse نمی‌کرد.                                                                     | ✅    | ✅ دستی تأیید شد: سرور واقعی بالا اومد، `/docs/json` واقعاً spec درست‌شده رو برگردوند، `/docs/static/index.html` بدون auth باز شد (بعد از اضافه‌شدن `/docs` prefix به `PUBLIC_ROUTES`)                                                                                                    |
| RT-075 | Tutorials — ۴ فایل مارک‌داون واقعی در `docs/tutorials/` (scheduled trigger، inbound webhook، NL query، export/import) — هر کدوم با اجرای واقعی روی gateway dev واقعی نوشته شدن، نه حدس از روی کد. **مستقیماً «مستندسازی site» کامل (Docusaurus/VitePress) ساخته نشد** — طبق تصمیم صریح، فقط ۴ تا tutorial واقعی. **یک باگ واقعی دیگه پیدا و فیکس شد** حین نوشتن tutorial ۴: `skills:*` اصلاً توی seed پیش‌فرض نقش admin نبود — یعنی فیچر Skills از اول تاریخچه‌ش (RT-026) عملاً از طریق API قابل‌استفاده نبود، حتی برای admin. فیکس شد در `packages/governance/src/permissions.ts`.                  | ✅    | ✅ همه‌ی ۴ tutorial واقعاً روی gateway واقعی اجرا و نتیجه‌ی واقعی (نه فرضی) کپی شد — از جمله RT-064 (NL query) که این‌بار با LLM واقعی (نه provider جعلی تست) یک جواب واقعی گرفت: «Eleven.» برای ۱۱ ردیف audit_log                                                                        |

**تصمیم‌های طراحی مهم (مستند در کد):**

- SSO per-org طراحی شد (نه env-global مثل oauth.ts) چون معنای واقعی
  «enterprise SSO» اینه که هر مشتری IdP خودش رو بیاره — یک تصمیم فنی، نه
  ترجیح دلخواه.
- OIDC عمداً بدون کتابخونه‌ی `openid-client` ساخته شد (همون الگوی دستی
  `oauth.ts`، فقط با یک discovery fetch اضافه) — یک وابستگی کمتر، ریسک
  کمتر روی نسخه‌ی API کتابخونه. SAML برعکس، عمداً _با_ کتابخونه ساخته شد
  چون XML signature verification دستی یه ریسک امنیتی واقعیه، نه یه
  ساده‌سازی قابل قبول.
- Backup فقط local disk — آپلود واقعی S3/GCS TODO مستندشده، نه جعل‌شده،
  چون این محیط credential ابری نداره.
- `/docs` (Swagger UI) به‌جای اضافه‌کردن exact-match های زیاد به
  `PUBLIC_ROUTES`، با یک prefix check (`startsWith('/docs/')`) عمومی شد —
  چون کل زیردرخت route های swagger-ui (استاتیک assets، json/yaml) باید
  عمومی باشن، نه یکی‌یکی شمارش بشن.

**دو باگ واقعی پیدا و فیکس شد این batch (هردو حین کار واقعی با API، نه
code review):**

1. `docs/spect/04_API/00-openapi-v0.1.yaml` یه YAML syntax error واقعی
   داشت (خط ۴۱) که سال‌ها هیچ‌کس متوجه نشده بود چون تا الان هیچ کدی این
   فایل رو parse نمی‌کرد — فقط مستندات انسانی بود.
2. `skills:*` توی seed پیش‌فرض نقش admin نبود، از زمان RT-026 به بعد —
   یعنی فیچر Skills (که در batch های قبلی خیلی گسترش پیدا کرد: RT-032,
   RT-033, RT-049, RT-050) در عمل هیچ‌وقت از طریق API با نقش پیش‌فرض قابل
   استفاده نبوده، حتی برای admin یه سازمان تازه.

### باقی‌مانده (این بخش)

- SOC2 certification — گواهی رسمی خارجیه، نه فیچر. ساخته نشد (طبق تصمیم
  صریح کاربر).
- VPC / Private network واقعی، Multi-region واقعی، CDN واقعی — همه نیاز
  به حساب cloud واقعی دارن که این محیط نداره. ساخته نشدن (طبق تصمیم صریح
  کاربر).
- Case studies — نیاز به مشتری واقعی داره، جعل نشد.
- Enterprise sales kit — محتوای مارکتینگ/تصمیم کسب‌وکاریه، خارج از حوزه‌ی
  کد.
- RT-069 (SAML) مسیر IdP واقعی امضادار end-to-end تست نشده.
- RT-071 (backup) آپلود off-host واقعی (S3/GCS) TODO مستندشده، نه ساخته
  شده.
- مستندسازی site کامل (Docusaurus/VitePress) — عمداً کنار گذاشته شد،
  فقط ۴ tutorial واقعی جایگزینش شد.
- Kubernetes manifests روی یه کلاستر واقعی (kind/minikube) اجرا/تأیید
  نشدن — این محیط کلاستر نداشت؛ فقط YAML syntax با `js-yaml` تأیید شد.

---

## Control Plane (Plane 2) — `docs/sprint-plan/04_control-plane-backlog.md`

> شروع: 2026-07-09، به‌صراحت درخواست کاربر. همه‌چیز فقط داخل
> `apps/openon4net-Platform/` (بدون دست‌زدن به `openon4net-runtime`).
> **2026-07-10 (وصل به workspace):** با اجازه کاربر، `apps/openon4net-Platform/{gateway,web}`
> در `pnpm-workspace.yaml` ریشه ثبت شد؛ `pnpm turbo run lint typecheck test build`
> روی هر دو پکیج و کل workspace سبز شد.
> **2026-07-10 (CP-001 — اولین دور end-to-end واقعی):** یک دیتابیس واقعی
> (`o2n_control_plane` روی همون Postgres بیرونی) ساخته و migrate شد، gateway
> واقعاً بالا اومد، و کل مسیر issue-key → check-in → credit → wallet/transactions
> با curl واقعی تأیید شد (جزئیات کامل پایین). به همین خاطر بیشتر ردیف‌های زیر
> از ⚠️ به ✅ ارتقا پیدا کردن.

### CP-SP-01 — Foundation + Activation MVP

| #        | تسک                                                                           | وضعیت         | تست                                                                                                                           |
| -------- | ----------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| T-CP-001 | اسکلت `gateway/` + `migrations/` + `docker-compose.yml`                       | ✅            | ✅ هم مستقیم (`pnpm dev`) هم واقعاً از طریق `docker compose build/up` (CP-004، دو باگ واقعی همونجا پیدا و فیکس شد — پایین‌تر) |
| T-CP-002 | ثبت در `pnpm-workspace.yaml` ریشه                                             | ✅            | ✅ `pnpm install` + `pnpm turbo run lint typecheck test build` سبز، هم برای این دو پکیج هم کل workspace (۱۰/۱۰ task)          |
| T-CP-003 | Migrations: `organizations`/`activation_keys`/`wallets`/`credit_transactions` | ✅            | ✅ روی یک Postgres واقعی (همون سرور بیرونی runtime، دیتابیس جدا `o2n_control_plane`) اجرا شد؛ هر ۴ جدول ساخته شدن             |
| T-CP-004 | App skeleton (Fastify) + health check                                         | ✅            | ✅ `curl /health` → `{"status":"ok"}` (200)                                                                                   |
| T-CP-005 | `POST /admin/activation-keys` (issue، admin-auth)                             | ✅            | ✅ curl واقعی: org+wallet+key ساخته شد، کلید خام یک‌بار برگشت                                                                 |
| T-CP-006 | `POST /activation/check-in`                                                   | ✅            | ✅ curl واقعی: policy/thresholds درست مطابق پلن `team` برگشت                                                                  |
| T-CP-007 | کلاینت activation سمت Runtime                                                 | ❌ عمداً معلق | نیاز به اجازه صریح کاربر (تغییر در Runtime)                                                                                   |
| T-CP-008 | CI پایه (`.github/workflows/ci.yml`)                                          | ✅            | ❌ push واقعی برای تست انجام نشده                                                                                             |

### CP-SP-02 — Wallet Read-only + Policy Distribution + Web Panel

| #        | تسک                                                                                                                                                                                                 | وضعیت | تست                                                                                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T-CP-009 | `GET /billing/wallet`, `/billing/transactions` + admin manual-credit با idempotency                                                                                                                 | ✅    | ✅ credit واقعی (0→10000)، replay همون idempotency key دوبار شارژ نکرد، transactions دقیقاً ۱ ردیف برگردوند                                                                                           |
| T-CP-010 | Policy distribution (allowed models/providers + thresholds در پاسخ check-in)                                                                                                                        | ✅    | ✅ مقادیر پلن `team` (`approvalThresholdCents: 5000`, مدل‌های درست) دقیقاً مطابق کد در پاسخ واقعی برگشت                                                                                               |
| T-CP-011 | Feature flags استاتیک per-plan (در همان پاسخ check-in)                                                                                                                                              | ✅    | ✅ `{managedAiGateway:false, workflowEngine:false}` در پاسخ واقعی check-in تأیید شد                                                                                                                   |
| T-CP-012 | `web/` — صفحه فرود (`/`) + پنل ادمین (`/admin`, `/admin/new`, `/admin/organizations/[id]`)                                                                                                          | ✅    | ⚠️ `next build` سبز + سرو شدن واقعی از containerized `next start` تأیید شد با curl (CP-004، HTTP 200 + محتوای درست)، ولی تعامل واقعی با فرم‌ها/fetch در یک مرورگر واقعی هنوز چک نشده (CP-002 در TODO) |
| T-CP-013 | Trace id (`X-Trace-Id` + child logger)                                                                                                                                                              | ✅    | ✅ `curl -D -` هدر `x-trace-id` با یک UUID واقعی روی هر پاسخ تأیید شد                                                                                                                                 |
| T-CP-014 | Rate limiting پایه (in-memory) روی activation/admin endpoints                                                                                                                                       | ✅    | ⚠️ کد سر جاشه ولی به سقف نرسوندیم که واقعاً 429 بگیریم — رفتار مرزی هنوز تست نشده                                                                                                                     |
| —        | _اضافه‌ی خارج از طرح اولیه:_ `GET /admin/organizations`, `GET /admin/organizations/:id` (لازم برای پنل ادمین — `/billing/*` فقط با کلید خودِ سازمان کار می‌کند)؛ صفحه‌بندی/جستجو در CP-005 اضافه شد | ✅    | ✅ لیست + جزئیات (wallet + activation keys با `lastSeenAt` واقعی) هر دو با curl تأیید شدن                                                                                                             |

**نکته‌ی جانبی (2026-07-10):** برای ساخت دیتابیس `o2n_control_plane` یک مشکل زیرساختی از قبل موجود کشف شد: Postgres container بیرونی (`openon4net-runtime-postgres-1`) collation-version mismatch داره («template database was created using collation version 2.41, but the OS provides 2.36» — به‌احتمال زیاد به‌خاطر آپدیت سیستم بعد از init شدن `template1`). این مربوط به کد Control Plane نیست؛ فقط با `CREATE DATABASE ... TEMPLATE template0` دورش زده شد تا `template1` خراب دست‌نخورده بمونه. اگه بعداً `openon4net-runtime` هم بخواد دیتابیس جدید بسازه به همین مشکل می‌خوره.

منفی‌های auth هم چک شدن: کلید ادمین غلط → 401 `UNAUTHORIZED`، کلید activation غلط → 401 `ACTIVATION_KEY_INVALID`، بدون هدر → 401 — هر سه با envelope خطای درست.

### CP-003 — تست‌های vitest واقعی (2026-07-10، از `docs/spect/TODO-openon4net-platform.md`)

> رویکرد: Postgres واقعی، نه mock (هم‌راستا با CP-001 و روش تست‌نویسی بقیه‌ی این پروژه). هر تست
> با `uniqueSlug()` داده‌ی خودش رو می‌سازه و در `afterEach` پاک می‌کنه — بعد از اجرا فقط همون یک
> org دمو از CP-001 (`Acme Test Org`) توی DB باقی می‌مونه، صفر residue.

| #         | تسک                                                                                                                                                                                                                                     | وضعیت | تست                                                                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| T-CP-003a | `activation-service.test.ts` — issue، عدم ذخیره کلید خام (فقط hash)، authenticate + `last_seen_at`، رد کلید نامعتبر/secret اشتباه، policy/flags per-plan، پیش‌فرض پلن starter                                                           | ✅    | ✅ ۷ تست، همه روی DB واقعی سبز                                                                                                              |
| T-CP-003b | `wallet-service.test.ts` — موجودی صفر اولیه، `NotFoundError` برای wallet/org ناموجود، credit+transaction، **idempotency واقعی زیر race همزمان** (`Promise.all` با یک idempotency key)، دو کلید جدا هر دو اعمال می‌شن، رد amount غیرمثبت | ✅    | ✅ ۸ تست، همه سبز — شامل تست race واقعی (نه فقط replay ترتیبی) که به لطف `SELECT ... FOR UPDATE` توی `withTransaction` درست serialize می‌شه |
| —         | `gateway/scripts/migrate.mjs` — اجراکننده‌ی migration قابل استفاده‌ی مجدد (جایگزین دستور دستی inline که در CP-001 استفاده شد) + اسکریپت `pnpm run migrate`                                                                              | ✅    | ✅ همینو CI هم مصرف می‌کنه (پایین)                                                                                                          |
| —         | `.github/workflows/ci.yml` — اضافه شدن Postgres service container + step اجرای migration، چون بدونش تست‌های جدید در CI فورا fail می‌شدن (قبلاً هیچ service ای نداشت)                                                                    | ✅    | ❌ push واقعی هنوز انجام نشده (همون محدودیت T-CP-008 قبلی)                                                                                  |

نتیجه‌ی `pnpm turbo run lint typecheck test build --filter=@o2n/control-plane-gateway --filter=@o2n/control-plane-web`: **۸/۸ سبز** (شامل ۱۵ تست واقعی).

### CP-004 — Docker packaging برای `web/` (2026-07-10، از `docs/spect/TODO-openon4net-platform.md`)

> این تسک دو تا باگ واقعی preexisting رو لو داد که تا الان هیچ‌جا کشف نشده بودن — چون تا امروز
> هیچ‌کس (نه من، نه CP-001) واقعاً `docker compose build` رو روی این پروژه اجرا نکرده بود، فقط
> `pnpm dev`/`node` مستقیم. یعنی `Dockerfile.gateway` هم همین باگ‌ها رو داشت، نه فقط `Dockerfile.web`.

| #                | تسک                                                                                                                                                                                                                                                                                                           | وضعیت      | تست                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| T-CP-012 (تکمیل) | `Dockerfile.web` + سرویس `web` در `docker-compose.yml`                                                                                                                                                                                                                                                        | ✅         | ✅ `docker compose build` + `docker compose up -d` واقعی، هر دو container بالا اومدن                                                          |
| —                | **باگ ۱ (preexisting، هر دو Dockerfile):** `corepack enable` بدون pin کردن نسخه، pnpm 11.x رو می‌کشه که به Node 22.13+ نیاز داره → کرش «Unknown built-in module: node:sqlite» روی `node:20-slim`                                                                                                              | ✅ فیکس شد | ✅ با `corepack prepare pnpm@9.12.0 --activate` (همون نسخه‌ی `packageManager` روت) فیکس شد، هر دو Dockerfile                                  |
| —                | **باگ ۲ (preexisting، هر دو Dockerfile):** نبود `.dockerignore` باعث می‌شد `COPY web ./` (یا `COPY gateway ./`) در stage «build»، `node_modules` تازه‌نصب‌شده‌ی stage «deps» رو با `node_modules` هاست (symlinkهای pnpm که به مسیرهای هاست اشاره دارن) خراب کنه → «Cannot find module .../next/dist/bin/next» | ✅ فیکس شد | ✅ با اضافه‌کردن `apps/openon4net-Platform/.dockerignore` (چون context خودِ همین پوشه‌ست، نه ریشه‌ی مونوریپو که `.dockerignore` خودش رو داره) |

تأیید نهایی: `docker compose up -d` → `curl http://localhost:4100/health` (containerized، از طریق `host.docker.internal` به همون Postgres) → `{"status":"ok"}`؛ `curl http://localhost:3300/` و `/admin` → هر دو HTTP 200 با محتوای واقعی (`<title>on4net Control Plane</title>` تأیید شد در HTML واقعی). بعدش `docker compose down` تمیز پاک شد.

### CP-005 — صفحه‌بندی/جستجو برای `GET /admin/organizations` (2026-07-10، از `docs/spect/TODO-openon4net-platform.md`)

| #      | تسک                                                                                                                                                                                                              | وضعیت | تست                                                                                                          |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------ |
| CP-005 | `organization-service.ts`: `listOrganizations` حالا `{limit, offset, search}` می‌گیره و `{organizations, total}` برمی‌گردونه؛ search با `ILIKE` روی name/slug                                                    | ✅    | ✅ ۸ تست vitest جدید (پاراگراف پایین) + curl زنده: `q=acme`، `q=` بی‌نتیجه (خالی نه خطا)، `limit=1&offset=0` |
| CP-005 | `lib/pagination.ts` — `clampInt` مشترک، جایگزین کد تکراری parse/clamp که در `admin-organizations.ts` و `billing.ts` هر دو بود                                                                                    | ✅    | ✅ توسط تست‌های موجود billing/organization غیرمستقیم پوشش داده می‌شه                                         |
| CP-005 | `web/app/admin/page.tsx`: باکس جستجو + Prev/Next با شمارنده‌ی «X–Y of Z»؛ `api-client.ts`: `PAGE_SIZE=20`                                                                                                        | ✅    | ⚠️ فقط build/typecheck — تعامل واقعی در مرورگر جزو همون CP-002 باز مونده                                     |
| —      | `organization-service.test.ts` — ترتیب newest-first، صفحه‌بندی (بدون هم‌پوشانی صفحات)، جستجوی case-insensitive روی name/slug، جستجوی بی‌نتیجه (نه خطا)، بدون فیلتر، `getOrganizationDetail` (شامل مسیر NotFound) | ✅    | ✅ ۸ تست، همه سبز روی DB واقعی؛ مجموع تست‌های gateway الان **۲۳** (۷+۸+۸)                                    |

**نکته‌ی جانبی مهم — race شناسایی‌شده در تولینگ (نه در کد این تسک):** وقتی `pnpm turbo run lint typecheck test build`
برای `@o2n/control-plane-web` اجرا می‌شه، گاهی `typecheck` (`tsc --noEmit`) با خطای «`.next/types/cache-life.d.ts` not
found» fail می‌کنه. علتش: چون این پکیج هیچ `workspace:*` dependency نداره، `turbo.json`'s
`typecheck: {dependsOn: ["^build"]}` هیچ ترتیبی بین `typecheck` و `build` _خودِ همین پکیج_ اعمال نمی‌کنه، پس turbo
گاهی موازی اجراشون می‌کنه و `tsc` وسط بازنویسیِ `.next/types/` توسط `next build` بهشون برمی‌خوره. **این یک باگ کد
نیست** — با اجرای مجدد (یا `typecheck` تنها) همیشه سبز می‌شه؛ همون الگوی race که در بخش Runtime این فایل («یادداشت
CI») مستند شده. فیکس واقعی (مثلاً `typecheck: {dependsOn: ["build"]}` به‌جای `^build`) نیاز به ویرایش `turbo.json`
ریشه داره — فایل مشترک، پس بدون اجازه صریح دست نزدم؛ در `docs/spect/TODO-openon4net-platform.md` اضافه شد.

### باقی‌مانده

- CP-SP-03 (Managed AI Gateway) — ✅ انجام شد، پایین‌تر ببینید. CP-SP-04 (پرداخت واقعی) هنوز عمداً شروع نشده، طبق backlog جزو Should/Later هست.
- `web/` هنوز docker-compose/Dockerfile ندارد (فقط `gateway/` دیپلوی می‌شود).
- `web/` هنوز در مرورگر واقعی باز نشده (CP-002 در `docs/spect/TODO-openon4net-platform.md`).
- Rate limiter هنوز به سقف نرسیده تا 429 واقعی دیده بشه.

---

## Control Plane (Plane 2) — CP-012 Managed AI Gateway (۲۰۲۶-۰۷-۱۸، از `docs/spect/TODO-openon4net-platform.md` بخش C)

✅ انجام شد — طبق درخواست صریح کاربر برای رفع وابستگی RT-078. دامنه‌ی واقعی
همون backlog مشخص `docs/sprint-plan/04_control-plane-backlog.md`'s E-063
(US-630..633) است، **نه** کل سند آرمانی `02_ARCHITECTURE/02-ai-gateway.md`
(که semantic cache، circuit breaker state machine، intent classifier، و
providerهای غیر از ۴ تای موجود مثل Gemini/Runway/Grok رو هم توصیف می‌کنه —
اون‌ها ساخته نشدن، عمداً).

- **Migration `0007_ai_gateway.sql`**: `organizations.ai_gateway_enabled`
  (پیش‌فرض `false` — طبق اصل صریح معماری در `13-four-plane-architecture.md`
  §5.3 و `02-ai-gateway.md` §1.1، BYOK همیشه پیش‌فرض می‌مونه، managed مطلقاً
  opt-in است، US-633)، `ai_gateway_provider_configs` (زنجیره‌ی ordered
  provider با `priority`، طبق همون الگوی envelope-encryption موجود
  Runtime's `llm_configs` — کد `lib/crypto.ts` عیناً کپی شد، نه import
  مشترک، چون هر Plane سرویس مستقلیه با کلید master خودش)،
  `ai_gateway_usage_events` (US-632).
- **`ai-gateway-service.ts`**: `routeCompletion()` زنجیره رو به ترتیب
  priority امتحان می‌کنه، هر خطایی (نه فقط retryable) رو fallback به بعدی
  می‌کنه (US-630/631) — استثنا: `InsufficientBalanceError` بلافاصله throw
  می‌شه چون امتحان provider بعدی کمکی نمی‌کنه (wallet یکیه). موفقیت اول:
  هزینه با `pricing.ts` مرکزی (که Runtime's خودِ pricing.ts صراحتاً بهش
  ارجاع می‌داد به‌عنوان «جای واقعی pricing») محاسبه می‌شه، `debitWallet`
  (تابع جدید در `wallet-service.ts` — قبلش فقط credit بود) صدا زده می‌شه،
  و یک ردیف در `ai_gateway_usage_events` ثبت می‌شه (US-632). Provider
  factory از طریق پارامتر تزریق‌پذیره (`ProviderFactory`) تا تست بتونه
  رفتار موفقیت/شکست provider رو بدون HTTP واقعی کنترل کنه.
- **Routes (`routes/ai-gateway.ts`)**: `GET`/`PUT /v1/ai-gateway/config`
  (auth با `requireSession` — همون login خودسرویس CP-025 — + بررسی
  مالکیت سازمان از طریق `activation_keys.created_by_user_id`، چون
  session فقط `userId` داره نه `organizationId`)، `GET /v1/ai-gateway/usage`،
  `POST /v1/ai-gateway/complete` (auth با activation key، Runtime-facing،
  عین `/activation/check-in`/`/billing/*`).
- **`activation-service.ts`**: `featureFlags.managedAiGateway` که قبلاً
  همیشه `false` بود («E-063, not built yet regardless of plan») حالا
  برای `team`/`business`/`enterprise` واقعاً `true` می‌شه (تصمیم خودم،
  `starter` مرز رایگان طبیعی می‌مونه — کاربر می‌تونه عوضش کنه). یک تست
  قدیمی (`activation-service.test.ts`) که انتظار `false` رو داشت آپدیت
  شد + یک تست جدید برای `starter` اضافه شد. `checkIn()`/`authenticateActivationKey()`
  حالا `aiGatewayEnabled` (وضعیت opt-in واقعی org، جدا از این‌که پلن
  اجازه می‌ده یا نه) رو هم برمی‌گردونن — Runtime بعداً (RT-078) هر دو رو
  چک می‌کنه.
- **جانبی مهم — CI**: این اولین باری بود که `openon4net-platform` یک
  `workspace:*` dependency واقعی گرفت (`@o2n/llm-providers`). کامنت قدیمی
  `errors.ts` («این app توی pnpm-workspace.yaml ثبت نشده») و CI («no
  workspace:* dependencies yet») هر دو **stale** بودن — تأیید شد
  `pnpm-workspace.yaml` از قبل `apps/openon4net-platform/gateway` رو
  داشت. `.github/workflows/ci.yml` به همون الگوی overlay-به-parent-monorepo
  که Runtime's CI استفاده می‌کنه تغییر کرد (checkout parent، overlay این
  کامیت روی `apps/openon4net-platform`، `pnpm install` از ریشه). عمداً
  بدون `--frozen-lockfile` چون `pnpm-lock.yaml` ریشه یک diff بزرگ
  ناشناخته‌ی از قبل موجود داره که این جلسه دست نمی‌زنه.
- **تست واقعی**: یک دیتابیس Postgres واقعی (`o2n_control_plane` روی همون
  container در حال اجرای Runtime، پورت ۵۴۳۲ — `.env`ش قبلاً اشتباهاً به
  پورت ۵۵۳۲ (یک container متوقف‌شده‌ی جدای Memory) اشاره می‌کرد، fix شد
  همین‌جا) ساخته و migrate شد. **همه‌ی ۷ migration، از جمله ۶ تای قبلی که
  تا حالا هیچ‌وقت واقعاً روی یک DB واقعی امتحان نشده بودن، پاس شدن** — این
  عملاً اولین بار CP-001 (راه‌اندازی end-to-end واقعی) این‌قدر واقعی تأیید
  شد. ۱۱ تست جدید vitest (`ai-gateway-service.test.ts`) + کل مجموعه‌ی
  موجود (۹۲ تست قبلی + خودم) = **۱۰۴/۱۰۴ پاس**. یک HTTP smoke-test واقعی
  دستی هم انجام شد: gateway واقعی بالا اومد، یک activation key واقعی صادر
  شد (`POST /admin/activation-keys`)، `POST /v1/ai-gateway/complete` باهاش
  زده شد و `402 FEATURE_NOT_AVAILABLE` درست برگشت (چون org تازه‌ساز هنوز
  opt-in نکرده).
- **عمداً ساخته نشد (خارج scope واقعی E-063)**: صفحه‌ی تنظیمات در
  `web/` برای این routeها (فعلاً فقط API — یک admin باید مستقیم API رو صدا
  بزنه یا از curl استفاده کنه)؛ circuit breaker/semantic cache/prompt
  manager (بخش‌های ۲،۵،۶ سند `02-ai-gateway.md`)؛ providerهای غیر از
  anthropic/openai/deepseek/ollama.

---

## Memory (Plane 3) — MEM-008..MEM-013 (2026-07-12، از `docs/spect/TODO-openon4net-memory.md`)

> Guardrail `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` §3.3 ("Later —
> بعد از ۲-۳ مشتری واقعی") با تأیید صریح کاربر عبور داده شد، بعد از این‌که
> این تناقض مطرح شد که `01_ROADMAP/01-roadmap-12-months.md` همین کار را
> Phase 1 (ماه ۳-۴) برنامه‌ریزی کرده بود. آنچه ساخته شد self-host واقعی است
> (Postgres/pgvector + Neo4j اختصاصی سرویس)، نه یک ارائه‌دهنده‌ی managed —
> یعنی همچنان با هدف §۵ (Plane 3 = self-host) سازگار است.

| #       | تسک                                                                                                                                                          | وضعیت | تست                                                                                                                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MEM-008 | migration کامل Layers 3-6 + graph backup + jobs/approvals/audit (۶ فایل `apps/openon4net-memory/migrations/0001..0006.sql`) روی دیتابیس اختصاصی `o2n_memory` | ✅    | ✅ روی `pgvector/pgvector:pg16` واقعی (container جدا، نه postgres:13.4 مشترک قدیمی که pgvector نداره) اجرا شد؛ همه ۶ migration apply شدن                                                                   |
| MEM-009 | `KnowledgeStore` عمومی (project/company/global) + `PersonalKnowledgeStore` (لایه ۵، رمزنگاری‌شده) — semantic search (pgvector cosine) با fallback به ILIKE   | ✅    | ✅ مسیر ILIKE fallback تست شد (write→search روی لایه ۳ و ۴)؛ ✅ **۲۰۲۶-۰۷-۱۲: مسیر semantic واقعی هم تست شد** با Ollama/`nomic-embed-text` (جزئیات در بخش MEM-014..018 پایین‌تر)                           |
| MEM-010 | `GraphService` (Neo4j واقعی) — upsert node/edge + query با depth-traversal + backup در Postgres                                                              | ✅    | ✅ روی `neo4j:5-community` واقعی: نوشتن دو node مرتبط از طریق `context.graph_nodes/edges` در `/memory/write`، بعد `/memory/graph` هر دو node + edge رو پیدا کرد                                            |
| MEM-011 | envelope encryption لایه ۵ (AES-256-GCM، پورت از `apps/openon4net-runtime`) — `personal_knowledge.content_encrypted`، اسکوپ به (organization_id, user_id)    | ✅    | ✅ نوشتن/خواندن رمزنگاری‌شده تأیید شد؛ user-scoping هم تست شد (کاربر B نتیجه‌ی کاربر A رو نمی‌بینه). یک باگ واقعی همین‌جا پیدا و فیکس شد: کلید تست ۶۲ کاراکتر (نه ۶۴) باعث crash در `createCipheriv` می‌شد |
| MEM-012 | `/memory/reindex`+`/memory/export` (async job با in-process poller، بدون queue خارجی) + `/memory/import`                                                     | ✅    | ✅ ایجاد job و `GET` وضعیت (`queued`) تست شد؛ ✅ **۲۰۲۶-۰۷-۱۲: خودِ پردازش async هم تست شد** — worker واقعاً در تست start شد و job به `completed` رسید                                                     |
| MEM-013 | `/memory/delete` → `memory_approvals` (هرگز synchronous) + `/memory/approvals/*` (approve/reject/list) + `memory_audit_logs`                                 | ✅    | ✅ کامل تست شد: delete→pending_approval→approve→ردیف واقعاً حذف شد؛ delete→reject→ردیف دست‌نخورده موند؛ `GET /memory/approvals` هم لیست pending رو درست برگردوند                                           |

**تصمیم‌های طراحی مهم (مستند در کد، نه فقط اینجا):**

- Layer 5 عمداً از bulk reindex/export/graph-auto-delete مستثنی است — چون
  scoping آن (organization_id + user_id) با ساختار جاب‌های سازمانی‌محور و
  filter عمومی approval flow جور نیست؛ narrowing scope به‌جای force-fit کردن
  یک راه‌حل نیم‌بند.
- `POST /memory/approvals/:id/approve` عمداً گراف Neo4j را پاک نمی‌کند — یک
  ردیف حافظه و node/edgeهای گراف کنارش (از طریق `context.graph_nodes/edges`
  زمان write) با FK سخت به هم وصل نیستند، پس silently حذف گراف نامرتبط از
  اینجا ریسکش از نبودنش بیشتره.
- `graph_updated` فقط وقتی `true` است که caller صریحاً `context.graph_nodes`/`graph_edges`
  بفرستد — هیچ pipeline استخراج entity/NLP خودکاری در این کدبیس نیست یا ساخته نشد.

**زیرساخت local dev/test:** دو container اختصاصی جدید (نه container مشترک
Runtime/Control-Plane) — `pgvector/pgvector:pg16` روی پورت `5532` و
`neo4j:5-community` روی پورت `7687` — دقیقاً طبق قرارداد
`apps/openon4net-runtime/ONBOARDING.md`. (container Postgres مشترک قدیمی
`postgresdb`، که Runtime هم ازش استفاده می‌کنه، `postgres:13.4` ساده است و
اصلاً پکیج pgvector رو نداره — برای این کار مناسب نبود.)

### باقی‌مانده

- CI (`apps/openon4net-memory/.github/workflows/ci.yml`) بازنویسی شده (الگوی
  checkout-parent+overlay مثل Runtime، سرویس‌های `pgvector/pgvector:pg16`+`neo4j:5-community`)
  ولی push/اجرای واقعی روی GitHub Actions هنوز نشده.
- BYOK managed-provider واقعی (کلید سمت مشتری، نه فقط envelope encryption با
  کلید سرویس) ساخته نشده — خارج از scope این پاس.

---

## Memory (Plane 3) — MEM-014..MEM-018 (2026-07-12، تکمیل «فاز ۱: Memory» تا ۱۰۰٪)

> کاربر پرسید فاز ۱ Memory (`docs/spect/01_ROADMAP/01-roadmap-12-months.md` §۳)
> چند درصد جلو رفته؛ بررسی کدبیس (نه فقط چک‌لیست roadmap) ۵ شکاف واقعی پیدا
> کرد که در `docs/spect/00_VISION/03-memory-engine.md` §۴ (Extractor + Memory
> Ranking) و §۵ (Memory Pruning) مستند بودن ولی هیچ‌کدوم کد نداشتن. کاربر گفت
> «کامل کن» — این بخش همون تکمیل‌کاری است.

| #       | تسک                                                                                                                  | وضعیت | تست                                                                                                                                                                                                                                                                          |
| ------- | -------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MEM-014 | `ClassificationService` ("Extractor") — `layer` در write/import حالا optional، LLM تصمیم می‌گیرد، fallback به لایه ۴ | ✅    | ✅ هر دو مسیر تست شد: بدون `CLASSIFICATION_MODEL` → لایه ۴ (fallback)؛ با مدل واقعی محلی Ollama (`qwen2.5-coder:14b`) → محتوای صریحاً شخصی درست لایه ۵ کلاسیفای شد (اولین اجرا ~۵۳ ثانیه طول کشید — cold load مدل ۱۴ میلیارد پارامتری؛ تایم‌اوت تست به ۹۰ ثانیه افزایش یافت) |
| MEM-015 | Ranking: time decay (`score × 0.5^(ageDays/halfLife)`)                                                               | ✅    | ✅ دو ردیف با محتوا/امتیاز پایه یکسان، سن متفاوت (یکی ۲۰۰ روز عقب‌کشیده‌شده با SQL مستقیم) — ردیف جدیدتر رتبه بالاتر گرفت                                                                                                                                                    |
| MEM-016 | Automatic pruning — `PruneService`، `POST /memory/prune`، `startPruneWorker`                                         | ✅    | ✅ لایه ۴ (مالک‌دار) فقط approval معلق ساخت، ردیف حذف نشد؛ لایه ۶ (بدون مالک) بلافاصله حذف شد                                                                                                                                                                                |
| MEM-017 | Context compression (`max_tokens`، فیلد جدید `truncated` در پاسخ search)                                             | ✅    | ✅ با `max_tokens` کوچک، `truncated: true` و تعداد نتایج کمتر از حالت بدون بودجه                                                                                                                                                                                             |
| MEM-018 | Benchmark script (`scripts/benchmark-search.ts`, `pnpm run benchmark`)                                               | ✅    | ✅ واقعاً اجرا شد روی ۵۰۰ ردیف: p50 0.9ms، p95 1.4ms، p99 12.4ms (مسیر ILIKE fallback) — هدف مستندشده `<200ms` به‌راحتی رد شد                                                                                                                                                |

**تصمیم طراحی مهم (MEM-016):** لایه‌های ۳/۴/۵ هرگز خودکار حذف نمی‌شوند — چون
"review" و "summarize" در جدول retention سند memory-engine §۵ هر دو یعنی
تصمیم انسانی، نه حذف کور. سیگنال قابل‌اتکا برای "پایان پروژه" یا "کاربر
inactive" وجود ندارد، پس سن ردیف فقط تقریب است، نه پیاده‌سازی لفظی آن
trigger ها. خلاصه‌سازی قبل از حذف (لایه‌های ۲/۵ طبق سند) در این پاس ساخته
نشده — یک ساده‌سازی مستندشده، مثل تصمیم قبلی «Layer 5 از bulk reindex/export
مستثنی» در MEM-008..013.

### باقی‌مانده (این بخش)

- مسیر semantic search واقعی benchmark نشده (فقط مسیر ILIKE fallback در
  `scripts/benchmark-search.ts` تست شده — عمداً، چون Ollama را در benchmark
  به‌کار نگرفته تا نتیجه پایدار/تکرارپذیر بمونه).
- خلاصه‌سازی قبل از حذف برای لایه‌های ۲/۵ (طبق retention table) ساخته نشده.

---

## Marketplace (Plane 4) — MKT-002..MKT-006 (2026-07-10، از `docs/spect/TODO-openon4net-marketplace.md`)

> **MKT-017..019 (Skills entity + Plugin config PATCH)** در بخش «Phase 2
> تکمیلی» بالاتر مستند شده، نه اینجا — چون کراس-ریپو بود (Marketplace +
> Runtime + Control Plane با هم).

> برخلاف Memory (که عمداً یک contract-only اسکلت با روت‌های 501 است)، MVP-lite
> برای Plane 4 طبق `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` §5 باید
> واقعاً کار کنه: «private/local install + registry ساده». پس این سرویس از
> اول یک پیاده‌سازی واقعی روی Postgres واقعیه، نه صرفاً یک قرارداد.

| #              | تسک                                                                                                                                                                                                                                                                                                                                                | وضعیت | تست                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------- |
| MKT-001 (بخشی) | اسکلت `service/` (Fastify+TS+pg) داخل ریپوی خودش — بدون ثبت در `pnpm-workspace.yaml` ریشه (اون بخش نیاز به اجازه‌ی جدا داره، هنوز گرفته نشده)                                                                                                                                                                                                      | 🔧    | ✅ `pnpm install --ignore-workspace` + typecheck/build/test/docker همه واقعاً اجرا و سبز شدن (پایین‌تر)                   |
| MKT-002        | migration `0001_marketplace_core.sql`: `publishers`, `plugins`, `plugin_versions` (version/manifest/permissions/pricing/checksum/signature جدا از خود پلاگین)، `plugin_reviews`، `plugin_installs`                                                                                                                                                 | ✅    | ✅ روی `o2n_marketplace` واقعی (همون Postgres instance که Runtime/Control Plane استفاده می‌کنن، دیتابیس جدا) اجرا شد      |
| MKT-003        | `POST/GET /publisher/plugins` (submit با upsert publisher+plugin به‌روش control-plane's `issueActivationKey`، + list با pagination)، `GET /marketplace/plugins` (discovery، عمداً بدون فیلتر روی `status` چون هنوز review pipeline‌ای نیست)، `POST /marketplace/plugins/:id/install` (idempotent — نصب مجدد فقط `is_active` رو دوباره true می‌کنه) | ✅    | ✅ هم ۱۴ تست vitest، هم curl زنده روی سرور واقعی (submit→discover→install→re-install idempotent→404 ناشناخته→400 نامعتبر) |
| MKT-004        | `.github/workflows/ci.yml` (typecheck+test+build، با Postgres service container — عین الگوی control-plane)                                                                                                                                                                                                                                         | 🔧    | فایل نوشته شده، push/اجرای واقعی روی GitHub Actions نشده (همون سطح CP-002 قبل تأیید — فقط این یکی حتی push هم نشده)       |
| MKT-005        | `Dockerfile.service` + `.dockerignore` + `docker-compose.yml`                                                                                                                                                                                                                                                                                      | ✅    | ✅ `docker compose build` + `docker compose up` واقعی، `curl /health` از داخل container جواب داد                          |
| MKT-006        | تست‌های vitest سطح service (نه route/HTTP) برای publisher-service و marketplace-service — submit/upsert/conflict/list/discover/install/idempotency/404، مطابق قرارداد تست‌محور control-plane (فقط service-level، نه supertest)                                                                                                                     | ✅    | ✅ ۱۴/۱۴ روی DB واقعی                                                                                                     |

**نکته‌ی جانبی مهم (باگ واقعی پیدا و فیکس شد، نه صرفاً کد نوشتن):** اولین نسخه‌ی
`service/tsconfig.json` از الگوی Memory کپی شده بود (`extends:
"../../../tsconfig.base.json"`، یعنی وابسته به فایل ریشه‌ی مونوریپو). روی هاست
(داخل کل درخت ریپو) کار می‌کرد، ولی چون `Dockerfile.service`ی خودِ همین تسک
build context رو فقط به `apps/openon4net-marketplace/` محدود می‌کنه (بدون
پدر مونوریپو)، `docker compose build` واقعاً fail شد: `TS5083: Cannot read
file '/tsconfig.base.json'`، به همراه یک عالمه خطای type دیگه چون بدون
`extends` تنظیماتی مثل `esModuleInterop`/`target` هم گم می‌شدن. **این یعنی
همین باگ همین الان توی Memory هم هست** (چون MEM-001 هنوز اجرا نشده، هیچ‌کس
تا حالا `docker compose build` روش امتحان نکرده) — فیکس اینجا: عین
control-plane's gateway/tsconfig.json، تمام compilerOptions رو inline کردم
به‌جای extends. اگه یه وقت MEM-001/Memory Docker انجام شد، همین فیکس اونجا
هم لازمه.

**دیتابیس:** `o2n_marketplace` روی همون Postgres instance محلی (`localhost:5532`)
که Runtime ازش استفاده می‌کنه ساخته شد (با `TEMPLATE template0`، عین همون
دور زدن collation-mismatch که CP-001 مستند کرده بود).

### باقی‌مانده

- MKT-001 (ثبت در `pnpm-workspace.yaml` ریشه): عمداً انجام نشد — نیاز به اجازه‌ی جدا داره (فایل ریشه). فعلاً `pnpm install --ignore-workspace` جایگزینشه برای dev/test محلی.
- MKT-004 هنوز push/اجرای واقعی روی GitHub Actions نشده.
- بخش B (MKT-007..011) از ۲۰۲۶-۰۷-۱۵ کامل شد — پایین‌تر ببینید. بخش C (public marketplace واقعی، SAST، KYC/PKI سخت‌گیرانه، payout واقعی) هنوز طبق guardrail عمداً شروع نشده.

---

## بازبینی وضعیت — Control Plane + Memory + Marketplace (۲۰۲۶-۰۷-۱۵)

> بعد از تکمیل روadmap Runtime تا فاز ۵، کاربر پرسید سه پلن دیگه (Control
> Plane, Memory, Marketplace) چی مونده. تحقیق با ۳ ایجنت Explore موازی یه
> الگوی مهم رو نشون داد که چند بار دیگه هم این جلسه دیده شده بود: **بیشتر
> کارهای «باقی‌مونده» از قبل ساخته و کامیت شده بودن، فقط فایل‌های TODO
> ریشه هیچ‌وقت به‌روز نشده بودن.** بعد از spot-check مستقیم کد (نه فقط
> اعتماد به گزارش ایجنت)، این‌ها تأیید شد:

### Control Plane — CP-006, CP-007, CP-015..CP-018

همه‌شون از قبل توی کامیت `daa0d0b` (۲۰۲۶-۰۷-۱۴، ریپوی خودِ control-plane)
پیاده‌سازی شده بودن. امروز با curl واقعی روی یک instance در حال اجرا
دوباره تأیید شد (نه فقط خوندن کد):

- `/health` → ۲۰۰، `/metrics` → خروجی واقعی Prometheus.
- `GET /admin/organizations/not-a-uuid` → ۴۰۰ `VALIDATION_ERROR` (نه ۵۰۰ —
  CP-015's باگ واقعاً فیکس شده).
- CORS: preflight از یک origin غیرمجاز هیچ `Access-Control-Allow-Origin`
  نمی‌گیره؛ از `localhost:3300` (مقدار پیش‌فرض `WEB_ORIGIN`) می‌گیره.

جزئیات کامل هر آیتم در `docs/spect/TODO-openon4net-platform.md`.
CP-002 (تعامل واقعی مرورگر) همچنان ❌ مونده — تعامل کلیک‌کردن روی فرم در
مرورگر کاری نیست که این session بتونه انجام بده (ابزار مرورگر نداره)؛
smoke test سطح HTTP جایگزینش شد، نه معادلش.

### Marketplace — MKT-007..011

MKT-007 (auth)، MKT-008 (trace_id)، MKT-009 (checksum)، MKT-010
(permission diff) از قبل پیاده و کامیت شده بودن (`plugins/auth.ts`,
`plugins/trace-id.ts`, `lib/artifact-storage.ts`'s `verifyChecksum()`,
`services/marketplace-service.ts`'s `PermissionDiffRequiredError`).

**MKT-011 واقعاً کار جدید بود:** `API.md` قبلاً فقط plugin routes رو
پوشش می‌داد، صفر اشاره به skill. بخش‌های جدید اضافه شد — همه با پاسخ
واقعی گرفته‌شده از سرویس در حال اجرا (submit skill، list، discovery،
install، rate برای هر دو plugin/skill، و `PATCH
/marketplace/installs/:id/config`). حین تست زنده، یه بار `ECONNRESET`
واقعی از Postgres گرفتیم — نه باگ کد، Docker Desktop روی این ماشین موقتاً
unstable شده بود (بین راه‌اندازی container های memory/control-plane)؛
بعد از پایدار شدن Docker همه‌ی روت‌ها با retry واقعاً سبز شدن.

### Memory — MEM-005, MEM-006

هر دو از قبل نوشته شده **و در `app.ts` وایر شده بودن** — برخلاف چیزی که
عبارت «اجرای واقعی نشده» ممکنه القا کنه، این یک «نوشته شده ولی وصل نشده»
نبود. امروز واقعاً روی یک instance زنده (Postgres + Neo4j واقعی، از قبل
متوقف بودن، دوباره `docker start` شدن) تأیید شد:

- بدون `Authorization` → ۴۰۱؛ کلید غلط → ۴۰۱؛ کلید درست بدون
  `X-Organization-Id` → ۴۰۰؛ درخواست کامل معتبر → ۲۰۰.
- `X-Trace-Id: my-custom-trace-id-123` دقیقاً همون رو در پاسخ echo کرد؛
  بدون فرستادن هدر، یک UUID تازه mint و برگردوند.
- هیچ باگی پیدا نشد — کد دقیقاً همون‌طوری کار کرد که نوشته شده بود.

### نکته‌ی جانبی (نه مرتبط به کد)

حین این کار، یک auto-commit process از قبل روی دستگاه کاربر (نه این
session) پیدا شد که هر چند روز یک‌بار پوشه‌ی build-output
`web/.next` رو توی ریپوی control-plane کامیت/پوش می‌کنه (با وجود
`.gitignore`). کاربر تأیید کرد این عمدیه و مال خودشه — دست‌نخورده موند.

---

## اکوسیستم Plugin — جلسه ۴ (۲۰۲۶-۰۷-۱۶، از `06_MEETINGS/04-plugin-ecosystem-architecture.md`)

کاربر شب قبل (۲۰۲۶-۰۷-۱۵ به ۰۷-۱۶) خواست بدون سوال بیشتر، این batch به‌طور
خودکار جلو بره؛ هر تسک با commit جدا ثبت می‌شه. RT-078 (اجرای مستقیم پلاگین
ایجنت‌ساز) عمداً کنار گذاشته شد چون به CP-012 (که هنوز ساخته نشده) بلاک است.

### MKT-024 — دسته‌بندی (category) برای Plugin

✅ انجام شد — migration `0006_plugin_categories.sql` (ستون `plugins.category`

- `CHECK` روی یک تاکسونومی ثابت هفت‌تایی: `communication`/`productivity`/
  `data-analytics`/`devops`/`ai-ml`/`finance`/`other` + ایندکس). `submitPlugin`
  مقدار `category` رو می‌گیره (اختیاری؛ در نسخه‌ی بعدی همون پلاگین اگه فرستاده
  نشه، مقدار قبلی دست‌نخورده می‌مونه — `COALESCE`). `listMarketplacePlugins`/
  `getMarketplacePlugin` مقدار رو برمی‌گردونن؛ `GET /marketplace/plugins` یک
  query param جدید `category` قبول می‌کنه. ۲ تست vitest جدید روی Postgres
  واقعی (فیلتر درست کار می‌کنه، مقدار خارج از تاکسونومی رد می‌شه). مستندسازی
  در `API.md`.

**یک باگ واقعی پیدا و فیکس شد حین این کار:** اول پارامتر فیلتر category رو
به `$4` مپ کرده بودم درحالی‌که query متن SQL فقط `$1` و `$4` رو ارجاع
می‌داد (بدون `$2`/`$3`) — Postgres با خطای «could not determine data type of
parameter $2» رد می‌کرد چون پارامترهای وسط هیچ‌جای متن کوئری ظاهر نمی‌شدن.
فیکس: شماره‌گذاری پیوسته (`$1`=search، `$2`=category، `$3`=limit، `$4`=offset)
بدون شکاف. همه‌ی ۷۹ تست سرویس (نه فقط تست‌های جدید) بعد از فیکس سبز شدن.

### RT-080 — Per-agent Plugin grants

✅ انجام شد — migration `0024_plugin_grants.sql` (`agent_plugin_grants`، عیناً
مثل `agent_skill_grants`، ولی `plugin_id` یک cross-plane reference بدون FK
است چون Plugin هیچ ردیف محلی در Runtime نداره — نصب فقط توی Marketplace
ثبت می‌شه، نه یک mirror محلی مثل Skills). `PluginGrantService` (`grant`/
`revoke`/`hasGrant`/`listForAgent`) + سه route جدید: `POST`/`DELETE
/v1/agents/:id/plugins/:pluginId/grant` و `GET /v1/agents/:id/plugins`.
چون هیچ جدول محلی برای اعتبارسنجی وجود Plugin نیست، قبل از grant دادن،
`marketplaceClient.getPlugin()` صدا زده می‌شه (همون الگوی موجود در
`routes/marketplace.ts`) تا واقعاً وجود پلاگین رو از Marketplace بپرسه.
Permission جدید `plugins:*` به seed پیش‌فرض admin اضافه شد
(`packages/governance/src/permissions.ts`). ۴ تست vitest جدید
(`plugin-grant-service.test.ts`) روی Postgres واقعی.

**یک باگ واقعی پیدا و فیکس شد حین این کار (همون کلاس باگ workflows/
webhook_endpoints قبلی):** `agent_plugin_grants.granted_by_user_id` هیچ
`ON DELETE CASCADE` نداره، و `cleanupTestFixture()` قبل از این batch
`users` رو قبل از حذف grantها پاک می‌کرد → FK violation. فیکس: یک
`DELETE FROM agent_plugin_grants WHERE agent_id IN (...)` قبل از
`DELETE FROM users` در `test-support/fixtures.ts` اضافه شد.

**محدودیت شناخته‌شده، نه فراموش‌شده:** این batch فقط CRUD گرنت رو ساخت —
هنوز هیچ نقطه‌ی enforcement واقعی (چک `hasGrant` هنگام اجرا) وجود نداره،
چون هیچ execution engine برای Pluginها نیست (طبق تصمیم جلسه ۴). این چک
قراره وقتی RT-079 (اولین مسیر واقعی اجرای Plugin — نوع HTTP-provider)
ساخته شد، به اون dispatch path وصل بشه.

### MKT-025 — Sandbox test-gate پیش از انتشار

✅ انجام شد — `sandbox-service.ts`'s `runSandboxTest()`، و کشف مهم حین این
کار: ستون `plugins.status` (`draft`/`listed`/`delisted`) از زمان migration
0001 اصلاً به هیچ منطقی وصل نبود — نه discovery روش فیلتر می‌کرد، نه هیچ
کدی مقدارش رو تغییر می‌داد (schema مرده). این batch واقعاً وصلش کرد:

- `submitPlugin()`: بعد از هر submit، همون automated permission-allowlist
  check (MKT-013) این‌بار در سطح Plugin هم اجرا می‌شه → `listed` یا
  `sandbox_rejected`. هیچ‌وقت یک Plugin از قبل `listed` رو به خاطر یک
  نسخه‌ی جدید ناموفق پایین نمی‌کشه — فقط همون نسخه در حالت `submitted`
  می‌مونه (منتظر بازبینی دستی).
- `reviewPluginVersion()`: وقتی یک انسان دستی یک نسخه رو `approved` می‌کنه،
  Pluginاش هم به `listed` تغییر می‌کنه (اگه از قبل نبود).
- `listMarketplacePlugins`: حالا `AND p.status = 'listed'` هم فیلتر
  می‌کنه — این چیزیه که واقعاً «قابل عرضه در فروشگاه» رو معنا می‌ده.
  عمداً `getMarketplacePlugin` (تک‌آیتمی، مصرف‌شده توسط RT-057 برای قیمت
  پیش از نصب) گیت نشد — نصب مستقیم با id هنوز کار می‌کنه حتی قبل از
  sandbox-test، هم‌راستا با تصمیم «self-hosted می‌تونه مستقیم نصب/استفاده
  کنه، فقط برای فروش در فروشگاه نیاز به sandbox داره».
- `POST /admin/plugins/:id/sandbox-test` — اجرای دستی/دوباره (مثلاً بعد
  از تغییر بدون نسخه‌ی جدید).

**محدودیت صادقانه، مستندشده:** این یک WASM/dynamic sandbox واقعی نیست
(Level 2 در `09-plugin-sandbox.md` عمداً معلقه) — همون چک‌های استاتیک
موجود (allowlist مجوز + checksum) رو، این‌بار در سطح Plugin و پیش از
انتشار عمومی، اجرا می‌کنه.

۶ تست vitest جدید (`sandbox-service.test.ts`) روی Postgres واقعی، بدون
شکستن هیچ‌کدوم از ۷۹ تست موجود. یک تست ناپایدار (`kill switch`) در یک اجرا
دیده شد که ربطی به این batch نداشت — race قدیمی روی ردیف مشترک
`platform_settings` بین فایل‌های تست موازی؛ در اجرای بعدی سبز شد.

### MKT-026 — تأیید مدل رایگان/فروشی یکسان برای Skill (ADR-012)

✅ **verification only، هیچ کد جدیدی لازم نشد** — بررسی مستقیم کد نشون داد
این قبلاً کامل و کاملاً موازی با Plugin پیاده‌سازی شده بود:

- `marketplace_skills.price_cents` (migration `0003_marketplace_skills.sql`)
  واقعاً settable روی submit است (`publisher-skill-service.ts`'s
  `input.priceCents ?? 0`).
- `listMarketplaceSkills`/`getMarketplaceSkill` مقدار رو در discovery/
  single-lookup برمی‌گردونن (`marketplace-skill-service.ts`).
- Runtime's `POST /v1/marketplace/skills/:id/install`
  (`gateway/src/routes/marketplace.ts:91-125`) دقیقاً همون الگوی
  debit-before-install رو داره که Plugin install داره (کامنت خود کد:
  _"RT-057: same debit-before-install ordering as the plugin route
  above"_) — `WalletService.debit()` قبل از نصب صدا زده می‌شه اگه
  `priceCents > 0`.
- ADR-012's activation-gating (`ctx.activationState.isActivated()`) هم
  دقیقاً به همون شکل، قبل از هر دو نوع نصب (Plugin و Skill)، چک می‌شه.

**یک محدودیت شناخته‌شده (نه جدید، نه چیزی که این verification تغییرش داد):**
هیچ route-level test برای `routes/marketplace.ts` وجود نداره — نه برای
مسیر پولی Plugin، نه Skill (فقط `marketplace-client.test.ts` هست که
سطح HTTP-client رو تست می‌کنه، نه route handler رو). این یک gap
از قبل موجود در کل فایل بوده، نه چیزی که این batch ایجاد کرده باشه.

### RT-079 — نوع step جدید `plugin` در Workflow Engine (اولین مسیر واقعی اجرای Plugin)

✅ انجام شد — اولین باری که نصب یک Plugin واقعاً باعث اجرای چیزی می‌شه، نه
فقط ثبت DB. طبق تصمیم جلسه ۴، محدود به Pluginهای «thin HTTP-provider»
(همون چیزی که سند sandbox عمداً معلق نگه داشته رو، یعنی اجرای کد دلخواه،
دور می‌زنه — بدون نیاز به WASM sandbox):

- `packages/shared/src/schemas/workflow.ts`: `WorkflowPluginStepSchema`
  جدید (`type: 'plugin'`, `pluginId`, `agentRole`, `params`) — کنار
  ۵ نوع step موجود (`agent`/`tool`/`human`/`parallel`/`condition`).
  `agentRole` (نه `agentId` ثابت) عیناً مثل `WorkflowAgentStepSchema` —
  در زمان اجرا resolve می‌شه.
- `marketplace-client.ts`: نوع `manifest` گسترش یافت تا
  `provider?: {type: 'http', baseUrl: string}` رو بشناسه.
- `connectors/plugin-provider-connector.ts` (جدید): `invokePluginProvider()`
  — عیناً همون SSRF guard `webhook-send` (`assertSafeWebhookUrl`، بازاستفاده
  نه بازنویسی) رو قبل از هر فراخوانی اجرا می‌کنه.
- `services/plugin-invoker.ts` (جدید): `executePluginStep()` — سه چک به
  ترتیب: (۱) پلاگین در Marketplace وجود داره، (۲) **اولین enforcement
  واقعی RT-080** — `PluginGrantService.hasGrant(agentId, pluginId)`، اگه
  نه → `PermissionDeniedError`، (۳) manifest واقعاً `provider.type: 'http'`
  رو declare کرده، وگرنه `ValidationError`.
- `workflow-executor.ts`'s `runStep()`: نوع `plugin` رو مثل نوع `agent`
  با `AgentService.findByRole()` resolve می‌کنه، بعد `executePluginStep`
  رو صدا می‌زنه.

**عمداً خارج از scope این batch:** Skills هنوز این step type رو ندارن
(RT-079 صریحاً فقط Workflow Engine بود، طبق متن ثبت‌شده‌ی تسک) — گسترش به
Skill step types یک تسک جدا می‌مونه اگه لازم شد. هیچ تغییری در UI
(`web/app/workflows/page.tsx`) هم داده نشد — این batch فقط سطح Engine بود.

۴ تست جدید (`plugin-invoker.test.ts`) + ۲ تست جدید در
`workflow-executor.test.ts` (مسیر موفق با provider واقعی خارجی
`postman-echo.com` چون SSRF guard آدرس‌های loopback/local رو رد می‌کنه —
همون محدودیتی که تست‌های `webhook-send` موجود هم داشتن؛ و مسیر بدون grant
که باید کل run رو fail کنه). همه‌ی ۱۵۶ تست موجود (نه فقط جدیدها) سبز
موندن؛ typecheck/lint هر دو تمیز.

### RT-076 — Per-plugin DB isolation (schema/namespace جدا)

✅ انجام شد — تصمیم جلسه ۴: schema/namespace جدا داخل Postgres مشترک، نه
container/deployment مجزا (بدون orchestration جدید). چون مدل اجرای واقعی
که ساخته شد (RT-079) یک HTTP-provider بیرونی و stateless است — نه کد
درون‌فرآیندی که بشه یک شیء memory زنده بهش داد — persistence از طریق خودِ
درخواست/پاسخ threading شد، نه یک callback API جدید (که نیاز به یک مدل auth
تازه برای پلاگین داشت):

- `services/plugin-schema-service.ts` (جدید): `PluginSchemaService` —
  `schemaName(orgId, pluginId)` یک نام قطعی از هش sha256 (فقط
  `[0-9a-f]`، بدون سطح injection چون هیچ متن خام کاربر مستقیم وارد SQL
  نمی‌شه)، `ensureSchema()` (`CREATE SCHEMA` + یک جدول `kv` ساده)،
  `readAll`/`writeAll` (key-value، JSONB، upsert).
- `plugin-invoker.ts`'s `executePluginStep()`: قبل از فراخوانی provider،
  state قبلی این جفت (org, plugin) به‌عنوان `_state` به params اضافه
  می‌شه؛ اگه پاسخ provider خودش یک فیلد `_state` (object) داشته باشه،
  همون ذخیره می‌شه. امضای تابع یک پارامتر `organizationId` جدید گرفت.

**محدودیت صادقانه، مستندشده:** نیمه‌ی «ارسال state قبلی در درخواست» با
provider واقعی خارجی (`postman-echo.com`) end-to-end تست شده. نیمه‌ی
«ذخیره‌ی state برگشتی از پاسخ provider» فقط از طریق تست مستقیم
`PluginSchemaService` تأیید شده، نه یک پاسخ HTTP زنده — چون SSRF guard
(به‌درستی) اجازه‌ی سرور تست محلی رو نمی‌ده، و هیچ سرویس خارجی واقعی‌ای
در دسترس نبود که بشه پاسخ JSON دلخواه ازش گرفت با یک فیلد `_state` در
ریشه‌ی پاسخ.

۵ تست جدید (`plugin-schema-service.test.ts`: provisioning، round-trip،
upsert، ایزولیشن کامل بین org/plugin مختلف، حالت خالی) + ۱ تست جدید در
`plugin-invoker.test.ts` (ارسال state قبلی) + بروزرسانی ۲ assertion موجود
(چون خروجی حالا `_state` هم داره). همه‌ی ۱۶۲ تست موجود سبز؛ typecheck/lint
تمیز.

### RT-077 — مسیر نصب self-hosted محلی برای Plugin (بدون نیاز به Marketplace)

✅ انجام شد — آخرین تسک ثبت‌شده‌ی جلسه ۴ (RT-078 همچنان بلاک روی CP-012
می‌مونه، طبق تصمیم صریح). طبق چشم‌انداز کاربر: «پلاگین‌ها حتماً نیاز نیست
از مارکت‌پلیس نصب بشن — کاربر self-hosted می‌تونه پلاگین خودش رو بسازه و
مستقیم استفاده کنه»:

- migration `0025_local_plugins.sql` (جدید) — جدول `local_plugins`،
  کاملاً org-scoped، بدون هیچ رابطه‌ای با Marketplace (نه publisher، نه
  submit/review/sandbox pipeline — اون مسیر فقط برای «فروش» لازمه، طبق
  MKT-025).
- `services/local-plugin-service.ts` (جدید): `LocalPluginService`
  (`create`/`list`/`getById`/`delete`، همه org-scoped — حتی با حدس id،
  یک پلاگین سازمان دیگه هیچ‌وقت resolve نمی‌شه).
- `routes/local-plugins.ts` (جدید): `POST`/`GET /v1/plugins`،
  `GET`/`DELETE /v1/plugins/:id` — با همون permission موجود `plugins:*`.
- **نقطه‌ی کلیدی wiring:** `plugin-invoker.ts`'s `executePluginStep()` و
  `routes/plugin-grants.ts` هر دو حالا اول رجیستری محلی رو چک می‌کنن،
  بعد در صورت نبودن، می‌رن سراغ Marketplace — و این چک محلی هیچ‌وقت به
  `MARKETPLACE_SERVICE_URL` نیاز نداره (یک deployment کاملاً self-hosted
  بدون هیچ اتصالی به Marketplace باید بتونه پلاگین‌های خودش رو کامل اجرا
  کنه).
- تاکسونومی category (`local-plugin-categories.ts`) عیناً همون هفت‌تایی
  MKT-024 در Marketplace — یک مفهوم دسته‌بندی مشترک در کل اکوسیستم.

**یک باگ واقعی پیدا و فیکس شد حین این کار (همون کلاس باگ‌های قبلی):**
`local_plugins.created_by_user_id` هم `ON DELETE CASCADE` نداشت —
`cleanupTestFixture()` فیکس شد (اضافه شدن یک `DELETE FROM local_plugins`
قبل از `users`، چهارمین مورد از این کلاس باگ در همین batch).

۵ تست جدید (`local-plugin-service.test.ts`: CRUD، ایزولیشن سازمانی کامل،
delete هم org-scoped) + ۲ تست جدید در `plugin-invoker.test.ts` (اجرای
واقعی یک پلاگین محلی بدون هیچ Marketplace server ای؛ و پلاگین سازمان A
برای سازمان B نامرئیه، درست fallback می‌کنه به Marketplace و اونجا هم
404 می‌شه). همه‌ی ۱۶۷ تست موجود سبز؛ typecheck/lint تمیز.

---

## مدل ثبت‌نام self-service + activation شخصی/سازمانی — جلسه ۵ (۲۰۲۶-۰۷-۱۷، از `06_MEETINGS/05-self-service-signup-and-activation-model.md`)

کاربر شب قبل ("همه را انجام بده") دستور صریح داد این ۱۰ تسک (CP-025..031،
RT-081..083) بدون سوال بیشتر ساخته بشه، طبق ترتیب وابستگی مستندشده.

### CP-025 — ثبت‌نام self-service (Control Plane تا امروز اصلاً `users` نداشت)

✅ انجام شد — اولین سیستم احراز هویت واقعی Control Plane، عیناً همون
معماری اثبات‌شده‌ی Runtime (argon2 + JWT + مگ‌لینک هش‌شده) رو بازاستفاده
کرد، نه یک طراحی جدید:

- migration `0002_users.sql` (جدید): جدول `users` (بسیار ساده‌تر از
  Runtime — بدون org/workspace/role، چون یک «کاربر Control Plane» فقط
  صاحب‌حسابیه که activation key خودش رو صادر می‌کنه، نه عضو یک سازمان) +
  `email_verification_tokens` (همون الگوی hash-only token).
- `services/user-service.ts` (جدید) + `services/auth-service.ts` (جدید):
  `signup()` (argon2 hash + امیل تأیید ۲۴ساعته، SMTP اختیاری — بدون
  SMTP هم کار می‌کنه، فقط ایمیل نمی‌ره)، `verifyEmail()`، `login()`
  (فقط با ایمیل تأییدشده)، `verifySessionToken()`.
- `routes/auth.ts` (جدید): `POST /auth/signup`، `POST /auth/verify-email`،
  `POST /auth/login`، `GET /auth/me` (نمونه‌ی route محافظت‌شده با session).
- `lib/require-session.ts` (جدید): چک Bearer JWT، جدا از
  `requireAdminAuth` موجود (دو قلمرو auth کاملاً جدا — ادمین در مقابل
  کاربر self-service).
- وابستگی‌های جدید: `@node-rs/argon2`، `jsonwebtoken`، `nodemailer` (سه‌تا
  دقیقاً همونایی که Runtime قبلاً استفاده می‌کنه).
- Web UI: `/signup`، `/verify-email` (با Suspense boundary — Next.js 15
  برای `useSearchParams` لازمش داره)، `/login`، `/account` (placeholder —
  مدیریت activation key سمت CP-026 میاد اینجا).

**تست:** ۸ تست جدید (`auth-service.test.ts`) — شامل یک تست end-to-end
واقعی که یک SMTP server محلی واقعی (پکیج `smtp-server`، نه mock) رو
راه‌انداخت، ایمیل واقعی رو از nodemailer گرفت، توکن رو از بدنه‌ی ایمیل
استخراج کرد (بعد از حل یک مشکل واقعی: نودمیلر خط‌های طولانی رو
quoted-printable با `=\r\n` soft-wrap می‌کنه، و توکن ۶۴کاراکتری دقیقاً
وسط wrap می‌افتاد — رفع شد با unwrap کردن قبل از regex match)، verify
کرد، و کل چرخه‌ی signup→verify→login→session را واقعی تأیید کرد. ۵ تست
جدید `api-client.test.ts` (جدا بودن session token از admin key). یک
smoke-test دستی هم روی سرور واقعی (`pnpm dev` + curl) اجرا شد: signup،
رد login قبل از verify، verify (با UPDATE مستقیم DB چون SMTP محلی
پیکربندی نشده بود)، login موفق، `GET /auth/me` با token واقعی، و رد
دسترسی بدون token/با token غلط. همه‌ی ۴۱ تست gateway + ۱۵ تست web سبز؛
typecheck/lint هر دو تمیز.

**محدودیت شناخته‌شده:** بدون rate-limit روی SMTP نبود (فقط login خودش
rate-limit شد، با همون in-memory limiter موجود CP-007 — نه Redis). بدون
مسیر «resend verification» — اگه ایمیل اول گم بشه، راهی برای درخواست
دوباره نیست؛ یک gap مستندشده، نه فراموش‌شده.

### CP-030 — Revoke/expire واقعی برای activation key

✅ انجام شد — قبلاً `status`/`expires_at` توی schema بودن ولی هیچ کدی
هیچ‌وقت تغییرشون نمی‌داد؛ یک کلید صادرشده عملاً برای همیشه فعال می‌موند:

- `services/activation-service.ts`'s `authenticateActivationKey()`:
  انقضا **lazy**، دقیقاً لحظه‌ی استفاده چک می‌شه — نه یک scheduler جدید
  (Control Plane برخلاف Runtime هیچ `*-scheduler.ts` نداره؛ ساخت یکی
  فقط برای این، بیش‌ازحد بود). اگه `expires_at` گذشته باشه و status هنوز
  `active` باشه، همون لحظه به `expired` تغییر می‌کنه و رد می‌شه.
- `revokeActivationKey()` (جدید) + `POST /admin/activation-keys/:id/revoke`
  (جدید، فقط اپراتور): نیمه‌ی دستی enforcement. Idempotent نیست عمداً —
  لغو یک کلید از‌قبل‌لغوشده `NotFoundError` می‌ده، نه یک no-op ساکت.

۵ تست جدید (`activation-service.test.ts`): revoke واقعاً بلاک می‌کنه،
لغو دوباره خطا می‌ده، لغو id ناشناس خطا می‌ده، کلید منقضی‌شده رد و
`expired` می‌شه، کلید با انقضای آینده عادی کار می‌کنه. همه‌ی ۴۶ تست
gateway سبز؛ typecheck/lint/build هر سه تمیز.

### CP-026 — نوع شخصی/سازمانی + سقف ۵ کد + سقف seat برای activation key

✅ انجام شد — مسیر صدور self-service جدا از مسیر ادمین موجود
(`/admin/activation-keys`):

- migration `0003_activation_type_and_seats.sql`: `activation_keys.type`
  (`personal`|`organizational`, پیش‌فرض `organizational` برای مسیر ادمین
  قدیمی) + `activation_keys.created_by_user_id` + `organizations.max_users`
  (NULL = بی‌سقف — فقط مسیر self-service مقدارش می‌ده).
- `services/activation-service.ts`: `issueSelfServiceActivationKey()`
  (سقف ۵ کد به‌ازای هر کاربر — عمری، نه فقط کلیدهای فعال؛ `personal` →
  `maxUsers=1`، `organizational` → `maxUsers=3` پیش‌فرض)، `listActivationKeysForUser()`،
  `revokeOwnActivationKey()` (فقط کلید خودِ کاربر، حتی با حدسِ id قابل
  لغوکردن کلید دیگری نیست). `checkIn()`/`CheckInResult` حالا
  `activationType`/`maxUsers` رو هم برمی‌گردونن — این چیزیه که RT-081
  می‌خونه.
- `routes/self-service-activation.ts` (جدید): `POST`/`GET /v1/activation-keys`،
  `POST /v1/activation-keys/:id/revoke` — همه پشت `requireSession` (نه
  admin auth).
- Web: `/account` از یک placeholder به یک صفحه‌ی واقعی مدیریت activation
  key تبدیل شد (فرم صدور با انتخاب نوع، جدول کلیدها، دکمه لغو).

**۲ باگ واقعی پیدا و فیکس شد حین این کار:**
۱) migration های `0002`/`0003` بدون `IF NOT EXISTS`/`DO $$` guard نوشته
شده بودن — چون اسکریپت migrate این ریپو (برخلاف Runtime) هیچ جدول
tracking نداره و هر بار همه‌ی فایل‌ها رو دوباره اجرا می‌کنه (idempotent
بودن خودِ SQL تنها تضمینه)، دومین اجرا با `relation already exists` fail
می‌شد. فیکس شد با `IF NOT EXISTS` روی جدول‌ها/ایندکس‌ها و یک `DO $$` guard
برای constraint (که Postgres اصلاً `ADD CONSTRAINT IF NOT EXISTS` نداره).
۲) `routes/activation.ts`'s `POST /activation/check-in` مقادیر جدید
`activationType`/`maxUsers` رو از `checkIn()` می‌گرفت ولی هیچ‌وقت توی
پاسخ HTTP برنمی‌گردوند — تست‌های سطح-service این رو نمی‌دیدن چون فقط
تابع `checkIn()` رو مستقیم صدا می‌زدن، نه route رو. با یک smoke-test
واقعی روی سرور در حال اجرا (`pnpm dev` + curl با هدر Bearer درست) پیدا
و فیکس شد.

۹ تست جدید (`self-service-activation.test.ts`). یک smoke-test کامل روی
سرور واقعی: signup→verify→login→صدور کلید شخصی→صدور کلید سازمانی→لیست→
check-in واقعی (با `activationType`/`maxUsers` صحیح در پاسخ)→revoke.
همه‌ی ۵۵ تست gateway + ۱۸ تست web سبز؛ typecheck/lint/build هر سه (هم
gateway هم web) تمیز.

### CP-029 — قفل IP/دامنه برای activation key سازمانی

✅ انجام شد — طبق پیشنهاد خود کاربر: موقع صدور کلید سازمانی، یک IP
استاتیک یا دامنه اختیاری گرفته می‌شه؛ هر check-in بعدی IP مبدأ درخواست
رو باهاش مقایسه می‌کنه:

- migration `0004_bound_host.sql`: `activation_keys.bound_host` — فقط
  برای نوع `organizational`، اختیاری (NULL = بدون قفل، رفتار قبلی
  دست‌نخورده می‌مونه). کلیدهای شخصی هیچ‌وقت این ستون رو استفاده نمی‌کنن
  (تصمیم جلسه ۵).
- `lib/bound-host.ts` (جدید): `hostMatchesCallerIp()` — اگه `boundHost`
  یک IP باشه مقایسه مستقیم، اگه دامنه باشه هر بار DNS resolve می‌شه (نه
  یک snapshot قدیمی، پس تغییر DNS مشتری نیاز به صدور کلید جدید نداره).
  خطای DNS resolution = fail-closed (رد، نه قبول).
- `authenticateActivationKey()`/`checkIn()` یک پارامتر اختیاری `callerIp`
  گرفتن — فقط وقتی هم `callerIp` هم `bound_host` مقدار داشته باشن قفل
  فعال می‌شه؛ همه‌ی فراخوانی‌های قبلی (بدون این پارامتر) دست‌نخورده کار
  می‌کنن.
- `routes/activation.ts` حالا `request.ip` رو به `checkIn()` می‌ده.
- Self-service: `PATCH /v1/activation-keys/:id/bound-host` (جدید) —
  چون IP/دامنه‌ی واقعی مشتری می‌تونه عوض بشه، بدون نیاز به صدور دوباره‌ی
  کلید قابل‌ویرایشه. صفحه‌ی `/account` هم آپدیت شد (فیلد اختیاری در فرم
  صدور + ستون «Locked to» با امکان ویرایش در جدول).

۶ تست جدید (`bound-host.test.ts`: IP دقیق، عدم‌تطابق، IPv4-mapped-IPv6،
resolve واقعی دامنه — با `localhost` به‌جای mock، fail-closed روی دامنه‌ی
غیرقابل‌resolve) + ۵ تست جدید در `activation-service.test.ts` (بدون قفل
از هر IP کار می‌کنه، قفل با IP درست کار می‌کنه، قفل با IP غلط رد می‌شه،
بدون callerIp اصلاً چک نمی‌شه، کلید شخصی هیچ‌وقت bound_host نمی‌گیره حتی
اگه فرستاده بشه). همه‌ی ۶۶ تست gateway سبز؛ typecheck/lint/build هر سه
(gateway و web) تمیز.

### CP-031 — مدل Reseller/Host (جهت‌گیری تأییدشده‌ی جلسه ۳، حالا واقعاً ساخته شد)

✅ انجام شد — یک Reseller یک کاربر عادی (CP-025) هست که یک اپراتور
سهمیه بهش داده، نه یک سیستم auth کاملاً جدید:

- migration `0005_resellers.sql`: جدول `resellers` (`user_id` یکتا،
  `display_name`، `max_connected_instances`، `status`) +
  `activation_keys.reseller_id` (nullable — null یعنی مسیر مستقیم/
  self-service معمولی).
- `services/reseller-service.ts` (جدید): `grantResellerStatus()` (فقط
  اپراتور — upsert بر اساس ایمیل کاربر)، `issueResellerActivationKey()`
  (سقف در برابر سهمیه، نه سقف ۵تایی CP-026)، `listResellerActivationKeys()`،
  `revokeResellerActivationKey()` (scope‌شده، reseller دیگه نمی‌تونه کلید
  reseller دیگه رو لغو کنه).
- `routes/admin-resellers.ts` (جدید): `POST`/`GET /admin/resellers` —
  فقط اپراتور.
- `routes/reseller.ts` (جدید): `POST`/`GET /v1/reseller/activation-keys`،
  `POST /v1/reseller/activation-keys/:id/revoke` — با همون
  `requireSession` موجود، بعد چک `resellers.user_id` (نه یک API scope
  کاملاً جدا).
- **تسویه‌ی مالی واقعی عمداً ساخته نشد** — طبق تصمیم جلسه ۵ و
  guardrail شناخته‌شده‌ی CP-013، این جدول فقط سهمیه و مصرفش رو ردیابی
  می‌کنه، پول جابه‌جا نمی‌شه.

**یک تصمیم طراحی مهم که حین smoke-test واقعی اصلاح شد:** اول
`countInstancesForReseller` همه‌ی کلیدهای صادرشده (حتی revoked) رو
می‌شمرد — یعنی لغو کردن مشتری رفته، سهمیه رو برای همیشه می‌سوزوند.
با یک curl واقعی (صدور تا سقف، لغو یکی، تلاش صدور دوباره) این رفتار
اشتباه پیدا شد؛ چون «max_connected_instances» طبق جلسه ۳ یعنی ظرفیت
**فعلی متصل**، نه سقف عمری (برخلاف سقف ۵تایی CP-026 که عمداً عمریه، چون
هدفش جلوگیری از سوءاستفاده از ثبت‌نام رایگانه). فیکس شد: فقط کلیدهای
`status = 'active'` شمرده می‌شن — لغو یک مشتری، جای اون رو واقعاً آزاد
می‌کنه.

۹ تست جدید (`reseller-service.test.ts`) + یک smoke-test کامل روی سرور
واقعی: grant reseller → login → صدور تا سقف ۲ → رد سومی → لغو یکی →
صدور موفق چهارمی (بعد از فیکس سهمیه) → توکن نامعتبر رد می‌شه. همه‌ی ۷۵
تست gateway سبز؛ typecheck/lint/build هر سه تمیز.

### CP-027 — نمایش Marketplace داخل Control Plane (فراخوانی مستقیم API، بدون micro-frontend)

✅ انجام شد — طبق تصمیم جلسه ۵: Control Plane مستقیماً به API عمومی
Marketplace (یک سرویس/repo جدا) وصل می‌شه و خودش UI رو رندر می‌کنه؛ نه
micro-frontend، نه iframe:

- `services/marketplace-client.ts` (جدید): `listPlugins/getPlugin/
listSkills/getSkill` — wrapper نازک روی fetch به
  `MARKETPLACE_SERVICE_URL` (env جدید، اختیاری)؛ اگه تنظیم نشده باشه یا
  پاسخ غیر-2xx برگرده، `ValidationError` می‌ده. تست‌هاش دقیقاً همون
  الگوی `marketplace-client.test.ts` خود Runtime رو تکرار می‌کنن: یک
  `http.createServer` محلی جای سرویس واقعی Marketplace می‌شینه (نه
  mock کردن fetch).
- `routes/marketplace.ts` (جدید): `GET /v1/marketplace/plugins[/:id]`،
  `GET /v1/marketplace/skills[/:id]` — پشت `requireSession` +
  `requireActivatedUser` (جدید، صدا می‌زنه `hasActivatedAnyRuntime`).
  یعنی طبق متن جلسه ۵ («وقتی کاربر activation خودش رو در Runtime فعال
  می‌کنه، دسترسی استفاده از مارکت‌پلیس براش باز می‌شه»): صرفِ signup یا
  حتی صدور یک activation key کافی نیست، باید حداقل یک بار واقعاً
  check-in شده باشه.
- `services/activation-service.ts`: `hasActivatedAnyRuntime(db, userId)`
  (جدید) — `last_seen_at IS NOT NULL` رو چک می‌کنه، نه `status =
'active'` فعلی؛ عمداً چون یک self-hoster واقعی که بعداً کلیدش رو لغو
  کرده نباید دسترسی مرورِ Marketplace رو از دست بده (تست مخصوص این رفتار
  اضافه شد).
- وب: صفحه‌ی `/marketplace` (جدید) — تب plugins/skills، جستجو، و مسیر
  ۴۰۱ («هنوز activate نکردی») که پیام مخصوص «یک Runtime رو activate کن»
  نشون می‌ده به‌جای خطای عمومی. لینک از `/account` هم اضافه شد.
  «نصب» این‌جا نیست — طبق جلسه ۵ فقط مرور، نصب واقعی داخل خود Runtime
  کاربر اتفاق می‌افته.

smoke-test واقعی روی سرور در حال اجرا (نه فقط تست‌های واحد): signup →
verify → login → `GET /v1/marketplace/plugins` قبل از activation →
`401 UNAUTHORIZED` با پیام دقیق «Activate at least one Runtime
deployment…» → صدور کلید شخصی + check-in واقعی → همون درخواست دوباره →
دیگه ۴۰۱ نیست، رد می‌شه تا `marketplaceClient` و چون
`MARKETPLACE_SERVICE_URL` در این محیط تنظیم نشده با
`400 VALIDATION_ERROR` («Marketplace integration is not configured»)
برمی‌گرده — یعنی gate درست عبور کرد و درخواست واقعاً به لایه‌ی client
رسید.

۹ تست جدید gateway (`marketplace-client.test.ts` ۵ تا + ۴ تست
`hasActivatedAnyRuntime` در `self-service-activation.test.ts`). همه‌ی
۸۴ تست gateway + ۱۸ تست web سبز؛ typecheck/lint/build هر سه (هم
gateway هم web) تمیز.

### CP-028 — چندزبانگی (i18n) در Control Plane

✅ انجام شد — طبق تصمیم جلسه ۵: فایل‌های JSON key/value با `en.json`
به‌عنوان مرجع، پیش‌فرض زبان **در سطح سازمان** (نه per-user — اون فقط در
Runtime معنی داره، RT-083):

- migration `0006_organization_language.sql`: `organizations.language`
  (`VARCHAR(10)`، پیش‌فرض `'en'`).
- `services/locale-service.ts` (جدید): `getLocale(env, lang)` — `en`
  همیشه از `gateway/locales/en.json` (مرجع، در git) برمی‌گرده؛ زبان‌های
  دیگه اول از cache دیسک (`gateway/locales/generated/<lang>.json`)
  خونده می‌شن، اگه نبود و `LOCALE_AI_API_KEY` تنظیم شده بود از طریق
  Anthropic Messages API ترجمه و روی دیسک cache می‌شه (فقط یک‌بار به‌ازای
  هر deployment)، وگرنه با پیام روشن رد می‌شه («AI translation is not
  configured»). کد زبان قبل از هرکاری validate می‌شه
  (`/^[a-z]{2}(-[A-Z]{2})?$/`).
- `routes/locales.ts` (جدید): `GET /v1/locales/:lang` — بدون auth، چون
  UI باید بتونه قبل از هر session زبان رو نشون بده.
- `activation-service.ts`: `issueActivationKey`/
  `issueSelfServiceActivationKey` یک `language` اختیاری می‌گیرن (پیش‌فرض
  `'en'`)، روی ردیف organization ذخیره می‌شه، و در `UserActivationKeySummary`
  برمی‌گرده.
- وب: صفحه‌ی `/account` — وقتی کاربر هنوز هیچ کلیدی نداره (اولین ورود)
  یک بنر انتخاب زبان نشون داده می‌شه؛ انتخاب در `localStorage` ذخیره و
  فوراً `GET /v1/locales/:lang` صدا زده می‌شه، و همون زبان به‌عنوان
  `language` توی فرم صدور کلید بعدی می‌ره. چند رشته‌ی واقعی UI (عنوان
  صفحه، دکمه‌ی صدور، عنوان جدول کلیدها) از این‌طریق واقعاً عوض می‌شن —
  fallback انگلیسی سخت‌کدشده اگه fetch fail بشه. صفحه‌ی `/marketplace`
  هم عنوان و پیام «activate نشده» رو از همین pipeline می‌خونه.
- Dockerfile.gateway: یک `COPY` جدید برای `gateway/locales` اضافه شد —
  قبلش فقط `dist`/`node_modules`/`package.json` کپی می‌شد، پس `en.json`
  توی image نبود؛ با یک build واقعی پیدا شد.

**صادقانه، تست‌نشده:** مسیر واقعی AI translation
(`translateViaAi` در `locale-service.ts`) — این محیط `LOCALE_AI_API_KEY`
نداره، پس این مسیر با smoke-test واقعی curl فقط تا «۴۰۰ چون تنظیم
نشده» تأیید شد، نه فراخوانی واقعی Anthropic. مسیرهای دیگه (`en`
مرجع، cache دیسک واقعی، ذخیره/بازخوانی زبان روی organization، ولیدیشن
فرمت کد زبان) همه با فایل‌سیستم/Postgres واقعی و یک smoke-test HTTP
کامل (signup→verify→login→صدور کلید با `language=fa`→لیست کلیدها با
فیلد `language` صحیح→رد فرمت نامعتبر) تأیید شدن.

۷ تست جدید gateway (`locale-service.test.ts` ۵ تا + ۲ تست organization
language در `activation-service.test.ts`) + ۱ تست در
`self-service-activation.test.ts` + ۳ تست جدید web
(`api-client.test.ts`). همه‌ی ۹۲ تست gateway + ۲۱ تست web سبز؛
typecheck/lint/build هر سه (هم gateway هم web) تمیز.

### RT-081 — Runtime سقف seat رو از نوع activation اعمال می‌کنه (شخصی=۱، سازمانی=maxUsers)

✅ انجام شد (در `openon4net-runtime`) — طبق CP-026: Control Plane
`activationType`/`maxUsers` رو توی جواب check-in برمی‌گردونه، Runtime حالا
واقعاً بهش گوش می‌ده و enforce می‌کنه:

- migration `0026_activation_seat_limit.sql`: `organizations.activation_type`
  (پیش‌فرض `'organizational'`، سازگار با orgهای قبلی) + `organizations.max_users`
  (`NULL` = بدون سقف).
- `services/activation-client.ts`: `CheckInResult` حالا `activationType`/
  `maxUsers` رو هم type می‌کنه (قبلاً فیلدهای CP-026 اصلاً خونده نمی‌شدن).
- `services/org-service.ts`: `updateActivationInfo()` (جدید) — فقط توسط
  scheduler نوشته می‌شه؛ درست مثل `plan`/`status`، از مسیر self-service
  `update()` عمداً قابل‌ویرایش نیست (کامنت خود فایل این قانون رو از قبل
  برای plan/status مستند کرده بود).
- `services/activation-scheduler.ts`: هر check-in موفق (اول boot، بعد هر
  ساعت) حالا `updateActivationInfo` رو هم صدا می‌زنه — یعنی حتی اگه
  Control Plane لحظه‌ی افزودن کاربر در دسترس نباشه، enforcement روی
  آخرین مقدار شناخته‌شده کار می‌کنه، نه یک فراخوانی زنده به‌ازای هر request.
- `services/seat-limit-service.ts` (جدید): `assertSeatAvailable(client,
organizationId)` — تابع مستقل (نه متد OrgService، چون org-service.ts از
  قبل user-service.ts رو import می‌کنه و متد کلاس باعث import چرخه‌ای
  می‌شد). شخصی → سقف ثابت ۱؛ سازمانی → `max_users` (`NULL` = نامحدود)؛
  فقط کاربرهای `is_active = true` شمرده می‌شن (غیرفعال کردن یه کاربر جای
  خالی آزاد می‌کنه).
- سیم‌کشی در دو نقطه‌ی واقعی insert کاربر: `UserService.create()` (همون
  transaction، بعد از چک ایمیل تکراری) و `InvitationService.accept()`
  (چک نهایی/authoritative، همون transaction با insert). `InvitationService.create()`
  هم یک چک fail-fast قبل از ساخت دعوت داره — که یه دعوت رو نساخته که
  قطعاً موقع accept برگرده.

۱۳ تست جدید (`seat-limit-service.test.ts` ۲ تا، ۴ تست در
`user-service.test.ts`، ۲ تست در `invitation-service.test.ts`، ۲ تست در
`org-service.test.ts`، به‌روزرسانی fixture در `activation-client.test.ts`)
— همه با Postgres واقعی، شامل تست race-محور «کاربر غیرفعال جای خودش رو
آزاد می‌کنه» و «چک دوباره در accept حتی اگه در لحظه‌ی create قبول شده
بود». Route-level smoke test عمداً انجام نشد: برخلاف باگ CP-026 (که یک
فیلد جدید در پاسخ HTTP بود)، این‌جا route هیچ shape جدیدی نداره — فقط
همون مسیر خطای `ValidationError`ی که از قبل با تست‌های duplicate-email
تأیید شده. همه‌ی ۳۵ فایل تست gateway (۱۷۷ تست) سبز؛ typecheck/lint/build
هر سه تمیز.

### RT-082 — مخفی/غیرفعال شدن کل ویژگی Agent Access در حالت activation شخصی

✅ انجام شد (در `openon4net-runtime`، به‌همراه یک تغییر کوچک در ریشه‌ی
مونوریپو) — چون Agent Access (RT-024) یعنی «چه کاربری به کدوم Agent
دسترسی داره»، و activation شخصی طبق RT-081 دقیقاً یک کاربر داره (و اون
کاربر همیشه admin بوت‌استرپ سازمانه)، این ویژگی برای حالت شخصی کلاً
بی‌معنیه:

- **root repo، `packages/shared/src/types/organization.ts`**: `Organization`
  حالا `activationType`/`maxUsers` رو هم داره (`OrganizationActivationType`
  جدید). طبق قانون شناخته‌شده‌ی «packages/\* ریشه رو قبل از submodule
  push کن»، این تغییر جدا commit/push شد **قبل از** هر تغییری در Runtime
  — چون CI خودِ Runtime (`.github/workflows/ci.yml`) ریشه رو تازه از
  GitHub checkout می‌کنه، نه از فایل‌های محلی.
- `services/org-service.ts`: `toOrganization()`/`OrgRow` این دو فیلد رو
  حالا map می‌کنن (ستون‌هاش از قبل توسط migration RT-081 اضافه شده بودن،
  فقط تا الان توی `getById()`/`GET /v1/organization` برنمی‌گشتن).
- `lib/agent-access.ts`: `assertAgentAccessFeatureEnabled(db, organizationId)`
  (جدید، تابع مستقل مثل `assertSeatAvailable` نه متد کلاس) — اگه
  `activationType === 'personal'` باشه `ValidationError` می‌ده.
- سه route در `routes/agents.ts` (`GET/POST .../access`, `POST
.../access/grant`, `DELETE .../access/:userId`) این چک رو قبل از هر
  کاری صدا می‌زنن — یعنی حتی اگه کسی مستقیم به route درخواست بزنه (نه از
  UI)، برای سازمان شخصی رد می‌شه.
- وب (`app/agents/page.tsx`): `api.getOrganization()` حالا موقع لود صفحه
  صدا زده می‌شه (تازه، نه از session ذخیره‌شده — چون `activationType`
  می‌تونه بین دو check-in ساعتی تغییر کنه)؛ دکمه‌ی «Access» فقط وقتی
  `session.role === 'admin' && activationType !== 'personal'` نشون داده
  می‌شه (قبلاً فقط شرط admin بود).
- **عمداً دست‌نخورده موند**: `grantOwner()` که موقع ساخت Agent صدا زده
  می‌شه (چه سازمان شخصی چه سازمانی) — چون خودِ enforcement
  (`requireAgentAccessible`) برای admin از قبل کلاً bypass می‌شه، وجود یا
  عدم وجود یک ردیف در `agent_access_bindings` برای تنها کاربر یک سازمان
  شخصی هیچ رفتاری رو عوض نمی‌کنه.

smoke-test واقعی روی سرور در حال اجرا: dev-login → ساخت Agent →
`GET .../access` روی سازمان سازمانی → `200` با binding واقعی → سازمان
دستی به `personal` تغییر داده شد → همون route → `400 VALIDATION_ERROR`
(«Agent Access is not available for personal activations…») → همون
برای `POST .../access/grant`. `GET /v1/organization` هم قبل و بعد چک
شد تا مطمئن بشیم فیلد `activationType` واقعاً توی پاسخ HTTP برمی‌گرده،
نه فقط توی type.

۳ تست جدید (`lib/agent-access.test.ts`) + ۱ تست جدید در
`org-service.test.ts` (تأیید `getById()` این دو فیلد رو برمی‌گردونه).
**یک شکاف پوشش از قبل موجود، نه از این تسک:** `agent-access-service.ts`
و `requireAgentAccessible`/چک `hasAccess` داخل `chat-service.ts` هنوز
هیچ تست مستقیمی ندارن — این تسک فقط تابع تازه‌ی خودش
(`assertAgentAccessFeatureEnabled`) رو تست کرد، نه کل RT-024 رو
retroactively پوشش داد. همه‌ی ۳۶ فایل تست gateway (۱۸۰ تست) سبز؛
typecheck/lint/build هر سه (gateway، web، و `packages/shared` ریشه)
تمیز.

### RT-083 — چندزبانگی در Runtime + RTL/LTR واقعی در چت (تکمیل بخش جامانده از RT-021)

✅ انجام شد (در `openon4net-runtime`، به‌همراه یک تغییر ریشه‌ای دیگر در
`packages/shared`) — آخرین تسک این batch. طبق جلسه ۵: فایل‌های JSON
مرجع + AI-generation عیناً مثل CP-028، ولی به‌همراه چیزی که Control
Plane نمی‌تونست بسازه (چون جدول `users` نداره به همون معنا): override
شخصیِ هر کاربر، مستقل از پیش‌فرض سازمانش.

- **root repo، `packages/shared`**: `Organization.language` (همیشه
  ست‌شده) و `User.language` (`string | null` — `null` یعنی «هنوز
  انتخاب نکرده»، همون سیگنال اولین ورود) به type ها اضافه شد؛
  `OrganizationUpdateSchema` یک `language` اختیاری گرفت،
  `SelfLanguageUpdateSchema` جدید (فقط `{language}`) برای مسیر
  self-service کاربر عادی. طبق قانون «packages/\* ریشه رو قبل از
  submodule» جدا commit/push شد.
- migration `0027_language.sql`: `organizations.language` (پیش‌فرض
  `'en'`) + `users.language` (nullable، بدون پیش‌فرض).
- `services/locale-service.ts` + `routes/locales.ts` (جدید) — کپی دقیق
  معماری CP-028 (`en.json` مرجع در git، cache روی دیسک برای زبان‌های
  تولیدشده، AI translation عمداً یک fetch جدا و ساده به Anthropic،
  **نه** از طریق `ProviderConfigService`/`ChatService` سازمانی — چون
  تولید locale یک عملیات global و یک‌بارمصرفه، نه هزینه‌ی چت یک org).
  `GET /v1/locales/:lang` به‌خاطر global auth hook (`plugins/auth.ts`)
  باید صریحاً به `PUBLIC_ROUTES` اضافه می‌شد، چیزی که در Control Plane
  لازم نبود (اون auth model متفاوته).
- `services/org-service.ts`: `update()` حالا `language` رو هم می‌گیره
  (admin-facing، مثل `name`).
- `services/user-service.ts`: `updateOwnLanguage(userId, language)`
  (جدید، تابع مستقل — نه از طریق `update()` ادمین‌محورِ موجود که
  صراحتاً self-PATCH رو رد می‌کنه).
- `routes/users.ts`: `GET/PATCH /v1/users/me` (جدید) — هر کاربر
  signed-in، بدون نیاز به `users:read`/`users:write`، چون فقط ردیف خودش
  رو می‌بینه/عوض می‌کنه. `GET .../me` هم همون endpoint‌ایه که فرانت برای
  تشخیص «اولین ورود» صداش می‌زنه (`language === null`).
- وب: `lib/i18n.ts` (جدید) — `isRtlLanguage()` + `applyDocumentDirection()`
  (روی `document.documentElement` مستقیم، چون این اپ SSR/cookie-session
  نداره، همه‌چیز client-side session-based هست). `/agents` بلاک می‌شه
  با یک بنر انتخاب زبان تا وقتی `me.language !== null` بشه (طبق متن
  جلسه ۵: «اولین ورود کاربر یک انتخاب زبان نشون می‌ده»)؛ چون هم
  `/login` هم `/accept-invite` هر دو به `/agents` redirect می‌کنن، این
  یک نقطه‌ی مشترک هر دو مسیر ورود رو پوشش می‌ده. صفحه‌ی `/settings`
  پیش‌فرض زبان سازمان رو (admin-only) قابل‌ویرایش کرد.
- **صفحه‌ی چت (`agents/[id]/chat/page.tsx`) — بخش RTL/LTR واقعی**:
  زبان مؤثر (`user.language ?? organization.language`) واقعاً
  `document.documentElement.dir`/`lang` رو ست می‌کنه (نه صرفاً
  `text-align`)؛ چون layout موجود قبلاً کاملاً با flex/gap ساخته شده
  بود (بدون هیچ `margin-left`/`text-align: left` سخت‌کدشده)، خودِ
  balloon‌های پیام (`alignSelf: flex-end/flex-start`) طبق spec خودِ
  Flexbox زیر `dir="rtl"` **خودکار** جهت عوض می‌کنن — نیازی به تغییر
  منطق نبود. چیزی که واقعاً نیاز به فیکس داشت: فلش سخت‌کدشده‌ی `←`
  (حالا جهت‌آگاهه، `Agents →` در RTL).
- **عمداً محدود به همین صفحه، نه کل اپ**: طبق متن دقیق تسک («RTL/LTR
  واقعی **در چت**»)، `dir` فقط توی صفحه‌ی چت (و به‌عنوان یک مزیت جانبی،
  صفحه‌ی `/agents` هم چون همون‌جا زبان انتخاب می‌شه) واقعاً اعمال شد؛
  صفحات دیگه (settings, users, ...) هنوز LTR انگلیسی‌محورن — یک گسترش
  آینده، نه بخشی از این تسک.

smoke-test واقعی روی سرور در حال اجرا: dev-login → `GET /v1/locales/en`
(مرجع واقعی) → `GET /v1/users/me` (`language: null`, تأیید سیگنال
اولین ورود) → `GET /v1/organization` (`language: "en"`) →
`PATCH /v1/users/me {language: "fa"}` → `GET .../me` دوباره (`fa`) →
رد فرمت نامعتبر (`persian"` → ۴۰۰) → `PATCH /v1/organization
{language: "ar"}` → `GET /v1/locales/xx` بدون AI key → ۴۰۰ با پیام
روشن.

۵ تست جدید (`locale-service.test.ts`) + ۲ تست در `org-service.test.ts`

- ۳ تست در `user-service.test.ts`. همه‌ی ۳۷ فایل تست gateway (۱۹۰ تست)
  سبز؛ typecheck/lint/build هر سه (gateway، web، `packages/shared` ریشه)
  تمیز.

---

### RT-094/RT-095/RT-096 — Design System pass روی وب Runtime (نقد UI/UX کاربر، ۲۰۲۶-۰۷-۱۸)

✅ انجام شد — پاسخ به نقد صریح کاربر («از نظر ui/ux اصلا قابل قبول نیست»)،
با کمک skill پلاگین `ui-ux-pro-max` (بخش design-system، معماری primitive
→ semantic → component token طبق `references/primitive-tokens.md`/
`semantic-tokens.md`).

- **RT-094 — لایه‌ی token مشترک**: `web/app/globals.css` کامل بازنویسی
  شد با یک سیستم سه‌لایه (primitive gray/blue/status scale → semantic
  background/surface/border/primary/success/warning/error → استفاده در
  base elementها). رنگ‌های primitive عیناً برابر رنگ‌های hex قبلی انتخاب
  شدن (مثلاً `--color-gray-900: #0f1115`) تا رنگ واقعی صفحه عوض نشه،
  فقط منبعش متمرکز بشه. اضافه‌شده‌ی واقعی که قبلاً اصلاً نبود: `:focus-visible`
  ring (قبلاً هیچ focus style‌ای، یک gap واقعی دسترس‌پذیری)، `:hover`/`:active`
  روی button/input (قبلاً هیچ)، کلاس‌های `.badge-success/warning/error/neutral`
  (برای وضعیت‌ها، به جای رنگ inline پراکنده).
- **RT-095/RT-096 — اعمال روی صفحات**: به‌جای بازنویسی JSX هر ۱۸ صفحه
  از صفر (ریسک بالا برای فرم‌های stateful موجود بدون تست UI خودکار)،
  دو تغییر ساختاری واقعی انجام شد:
  - جایگزینی مکانیکی همه‌ی literal hex رنگ (۱۷۹ مورد در ۱۸ فایل — تأیید
    شده با grep قبل/بعد) با `var(--color-...)` — یعنی همه‌ی صفحات حالا
    واقعاً از همون token layer استفاده می‌کنن، نه فقط globals.css.
  - **کامپوننت مشترک جدید `web/components/TopBar.tsx`** (اولین کامپوننت
    مشترک در این اپ — قبلش هیچ `web/components/` وجود نداشت) که nav
    تکراری ۱۶ صفحه رو یکی کرد. این استخراج یک باگ واقعی UX رو هم فیکس
    کرد: قبلش nav هر صفحه دستی نگه‌داری می‌شد و واقعاً ناهماهنگ بود —
    بعضی صفحات (`audit`, `workflows`, `skills`, ...) لینک‌های
    admin-only (Workspaces/Users/Roles/Policies) رو بدون هیچ گیتی به
    همه نشون می‌دادن، بعضی دیگه (`outcomes`, `webhooks`,
    `marketplace/publisher`) تقریباً هیچ nav‌ای نداشتن جز یک لینک
    بازگشت، و «Sign out» فقط توی `/agents` وجود داشت. `TopBar` حالا:
    یک لیست کانونیک لینک (۱۴ مورد)، gating صحیح روی `session.role ===
'admin'`، highlight صفحه‌ی جاری (`usePathname`)، و «Sign out»
    یکسان همه‌جا.
  - عمداً دست‌نخورده موند: صفحه‌ی چت (`agents/[id]/chat/page.tsx`) —
    nav مینیمال اون صفحه (فقط بازگشت + نام Agent + rate limit) عمدیه
    (تجربه‌ی متمرکز چت)، نه یک gap؛ بازطراحی واقعی این صفحه به ۳ پنل
    (Control/Chat/Workspace) کار RT-021 جداست، نه این batch.
- **تست واقعی**: `pnpm build` کامل (۲۲ روت، typecheck+lint+build سه‌تایی
  Next.js) قبل و بعد از تغییرات پاس شد؛ dev server واقعی بالا اومد و هر
  صفحه‌ی تغییریافته (login/agents/settings/audit/workflows/policies/
  workspaces) `200` برگردوند؛ CSS کامپایل‌شده‌ی واقعی سرو شده از dev
  server چک شد که token‌ها درسته اعمال شدن. **محدودیت صادقانه:** هیچ
  ابزار مرورگر واقعی (screenshot/Playwright) در دسترس نبود، پس تأیید
  بصری نهایی (رنگ/spacing درست دیده می‌شه از نظر انسانی) انجام نشده —
  فقط تأیید کد/build/HTTP.

---

### RT-097/RT-100 — جایگزینی TopBar با Sidebar کشویی + پوشش responsive (همون روز، ۲۰۲۶-۰۷-۱۸)

✅ انجام شد — بعد از RT-094/095/096، کاربر مدل «داشبورد با sidebar» خواست
به‌جای نوار بالا؛ به‌علاوه PWA/responsive (RT-098/RT-099 هنوز باز).

- **`web/components/Sidebar.tsx` (جدید، جایگزین `TopBar.tsx` که حذف شد)**:
  همون لیست/gating/active-state RT-097 که `TopBar` داشت، با یک layout
  کاملاً متفاوت — `position: fixed` سمت چپ، عرض از طریق CSS var
  (`--sidebar-width`) کنترل می‌شه:
  - **Collapse دسکتاپ**: دکمه‌ی ««/»» بین حالت کامل (۲۴۰px، متن کامل) و
    جمع‌شده (۶۴px، ۲ حرف اول هر لینک + `title` tooltip) — وضعیتش در
    `localStorage` (`o2n-sidebar-collapsed`) نگه داشته می‌شه، بین
    صفحات/reload حفظ می‌مونه.
  - **Drawer موبایل (کشویی)**: زیر ۹۰۰px، sidebar به‌طور پیش‌فرض
    `translateX(-100%)` (خارج از صفحه) است؛ یک دکمه‌ی همبرگر ثابت (☰)
    بازش می‌کنه، یک backdrop نیمه‌شفاف پشتش می‌افته که با کلیک می‌بندتش،
    و با هر تغییر مسیر (`pathname`) خودکار بسته می‌شه.
  - **هماهنگی با محتوای صفحه**: `body`'s `padding-left` از یک CSS var
    دوم (`--sidebar-content-offset`) میاد، نه مستقیم از عرض sidebar —
    روی موبایل این var صفر می‌شه (چون اونجا sidebar روی محتوا میاد، جای
    اون رو نمی‌گیره)، روی دسکتاپ برابر عرض واقعی sidebar (کامل یا
    جمع‌شده) — بدون نیاز به تغییر ساختار JSX هیچ صفحه‌ای، چون `.page`
    خودش قبلاً `margin: 0 auto` داشت و همین‌جوری در فضای باقی‌مونده
    وسط‌چین می‌مونه.
  - **همه‌ی ۱۸ صفحه، از جمله Chat**: جایگزینی مکانیکی
    `<TopBar session={session}/>` → `<Sidebar session={session}/>` در
    ۱۷ صفحه؛ صفحه‌ی چت (`agents/[id]/chat/page.tsx`) هم `session` رو
    این‌بار در state ذخیره کرد (قبلاً فقط چک می‌شد، نگه داشته نمی‌شد) و
    `<Sidebar>` گرفت — نوار محلی‌اش (بازگشت + نام Agent + rate limit)
    نگه داشته شد چون context مخصوص همون صفحه‌ست، ولی لینک «Settings»ش
    حذف شد چون حالا در sidebar سراسری هست.
- **RT-100 (بخشی که هم‌زمان انجام شد)**: عرض sidebar در موبایل خودش یک
  drawer واقعیه (بالا). علاوه بر اون: `.card` حالا `overflow-x: auto`
  داره — چون همه‌ی صفحات جدول‌های `width: 100%` رو مستقیم داخل `.card`
  می‌ذارن، این باعث می‌شه جدول عریض خودش scroll افقی بگیره، نه کل صفحه.
  `.page`/`.card` روی موبایل padding تنگ‌تر گرفتن. **هنوز باقی مونده**:
  بازبینی صفحه‌به‌صفحه با یک مرورگر واقعی موبایل/تبلت — این batch فقط
  زیرساخت عمومی (sidebar drawer + card overflow) رو پوشش داد، نه تک‌تک
  فرم‌های پیچیده (مثل Roles یا Agents با پنل‌های تو‌در‌تو).
- **تست واقعی**: `pnpm build` کامل (۲۲ روت) بعد از این تغییرات هم پاس
  شد؛ dev server بالا اومد، صفحات `200` برگردوندن، CSS کامپایل‌شده چک
  شد که کلاس‌های `.sidebar`/`.sidebar-backdrop`/`.sidebar-mobile-toggle`
  واقعاً تولید شدن. همون محدودیت قبلی: بدون مرورگر واقعی، تأیید بصری
  نهایی (نه فقط کد/CSS/HTTP) انجام نشد.

---

### RT-098/RT-099 — صفحه‌ی Dashboard واقعی + PWA (همون batch، ۲۰۲۶-۰۷-۱۸)

✅ انجام شد — آخرین دو مورد از نقد UI/UX کاربر (بعد از RT-097).

- **RT-098 — `web/app/dashboard/page.tsx` (صفحه‌ی جدید)**: یک overview
  واقعی، نه فقط تکرار `/agents`:
  - کارت **Agents** (تعداد کل + badge فعال/pause شده)
  - کارت **Budget used this month** (جمع `usedBudgetCents`/`monthlyBudgetCents`
    همه‌ی Agentها + یک progress bar مشابه `BudgetBar` صفحه Agents)
  - کارت **Pending approvals** (لینک به `/approvals`)
  - کارت **Wallet balance** (اگه wallet سازمان هنوز `initialized` نشده،
    «Not set up» نشون می‌ده به‌جای عدد گمراه‌کننده صفر)
  - جدول **Recent activity** — ۸ ردیف آخر از همون `GET /v1/audit` که
    صفحه‌ی audit استفاده می‌کنه، با لینک به audit کامل.
  - همه‌ی fetchها `Promise.all` با `.catch()` جدا روی approvals/wallet —
    اگه نقشی دسترسی `approvals:read`/`billing:wallet:read` نداشته باشه،
    فقط اون کارت خالی می‌مونه، نه کل صفحه fail می‌شه.
  - لینک `Dashboard` به اول لیست `Sidebar.tsx` اضافه شد. **تصمیم آگاهانه**:
    ریشه (`/`) هنوز به `/agents` redirect می‌شه، نه `/dashboard` — تغییر
    صفحه‌ی پیش‌فرض ورود یک تصمیم جداگانه است که درخواست صریح نبود.
- **RT-099 — PWA**:
  - `web/public/manifest.json` (نام/آیکون/`display: standalone`/
    `start_url: /dashboard`/theme رنگ `--color-background` فعلی)
  - `web/public/sw.js` — استراتژی عمداً محافظه‌کارانه چون این اپ کاملاً
    session/API-محوره: `/v1/*`/`/api/*` **هیچ‌وقت cache نمی‌شن** (network
    passthrough مستقیم، حتی رجیستر نمی‌شن رو fetch handler)؛ فقط
    asset‌های استاتیک با نام hash-شده‌ی Next.js (`/_next/static/*`) و
    manifest/icon‌ها cache-first می‌شن؛ ناوبری صفحه (HTML) network-first
    با fallback به cache برای حالت آفلاین. `activate` نسخه‌های قدیمی
    cache رو پاک می‌کنه (`CACHE_VERSION`).
  - `web/components/RegisterServiceWorker.tsx` (کلاینت، در
    `layout.tsx`) — `navigator.serviceWorker.register('/sw.js')`،
    best-effort (خطا silent، چون اپ بدون service worker هم کامل کار
    می‌کنه).
  - **آیکون‌ها placeholder واقعی هستن، نه طراحی نهایی**: چون هیچ asset
    برندینگ (لوگو) توی ریپو نبود (RT-030 هنوز انجام نشده) و ابزار
    تولید تصویر در دسترس نبود، دو PNG تک‌رنگ (۱۹۲/۵۱۲px، رنگ
    `--color-primary`) با یک اسکریپت Node مستقیم (بدون کتابخونه، PNG
    دستی encode شده با `zlib`) ساخته شد — باید بعداً با لوگوی واقعی
    (RT-030) جایگزین بشه.
- **تست واقعی**: `pnpm build` (۲۳ روت، شامل `/dashboard` جدید) پاس شد.
  `next start` واقعی اجرا شد و با curl تأیید شد: `manifest.json` با
  `Content-Type: application/json`، هر دو PNG با `Content-Type:
image/png`، `sw.js` با `Content-Type: application/javascript`، همه
  `200`؛ `<link rel="manifest">` و `<meta name="theme-color">` واقعاً
  توی HTML صفحه‌ی login رندر شدن. **تست نشده**: نصب واقعی به‌عنوان PWA
  روی یک دستگاه موبایل/دسکتاپ واقعی (نیاز به HTTPS واقعی و مرورگر — این
  محیط فقط localhost HTTP داره)، و رفتار آفلاین واقعی service worker.

---

### RT-028/RT-078 — Feature gating روی لایسنس Managed AI Gateway + اجرای مستقیم Plugin (۲۰۲۶-۰۷-۱۸)

✅ انجام شد — بعد از تکمیل CP-012، بلاک RT-078 برداشته شد و هر دو تسک
باهم ساخته شدن چون واقعاً یک گیت مشترکن (`02_ARCHITECTURE/02-ai-gateway.md`
§1.2) که در دو نقطه اعمال می‌شه.

- **`packages/governance/src/errors.ts`**: `FeatureNotAvailableError` جدید
  (کد `FEATURE_NOT_AVAILABLE`، اضافه شده به `@o2n/shared`'s `ErrorCode` هم) —
  همون کد خطایی که خودِ سند معماری صراحتاً نام برده.
- **`gateway/src/services/license-service.ts` (جدید)**: `hasFeature(activationState,
feature)` — می‌خونه از `activationState.lastCheckIn?.featureFlags` (که
  CP-012 حالا واقعی پرش می‌کنه). **عمداً پیش‌فرضش برعکس** `ActivationState.isActivated()`
  است: `isActivated()` برای self-host بدون Control Plane پیش‌فرض `true`
  می‌مونه (اصل self-host-first)، ولی یک فیچر پولی مثل Managed AI Gateway
  «رایگان» نمی‌شه فقط چون Platform در دسترس نیست یا هیچ‌وقت پیکربندی نشده —
  پیش‌فرض این تابع `false` است.
- **RT-028 — دو نقطه‌ی enforcement**:
  - `routes/agents.ts`: `assertProgrammerRoleAllowed()` روی هم `POST /v1/agents`
    (ساخت) هم `PATCH /v1/agents/:id` (فقط وقتی `role` واقعاً توی بدنه هست) —
    اگه role درخواستی `programmer` باشه و لایسنس نباشه، `FeatureNotAvailableError`
    (۴۰۲) + یک ردیف audit (`agent-role-denied-no-license`, `status: 'failed'`).
  - `routes/local-plugins.ts`: همون گیت روی دسته‌ی `devops` (نزدیک‌ترین
    مقدار موجود در `PLUGIN_CATEGORIES` به «Development» سند معماری — تصمیم
    خودم، مستندشده اینجا) هنگام `POST /v1/plugins`.
  - **جانبی**: یک gap واقعی پیدا شد حین کار — `web/app/roles/page.tsx`'s
    `PERMISSION_CATALOG` هیچ‌وقت گروه `plugins` رو نداشت (با اینکه
    `plugins:create/read/grant` از RT-077/080 وجود داشتن) — یعنی نقش‌های
    سفارشی (نه admin، چون admin از قبل `plugins:*` wildcard داره) هیچ‌وقت
    نمی‌تونستن از UI این permissionها رو بگیرن. اضافه شد (+ `plugins:execute`
    جدید این batch).
- **RT-078 — `routes/plugin-execute.ts` (جدید)**: `POST
/v1/agents/:agentId/plugins/:pluginId/execute` — اولین مسیر اجرای Plugin
  **خارج از Workflow** (تا الان `executePluginStep` فقط از
  `WorkflowExecutor` صدا زده می‌شد، RT-079). محدود به agent با
  `role === 'programmer'` + همون گیت لایسنس؛ منطق واقعی (grant check،
  invoke، state persist) عیناً از `plugin-invoker.ts` دوباره استفاده شد —
  این route فقط گیت + audit تازه اضافه کرد. permission جدید
  `plugins:execute`.
- **`activation-client.ts`**: `CheckInResult`'s فیلد جدید `aiGatewayEnabled`
  (opt-in واقعی سازمان، جدا از `featureFlags.managedAiGateway` که سطح
  پلنه) اضافه شد برای هم‌خوانی نوع با پاسخ واقعی Platform — **هنوز مصرف
  نمی‌شه** توی گیت‌های RT-028/078 چون متن دقیق سند («سازمان‌هایی که خریده‌اند»)
  فقط سطح پلن رو می‌گه، نه toggle عملیاتی روتینگ.
- **تست واقعی**: ۴ تست جدید (`license-service.test.ts`) + کل مجموعه‌ی
  gateway (۳۸ فایل، ۱۹۴ تست، بدون شمردن ۳ تای skip شده‌ی از قبل) پاس شد —
  شامل فیکس یک gap محیطی واقعی پیدا‌شده در راه: `health.test.ts`'s ۲ تست
  Redis همیشه fail می‌شدن چون هیچ Redis container‌ای بالا نبود (نه ربطی
  به این تغییرات) — یک container Redis واقعی بالا آورده شد، حالا ۱۹۴/۱۹۴.
  یک HTTP smoke-test کامل دستی هم انجام شد: gateway واقعی بالا اومد، لاگین
  واقعی (`dev_api_key`) گرفته شد، و هر سه رفتار با curl تأیید شد — ساخت
  Agent با role=programmer بدون لایسنس ۴۰۲ داد، ساخت Agent با role عادی
  ۲۰۰ داد (بدون تأثیر جانبی)، ساخت Plugin با category=devops بدون لایسنس
  ۴۰۲ داد، اجرای مستقیم Plugin روی یک agent غیر-programmer با پیام خطای
  درست رد شد.

---

### RT-089 — فیکس تنظیمات LLM provider (۲۰۲۶-۰۷-۱۸)

✅ انجام شد — دو باگ/خلأ واقعی که در بازبینی جلسه ۶ پیدا شده بودن.

- **`packages/shared/src/schemas/config.ts`**: `LlmConfigSetSchema.apiKey`
  از `z.string().min(1)` (همیشه اجباری) به `z.string().optional()` +
  `superRefine` («اجباری مگر provider === 'ollama'») تغییر کرد — قانون توی
  خودِ schema است، نه پخش‌شده روی caller. `provider-config-service.ts`'s
  `setConfig()` وقتی apiKey خالیه و provider ollama است، از همون
  placeholder ('ollama') استفاده می‌کنه که کامنت خودِ `registry.ts` قبلاً
  توصیه کرده بود.
- **`packages/llm-providers/src/models.ts` (جدید)**: `CURATED_MODELS`
  (لیست ثابت anthropic/openai/deepseek، دقیقاً همون model IDهایی که
  `pricing.ts` می‌شناسه — چیزی انتخاب نمی‌شه که به `DEFAULT_PRICE` بیفته)
  - `listOllamaModels(baseUrl)` که واقعاً `/api/tags` رو صدا می‌زنه (نه
    `/v1/models` سازگار-با-OpenAI) — یعنی **واقعاً می‌بینه چه مدلی روی این
    instance نصبه**، نه یک لیست عمومی بی‌ربط. هیچ‌وقت throw نمی‌کنه (آرایه
    خالی برمی‌گردونه)، پس UI می‌تونه fallback به ورودی دستی بزنه.
  * **جانبی**: این اولین کدی بود توی این package که به `fetch`/`AbortSignal`
    نیاز داشت — `@types/node` هیچ‌وقت دیپندنسی این package نبود (فقط
    SDKهای anthropic/openai که خودشون HTTP رو مدیریت می‌کنن)، اضافه شد.
- **`routes/config.ts`**: `GET /v1/config/models?provider=X&baseUrl=Y`
  جدید.
- **`web/app/settings/page.tsx`**: فیلد Model از `<input>` آزاد به
  `<select>` با گزینه‌ی «Other…» (fallback دستی وقتی لیست خالیه) تغییر
  کرد؛ فیلد API key وقتی provider=ollama دیگه `required` نیست + placeholder
  توضیحی.
- **تست واقعی**: کل مجموعه‌ی gateway (۳۸ فایل، ۱۹۴ تست) بعد از تغییرات
  پاس شد. یک HTTP smoke-test کامل: ذخیره‌ی config ollama بدون apiKey
  موفق (۲۰۰)، ذخیره‌ی anthropic بدون apiKey رد شد با پیام دقیق، لیست
  مدل‌های curated انتخاب برای anthropic برگشت، و — جالب‌ترین بخش —
  `GET /v1/config/models?provider=ollama` **واقعاً به یک Ollama واقعی
  نصب‌شده روی همین دستگاه وصل شد** و لیست واقعی مدل‌های نصب‌شده
  (`qwen2.5-coder:14b`, `gemma3:4b`, ...) رو برگردوند — نه یک mock.

---

### RT-019 — KMS Provider Registry (۲۰۲۶-۰۷-۱۸)

✅ انجام شد — زیرساخت پایه برای rotation واقعی، مستقل از اینکه RT-020
(Vault) ساخته بشه یا نه (فعلاً موکول شده، طبق تصمیم کاربر).

- **`gateway/src/lib/kms/types.ts`**: اینترفیس `KmsProvider` (`encrypt`,
  `decrypt(ciphertext, keyId)`, `isStale(keyId)`).
- **`gateway/src/lib/kms/env-provider.ts`**: تنها provider موجود، wrapper
  دور همون AES-256-GCM قبلی (`lib/crypto.ts`). **یک باگ طراحی واقعی حین
  نوشتن تست پیدا و فیکس شد**: طرح اولیه `keyId` رو برچسب نقشی
  («current»/«previous») می‌ذاشت — که غلط از آب درمیومد، چون بعد از یک
  rotation دوم، معنی «current» عوض می‌شه ولی ردیف‌های قدیمی همون رشته‌ی
  «current» رو نگه می‌دارن و به کلید اشتباه اشاره می‌کنن. فیکس: `keyId`
  الان fingerprint خودِ کلید است (`sha256(key).slice(0,16)`) — مستقل از
  اینکه کدوم env var فعلاً اون کلید رو نگه داشته، برای همیشه درست می‌مونه.
- **`gateway/src/lib/kms/registry.ts`**: `createKmsRegistry(env)` — فعلاً
  فقط provider «env» رجیستر می‌شه؛ `primary` (برای نوشتن) + `resolve(providerId)`
  (برای خوندن secretهای قدیمی، حتی اگه primary بعداً عوض بشه).
- **`env.ts`**: `CONFIG_ENCRYPTION_KEY_PREVIOUS` جدید (اختیاری) — موقع
  rotation، مقدار قبلیِ `CONFIG_ENCRYPTION_KEY` اینجا می‌ره.
- **Migration `0028_kms_provider_registry.sql`**: ستون‌های `kms_provider_id`/
  `kms_key_id`/`kms_key_version` روی `llm_configs` و `sso_configs` (پیش‌فرض
  `'env'`/fingerprint فعلی/`1` — بدون نیاز به backfill، چون تنها provider‌ای
  که تا حالا وجود داشته دقیقاً همینه).
- **`provider-config-service.ts`/`sso-config-service.ts`**: هر دو از
  `encryptSecret`/`decryptSecret` مستقیم به `this.kms.primary.encrypt()`/
  `this.kms.resolve(row.kms_provider_id).decrypt()` منتقل شدن + **re-encrypt-on-read**:
  اگه کلیدی که یک ردیف رو رمزنگاری کرده دیگه «stale» باشه (یعنی کلید
  اصلی عوض شده)، بعد از رمزگشایی موفق، دوباره با کلید فعلی رمزنگاری و
  ذخیره می‌شه — best-effort (اگه UPDATE fail بشه، مقدار درست همچنان
  برگردونده می‌شه، فقط دفعه بعد دوباره تلاش می‌کنه).
- **تست واقعی**: `lib/kms/env-provider.test.ts` (۴ تست، شامل یک سناریوی
  کامل rotation که خودِ باگ بالا رو گیر انداخت) + یک تست integration جدید
  در `sso-config-service.test.ts` که **واقعاً** یک rotation رو شبیه‌سازی
  می‌کنه: ذخیره با کلید قدیم → ساخت instance جدید با `CONFIG_ENCRYPTION_KEY`
  جدید + `_PREVIOUS` = کلید قدیم → `resolve()` هم مقدار درست رو برمی‌گردونه
  هم ردیف DB رو واقعاً به کلید جدید منتقل می‌کنه (تأیید شده با یک SELECT
  مستقیم قبل/بعد) → یک بار دیگه بدون `_PREVIOUS` هم درست کار می‌کنه. کل
  مجموعه‌ی gateway (۳۹ فایل، ۱۹۹ تست) پاس شد. Migration واقعی روی DB
  واقعی هم اجرا و تأیید شد.

---

### RT-023 — Agent picker/modal با workspace اختصاصی ۱:۱ (۲۰۲۶-۰۷-۱۸)

✅ انجام شد — `web/app/agents/page.tsx`.

- دکمه‌ی `+ New agent` (و کل فرم ساخت) حالا فقط برای `session.role === 'admin'`
  رندر می‌شه (قبلاً به همه‌ی کاربرها با `agents:create` نشون داده می‌شد).
- فرم ساخت Agent دیگه picker دستی workspace نداره — به‌جاش، موقع submit
  اول یک workspace اختصاصی می‌سازه (`POST /v1/workspaces`، اسم
  `{agentName} Workspace`) و بعد Agent رو با همون `workspaceId` می‌سازه
  (`POST /v1/agents`) — یعنی رابطه‌ی ۱:۱ واقعی، نه یک پیش‌فرض روی
  workspace مشترک.
- کد مرده‌ی مرتبط پاک شد: state/effectهای `workspaces`/`workspaceId` که
  فقط برای اون picker حذف‌شده وجود داشتن، و import بی‌استفاده‌ی `Workspace`
  type.
- **تست واقعی**: `pnpm build` پاس شد. HTTP smoke-test end-to-end با
  gateway واقعی: `POST /v1/workspaces` → workspace ساخته شد → `POST
/v1/agents` با همون `workspaceId` → Agent با موفقیت به همون workspace
  اختصاصی بایند شد (تأیید در پاسخ JSON).

---

### RT-030 — Branding (آپلود لوگو) با MinIO/S3 واقعی (۲۰۲۶-۰۷-۱۸)

✅ انجام شد — اولین integration واقعی این پروژه با object storage.

- **Migration `0029_org_branding.sql`**: `organizations.logo_light_url`/
  `logo_dark_url` (هر دو nullable — یعنی بدون لوگو، همون نشان پیش‌فرض O2N).
- **`lib/object-storage.ts` (جدید)**: wrapper نازک دور `@aws-sdk/client-s3`،
  به یک MinIO خودمیزبان اشاره می‌کنه (چون MinIO سازگار با S3 است، همین
  کد بدون تغییر روی AWS S3 واقعی هم بعداً کار می‌کنه). **یک یافته‌ی واقعی
  حین تست**: باکت‌های MinIO پیش‌فرض کاملاً private هستن — آپلود اول موفق
  می‌شد ولی URL برگشتی ۴۰۳ می‌داد روی fetch. فیکس: `ensureBucket()` حالا
  یک bucket policy با `s3:GetObject` عمومی هم روی باکت تازه‌ساز می‌ذاره —
  چون لوگوی برندینگ باید برای هر بازدیدکننده‌ی صفحه لاگین/sidebar قابل‌دیدن
  باشه، نه فقط API call‌های احراز‌هویت‌شده.
- **`env.ts`**: `MINIO_ENDPOINT`/`MINIO_PORT`/`MINIO_USE_SSL`/`MINIO_ROOT_USER`/
  `MINIO_ROOT_PASSWORD`/`MINIO_BUCKET`/`MINIO_PUBLIC_URL` — همه اختیاری،
  همون الگوی «degrade gracefully» (بدون پیکربندی، مسیر upload با پیام
  روشن ۴۰۰ می‌ده، نه crash).
- **Routes**: `POST /v1/organization/branding` (multipart، یک variant
  `light`/`dark` در هر بار، `@fastify/multipart` با سقف ۲ مگابایت، permission
  جدید `branding:update` + audit).
- **UI**: بخش Branding در Settings (دو `<input type="file">` + پیش‌نمایش
  لوگوی فعلی)؛ `Sidebar.tsx` حالا لوگوی سازمان رو (اولویت با نسخه‌ی
  dark-background چون پس‌زمینه‌ی sidebar تیره‌ست) به‌جای متن اسم سازمان
  نشون می‌ده، اگه ست شده باشه.
- **عمداً ساخته نشده**: برندینگ در صفحه‌ی login — قبل از احراز هویت هنوز
  معلوم نیست کاربر مال کدوم سازمانه (بدون یک مرحله‌ی جدید «اول slug رو
  وارد کن» که خارج scope این تسک بود)، پس این بخش از یادداشت اصلی RT-030
  عمداً پیاده نشد.
- **تست واقعی**: `lib/object-storage.test.ts` — یک تست unit (بدون MinIO)
  - یک تست integration واقعی که وقتی `MINIO_ENDPOINT` ست باشه اجرا می‌شه
    (وگرنه با `describe.skip` رد می‌شه، نه fail): آپلود واقعی + fetch واقعی
    از همون URL برگشتی، محتوا بایت‌به‌بایت چک شد. `org-service.test.ts`
    دو تست جدید برای `updateBranding` (پیش‌فرض null، ست‌کردن یک variant
    بدون پاک‌کردن اون یکی). کل مجموعه‌ی gateway (۴۰ فایل، ۲۰۳ تست، +۱ تست
    integration وقتی MinIO env ست بشه) پاس شد. یک HTTP smoke-test کامل
    دستی هم: gateway واقعی + MinIO واقعی بالا اومدن، یک PNG واقعی (تولیدشده
    با یک اسکریپت PNG-encoder دستی) از طریق `curl -F` آپلود شد، URL برگشتی
    با `curl` دیگه fetch شد و `200`/`image/png` واقعی گرفت.

---

### RT-025 — فایل‌های workspace اختصاصی per-agent (۲۰۲۶-۰۷-۱۸)

✅ انجام شد — بلافاصله بعد از RT-030، همون زیرساخت MinIO رو استفاده کرد
و **یک باگ امنیتی واقعی توی خودِ RT-030 پیدا کرد**.

- **⚠️ باگ امنیتی پیدا/فیکس‌شده**: نسخه‌ی اول `lib/object-storage.ts`
  (RT-030) کل باکت رو public می‌کرد تا لوگوی برندینگ قابل‌دیدن باشه. اگه
  همون تابع بدون تغییر برای فایل‌های workspace (این تسک) هم استفاده
  می‌شد، یعنی **فایل‌های خصوصی هر سازمان به کل اینترنت لو می‌رفت** — قبل
  از نوشتن هیچ کد جدیدی، `object-storage.ts` بازنویسی شد: `uploadFile()`
  حالا یک پارامتر `{ public?: boolean }` می‌گیره؛ `public: true` (فقط
  برندینگ) یک policy عمومی **محدود به همون prefix** (نه کل باکت) اضافه
  می‌کنه؛ پیش‌فرض (`public` نبودن، یعنی فایل‌های workspace) یک presigned
  URL یک‌ساعته برمی‌گردونه، نه لینک دائمی. یک تست جدید مشخصاً این رو
  تأیید می‌کنه: آپلود یک فایل private و یک فایل public کنار هم توی همون
  باکت، بعد تأیید مستقیم با `fetch` بدون امضا که فایل private واقعاً
  ۴۰۳/۴۰۴ می‌گیره.
- **Migration `0030_workspace_files.sql`**: جدول `workspace_files`
  (metadata فقط — بدون ستون url، چون presigned URL هر بار تازه ساخته
  می‌شه، نه cache شده).
- **`services/workspace-file-service.ts`**: CRUD ساده، org-scoped روی
  `getById`/`delete` (یک file id هیچ‌وقت بین سازمان‌ها resolve نمی‌شه).
- **Routes (`routes/agent-files.ts`)**: عمداً **agent-scoped**
  (`/v1/agents/:agentId/files`) نه workspace-scoped — تا بتونه از همون
  `requireAgentAccessible` موجود (همون چک دسترسی chat/tools) استفاده
  کنه، به‌جای اختراع یک مفهوم membership جدا برای workspace. سقف حجم
  ۲۰ مگابایت.
- **UI**: پنل «Files» توگل‌شونده کنار چت (`agents/[id]/chat/page.tsx`) —
  لیست/آپلود/دانلود/حذف. چون RT-021 (چیدمان ۳پنلی Control/Chat/Workspace)
  هنوز ساخته نشده، این یک پنل ساده‌ی self-contained است، نه بخشی از اون
  چیدمان کامل — بعداً راحت داخلش جا می‌گیره.
- **تست واقعی**: ۴ تست جدید `workspace-file-service.test.ts` (شامل تست
  org-isolation) + ۳ تست امنیتی جدید در `object-storage.test.ts` (پابلیک،
  private-presigned، private-کنار-پابلیک-بدون-لو-رفتن). کل مجموعه‌ی
  gateway (۴۱ فایل، ۲۰۷ تست) پاس شد. یک HTTP smoke-test کامل end-to-end
  دستی: آپلود یک فایل واقعی → لیست → گرفتن presigned URL → واقعاً
  `fetch` محتوای درست → حذف (۲۰۴) → لیست دوباره خالی. Cleanup این‌بار
  درست انجام شد (با ترتیب صحیح `audit_logs` قبل از `users`/`organizations`
  — طبق همون الگوی `cleanupTestFixture` که از قبل توی تست‌ها بود).

---

### RT-031 — Context Contract + Prompt Builder (۲۰۲۶-۰۷-۱۸)

✅ انجام شد — قبل از این، کل system prompt هر چت یک خط ثابت بود:
`You are ${agent.name}, a ${agent.role} digital employee.` — بدون
workspace/org/memory/tools/زبان. طبق
`docs/spect/02_ARCHITECTURE/01-system-overview.md`'s "Context Contract"،
context باید یک artifact رسمی با لایه‌های مشخص باشه، نه متن آزاد.

- **`services/context-builder.ts`** (`ContextBuilder.build()`) این
  لایه‌ها رو از داده‌ی واقعی می‌سازه:
  - `identity`: نام/نقش/id همون Agent (از قبل شناخته‌شده بود، فقط حالا
    رسمی شد)
  - `task`: پیام فعلی + conversationId
  - `workspace`: نام سازمان + نام workspace (از `OrgService`/
    `WorkspaceService` — `WorkspaceService` یک متد `getById` جدید گرفت،
    قبلاً نداشت)
  - `memory`: خلاصه‌ی مکالمه (`conversations.summary`، از قبل توسط
    `maybeSummarize` پر می‌شد ولی هیچ‌وقت به prompt نمی‌رفت) + جست‌وجوی
    semantic (`searchMessagesSemantic`) روی پیام‌های قدیمی‌تر — فقط وقتی
    مکالمه از پنجره‌ی ۱۰ پیام اخیر (که همین الان کامل replay می‌شه)
    بزرگ‌تره، تا تکراری نشه
  - `tools`: اسم Skillها/Pluginهای grant‌شده به همین Agent (از
    `SkillGrantService`/`PluginGrantService` + resolve اسم واقعی از
    `SkillService`/`LocalPluginService`). **محدودیت شناخته‌شده**: grant
    یک Plugin نصب‌شده از Marketplace (id بین‌پلین، بدون ردیف
    `local_plugins`) در این لایه resolve نمی‌شه — بی‌صدا حذف می‌شه، نه
    خطا (تست مشخصاً همینو چک می‌کنه)
  - `permissions`: بودجه‌ی باقی‌مونده‌ی Agent (`monthlyBudgetCents -
usedBudgetCents`)
  - `language`: `user.language ?? organization.language` — محاسبه‌شده
    سمت سرور (بخشی از artifact رسمی)، نه گرفته‌شده از فرانت
  - `trace`: traceId همون که از قبل بود
- **`services/prompt-builder.ts`** (`buildSystemPrompt()`): تابع خالص،
  context رو به یک system message فشرده می‌کنه — هر بخش فقط وقتی خالی
  نیست اضافه می‌شه (یک Agent بدون grant/بدون خلاصه/بدون memory مرتبط
  همون prompt کوتاه قبلی رو می‌گیره، بدون تورم).
- **سیم‌کشی**: `chat-service.ts`'s `prepare()` حالا `ContextBuilder` رو
  صدا می‌زنه و `systemPrompt` رو از `buildSystemPrompt(context)` می‌گیره
  به‌جای اون خط ثابت قبلی.
- **⚠️ باگ واقعی پیدا/فیکس‌شده در زیرساخت مشترک تست‌ها**: هیچ تست قبلی
  مستقیماً `MemoryService`/conversation نساخته بود، پس
  `test-support/fixtures.ts`'s `cleanupTestFixture()` هیچ‌وقت
  `conversations` رو قبل از `users` پاک نمی‌کرد —
  `conversations.user_id` هیچ `ON DELETE CASCADE` نداره
  (`migrations/0003_memory.sql`)، پس اولین تستی که واقعاً یک مکالمه
  ساخت (تست‌های همین تسک) با خطای FK واقعی مواجه شد. فیکس شد: یک
  `DELETE FROM conversations WHERE agent_id IN (...)` قبل از
  `DELETE FROM users` اضافه شد (messages از طریق conversation_id
  cascade می‌شه، نیازی به DELETE جدا نداره).
- **تست واقعی**: ۷ تست جدید `prompt-builder.test.ts` (تابع خالص) + ۴
  تست جدید `context-builder.test.ts` (Postgres واقعی — identity/
  workspace/language، resolve اسم skill/plugin واقعی + حذف بی‌صدای
  grant بین‌پلینی، آستانه‌ی relevant-memory، اولویت زبان کاربر روی
  سازمان). کل مجموعه‌ی gateway (۴۳ فایل، ۲۱۸ تست) پاس شد. یک
  HTTP smoke-test کامل end-to-end با مدل واقعی محلی (Ollama
  `gemma3:4b`): ساخت Agent → چت "اسمت چیه و توی چه workspace‌ای هستی؟"
  → جواب مدل واقعاً "RT031 Agent" و "Default Workspace" رو از همون
  system prompt جدید در آورد (نه از قبل می‌دونست) → ساخت+grant یک
  Skill به اسم «Send Weekly Report» → پرسیدن «اسم دقیق toolهات رو
  بگو» → مدل دقیقاً همون اسم رو verbatim برگردوند، که ثابت می‌کنه
  لایه‌ی `tools` واقعاً به system prompt رسیده، نه صرفاً کد نوشته‌شده
  و تست‌شده در خلأ.

---

### RT-022 — Session management در UI (۲۰۲۶-۰۷-۱۸)

✅ انجام شد — قبل از این، هر Agent فقط یک "مکالمه‌ی فعلی" داشت
(`GET /v1/agents/:id/conversation`، تک‌عددی، همیشه آخرین). حالا چند
session مستقل ممکنه.

- **`services/memory-service.ts`** چهار متد جدید گرفت: `listConversations`
  (پیش‌فرض بدون archived، `includeArchived` اختیاری)، `createConversation`
  (صریح — متفاوت از `getOrCreateConversation` که implicit resume-or-create
  می‌کنه)، `renameConversation`، `archiveConversation` (soft — status،
  نه DELETE، چون messages/audit trail باید بمونه).
- **`routes/conversations.ts`** (جدید): تمام route‌ها agent-scoped
  (`/v1/agents/:agentId/conversations...`) همون الگوی `agent-files.ts` —
  تا از `requireAgentAccessible` موجود استفاده کنه:
  - `GET /v1/agents/:agentId/conversations` — لیست
  - `POST /v1/agents/:agentId/conversations` — «+ New session» (با
    `title` اختیاری)
  - `GET .../conversations/:conversationId/messages` — سوییچ به یک
    session دیگه
  - `PATCH .../conversations/:conversationId` — rename
  - `POST .../conversations/:conversationId/archive`
  - `assertConversationBelongsToAgent`: یک conversation id از Agent دیگه
    دقیقاً مثل id ناموجود ۴۰۴ می‌گیره (نه ۴۰۳) — با curl مستقیم تست شد.
- **UI**: پنل «Sessions» توگل‌شونده کنار «Files» در صفحه‌ی چت — لیست
  اخیر (عنوان/تعداد پیام)، دکمه‌ی «+ New session» در topbar، کلیک روی
  یک session سوییچ می‌کنه (پیام‌هاش رو لود می‌کنه)، rename/archive
  per-session. اگه session فعال archive بشه، خودکار به آخرین session
  فعال برمی‌گرده (`loadHistory`).
- **⚠️ باگ واقعی پیدا/فیکس‌شده در زیرساخت مشترک تست‌ها**: همون کلاس باگ
  RT-031 — هیچ تست قبلی چند `conversation` واقعی برای یک fixture user
  نساخته بود، پس این تسک اولین‌باری بود که `cleanupTestFixture`'s
  fix (اضافه‌شده در RT-031) واقعاً زیر بار قرار گرفت؛ کار کرد، نیازی به
  فیکس اضافه نبود.
- **تست واقعی**: ۴ تست جدید `memory-service.test.ts` (create متمایز از
  resume، ترتیب `updated_at`، rename + NotFoundError روی id ناموجود،
  archive + فیلتر پیش‌فرض). کل مجموعه‌ی gateway (۴۴ فایل، ۲۲۲ تست) پاس
  شد. HTTP smoke-test کامل end-to-end: ساخت Agent → چت پیش‌فرض (session
  ۱) → `POST .../conversations` صریح (session ۲) → چت داخل session ۲ با
  `conversationId` صریح → `GET .../messages` واقعاً پیام‌های همون session
  رو برگردوند → rename → archive → `GET .../conversations` پیش‌فرض
  واقعاً session آرشیوشده رو حذف کرد → تلاش برای گرفتن conversation
  session ۱ از مسیر Agent دیگه واقعاً ۴۰۴ گرفت (نه ۲۰۰/۴۰۳).

---

### RT-021 — صفحه Chat: چیدمان دائمی ۳پنلی (۲۰۲۶-۰۷-۱۸)

✅ انجام شد — طبق `docs/spect/00_VISION/05-ux-ui-design.md`'s §5.1
(«ساختار صفحه Chat — Agent / Session / Workspace»). قبل از این، پنل‌های
Sessions (RT-022) و Files (RT-025) toggle بودن، نه بخشی از یک چیدمان
ثابت. این تسک بدون backend جدید فقط UI رو بازآرایی کرد و دو تیکه‌ی
missing سند رو اضافه کرد: سوییچر Agent و مدال ساخت Agent مستقیم از
همین صفحه.

- **پنل چپ (Control)**: به‌جای toggle، همیشه رندر می‌شه. شامل:
  - `<select>` سوییچ Agent — تغییرش با `router.push` به
    `/agents/:id/chat` می‌ره (صفحه از نو mount می‌شه، همون معماری
    App Router موجود؛ سوییچ soft بین state مشترک نبود چون هر Agent
    مستقل خودش تمام state رو (پیام‌ها/session‌ها/فایل‌ها) از سرور
    می‌خونه)
  - دکمه‌ی `+` کنار dropdown، فقط `session.role === 'admin'` — یک
    فرم فشرده‌ی ساخت Agent (نام + نقش از `AGENT_ROLE_CATALOG` + Other)
    که دقیقاً همون الگوی `/agents` صفحه رو تکرار می‌کنه (workspace
    اختصاصی ۱:۱ خودکار، RT-023)، بعد از ساخت خودش با `router.push` به
    چت Agent جدید می‌ره
  - `+ New session` + لیست sessionهای اخیر (از RT-022، فقط جابه‌جا شده
    از پنل toggle به این پنل دائمی)
- **پنل وسط (Chat)**: بدون تغییر منطقی — همون streaming/approval/rate-limit
  که از قبل بود.
- **پنل راست (Workspace)**: فایل‌های Agent (از RT-025)، حالا با دکمه‌ی
  «↻ Refresh» صریح به‌جای فقط لود اول توگل. عملیات «open» (لینک
  presigned) به‌جای «Download» به سند نزدیک‌تره.
- **RTL mirroring**: کانتینر ۳پنل با `flexDirection: isRtlLanguage(...)
? 'row-reverse' : 'row'` — طبق سند («Control سمت راست، Workspace سمت
  چپ»)، بدون نیاز به duplicate کردن JSX پنل‌ها به ترتیب متفاوت.
- **⚠️ محدودیت صادقانه در تست**: این محیط ابزار مرورگر (Playwright و
  مشابه) نداره. verification واقعی انجام‌شده:
  - TypeScript/ESLint تمیز، `next build` production کامل موفق (۲۳
    صفحه، از جمله `/agents/[id]/chat`)
  - گیتوی + وب دوتاشون واقعاً بالا اومدن (پورت‌های جدا، `NEXT_PUBLIC_API_URL`
    به سمت گیتوی محلی) و `curl` صفحه‌ی چت واقعاً `200` گرفت، بدون
    exception توی لاگ dev server (`next dev`'s "Compiled" پاک بود)
  - داده‌ای که این پنل‌ها نشون می‌دن (agents/sessions/files) از قبل با
    curl واقعی در RT-022/RT-025 تأیید شده بود
  - چیزی که **تست نشده**: کلیک واقعی روی dropdown/دکمه‌ها توی مرورگر،
    ظاهر بصری واقعی، RTL mirroring به چشم دیدن. این باید توسط شما با
    مرورگر واقعی چک بشه.

---

### RT-027 — تکمیل: Upload ZIP دستی برای پلاگین self-hosted (۲۰۲۶-۰۷-۱۸)

✅ کامل شد — مسیر Marketplace (RT-035/RT-036) از قبل انجام شده بود؛
این بخش فقط تیکه‌ی باقی‌مونده («Upload ZIP دستی») رو بست.

- **`POST /v1/plugins/upload`** (`routes/local-plugins.ts`، multipart،
  سقف ۵ مگابایت): ادمین یک `.zip` از پروژه‌ی scaffold‌شده با
  `create-o2n-plugin` (`packages/create-o2n-plugin`) آپلود می‌کنه —
  همون که یک `manifest.json` در ریشه‌اش داره (`{ id, name, version,
description, author, license, permissions, models, hooks,
configSchema }`).
  - **⚠️ تصمیم امنیتی صریح**: فقط `manifest.json` از zip خونده می‌شه —
    هیچ entry دیگه‌ای (مثل `actions/*.ts`) هیچ‌وقت روی دیسک extract
    نمی‌شه. یعنی کلاً سطح حمله‌ی zip-slip/path-traversal (که در هر
    zip-extractor عمومی معمول‌ترین باگ امنیتیه) از اساس وجود نداره —
    نه فیکس شده، از اول طراحی نشده.
  - `manifest.name` → `name`، `manifest.description` (اگه رشته باشه)
    → `description`، خودِ کل JSON پارس‌شده → ستون `manifest` (همون
    شکلی که مسیر JSON دستی از قبل ذخیره می‌کرد). `category` یک فیلد
    فرم جدا (نه بخشی از zip) چون مفهوم متفاوتیه (تاکسونومی
    `PLUGIN_CATEGORIES`، نه چیزی که scaffold تولید می‌کنه).
  - gating لایسنس RT-028 (دسته‌ی `devops` نیاز به Managed AI Gateway)
    از مسیر JSON قبلی به یک تابع مشترک (`assertPluginCategoryAllowed`)
    refactor شد تا مسیر zip هم دقیقاً همون رفتار رو بگیره، بدون کپی
    منطق.
  - وابستگی جدید: `adm-zip` (zero-dependency، sync، فقط برای خوندن یک
    entry، بدون نیاز به هیچ extract-to-disk).
- **UI**: بخش «Self-hosted plugins» جدید در صفحه‌ی Marketplace —
  فیلد آپلود zip + انتخاب category اختیاری + لیست پلاگین‌های
  self-hosted موجود + حذف.
- **تست واقعی**: کل مجموعه‌ی gateway (۴۴ فایل، ۲۲۲ تست) پاس شد (بدون
  تست جدید — این کدبیس routeها رو با HTTP smoke-test تست می‌کنه، نه
  Fastify-level automated test، دقیقاً مثل بقیه‌ی routeهای موجود).
  HTTP smoke-test واقعی end-to-end با یک zip واقعی (ساخته‌شده با
  `adm-zip`، دقیقاً مطابق شکل scaffold): آپلود موفق → `GET /v1/plugins`
  واقعاً پلاگین رو با name/description/category/manifest درست
  برگردوند. چهار مسیر خطا هم جداگانه تست شد: zip نامعتبر (نه یک zip
  واقعی) → ۴۰۰، zip بدون `manifest.json` در ریشه → ۴۰۰، category
  نامعتبر → ۴۰۰، category=`devops` بدون لایسنس → ۴۰۲
  (`FEATURE_NOT_AVAILABLE`، دقیقاً مثل مسیر JSON).

---

### RT-071 — تکمیل: آپلود ابری backup (۲۰۲۶-۰۷-۱۸)

✅ کامل شد — بخش `pg_dump`/`pg_restore` + scheduler opt-in از قبل
انجام شده بود؛ این تسک فقط گپ صریحاً ثبت‌شده («آپلود ابری TODO») رو
بست، با استفاده از همون زیرساخت MinIO/S3 که RT-025/RT-030 ساختن —
بدون هیچ credential/سرویس ابری جدید.

- **`services/backup-service.ts`**'s `uploadBackupToCloud(env, filePath)`:
  فایل local dump رو زیر prefix خصوصی `backups/` آپلود می‌کنه
  (`uploadFile(..., { public: false })`‌ی پیش‌فرض — یک dump دیتابیس
  هیچ‌وقت نباید public باشه). Best-effort دقیقاً مثل الگوی embeddings/
  SMTP/Marketplace این پروژه: اگه object storage پیکربندی نشده باشه
  یا آپلود fail بشه، `null` برمی‌گردونه (نه throw) — یک outage توی
  آپلود ابری نباید یعنی «backup fail شد»، چون فایل local از قبل با
  موفقیت نوشته شده و به‌تنهایی هم مفیده.
- **`services/backup-scheduler.ts`**: بعد از `runBackup()` موفق، اگه
  `isObjectStorageConfigured(ctx.env)` باشه، `uploadBackupToCloud`
  صدا زده می‌شه؛ سازمانی که MinIO پیکربندی نکرده دقیقاً همون رفتار
  local-disk-only قبلی رو می‌گیره، بدون تغییر.
- **`scripts/backup-db.mjs`** (CLI دستی، `pnpm run backup`) هم همین
  قابلیت رو گرفت — یک env object حداقلی (فقط فیلدهایی که
  `object-storage.js` واقعاً می‌خونه) می‌سازه، بدون نیاز به کل
  Zod validation فایل `env.ts` (همون الگوی سبک‌وزنی که `migrate.mjs`
  از قبل داشت).
- **تست واقعی**: ۲ تست جدید در `backup-service.test.ts` — یکی همیشه
  اجرا می‌شه (بدون MinIO پیکربندی‌شده، `null` برمی‌گردونه، نه throw)،
  یکی روی MinIO واقعی (`describeIfMinio`، دقیقاً الگوی
  `object-storage.test.ts`): آپلود یک فایل fake-dump واقعی → گرفتن
  presigned URL → `fetch` واقعی محتوای درست گرفت → یک درخواست مستقیم
  بدون امضا به همون کلید واقعاً ۲۰۰ نگرفت (private بودن تأیید شد).
  کل مجموعه‌ی gateway با MinIO فعال: ۴۴ فایل، ۲۲۷ تست پاس، ۳ تا
  skip (همون تست‌های قبلی pg_dump/pg_restore — این محیط این
  باینری‌ها رو روی PATH نداره، محدودیت محیطی از قبل مستندشده، نه
  چیزی که این تسک ایجاد کرده باشه؛ `pg_dump`/`pg_restore` فقط داخل
  کانتینر Postgres هست، نه روی host).

---

### RT-091 — i18n: زیرساخت مصرف واقعی + Sidebar/چت (۲۰۲۶-۰۷-۱۸، subset)

⚠️ **subset واقعی، نه کامل** — کشف مهم: RT-083 در جلسه‌ی قبل
`GET /v1/locales/:lang` (reference `en.json` + ترجمه‌ی AI on-demand،
cache‌شده) رو ساخته بود، ولی **هیچ صفحه‌ای توی وب اصلاً این endpoint
رو صدا نمی‌زد** — یعنی کل ویژگی i18n تا این لحظه کد مرده بود؛ فقط
جهت RTL/LTR (`isRtlLanguage`/`applyDocumentDirection`) واقعی بود، نه
متن ترجمه‌شده.

- **`web/lib/i18n.ts`**'s `useLocaleStrings(language)`: هوک جدید،
  `t(key, fallback)` برمی‌گردونه. `en` فوری از reference resolve
  می‌شه؛ زبان‌های دیگه از بک‌اند fetch (و در یک Map سطح-ماژول cache)
  می‌شن — چون Sidebar روی هر صفحه از نو mount می‌شه (این اپ shared
  layout نداره)، بدون cache هر navigation یک fetch جدید می‌زد.
  همیشه non-blocking: قبل از resolve شدن، یا اگه key نبود، `fallback`
  برمی‌گرده — یعنی برای کاربر انگلیسی دقیقاً همون چیزی که همیشه
  بوده رو می‌بینه.
- **`gateway/locales/en.json`**: ۱۸ کلید `nav.*` جدید اضافه شد (یک
  به یک با `Sidebar.tsx`'s `NAV_LINKS` + sign out + collapse/expand
  tooltip + منوی موبایل) — قبلاً فقط ۷ کلید chat/settings/login
  داشت که هیچ‌کدوم مصرف نمی‌شدن.
- **`components/Sidebar.tsx`**: حالا زبان مؤثر (`user.language ??
organization.language`) رو خودش می‌گیره (همون fetch سازمانی که
  از قبل برای لوگو داشت، فقط با `getMe()` هم ترکیب شد) و همه‌ی
  nav labelها/sign out/tooltipها رو از `t()` می‌گیره. چون Sidebar
  **روی همه‌ی صفحات authenticated رندر می‌شه**، این یعنی منوی
  ناوبری الان واقعاً روی هر صفحه‌ای ترجمه می‌شه — نه فقط چت.
- **صفحه‌ی چت**: کلیدهای از قبل موجود ولی مرده‌ی `chat.*`
  (title/backToAgents/inputPlaceholder/send) الان واقعاً استفاده
  می‌شن.
- **⚠️ صراحتاً باقی‌مونده**: محتوای خودِ هر صفحه (جدول‌ها، برچسب
  فرم‌ها، دکمه‌ها) در Skills، Marketplace، Marketplace/publisher،
  Users، Roles، Policies، Workflows، Webhooks، Outcomes، Audit،
  Workspaces، Approvals، Skill Proposals، Dashboard، و بخش عمده‌ی
  Settings هنوز انگلیسی hardcode هستن — هر کدوم به یک pass جدا
  برای استخراج کلید نیاز دارن (ده‌ها رشته در هر صفحه)، کاری واقعی
  و قابل‌توجه که این تسک عمداً موکول به بعد کرد، نه کاری که «فراموش»
  شده باشه.
- **تست واقعی**: `locale-service.test.ts` (۵ تست، از قبل) بدون
  تغییر پاس شد. `npm run build` وب (۲۳ صفحه) موفق — چون Sidebar
  shared component است، این یعنی import جدید توی همه‌ی صفحات compile
  شد. HTTP smoke-test: `GET /v1/locales/en` واقعاً همه‌ی کلیدهای
  جدید `nav.*` رو برگردوند؛ یک فایل cache شبیه‌سازی‌شده‌ی فارسی
  (`locales/generated/fa.json`، بعداً حذف شد) گذاشته شد و
  `GET /v1/locales/fa` واقعاً `source: "cached"` با محتوای فارسی
  برگردوند — مسیر non-English backend تأیید شد. **محدودیت تست**:
  بدون ابزار مرورگر، رندر واقعی متن ترجمه‌شده در UI (نه فقط پاسخ
  API) تست نشد.

---

### زیرساخت — کشف/فیکس: CI واقعاً از ۱۲ تیر (۲۰۲۶-۰۷-۱۲) خراب بوده (۲۰۲۶-۰۷-۱۸)

⚠️ **کشف مهم، نه یک تسک از لیست بخش A** — حین بررسی pnpm-lock.yaml
(که برای RT-027 لازم شد commit بشه، پایین‌تر توضیح داده شده)، متوجه
شدم CI مدتیه واقعاً سبز نمی‌شه. با چک کردن تاریخچه‌ی کامل run‌های CI
از GitHub API، مشخص شد: از commit «chore: add skil[l]» در
۲۰۲۶-۰۷-۱۲ تا همین الان (تقریباً ۴۰ run پشت‌سرهم، شامل کل کار جلسه‌ی
قبل — RT-034 تا RT-083 — و کل کار همین جلسه)، CI هیچ‌وقت واقعاً سبز
نشده. دو مشکل جدا، هر دو واقعی:

1. **مرحله‌ی «Install dependencies» (`pnpm install --frozen-lockfile`)**:
   از commit RT-031 به بعد fail می‌کرد، چون `pnpm-lock.yaml` این
   جلسه اصلاً commit نشده بود (طبق یک قاعده‌ی قبلی که دلیلش این بود
   که یه diff بزرگ نامفهوم از قبل توی این فایل بود) — درحالی‌که
   وابستگی‌های جدید واقعی (adm-zip، @aws-sdk/*، @fastify/multipart،
   ...) به `gateway/package.json` اضافه می‌شدن. **فیکس**: واقعاً
   `pnpm install` کامل روی روت اجرا شد (تأیید شد "Lockfile is up to
   date")، بعد `pnpm install --frozen-lockfile` محلی موفق تأیید شد،
   بعد commit شد — این‌بار برخلاف قاعده‌ی قبلی، چون آن قاعده مستقیماً
   داشت باعث این خرابی می‌شد.
2. **مرحله‌ی «Lint, typecheck, test»**: از ۲۰۲۶-۰۷-۱۲ به این‌ور همیشه
   fail می‌کرده، چون workflow (`ci.yml`) اصلاً هیچ‌وقت Postgres/Redis
   واقعی نداشته — تست‌های gateway (`test-support/db.ts`, `redis.ts`)
   به یک دیتابیس/Redis واقعی نیاز دارن، و بدون اون‌ها هر تستی که یک
   fixture می‌ساخت با `ECONNREFUSED 127.0.0.1:5432/6379` fail می‌شد،
   صرف‌نظر از این‌که خودِ تست چی چک می‌کرد.
   - **فیکس** در `.github/workflows/ci.yml`: اضافه شدن
     `services: { postgres: postgres:16, redis: redis:7-alpine }` +
     `env: { DATABASE_URL, REDIS_URL }` سطح job + یک مرحله‌ی جدید
     «Run database migrations» (مستقیم `node scripts/migrate.mjs`،
     نه `pnpm run migrate`، چون آن npm script نیاز به یک فایل
     `--env-file=../.env` داره که توی این checkout وجود نداره —
     خودِ اسکریپت فقط `process.env.DATABASE_URL` رو می‌خونه که از
     قبل ست شده) قبل از مرحله‌ی تست.
   - تست‌های وابسته به MinIO عمداً همچنان توی CI skip می‌مونن
     (همون الگوی `describeIfMinio`/`minioAvailable` که قبلاً برای
     محیط محلی بدون MinIO هم استفاده می‌شد) — MinIO service container
     اضافه نشد، چون پیچیدگیش (image/healthcheck) برای این batch
     ارزشش رو نداشت؛ همون‌طور تست‌های `pg_dump`/`pg_restore` هم اگه
     runner این باینری‌ها رو نداشته باشه skip می‌مونن.

- **تست واقعی قبل از push**: دقیقاً همین توالی رو با کانتینرهای
  تازه/خالی `postgres:16`/`redis:7-alpine` (نه dev containerهای
  دائمی) محلی شبیه‌سازی کردم: `migrate.mjs` همه‌ی ۳۰ migration رو
  تمیز apply کرد (۰۰۰۸ که به `vector` نیاز داره طبق همون رفتار
  همیشگی skip شد)، بعد کل مجموعه‌ی gateway (۴۴ فایل، ۲۲۳ تست، ۷
  skip) پاس شد — دقیقاً همون توالی که این workflow الان اجرا می‌کنه.

- **⚠️ یک لایه‌ی سوم، غیرمنتظره، هم پیدا شد**: بعد از فیکس‌های بالا،
  «Install dependencies» و «Build» توی CI واقعی سبز شدن، ولی «Lint,
  typecheck, test» همچنان — و این‌بار **دقیقاً و همیشه همون سه فایل**
  (`agent-message-service.test.ts`, `health.test.ts`,
  `agent-access.test.ts`) با «password authentication failed for user
  "on4netdbuser"» (یعنی fallback هاردکدشده‌ی `test-support/db.ts`، نه
  مقدار `DATABASE_URL` واقعی) fail می‌کرد — با اینکه محلی (حتی با
  کانتینرهای تازه، حتی با `--env-mode=strict --force`) این قابل
  تکرار نبود. تشخیص واقعی (نه حدس): یک مرحله‌ی موقت اضافه شد که
  vitest رو مستقیم (بدون turbo) اجرا می‌کرد؛ همزمان `turbo.json`
  (روت) یک `"env": ["DATABASE_URL", "REDIS_URL"]` صریح برای تسک
  `test` گرفت — طبق مستندات Turborepo، یک متغیر محیطی فقط وقتی
  تضمین می‌شه به پردازش فرزند یک تسک برسه که همین‌جا declare بشه،
  صرف‌نظر از این‌که سطح job/step چی ست شده. بعد از این فیکس، run
  کامل سبز شد (هم مرحله‌ی تشخیصیِ مستقیم، هم «Lint, typecheck,
  test» واقعی از طریق turbo) — مرحله‌ی تشخیصی موقت بعداً حذف شد.
  **درس**: تنظیم env در سطح GitHub Actions (`job.env`/`step.env`)
  کافی نیست وقتی یک ابزار build مثل Turborepo واسط اجراست؛ باید توی
  خودِ `turbo.json` هم صریح declare بشه.

- **نتیجه‌ی نهایی، تأییدشده با واقعیت نه امید**: commit
  `1e6c8f6` (runtime) + `2950df6` (root) → CI کامل سبز
  (`lint-typecheck-test-build`: success، همه‌ی ۱۶ step). این اولین
  بار از ۲۰۲۶-۰۷-۱۲ است که CI این ریپو واقعاً سبز می‌شه.

---

### RT-084 — فرایند فکری قابل‌مشاهده (۲۰۲۶-۰۷-۱۸، subset واقعی)

⚠️ **subset واقعی، نه کامل** — دو تصمیم معماری سند صراحتاً می‌خواست
(«باید تصمیم گرفته بشه») این‌جا واقعاً گرفته شد، با دلیل مشخص، نه حدس:

- **تصمیم ذخیره‌سازی**: جدول `messages` با یک `role` جدید به اسم
  `'thought'` — نه جدول جدا (`agent_thoughts`). چون `messages.role`
  یک `VARCHAR(20)` بدون CHECK constraint بود، هیچ migration لازم
  نبود؛ فقط `MessageRole` (packages/shared) یک مقدار جدید گرفت.
  `'thought'` هیچ‌وقت به تاریخچه‌ی replay‌شده به مدل برنمی‌گرده
  (`toLlmRole()`، دقیقاً همون رفتار `'tool'`).
- **تصمیم provider**: پیاده‌سازی extended thinking واقعی Anthropic
  عمداً **رد شد** — نسخه‌ی نصب‌شده‌ی `@anthropic-ai/sdk` (۰.۳۰.۱) کلاً
  از قبل از این قابلیت است (`ContentBlock` فقط `TextBlock |
ToolUseBlock`، نه در stable نه در beta). ارتقاء SDK (۰.۳۰ → ۰.۱۱x+،
  حدود ۸۰ نسخه‌ی minor) ریسک واقعی داره روی هر ویژگی دیگه‌ای که از
  قبل به Anthropic متکیه — یک تسک جدا و عمداً موکول‌شده، نه بخشی از
  این batch.
- **مسیر واقعی که کار می‌کنه**: `packages/llm-providers`'s
  `openai-compatible-provider.ts` حالا فیلد غیراستاندارد
  `reasoning_content` رو می‌خونه (هم `complete()` هم `stream()`) —
  همون فیلدی که DeepSeek's `deepseek-reasoner` و بعضی مدل‌های Ollama
  واقعاً برمی‌گردونن. `LlmCompletionResult.reasoning?` و
  `LlmStreamChunk.isReasoning?` فیلدهای جدید (`@o2n/llm-providers`).
- **`chat-service.ts`**: `persistTurn()` اگه `reasoning` داشته باشه،
  یک ردیف `'thought'` درست قبل از ردیف `'agent'` می‌نویسه (همون
  تراکنش). `chatStream()` یک نوع رویداد SSE جدید داره: `event:
reasoning` (جدا از `event: token`).
- **⚠️ باگ واقعی پیدا/فیکس‌شده حین نوشتن تست**: Postgres's `NOW()`
  توی یک تراکنش **فریز**‌شده (زمان شروع تراکنش، نه زمان واقعی هر
  statement) — یعنی ردیف `'thought'` و ردیف `'agent'` که هر دو توی
  همون تراکنش نوشته می‌شن دقیقاً همون `created_at` رو می‌گرفتن، و
  ترتیبشون توی `ORDER BY created_at` واقعاً نامشخص بود (می‌تونست
  agent قبل از thought بیاد). فیکس: `memory-service.ts`'s
  `appendMessage` حالا از `clock_timestamp()` (ساعت واقعی هر
  statement) به‌جای DEFAULT ستون (`NOW()`) استفاده می‌کنه — این یعنی
  دو insert پشت‌سرهم همیشه به ترتیب واقعی‌شون مرتب می‌شن.
- **UI**: صفحه‌ی چت یک بلوک مجزا («🧠 Show/Hide reasoning»، collapsed
  به‌طور پیش‌فرض) **بالای** حباب پاسخ Agent نشون می‌ده — نه داخل همون
  حباب، طبق «مستقل از پیام‌های عادی». هم استریم زنده (`onReasoningToken`)
  هم بارگذاری تاریخچه (`toDisplayMessages()` که ردیف `'thought'` رو با
  ردیف `'agent'` بعدی جفت می‌کنه، چون همیشه بلافاصله قبلش نوشته می‌شه)
  پشتیبانی می‌شه.
- **تست واقعی**: ۳ تست جدید `openai-compatible-provider.test.ts`
  (HTTP واقعی روی یک `http.createServer` محلی — همون الگوی
  `activation-client.test.ts` — هم `complete()` هم `stream()`، شامل
  حالت بدون `reasoning_content`) + ۲ تست جدید `chat-service.test.ts`
  (اولین تست این فایل که اصلاً وجود داشت — `ChatService` قبلاً هیچ
  تستی نداشت). از یک `FakeProviderConfigService` (subclass، نه cast،
  چون `ProviderConfigService` فیلد private داره) با یک fake
  `LlmProvider` تزریق‌شده استفاده کرد — دقیقاً همون الگوی
  `fakeProviderFactory` که CP-012's `ai-gateway-service.test.ts`
  ساخته بود. کل مجموعه‌ی gateway (۴۵ فایل، ۲۲۹ تست) + llm-providers
  (۳ تست) پاس شد. HTTP smoke-test واقعی روی چت معمولی/استریم (بدون
  reasoning، چون Ollama محلی مدل reasoning ساختاریافته نداره) تأیید
  کرد هیچ regression‌ای نیومده.

---

### CP-032 / RT-092 / CP-034 / RT-093 — توکن امنیتی proxy بعد از activation + first-run activation UI + عبور اجباری Marketplace از Platform (۲۰۲۶-۰۷-۱۸)

> تصمیم معماری: کاربر صریحاً «طراحی و بساز» رو انتخاب کرد (مشابه CP-012) — یعنی
> اجازه‌ی طراحی دقیق پروتکل (شکل توکن، TTL، rotation) + ساخت کل زنجیره،
> نه فقط یک تسک منفرد.

- **CP-032 (Platform) — صدور توکن امنیتی**: `gateway/src/services/proxy-token-service.ts`
  دو تابع `issueProxyToken(env, organizationId)` و `verifyProxyToken(env, token)`.
  توکن یک JWT کوتاه‌عمر (**۲ ساعت**) با `JWT_SECRET` موجود Platform امضا می‌شه
  (نه یک secret جدا — کمترین سطح جدید ممکن)، payload‌ش `{ sub: organizationId,
type: 'proxy-access' }` — فیلد `type` عمداً اضافه شده که JWT کاربر عادی هرگز
  به‌جای این توکن قابل استفاده نباشه (تست جدا داره). صادر می‌شه در هر
  `POST /activation/check-in` موفق و برمی‌گرده توی پاسخ به Runtime، به اسم
  `securityToken`. همون‌جا یک باگ preexisting هم فیکس شد: `checkIn()` مقدار
  `aiGatewayEnabled` رو محاسبه می‌کرد ولی هیچ‌وقت واقعاً برنمی‌گردوند.
  ۵ تست جدید (`proxy-token-service.test.ts`): round-trip، رد secret اشتباه،
  تفکیک JWT کاربر از JWT proxy، ورودی نامعتبر، انقضا.

- **RT-092 (Runtime) — صفحه‌ی first-run activation**: جدول singleton
  `migrations/0031_activation_config.sql` (`activation_config`، `id=1` با
  CHECK، یعنی فقط یک ردیف ممکنه وجود داشته باشه)، کلید فعال‌سازی
  envelope-encrypted دقیقاً با همون الگوی KMS registry موجود (مثل
  `llm_configs`/`sso_configs` — `activation-config-service.ts`). نکته‌ی مهم
  طراحی: `POST /v1/activation/configure` قبل از ذخیره یک check-in **واقعی**
  به Platform می‌زنه — کد نامعتبر هرگز ذخیره نمی‌شه. `GET /v1/activation/status`
  برای نمایش وضعیت فعلی. `activation-scheduler.ts` حالا اول کلید رو از DB
  می‌خونه (نه فقط env var دستی قبلی) و بعد از هر check-in موفق
  `markConfigured()` صدا می‌زنه. UI: بخش «Activation» در
  `web/app/settings/page.tsx` (نمایش وضعیت + فرم وارد کردن کد).
  ۳ تست جدید `activation-config-service.test.ts`.

- **CP-034 (Platform) — لایه‌ی proxy**: route عمومی
  `ALL /v1/proxy/marketplace/*` (`routes/proxy.ts`) — توکن CP-032 رو از
  هدر `Authorization: Bearer` می‌گیره و `verifyProxyToken` می‌کنه، درخواست
  رو با `MARKETPLACE_API_KEY` **خودِ Platform** (هرگز به Runtime نشون داده
  نمی‌شه) به Marketplace واقعی forward می‌کنه، پاسخ رو عیناً برمی‌گردونه.
  متریک جدید `proxyRequestsTotal` (label `service`/`outcome`، در
  `observability/metrics.ts`). Platform's `env.ts` حالا یک کپی مستقل از
  `MARKETPLACE_API_KEY` داره (قبلاً فقط Runtime این secret رو نگه می‌داشت).
  **تصمیم مقیاس**: عمداً فقط Marketplace — Memory هنوز هیچ client‌ای در
  Runtime نداره که «مهاجرت» بشه، پس اون نیمه از تسک اصلی خارج از scope
  موند و علتش همین‌جا مستند شد نه این‌که سکوت بشه.
  **تنش best-effort در برابر hard-fail** (که در TODO تراکر علناً پرچم شده
  بود قبل از شروع): activation check-in همچنان best-effort/غیرمسدودکننده
  می‌مونه (عملیات هسته‌ای چت/Agent هرگز نباید به در دسترس بودن Platform
  وابسته باشه)، ولی تماس‌های Marketplace از طریق proxy درست hard-fail
  می‌کنن وقتی Platform در دسترس نیست — این رگرسیون «self-host-first» نیست،
  چون رسیدن به Marketplace ذاتاً یک وابستگی بیرونیه صرف‌نظر از واسطه بودنش؛
  CP-034 فقط تغییر می‌ده Runtime با **کی** حرف بزنه، نه اینکه وابستگی
  بیرونی وجود داره یا نه. این استدلال مستقیماً توی JSDoc خودِ `proxy.ts`
  هم نوشته شده. اولین تست سطح route در کل این ریپو
  (`routes/proxy.test.ts` — `buildApp()` + `.inject()`، ۴ تست).

- **RT-093 (Runtime) — سوییچ marketplace-client**: `marketplaceRequest()`
  یک پارامتر اختیاری چهارم `securityToken` گرفت. وقتی `securityToken` و
  `CONTROL_PLANE_URL` هر دو موجود باشن، درخواست از
  `${CONTROL_PLANE_URL}/v1/proxy${path}` عبور می‌کنه (نه
  `MARKETPLACE_SERVICE_URL` مستقیم). فقط ۹ متد **authenticated**
  (`installPlugin`, `installSkill`, `updatePluginInstallConfig`,
  `ratePlugin`, `rateSkill`, `submitPlugin`, `listPublisherPlugins`,
  `submitSkill`, `listPublisherSkills`) این پارامتر رو گرفتن؛ ۴ متد
  discovery فقط-خواندنی (`listPlugins`, `listSkills`, `getPlugin`,
  `getSkill`) عمداً **دست‌نخورده موندن** چون endpointهای browse Marketplace
  عمومی و بدون auth طراحی شدن — `routes/marketplace.ts` نیازی به
  `MARKETPLACE_SERVICE_URL` برای این‌ها همچنان داره (این یک URL عمومیه، نه
  secret). بدون توکن (self-host بدون activation)، رفتار قبلی مستقیم با
  `MARKETPLACE_API_KEY` محلی عیناً حفظ شده — رگرسیون‌ای برای orgهای
  self-host خالص نیست. ۳ تست جدید در `marketplace-client.test.ts` (بخش
  «RT-093 — CP-034 proxy routing»): مسیر proxy واقعاً استفاده می‌شه با auth
  درست، fallback به مسیر مستقیم وقتی توکنی نیست، discovery هرگز proxy رو
  لمس نمی‌کنه.

- **تست end-to-end واقعی (نه فقط unit)**: یک فرآیند fake-Marketplace واقعی
  (`http.createServer` روی پورت ۴۲۰۰، هندل `POST .../install` و
  `GET .../plugins/:id`)، یک Platform واقعی (پورت ۴۱۰۰، با
  `MARKETPLACE_SERVICE_URL`/`MARKETPLACE_API_KEY` اشاره‌شده به fake سرور)،
  و یک Runtime واقعی (پورت ۴۱۲۳، با `CONTROL_PLANE_URL` اشاره‌شده به
  Platform و **بدون** `MARKETPLACE_API_KEY` محلی — دقیقاً برای اثبات این‌که
  دیگه لازم نیست). صدور کلید activation واقعی، check-in واقعی، لاگین واقعی
  Runtime، و در نهایت `POST /v1/marketplace/plugins/p1/install` واقعاً
  `200 { installId: 'fake-install-1', pluginId: 'p1', isActive: true }`
  برگردوند — زنجیره‌ی کامل Runtime → CP-034 proxy (با توکن CP-032، بدون
  secret محلی) → fake-Marketplace تأیید شد.
  یک باگ self-caused حین تست (نه باگ کد واقعی) پیدا و فیکس شد: مسیر
  install اول `getPlugin()` (discovery فقط-خواندنی، برای قیمت) رو صدا
  می‌زنه که همچنان به `MARKETPLACE_SERVICE_URL` واقعی نیاز داره؛ گذاشتن
  یک آدرس مرده اونجا (برای تست «proxy لازم نیست») باعث خطای گمراه‌کننده
  می‌شد، نه چیزی که واقعاً معنی‌دار باشه.
  همچنین یک stale process روی پورت ۴۱۰۰ (از یک smoke-test قبلی) پیدا و
  kill شد که باعث می‌شد curlها به یک نمونه‌ی قدیمی با کانفیگ اشتباه بخورن
  — الگوی تکراری این نشست (چک `netstat`/لاگ برای `EADDRINUSE`).
  بعد از تست: تمام دادهٔ سازمان‌های smoke-test (Runtime: `rt092-runtime-smoke`,
  `rt093-runtime-smoke`, `rt093-runtime-smoke2`؛ Platform: `RT093 Smoke Org`)
  از هر دو دیتابیس واقعی پاک شد، پردازش‌های smoke-test متوقف شدن.

- **تست‌های کامل قبل از commit**: Platform gateway ۱۱۳ تست (۱۴ فایل) پاس،
  Runtime gateway ۲۳۲ تست (۴۶ فایل، ۷ skip از قبل) پاس، typecheck و lint
  هر دو ریپو تمیز.

---

### CP-035 — Entity `workspaces` داخل Platform (۲۰۲۶-۰۷-۲۰)

> بخش G (`06_MEETINGS/08-ai-gateway-openrouter-model.md`) — پایه‌ی CP-036/037/039/041.
> طبق دستور کاربر («تسک‌ها را به ترتیب انجام بده») به‌عنوان اولین P0 backlog
> پیاده‌سازی شد.

- **مهاجرت** `0008_workspaces.sql`: جدول `workspaces` (id, organization_id
  FK cascade، name، slug، created_at/updated_at، `archived_at` برای
  soft-delete). Slug فقط بین workspaceهای فعال یک org یکتاست (unique index
  شرطی روی `archived_at IS NULL`) — آرشیو کردن اسم رو آزاد می‌کنه، ولی
  توکن‌ها/رویدادهای مصرف آینده (CP-036/039) هنوز به id ارجاع می‌دن.
- **`services/workspace-service.ts`**: create/list/get/rename/archive،
  validation slug (regex lowercase/hyphen)، پیام خطای واضح برای slug تکراری.
- **`routes/workspaces.ts`**: org-admin-facing با `requireSession` (همون
  الگوی `ai-gateway.ts`)، مالکیت همیشه از `organization_id` خودِ workspace
  چک می‌شه نه از ورودی کاربر (جلوگیری از حدس‌زدن id سازمان دیگر).
- ✅ **تست واقعی**: ۹ تست vitest روی Postgres واقعی (`workspace-service.test.ts`)
  سبز. علاوه بر این با curl زنده روی gateway واقعی (پورت ۴۱۰۰، یک کاربر
  واقعی verified + یک org واقعی + JWT session واقعی) کل مسیر create → list
  → get → patch (rename) → archive → list (بعد از آرشیو خالیه) → 401
  بدون auth → 400 روی uuid نامعتبر تأیید شد؛ دادهٔ تست بعد پاک شد.
  Lint و typecheck گیت‌وی هر دو سبز.
- جزئیات باز طبق جلسه ۸ بخش ۵ (فرمول امتیازدهی CP-038، لیست نهایی
  provider، معنای دقیق محدودیت زمانی CP-036) هنوز موکول به همون تسک‌های
  بعدی هستن — این تسک فقط CP-035 (خودِ entity) را می‌بست.

---

### CP-036 — مدل توکن AI Gateway (`ai_gateway_tokens`) (۲۰۲۶-۰۷-۲۰)

> بخش G — دومین P0 بعد از CP-035.

- **مهاجرت** `0009_ai_gateway_tokens.sql`: هر توکن به دقیقاً یک Workspace
  وصله (طبق جلسه ۸ بخش ۳: «یک Workspace... یک یا چند توکن»، نه برعکس).
  فیلدها: `budget_cap_cents`/`spent_cents` (سقف پولی + مصرف تجمیعی)،
  `allowed_providers`/`allowed_models`/`provider_order` (`TEXT[]`)،
  `valid_from`/`valid_until`، `enabled`/`revoked_at`.
  **تصمیم برای دو جزئیات باز جلسه ۸ بخش ۵** (چون هیچ‌کدوم decision لازم
  نداشت، فقط انتخاب گزینه‌ی ساده‌تر و افزودنی که بعداً بدون migration
  شکننده قابل‌گسترشه): «محدودیت زمانی» = بازه‌ی اعتبار ساده، نه
  cron ساعت/روز (RT-088-style) — می‌تونه بعداً کنارش اضافه بشه.
- **`lib/api-key.ts`**: `generateAiGatewayToken()` (پیشوند `o2n_agw_`،
  فرمت مشابه `generateActivationKey`). یک باگ واقعی حین نوشتن تست پیدا شد:
  `PREFIX_LENGTH` مشترک (۸) برای پیشوند فعال‌سازی (`o2n_cp_`، ۷ کاراکتر)
  کافیه (۱ کاراکتر تصادفی اضافه می‌کنه)، ولی برای `o2n_agw_` (خودش دقیقاً
  ۸ کاراکتره) صفر کاراکتر تصادفی می‌مونه — یعنی همه‌ی توکن‌ها یک prefix
  یکسان و غیرقابل‌تشخیص می‌داشتن. فیکس: توکن AI Gateway از
  `PREFIX_LENGTH + 8` استفاده می‌کنه.
- **`services/ai-gateway-token-service.ts`**: issue/list/get/revoke +
  `validateToken` (هش HMAC، بررسی enabled/revoked/بازه‌ی زمانی، آپدیت
  `last_used_at`) + `recordSpend` (یک `UPDATE ... WHERE spent_cents + $2 <=
budget_cap_cents` اتمیک — از race بین دو درخواست هم‌زمان روی یک توکن
  جلوگیری می‌کنه، نه read-then-write). خطاهای اختصاصی جدید در `errors.ts`:
  `AiGatewayTokenInvalidError`/`RevokedError`/`ExpiredError`/
  `BudgetExceededError`.
  **عمداً scope محدود شد**: این تسک فقط مدل/CRUD/validate/spend-tracking
  رو می‌سازه؛ واقعاً وصل‌کردن `/v1/ai-gateway/complete` به این توکن‌ها
  به‌جای زنجیره‌ی org-level فعلی (CP-012)، کار CP-038 (موتور انتخاب
  هوشمند) هست — طبق همون یادداشت TODO doc.
- **`routes/ai-gateway-tokens.ts`**: `/v1/workspaces/:workspaceId/tokens*`،
  همون الگوی session+ownership-via-workspace که CP-035 استفاده کرد. مقدار
  خام توکن فقط یک‌بار (لحظه‌ی issue) برمی‌گرده.
- ✅ **تست واقعی**: ۱۷ تست vitest روی Postgres واقعی (شامل رد race
  اتمیک بودجه: مصرف دقیقاً روی سقف رد میشه بدون partial-apply، خطای هش با
  secret اشتباه، توکن هنوز-معتبر-نشده/منقضی‌شده). کل سوییت گیت‌وی
  (۱۶ فایل/۱۳۹ تست) سبز. curl زنده روی gateway واقعی: issue → list → get
  → revoke → 401 بدون auth → 400 نام خالی، همه تأیید شد؛ دادهٔ تست پاک شد.
  Lint و typecheck سبز.

---

### CP-037 — کاتالوگ فنی Provider/Model (۲۰۲۶-۰۷-۲۰)

> بخش G — سومین/آخرین P0. با CP-035/036 تسک‌های P0 بخش G تموم شد.

- **مهاجرت** `0010_provider_catalog.sql`: `provider_catalog_entries` با همه‌ی
  فیلدهای دقیق جلسه ۸ بخش ۶.۱ (Parameters, Training Tokens, Context Window,
  Architecture, Active Parameters, Benchmark Scores به‌شکل JSONB انعطاف‌پذیر،
  Reasoning Ability, Inference Speed, Latency, Knowledge Cutoff, Multimodal/
  Tool-Calling/Fine-tuning/Memory Support, License, Hardware Requirement،
  قیمت ورودی/خروجی جدا + `price_updated_at`). یک فیلد اضافه‌ی فنی که در
  متن جلسه نبود ولی از تحلیل خودِ جلسه (بخش ۲: «اکثریت providerها همون
  پروتکل OpenAI-compatible») می‌اومد: ستون `protocol` (`openai-compatible` |
  `anthropic-native`) — کدوم آداپتور واقعی این ردیف رو اجرا می‌کنه، جدا از
  نام تجاری provider.
- **`services/provider-catalog-service.ts`**: create/list/get/update.
  `update` کل ردیف رو با merge روی مقدار فعلی جایگزین می‌کنه (نه PATCH
  جزئی در سطح SQL) — و `price_updated_at` فقط وقتی یکی از دو فیلد قیمت
  واقعاً عوض بشه دوباره stamp می‌شه (نه هر PATCH ای، حتی وقتی فقط license
  عوض شده).
- **`routes/provider-catalog.ts`**: `GET /v1/provider-catalog` عمومی (فقط
  `enabled=true`) — چون CP-036 (allowlist توکن) و CP-040 (نمای عمومی
  landing page) هر دو باید بتونن بخوننش؛ نوشتن (`POST`/`PATCH`) فقط با
  `ADMIN_API_KEY` (همون الگوی `admin-organizations.ts`) چون قیمت‌گذاری
  کار اپراتور Platform هست، نه ادمین یک org.
- ✅ **تست واقعی**: ۸ تست vitest روی Postgres واقعی (شامل «فقط تغییر واقعی
  قیمت باعث re-stamp می‌شه» و رد duplicate provider+model). کل سوییت
  گیت‌وی (۱۷ فایل/۱۴۷ تست) سبز. curl زنده: create (admin) → دیده‌شدن در
  لیست عمومی → 401 بدون admin key → غیرفعال‌سازی → حذف از لیست عمومی ولی
  ماندن در لیست ادمین → رد duplicate (۴۰۰)، همه تأیید شد؛ داده پاک شد.
  Lint/typecheck سبز.
- **عمداً پر نشد**: طبق یادداشت خودِ جلسه ۸ («لیست دقیق provider موکول به
  فاز پیاده‌سازی»، بخش ۵)، این تسک فقط جدول/CRUD رو ساخت — دادهٔ واقعی
  provider/model (قیمت واقعی، benchmark واقعی، context window واقعی) وارد
  نشد، چون این اعداد رو نمی‌شه بدون منبع تأییدشده حدس زد؛ ورودشون یک کار
  جدای «تکمیل داده» برای ادمین Platform (یا یک تسک بعدی با منبع مشخص) است.

---

### CP-045 — مدیریت webhook relay (بخش H، جلسه ۱۰) (۲۰۲۶-۰۷-۲۰)

> اولین از سه‌تایی relay وب‌هوک (CP-045/046/047). CP-047 روی تصمیم رفتار
> offline (جلسه ۱۰ بخش ۳) بلاکه — طبق خودِ سند («این تصمیم باید قبل از
> شروع CP-047 صریحاً تأیید/رد بشه»)، از کاربر پرسیده می‌شه، حدس زده نمی‌شه.

- **تصحیح واقعی نسبت به متن اولیه‌ی TODO doc**: بخش H نوشته بود
  `runtime_webhook_token — فقط hash ذخیره بشه`. این از نظر فنی کار
  نمی‌کنه — CP-047/RT-108 باید مقدار خام توکن Runtime رو موقع forward
  کردن _دوباره_ بفرستن؛ یک هش یک‌طرفه قابل بازگشت نیست. فیکس (حین
  پیاده‌سازی پیدا شد، نه در جلسه): `runtime_webhook_token` با همون طرح
  AES-256-GCM قابل‌بازگشت `ai_gateway_provider_configs.api_key_encrypted`
  رمزنگاری می‌شه (نه هش)؛ `public_relay_token` (که یک bearer credential
  واقعیه، فقط مقایسه می‌شه نه بازسازی) درست طبق سند اصلی HMAC-hash می‌مونه.
- **مهاجرت** `0011_webhook_relays.sql`: `webhook_relays` (org_id, name,
  `runtime_webhook_token_encrypted`, `public_relay_token_hash`/`prefix`).
- **`services/webhook-relay-service.ts`**: create/list/get/delete +
  `resolveByPublicToken` (آماده برای CP-047، هنوز هیچ route صداش نمی‌زنه)
  - `markDelivered`.
- **`routes/webhook-relays.ts`**: `/v1/webhook-relays*`، همون الگوی
  session+ownership که CP-035/036 استفاده کردن. مقدار خام public token
  فقط یک‌بار (لحظه‌ی ساخت) برمی‌گرده.
- **صفحه‌ی وب** `web/app/webhooks/page.tsx`: چون یک کاربر می‌تونه چند
  activation key (چند org) داشته باشه، یک انتخابگر org (از
  `listMyActivationKeys`) اضافه شد؛ فرم ساخت relay + جدول لیست/حذف + URL
  عمومی کامل (`{API_URL}/v1/webhook-relay/{token}`) فقط یک‌بار نمایش داده
  می‌شه. لینک از `/account`.
- ✅ **تست واقعی**: ۱۰ تست vitest روی Postgres واقعی (شامل رفت‌وبرگشت
  واقعی رمزنگاری/رمزگشایی توکن Runtime، عدم leak بین دو relay مختلف). کل
  سوییت گیت‌وی (۱۸ فایل/۱۵۷ تست) سبز. curl زنده: create → list → 401 بدون
  auth → delete → لیست خالی بعد از حذف، تأیید شد. `next build` واقعی صفحه‌ی
  جدید رو کامپایل کرد؛ typecheck/lint هر دو (gateway + web) سبز.
  **تعامل واقعی مرورگر با صفحه چک نشد** (همون محدودیت شناخته‌شده‌ی CP-002 —
  ابزار browser-automation در این نشست در دسترس نیست).

---

### CP-046 — WebSocket server برای اتصال Runtime (بخش H، جلسه ۱۰) (۲۰۲۶-۰۷-۲۰)

> دومین از سه‌تایی relay. CP-047 هنوز بلاکه (رفتار offline — بالا ببینید).

- **وابستگی جدید**: `@fastify/websocket@^11.3.0` + `ws@^8.18.0` به
  `gateway/package.json` اضافه شد (تا امروز Platform هیچ WebSocket نداشت؛
  Runtime از قبل داشت، RT-090).
- **`services/webhook-relay-connection-registry.ts`**: یک `Map<organizationId,
WebSocket>` در حافظه — طبق یادداشت صریح سند («یک اتصال به‌ازای هر Runtime
  instance، نه هر relay») سطح multiplex همینه: چندتا webhook relay (CP-045)
  روی یک اتصال سازمانی مشترک می‌مونن. اتصال دوم برای همون org، اتصال اول
  رو می‌بنده (کد ۴۰۰۰) — پوشش می‌ده حالت reconnect Runtime.
- **`routes/webhook-relay-ws.ts`**: `GET /v1/webhook-relay/ws`، همون
  activation key که همه‌جای دیگه Runtime-facing استفاده می‌شه
  (`authenticateActivationKey`، الگوی CP-032) — نه یک مکانیزم auth جدا.
  Handshake رد نمی‌شه (این نسخه از fastify/websocket راه تمیزی برای رد
  کردن upgrade قبل از پذیرش نداره)؛ به‌جاش اتصال نامعتبر بلافاصله با کد
  `4001` بسته می‌شه.
- **باگ محیطی واقعی پیدا شد**: تست اول با `app.injectWS()` (روش in-process
  خودِ `@fastify/websocket`، همون‌طور که Runtime's `chat-ws.test.ts` استفاده
  می‌کنه) نوشته شد، ولی با یک خطای داخلی Fastify 5.10.0
  (`Cannot read properties of undefined (reading 'length')` در
  `preParsingHookRunner`) شکست — یک ناسازگاری واقعی بین نسخه‌ی نصب‌شده‌ی
  fastify و مسیر میان‌بر injectWS، نه باگ کد این route (حتی یک handler
  خالی هم همین خطا رو می‌داد). فیکس: تست‌ها به یک listener شبکه‌ی واقعی
  (`app.listen({port:0})`) + کلاینت واقعی `ws` سوییچ شدن — دقیقاً همون
  الگوی «سرور واقعی» که `proxy.test.ts` (CP-034) قبلاً برای Marketplace
  fake استفاده کرده بود.
- ✅ **تست واقعی**: ۴ تست vitest روی یک listener واقعی + Postgres واقعی
  (اتصال معتبر + پیام `connected` + ثبت در registry، بستن بدون auth با کد
  ۴۰۰۱، کلید نامعتبر با کد ۴۰۰۱، اتصال دوم هم‌سازمان اولی رو می‌بنده و
  خودش زنده می‌مونه). کل سوییت گیت‌وی (۱۹ فایل/۱۶۱ تست) سبز. یک smoke-test
  دستی جدا هم روی خودِ پروسه‌ی واقعی گیت‌وی (نه vitest) اجرا شد — همون پیام
  `{"type":"connected"}` واقعاً دریافت شد؛ داده‌ی تست پاک شد. Lint/typecheck
  سبز.

---

### CP-047 — مسیر عمومی webhook relay (بخش H، جلسه ۱۰) (۲۰۲۶-۰۷-۲۰)

> سومین/آخرین تسک relay وب‌هوک. با این، کل زنجیره‌ی سمت Platform
> (CP-045/046/047) واقعاً end-to-end کار می‌کنه — فقط سمت Runtime
> (RT-108/109) هنوز ساخته نشده (خارج از محدوده‌ی این نشست).

- **تصمیم رفتار offline (بلاک‌کننده‌ی این تسک) نهایی شد**: کاربر صریحاً
  تفویض کرد («الان نمی‌تونم فکر کنم خودت تصمیم بگیر بعد یه جا به عنوان
  تصمیم‌گیری بزار تا بعد درست چک کنم»). تصمیم: **fail-fast (503)** — همون
  پیشنهاد اولیه‌ی جلسه ۱۰، حالا رسمی. ثبت شد در جلسه ۱۰ Action Item ۶ و
  `TODO-openon4net-platform.md` بخش H، هر دو با یادداشت «موقت‌اما‌فعال، تا
  کاربر بعداً بازبینی کنه».
- **`routes/webhook-relay-public.ts`**: `POST /v1/webhook-relay/:publicToken`،
  بدون auth (خودِ توکن اعتبارسنجیه، مثل RT-065)، rate-limit شده
  (۱۲۰/دقیقه به‌ازای IP). جریان: `resolveByPublicToken` (CP-045) → اگه
  سازمان در connection registry (CP-046) آنلاین نیست → ۵۰۳ فوری؛ اگه آنلاینه
  → `sendToOrganization` پیام `{type:'webhook', runtimeWebhookToken,
payload, receivedAt}` رو over همون WebSocket می‌فرسته → `markDelivered`
  → ۲۰۲ به فرستنده‌ی بیرونی (نه ۲۰۰ — چون این فقط تأیید forward شدنه، نه
  تأیید پردازش واقعی توسط Runtime، که هنوز پروتکل ack نداره).
- ✅ **تست واقعی**: ۳ تست vitest (Postgres واقعی + یک کلاینت `ws` واقعی
  متصل از طریق مسیر CP-046) — ۴۰۴ روی توکن ناشناخته، ۵۰۳ وقتی سازمان
  آفلاینه، و مسیر کامل موفق (۲۰۲ + فریم واقعاً روی WebSocket به کلاینت
  Runtime شبیه‌سازی‌شده می‌رسه + `last_delivered_at` واقعاً آپدیت می‌شه).
  کل سوییت گیت‌وی (۲۰ فایل/۱۶۴ تست) سبز. **یک smoke-test کامل دستی هم روی
  پروسه‌ی واقعی گیت‌وی** (نه vitest) اجرا شد: ساخت relay واقعی از طریق
  API → فراخوانی مسیر عمومی وقتی هیچ Runtime وصل نیست (۵۰۳ واقعی) → وصل
  کردن یک کلاینت WS واقعی → فراخوانی دوباره → ۲۰۲ + دریافت واقعی فریم روی
  کلاینت. داده‌ی تست پاک شد. Lint/typecheck سبز.
- **باقی‌مانده (خارج از این تسک)**: RT-108 (کلاینت WebSocket دائمی سمت
  Runtime که واقعاً این پیام‌ها رو دریافت و اجرا کنه) و RT-109 (`target_type:
'tool'`) — هر دو در `TODO-openon4net-runtime.md` بخش L، به‌صراحت خارج از
  scope این نشست (فقط Platform).

---

### CP-038 — موتور انتخاب هوشمند provider (بخش G) (۲۰۲۶-۰۷-۲۰)

> اولین تسک P1 بعد از تکمیل بخش‌های G/H P0. طبق درخواست کاربر («هر کدام از
> تسک‌ها که بدون مشکل می‌تونی پیاده‌سازی کنی») ساخته شد.

- **`services/provider-availability-tracker.ts`**: شمارش ساده‌ی خطای اخیر
  در حافظه (پنجره‌ی ۵ دقیقه‌ای، سقف ۲۰ رویداد به‌ازای هر provider+model) —
  همون گزینه‌ی ساده‌تری که جلسه ۸ به‌جای circuit-breaker کامل مطرح کرده بود.
- **`services/provider-selection-service.ts`**: `selectProviders(db, token)`
  — فیلتر بر اساس allowlist توکن (CP-036)، بعد یا ترتیب دستی کاربر
  (`providerOrder`) یا امتیازدهی (اول کمترین خطای اخیر، بعد کمترین قیمت
  جمع ورودی+خروجی از کاتالوگ CP-037؛ ردیف‌های بدون قیمت آخر می‌رن).
  **عمداً از `PlanPolicy` فعلی (`activation-service.ts`) استفاده نکرد** —
  اون لیست برای BYOK قدیمی (۴ provider) بود، نه کاتالوگ جدید ۱۰-۱۵تایی؛
  قاطی کردنشون کل هدف کاتالوگ رو نقض می‌کرد.
- **عمداً ناقص، مستند**: این تسک فقط منطق انتخاب/امتیازدهی رو می‌سازه؛
  اجرای واقعی completion روی provider برنده وصل نشد — چون برای اون Platform
  باید credential اصلی خودش (نه سازمان) رو برای هر ردیف کاتالوگ نگه داره،
  چیزی که هیچ‌کدوم از CP-035..044 نساختنش (یک gap واقعی در طراحی، نه
  فراموشی این تسک). این تابع آماده‌ست تا وصل بشه وقتی اون gap حل شد.
- ✅ **تست واقعی**: ۱۱ تست vitest (۷ روی Postgres واقعی برای انتخاب/فیلتر،
  ۴ واحد برای availability tracker). Lint/typecheck سبز.

---

### CP-039 — داشبورد مصرف: بعد Workspace (بخش G) (۲۰۲۶-۰۷-۲۰)

- **مهاجرت** `0012_usage_events_workspace_token.sql`: دو ستون nullable
  (`workspace_id`, `ai_gateway_token_id`) به `ai_gateway_usage_events`
  اضافه شد — مصرف قدیمی/BYOK هیچ‌وقت این‌ها رو نداره، طبیعیه.
- **`services/ai-gateway-service.ts`**: `getOrganizationUsageSummary`،
  `getWorkspaceUsageSummary`، `listWorkspaceUsage` — جمع کل + تفکیک هر
  provider (هزینه + تعداد درخواست)، رویدادهای `failed` از جمع هزینه حذف
  می‌شن.
- **مسیرها**: `GET /v1/ai-gateway/usage-summary` (org)،
  `GET /v1/workspaces/:workspaceId/usage` و `.../usage-summary` — همون
  الگوی session+ownership.
- **محدودیت صادقانه، طبق سند خودِ تسک بازنگری شد**: تفکیک «به‌ازای هر
  کاربر» ساخته نشد — درخواست AI Gateway به هویت یک کاربر انسانی خاص وصل
  نیست (فقط سطح org/token احراز هویت می‌شه)، بدون تغییر پروتکل
  `/v1/ai-gateway/complete` سمت Runtime (اضافه‌کردن شناسه‌ی کاربر) قابل‌ساخت
  نبود — خارج از scope این تسک.
- ✅ **تست واقعی**: ۵ تست vitest روی Postgres واقعی (جمع درست، حذف
  `failed`، عدم نشت بین workspaceها، مصرف خالی). کل سوییت گیت‌وی (۲۳
  فایل/۱۸۰ تست) سبز — یک فلیک محیطی گذرا (`proxy.test.ts`، تایم‌اوت پورت
  زیر بار موازی سنگین) در یک اجرا دیده شد، در اجرای تکراری و ایزوله هر دو
  سبز شد؛ ربطی به تغییرات این تسک نداشت. curl زنده روی پروسه‌ی واقعی: هر
  سه مسیر جدید تأیید شد؛ داده‌ی تست پاک شد. Lint/typecheck سبز.

---

### CP-042 — کمیسیون Platform روی مصرف (بخش G) (۲۰۲۶-۰۷-۲۰)

- **مهاجرت** `0013_platform_settings.sql`: جدول singleton (`id` همیشه ۱)
  با `commission_percent` — طبق جلسه ۸ بخش ۶.۳، runtime-configurable
  (نه env var، چون ادمین باید بتونه بدون redeploy عوضش کنه).
- **`services/platform-settings-service.ts`**: `getPlatformSettings`،
  `setCommissionPercent` (اعتبارسنجی ۰-۱۰۰)، `applyCommission(rawCents,
percent)` — گرد به بالا، همون قرارداد `pricing.ts`'s `calculateCostCents`.
- **`routes/platform-settings.ts`**: `/admin/platform-settings`
  (GET/PATCH)، فقط `ADMIN_API_KEY` — قیمت‌گذاری تصمیم اپراتور Platform‌ه،
  نه ادمین یک org.
- **`GET /v1/provider-catalog` گسترش پیدا کرد**: هر ردیف حالا
  `billedPriceInputCentsPerMillion`/`billedPriceOutputCentsPerMillion` هم
  داره (قیمت خام + کمیسیون) — تا قابل‌مشاهده باشه حتی بدون اجرای واقعی
  completion.
- ✅ **تست واقعی**: ۴ تست vitest روی Postgres واقعی. کل سوییت گیت‌وی (۲۴
  فایل/۱۸۴ تست) سبز. curl زنده: تنظیم کمیسیون ۲۰٪ → ساخت یک ردیف کاتالوگ
  با قیمت ۱۰۰۰/۲۰۰۰ → کاتالوگ عمومی درست `1200`/`2400` برگردوند؛ داده و
  تنظیم کمیسیون بعد از تست پاک/ریست شد. Lint/typecheck سبز.
- **همون محدودیت صادقانه‌ی CP-038/039**: کسر واقعی این کمیسیون از
  wallet workspace/توکن به اجرای واقعی completion وصل نیست (چون آن
  اجرا خودش هنوز به credential اصلی provider سمت Platform نیاز داره که
  ساخته نشده) — محاسبه و نمایش کامل و تست‌شده‌ست، فقط نقطه‌ی مصرف واقعی
  (کسر از wallet) هنوز جایی برای صدا زدنش وجود نداره.

---

### CP-040 — نمای عمومی محبوبیت provider در landing page (بخش G) (۲۰۲۶-۰۷-۲۰)

- **`services/ai-gateway-service.ts`**: `getGlobalProviderPopularity` —
  تجمیع تعداد درخواست به‌ازای هر provider در کل پلتفرم (همه‌ی سازمان‌ها با
  هم)، به‌علاوه‌ی سهم (`share`) از کل. **هیچ `organization_id`/`workspace_id`
  ای در خروجی نیست** — طبق یادداشت صریح تسک («بدون افشای داده‌ی سازمان
  خاص»)، رویدادهای `failed` هم حذف می‌شن (همون قرارداد CP-039).
- **مسیر**: `GET /v1/landing/provider-popularity` — عمومی، بدون auth
  (rate-limited)، چون این صفحه‌ی فرود عمومیه.
- ✅ **تست واقعی**: تست تازه به سوییت CP-039 اضافه شد — دو سازمان جدا
  رویداد می‌فرستن، تجمیع درست جمع می‌بنده و کلید `organizationId` در
  خروجی نیست. کل سوییت گیت‌وی (۲۴ فایل/۱۸۵ تست) سبز. curl زنده روی
  gateway واقعی: `{"popularity":[]}` (دیتابیس dev واقعاً خالیه، نه خطا).
  Lint/typecheck سبز.

---

### CP-044 — دسته‌بندی کاربردی مدل‌ها (بخش G) (۲۰۲۶-۰۷-۲۰)

- **مهاجرت** `0014_catalog_functional_categories.sql`: ستون
  `functional_categories TEXT[]` روی `provider_catalog_entries` (+ ایندکس
  GIN). **آزاد، نه enum ثابت** — طبق یادداشت خودِ تسک («لیست دقیق دسته‌ها
  موکول به پیاده‌سازی»)، تا ادمین بتونه از فرم یک دسته‌ی جدید اضافه کنه
  بدون نیاز به migration جدید.
- **`services/provider-catalog-service.ts`**: `functionalCategories` به
  create/update/select اضافه شد — کاملاً مستقل از فیلدهای فنی CP-037
  (تغییرش fields دیگه رو دست نمی‌زنه، همون‌طور که `updateCatalogEntry`'s
  merge-روی-موجود قبلاً تضمین می‌کرد).
- ✅ **تست واقعی**: ۲ تست جدید به سوییت CP-037 اضافه شد (ست/آپدیت مستقل،
  پیش‌فرض آرایه‌ی خالی) — کل فایل حالا ۱۰ تست. کل سوییت گیت‌وی (۲۴
  فایل/۱۸۷ تست) سبز. curl زنده روی gateway واقعی تأیید شد؛ داده پاک شد.
  Lint/typecheck سبز.

---

### CP-052 — Platform Plugin Hosting System (بخش K، جلسه ۱۵) (۲۰۲۶-۰۷-۲۱)

> پایه‌ای‌ترین تسک بخش K — همه‌ی پلاگین‌های آینده‌ی سمت Platform (CP-054
> Google، CP-056..066 Channel/social) روی این سوار می‌شن.

- **تصمیم scope عمدی، مستندشده**: بارگذاری پویای کد شخص‌ثالث (sandbox واقعی)
  یک ریسک امنیتی/معماری جدیه که جلسه ۱۵ هیچ‌وقت واقعاً تصمیمش رو نگرفت. v1
  همون‌طور که خودِ جلسه می‌گفت («پلاگین‌های Platform برای توسعه») یک **رجیستری
  first-party** است — هر پلاگین یک ماژول TypeScript داخل همین کدبیسه (مثل هر
  route file دیگه)، نه آپلود/اجرای کد بیرونی.
- **مهاجرت** `0015_platform_plugins.sql`: جدول `platform_plugins` (فقط
  `plugin_key` + `enabled` + `enabled_at`) — رجیستری خودِ تعریف‌ها
  (`plugin-registry-service.ts`) در کده، نه دیتابیس؛ این جدول فقط وضعیت
  فعال/غیرفعال رو نگه می‌داره.
- **`services/platform-plugin-service.ts`**: `listPluginStates` (merge
  رجیستری + وضعیت DB)، `setPluginEnabled` (فقط برای کلیدهای موجود در
  رجیستری، وگرنه `NotFoundError`؛ غیرفعال‌کردن `enabled_at` تاریخی رو پاک
  نمی‌کنه)، `getEnabledMenuEntries` (فقط زیرمجموعه‌ی فعال، برای منوی وب).
- **`routes/platform-plugins.ts`**: `/admin/platform-plugins*` (ADMIN_API_KEY،
  الگوی provider-catalog.ts) + `/v1/platform-plugins/menu` (هر کاربر لاگین‌کرده،
  چون منوی وب برای همه لازمه نه فقط ادمین).
- **وب**: `components/PluginMenuLinks.tsx` — کامپوننت مشترک بین صفحه‌ی
  account و webhooks که منوی پویا رو fetch/render می‌کنه؛ امروز چون رجیستری
  خالیه چیزی نشون نمی‌ده، ولی مسیر کامل تا آخر واقعیه و تست شده.
- ✅ **تست واقعی**: ۶ تست vitest روی Postgres واقعی (با یک رجیستری fake
  injection-شده برای تست، چون رجیستری production خالیه) — شامل رد کلید
  ناشناخته، حفظ `enabled_at` تاریخی موقع غیرفعال‌کردن، منوی خالی برای
  رجیستری خالی. کل سوییت گیت‌وی (۲۵ فایل/۱۹۳ تست) سبز. curl زنده: لیست
  خالی، ۴۰۴ روی کلید ناشناخته، ۴۰۱ بدون auth — همه تأیید شد. `next build`
  واقعی وب موفق. Lint/typecheck (gateway + web) سبز.

---

### CP-053 — تعمیم relay به Plugin Event Relay عمومی (بخش K، جلسه ۱۵) (۲۰۲۶-۰۷-۲۱)

- **یافته‌ی مهم قبل از شروع**: خودِ رجیستری اتصال (CP-046) از قبل عمومی بود —
  `sendToOrganization(organizationId, payload: unknown)` هیچ‌وقت به webhook
  محدود نبود. تنها بخش واقعاً webhook-specific مسیر CP-047 و شکل frame اون
  بود. پس این تسک بیشتر «رسمی‌کردن قرارداد مشترک» بود تا بازنویسی واقعی.
- **rename**: `webhook-relay-connection-registry.ts` → `plugin-event-relay.ts`،
  `routes/webhook-relay-ws.ts` → `routes/plugin-relay-ws.ts`، مسیر
  `/v1/webhook-relay/ws` → `/v1/plugin-relay/ws`. امن بود چون RT-108 (تنها
  مصرف‌کننده‌ی احتمالی سمت Runtime) هنوز ساخته نشده — چیزی مسیر قدیمی رو
  hardcode نکرده بود.
- **قرارداد جدید**: `PluginEventFrame {type, data, sentAt}` +
  `sendPluginEvent(organizationId, type, data)`. `routes/webhook-relay-public.ts`
  (CP-047) به این قرارداد مهاجرت کرد — دیگه شکل frame دست‌ساز خودش رو نداره.
- ✅ **تست واقعی**: تست‌های موجود CP-046/047 (۸ تست) با مسیر/import جدید
  به‌روزرسانی و پاس شدن + یک تست جدید مستقل برای `sendPluginEvent` (اثبات
  frame درست تحویل داده می‌شه). کل سوییت گیت‌وی (۲۵ فایل/۱۹۴ تست) سبز.
  یک smoke-test زنده روی پروسه‌ی واقعی هم تأیید کرد مسیر جدید کار می‌کنه.
  Lint/typecheck سبز.

---

### CP-054 — پلاگین Google (بخش K، جلسه ۱۵) (۲۰۲۶-۰۷-۲۱)

> جایگزین CP-041 قدیمی (Drive-only). اولین پلاگین واقعی ثبت‌شده در رجیستری
> CP-052 — اولین اثبات end-to-end که خودِ مکانیزم hosting کار می‌کنه.

- **مهاجرت** `0016_google_connections.sql`: `google_connections` —
  one-to-many واقعی (چند حساب Google به‌ازای هر org، هر کدوم `granted_scopes`
  مستقل). یکتایی فقط روی ردیف‌های فعال (`WHERE revoked_at IS NULL`) — بعد
  از revoke همون ایمیل دوباره قابل‌اتصاله (به‌عنوان grant تازه، نه merge با
  ردیف قدیمی).
- **`lib/google-oauth-client.ts`**: آداپتور واقعی روی endpointهای OAuth2
  واقعی Google (`accounts.google.com`, `oauth2.googleapis.com`,
  `googleapis.com/oauth2/v3/userinfo`) — injectable، دقیقاً مثل
  `ProviderFactory` در `ai-gateway-service.ts`، تا سرویس بدون credential
  واقعی هم قابل‌تست باشه.
- **`services/google-connector-service.ts`**: `resolveScopes` (نگاشت
  drive/calendar/gmail/sheets به scope واقعی Google — `drive` عمداً
  read-only، تصمیم least-privilege)، `buildAuthorizationUrl` (state امضاشده
  با JWT، ۱۰ دقیقه اعتبار)، `handleCallback` (اعتبارسنجی state، رمزنگاری
  AES-256-GCM توکن‌ها، **merge اسکوپ‌ها روی reconnect** به‌جای خطا — دقیقاً
  همون معنی «consent افزایشی» که جلسه خواسته بود).
  **یک باگ واقعی حین نوشتن پیدا و فیکس شد**: نسخه‌ی اول یک تابع placeholder
  داشت که همیشه آرایه‌ی خالی برمی‌گردوند برای `granted_scopes` — یعنی هر
  اتصال با scope خالی ذخیره می‌شد. فیکس: `GoogleTokenResponse` واقعاً فیلد
  `grantedScopes` (از پاسخ `scope` خودِ Google) رو حمل می‌کنه، نه فرض.
- **`routes/google-plugin.ts`**: `/v1/plugins/google/authorize` (session)،
  `/callback` (عمومی — امنیتش کامل روی state امضاشده است، نه session، چون
  redirect گوگل session نداره)، `/connections*` (session + مالکیت).
- **ثبت در رجیستری CP-052**: `google-connector` — اولین ورودی واقعی.
- **وب**: `app/plugins/google/page.tsx` — انتخاب سرویس، دکمه‌ی اتصال،
  جدول حساب‌های متصل + revoke.
- ✅ **تست واقعی**: ۱۲ تست vitest روی Postgres واقعی (با client fake چون
  credential واقعی Google نداریم) — شامل merge اسکوپ روی reconnect، دو
  حساب مستقل برای یک org، رد state دستکاری‌شده، عدم‌دسترسی بدون OAuth app.
  کل سوییت گیت‌وی (۲۶ فایل/۲۰۶ تست) سبز (یک فلیک گذرای شناخته‌شده‌ی
  `proxy.test.ts` بلافاصله بعد از ری‌استارت Docker Desktop، در تکرار سبز
  شد). curl زنده: ۴۰۲ بدون OAuth app پیکربندی‌شده، منوی خالی (پلاگین
  پیش‌فرض غیرفعال)، لیست ادمین پلاگین رو نشون داد، enable/disable واقعی
  کار کرد. **یک باگ واقعی build توسط `next build` پیدا و فیکس شد**:
  `useSearchParams()` بدون Suspense boundary باعث شکست prerender می‌شد؛
  فیکس با wrap کردن کامپوننت در `<Suspense>`. Lint/typecheck (gateway+web)
  سبز.
- **محدودیت صادقانه**: login واقعی با سرورهای Google تست نشد — نیاز به
  `GOOGLE_OAUTH_CLIENT_ID`/`SECRET` واقعی از کاربر داره (env vars اضافه
  شدن، optional، graceful degrade بدونشون).

---

### CP-056 — Telegram Channel Plugin سمت Platform (بخش K، جلسه ۱۵) (۲۰۲۶-۰۷-۲۱)

> دومین پلاگین واقعی ثبت‌شده در رجیستری CP-052، و اولین اثبات end-to-end
> واقعی زنجیره‌ی کامل «سرویس بیرونی → webhook عمومی → Plugin Event Relay
> (CP-053) → WebSocket متصل».

- **مهاجرت** `0017_telegram_connections.sql`: برخلاف Google (OAuth)،
  Telegram با bot token کار می‌کنه — خودِ org توکن رو از @BotFather می‌سازه
  و اینجا paste می‌کنه. one-to-many (چند بات به‌ازای هر org).
- **`lib/telegram-api-client.ts`**: آداپتور واقعی روی Telegram Bot API
  (`getMe`, `setWebhook`, `deleteWebhook`) — injectable مثل الگوی Google.
- **`services/telegram-connector-service.ts`**: `connectBot` (اعتبارسنجی
  توکن با `getMe` قبل از نوشتن هرچیزی، تولید webhook secret تصادفی،
  `setWebhook` واقعی روی Telegram با URL شامل id ردیف؛ **rollback واقعی**
  اگه `setWebhook` بعد از موفقیت `getMe` fail بشه — ردیف DB حذف می‌شه، چون
  Telegram هیچ‌وقت از این connection خبردار نشده)، `verifyWebhookSecret`
  (برای مسیر عمومی webhook)، `revokeConnection` (واقعاً `deleteWebhook`
  صدا می‌زنه، نه فقط soft-delete محلی).
- **`routes/telegram-plugin.ts`**: مدیریت (session-authed) + مسیر عمومی
  `POST /v1/plugins/telegram/webhook/:id` — auth با هدر
  `X-Telegram-Bot-Api-Secret-Token` (نه session، چون خودِ Telegram صداش
  می‌زنه)، موفقیت‌آمیز که بود، `sendPluginEvent(orgId, 'telegram-message',
{connectionId, update})` رو از طریق CP-053 relay می‌فرسته.
- **ثبت در رجیستری CP-052**: `telegram-connector`.
- **وب**: `app/plugins/telegram/page.tsx` — فرم توکن + جدول بات‌های
  متصل/revoke.
- ✅ **تست واقعی**: ۹ تست سرویس (Postgres واقعی + Telegram API fake شامل
  rollback روی خطا) + ۳ تست مسیر (یکیشون کل زنجیره‌ی webhook→relay رو با
  یک کلاینت WS واقعی متصل از طریق CP-053 اثبات کرد — دقیقاً فریم
  `{type:'telegram-message', data:{connectionId, update}, sentAt}` رو
  دریافت کرد). کل سوییت گیت‌وی (۲۸ فایل/۲۱۸ تست) سبز. curl زنده: لیست
  ادمین هر دو پلاگین (google-connector + telegram-connector) رو نشون داد،
  webhook بدون هدر secret رد شد (۴۰۱). `next build` واقعی وب موفق.
  Lint/typecheck سبز.
- **یادداشت محیطی این نشست**: Docker Desktop وسط کار پایین بود (Postgres
  در دسترس نبود) — بالا آورده شد و کانتینر `postgresdb` خودش دوباره بالا
  اومد، بدون از دست رفتن داده.

---

### CP-055 — بلاگ چندزبانه، فقط بکند (بخش K، جلسه ۱۵) (۲۰۲۶-۰۷-۲۱)

- **مهاجرت** `0018_blog.sql`: `blog_posts` (پوسته‌ی زبان‌مستقل) +
  `blog_post_translations` (هر زبان یک ردیف مستقل، وضعیت publish جدا).
  **تصمیم کلیدی**: تأیید/publish یک زبان هیچ‌وقت زبان دیگه رو خودکار
  publish نمی‌کنه — دقیقاً برخلاف CP-028 (رشته‌های UI) که فوری auto-publish
  می‌شن؛ محتوای عمومی/سئو ریسک بالاتری داره.
- **`services/blog-service.ts`**: `createPost` (پوسته + ترجمه‌ی اول، هر دو
  پیش‌نویس)، `translateToLanguage` (AI-draft، همیشه پیش‌نویس، حتی وقتی
  دوباره روی یک زبان اجرا بشه فقط جایگزین می‌شه نه تکراری)، `publishTranslation`/
  `unpublishTranslation` (per-language)، `updateTranslation` (فقط فیلدهای
  داده‌شده رو عوض می‌کنه). آداپتور AI مستقل از `locale-service.ts` (چون اونی
  برای key/value UI strings ثابته، اینجا متن آزاد مقاله لازمه) ولی همون
  الگوی Anthropic API + `LOCALE_AI_API_KEY` موجود رو استفاده می‌کنه — بدون
  env var جدید.
- **`routes/blog.ts`**: `GET /v1/blog` + `/v1/blog/:slug` عمومی (فقط
  published)، `/admin/blog*` با `ADMIN_API_KEY` (محتوای مارکتینگ Platform،
  کار اپراتور نه ادمین org).
- ✅ **تست واقعی**: ۱۴ تست vitest روی Postgres واقعی (شامل rejection وقتی
  زبان مبدأ ترجمه وجود نداره، عدم تکرار روی re-translate، عدم auto-publish
  بین زبان‌ها). کل سوییت گیت‌وی (۲۹ فایل/۲۳۲ تست) سبز. curl زنده روی
  gateway واقعی: ساخت پست → ۴۰۴ قبل از publish → publish → ۲۰۰ بعد از
  publish → دیده‌شدن در لیست عمومی، همه تأیید شد؛ داده پاک شد. Lint/typecheck
  سبز.
- **عمداً ناقص**: فقط بک‌اند. **صفحه‌ی نویسندگی ادمین و صفحات عمومی بلاگ در
  وب ساخته نشدن** — یک تسک UI جدا برای بعد، مشابه محدودیت‌های مشابه در
  CP-038/039/042 (اینجا محدودیت زمانی این نشست بود، نه یک gap طراحی).

---

### CP-062 — Facebook Messenger Channel Plugin سمت Platform (بخش K، جلسه ۱۵) (۲۰۲۶-۰۷-۲۱)

> سومین پلاگین واقعی رجیستری CP-052. اولین باری که واقعاً از الگوی
> **امضای سطح-app** (نه secret به‌ازای هر connection مثل Telegram) استفاده
> شد — چون callback URL وب‌هوک Meta بین همه‌ی Pageهای متصل مشترکه.

- **مهاجرت** `0019_facebook_connections.sql`: **تصمیم عمدی ساده‌سازی v1**:
  به‌جای OAuth چندمرحله‌ای Meta (login → انتخاب صفحه → page token)، org خودش
  Page Access Token رو از داشبورد اپ Meta می‌سازه و اینجا paste می‌کنه —
  دقیقاً همون الگوی bot-token که برای Telegram (CP-056) استفاده شد. یکتایی
  `page_id` **سراسریه** (نه فقط به‌ازای هر org) چون یک صفحه‌ی فیسبوک فقط
  می‌تونه هم‌زمان به یک org وصل باشه (وگرنه lookup وب‌هوک مبهم می‌شه).
- **`lib/meta-graph-client.ts`**: آداپتور واقعی Graph API (`getPageInfo`،
  `subscribeWebhook` روی `/me/subscribed_apps`، `unsubscribeWebhook`) +
  `verifyMetaSignature` — HMAC-SHA256 واقعی روی بدنه‌ی خام (نه parse‌شده)
  با `timingSafeEqual`.
- **`routes/facebook-plugin.ts`**: **دو مسیر مخصوص Meta که نه Telegram نه
  Google لازم نداشتن** — (۱) handshake یک‌باره‌ی `GET` با
  `hub.mode`/`hub.verify_token`/`hub.challenge` (Meta موقع تنظیم صداش
  می‌زنه)، (۲) مسیر `POST` که نیاز به بدنه‌ی **خام** (نه parse‌شده) داره
  برای تأیید امضا — با override کردن content-type parser فقط داخل یک
  scope کپسوله‌شده‌ی Fastify، تا بقیه‌ی مسیرهای اپ دست‌نخورده بمونن.
  چون callback مشترکه، لوکاپ سازمان از روی `entry[].id` (شناسه‌ی Page)
  داخل payload انجام می‌شه، نه از URL.
- **ثبت در رجیستری CP-052**: `facebook-connector`.
- **وب**: `app/plugins/facebook/page.tsx`.
- ✅ **تست واقعی**: ۸ تست سرویس (Postgres واقعی + Meta client fake، شامل
  رد اتصال تکراری یک Page، rollback روی خطای subscribe) + ۵ تست مسیر
  (handshake صحیح/غلط، امضای گمشده رد شد با ۴۰۱، **امضای HMAC واقعی محاسبه
  و تست شد** — نه فقط فرض — و کل زنجیره‌ی webhook→relay با کلاینت WS واقعی
  اثبات شد). کل سوییت گیت‌وی (۳۱ فایل/۲۴۵ تست) سبز. curl زنده: لیست ادمین
  هر سه پلاگین رو نشون داد، handshake بدون verify token واقعی درست ۴۰۳
  داد (graceful degrade). `next build` واقعی موفق. Lint/typecheck سبز.

---

### CP-063 + CP-057 — Instagram DM و WhatsApp Channel Plugin سمت Platform (بخش K، جلسه ۱۵) (۲۰۲۶-۰۷-۲۳)

> چهارمین و پنجمین پلاگین واقعی رجیستری CP-052. **یافته‌ی معماری مهم که در
> جلسه ۱۵ صریح تصمیم‌گیری نشده بود ولی از واقعیت API متا استخراج شد:** متا
> فقط **یک** callback URL وب‌هوک به‌ازای هر App قبول می‌کنه — یعنی
> Messenger/Instagram/WhatsApp همه از همون یک اپ Meta (`META_APP_SECRET`/
> `META_WEBHOOK_VERIFY_TOKEN` مشترک CP-062) و همون یک مسیر
> `POST /v1/plugins/facebook/webhook` وب‌هوک دریافت می‌کنن — یک وب‌هوک جدا
> برای Instagram/WhatsApp اصلاً هیچ‌وقت ترافیک واقعی نمی‌گرفت. برای همین
> `routes/facebook-plugin.ts` تعمیم داده شد به یک **دیسپچر مشترک** که بر
> اساس فیلد سطح-بالای `object` توی بدنه‌ی payload (`page` / `instagram` /
> `whatsapp_business_account`) تصمیم می‌گیره کدوم connector service صدا
> بشه؛ `routes/instagram-plugin.ts` و `routes/whatsapp-plugin.ts` فقط
> setup/list/revoke دارن، نه مسیر وب‌هوک جدا.

- **مهاجرت‌ها**: `0020_instagram_connections.sql` (`ig_business_account_id`
  یکتای سراسری + `page_access_token_encrypted`)، `0021_whatsapp_connections.sql`
  (`waba_id` + `phone_number_id` یکتای سراسری + `access_token_encrypted`،
  بدون Page — WhatsApp ساختار entity کاملاً متفاوتی داره).
- **`lib/meta-graph-client.ts`** با ۴ متد جدید تعمیم داده شد (نه فایل کلاینت
  جدا، چون سه محصول عضو همون خانواده‌ی Graph API متا هستن):
  `getInstagramAccountInfo` (کشف IG Business Account متصل به یک Page از
  طریق `fields=instagram_business_account{id,username}`)، `getPhoneNumberInfo`،
  `subscribeWabaWebhook`/`unsubscribeWabaWebhook` (`POST/DELETE
/{waba-id}/subscribed_apps` — متفاوت از سطح-Page چون WhatsApp اصلاً Page
  نداره). اشتراک وب‌هوک Instagram DM **دوباره از همون** `subscribeWebhook`
  سطح-Page استفاده می‌کنه (فیلد `messages` هم Messenger هم IG DM رو پوشش
  می‌ده وقتی Page یک IG Business Account متصل داره).
- **`services/instagram-connector-service.ts`**، **`services/whatsapp-connector-service.ts`**:
  دقیقاً همون شکل facebook-connector-service.ts (connect/list/get/revoke +
  `findOrganizationBy*`، یکتایی سراسری، rollback روی خطای subscribe،
  `FeatureNotAvailableError` اگه اپ متا تنظیم نشده).
- **ثبت در رجیستری CP-052**: `instagram-connector`، `whatsapp-connector`.
- **وب**: `app/plugins/instagram/page.tsx` (فرم تک-فیلدی مثل Facebook)،
  `app/plugins/whatsapp/page.tsx` (فرم سه-فیلدی: WABA id، Phone Number id،
  access token).
- ✅ **تست واقعی**: ۱۵ تست سرویس جدید (۸ Instagram + ۷ WhatsApp، Postgres
  واقعی + Meta client fake) + ۲ تست مسیر جدید توی همون
  `facebook-plugin.test.ts` که دیسپچ درست بر اساس `object` رو با کلاینت WS
  واقعی اثبات می‌کنن (یک اتصال IG واقعی + یک اتصال WhatsApp واقعی، امضای
  HMAC واقعی محاسبه شد). کل سوییت گیت‌وی (۳۳ فایل/۲۶۲ تست) سبز. `next build`
  واقعی موفق (هر دو صفحه‌ی جدید build شدن). Lint/typecheck هر دو پروژه سبز.
  smoke تست زنده با `curl`: handshake با verify token غلط ۴۰۳ داد،
  `POST /v1/plugins/whatsapp/connections` بدون session درست ۴۰۱ داد.

---

### CP-066 + CP-064 + CP-065 — YouTube/TikTok/LinkedIn Connector Plugin سمت Platform (بخش K، جلسه ۱۵) (۲۰۲۶-۰۷-۲۳)

> ششم/هفتم/هشتمین پلاگین واقعی رجیستری CP-052. برخلاف CP-057/CP-063
> (Meta family)، این سه از **الگوی Google (CP-054)** پیروی می‌کنن —
> پلاگین Platform-side تکی بدون جفت Runtime، چون TikTok/LinkedIn/YouTube
> پلتفرم انتشار محتوان نه گفتگو (تصمیم همون‌روزه‌ی جلسه ۱۵).

- **یافته‌ی مهم**: YouTube Data API خودش یک **API گوگله** — به‌جای ساخت
  یک OAuth app جدا و جدید، `lib/google-oauth-client.ts` (همون کلاینت
  CP-054) با یک متد جدید (`fetchYoutubeChannel`) تعمیم داده شد و
  `youtube-connector-service.ts` همون `GOOGLE_OAUTH_CLIENT_ID/SECRET` رو
  reuse می‌کنه — فقط یک `GOOGLE_OAUTH_YOUTUBE_REDIRECT_URI` جدا لازم بود
  (Google الزام می‌کنه هر redirect URI دقیقاً از پیش ثبت بشه، ولی یک
  پروژه‌ی واحد می‌تونه چند redirect URI ثبت‌شده داشته باشه). این یعنی
  `youtube_connections` یک جدول/رجیستری/UI جدا داره ولی هیچ اپ گوگل جدیدی
  لازم نیست بسازن — org فقط یک redirect URI دوم به همون OAuth client
  اضافه می‌کنه.
- **مهاجرت‌ها**: `0022_youtube_connections.sql`، `0023_tiktok_connections.sql`،
  `0024_linkedin_connections.sql`. یکتایی هر سه **به‌ازای هر org** (نه
  سراسری مثل Facebook/Instagram/WhatsApp) چون این پلتفرم‌ها یک کاربر رو
  می‌تونن هم‌زمان به چند org متفاوت (چند برند/مشتری) وصل کنن — مثل الگوی
  Google، نه الگوی Channel.
- **`lib/tiktok-oauth-client.ts`**، **`lib/linkedin-oauth-client.ts`**: دو
  کلاینت تزریق‌پذیر جدید (OAuth app واقعاً جدا برای هرکدوم،
  `TIKTOK_OAUTH_CLIENT_KEY/SECRET`، `LINKEDIN_OAUTH_CLIENT_ID/SECRET`).
  **یافته‌ی واقعی LinkedIn**: جریان استاندارد ۳-مرحله‌ای OAuth لینکدین
  اصلاً refresh token برنمی‌گردونه (access token ~۶۰ روزه) — برای همین
  `linkedin_connections` ستون `refresh_token_encrypted` نداره؛ این رفتار
  واقعی API‌شونه، نه یک ساده‌سازی.
- **`services/youtube-connector-service.ts`**، **`tiktok-connector-service.ts`**،
  **`linkedin-connector-service.ts`**: دقیقاً همون شکل
  google-connector-service.ts (state امضاشده‌ی ۱۰دقیقه‌ای، `handleCallback`،
  `ON CONFLICT ... DO UPDATE` برای reconnect، `FeatureNotAvailableError` اگه
  اپ تنظیم نشده).
- **ثبت در رجیستری CP-052**: `youtube-connector`، `tiktok-connector`،
  `linkedin-connector`.
- **وب**: `app/plugins/youtube/page.tsx`، `app/plugins/tiktok/page.tsx`،
  `app/plugins/linkedin/page.tsx` — نسخه‌ی ساده‌شده‌ی صفحه‌ی Google (یک
  دکمه‌ی «Connect»، بدون چک‌باکس انتخاب سرویس چون هرکدوم فقط یک scope
  ثابت دارن).
- ✅ **تست واقعی**: ۲۰ تست سرویس جدید (۷ YouTube + ۷ TikTok + ۷ LinkedIn،
  Postgres واقعی + client fake تزریقی برای هرکدوم، شامل تأیید state جعلی،
  reconnect به‌جای duplicate، و رفتار FeatureNotAvailableError). کل سوییت
  گیت‌وی (۳۶ فایل/۲۸۳ تست) سبز. `next build` واقعی موفق (هر سه صفحه‌ی
  جدید build شدن، مجموع ۸ صفحه‌ی پلاگین). Lint/typecheck هر دو پروژه سبز.

> **صریحاً انجام‌نشده همین بخش (نه فراموش‌شده)**: CP-058 (Discord)،
> CP-059 (Google Chat)، CP-060 (WeChat) عمداً ساخته نشدن. هر سه، برخلاف
> همه‌ی connector pluginهای بالا، یک الگوی معماری واقعاً جدید نیاز دارن که
> هیچ جلسه‌ای تصمیمش نگرفته: Discord پیام‌های معمولیش رو فقط از طریق یک
> اتصال WebSocket **Gateway دائمی و خروجی** (نه وب‌هوک ورودی) می‌ده —
> معماری کاملاً متفاوت از همه‌ی الگوهای موجود؛ Google Chat هویت وب‌هوک رو
> با یک JWT audience-check تأیید می‌کنه (نه secret ساده)؛ WeChat پیام‌ها
> رو با XML+امضای اختصاصی خودش می‌فرسته. طبق قاعده‌ی «اول جلسه، بعد ساخت»،
> این سه به‌جای حدس‌زدن یک طرح امنیتی/معماری جدید، به‌عنوان آیتم جلسه‌ی
> بعدی علامت‌گذاری شدن (به‌روزرسانی در TODO-openon4net-platform.md بخش K).

---

### RT-090 — جایگزینی SSE با WebSocket برای استریم چت (۲۰۲۶-۰۷-۱۸)

> تصمیم قبلاً در جلسه ۶ توسط کاربر تأیید شده بود (طبق یادداشت خودِ TODO tracker) —
> بدون نیاز به تأیید مجدد شروع شد.

- **مسیر جدید**: `GET /v1/agents/:id/chat/ws` (`gateway/src/routes/chat.ts`)،
  با `@fastify/websocket` (نسخه‌ی `^11.3.0`، سازگار با Fastify v5). مسیر
  POST قدیمی `/chat/stream` (SSE، `text/event-stream` دستی) کامل حذف شد.
- **مشکل auth و راه‌حل**: هندشیک WebSocket همیشه یک `GET` است و
  `WebSocket` سازنده‌ی بومی مرورگر نمی‌تونه هدر `Authorization` سفارشی
  بذاره — پس توکن/`organizationId` به‌عنوان query param سوار می‌شن.
  `plugins/auth.ts`'s هوک سراسری `onRequest` یک شاخه‌ی `isWsUpgrade`
  گرفت (چک `request.headers.upgrade === 'websocket'`) که _فقط_ برای
  درخواست‌های upgrade واقعی query param رو می‌پذیره — یک درخواست REST
  عادی نمی‌تونه از همین میان‌بر برای دور زدن auth هدر استفاده کنه (که
  توی access logها هم لو می‌رفت).
- **پروتکل**: اتصال برای کل session باز می‌مونه، نه یک اتصال جدا به ازای
  هر پیام — کلاینت هر turn رو با یک فریم JSON
  `{ message, conversationId? }` می‌فرسته، سرور یک رشته از فریم‌های
  `ChatStreamEvent`-شکل (`token`/`reasoning`/`done`/`requires_approval`/
  `error`) برمی‌گردونه. یک flag `busy` جلوی race دو `chatStream()`
  همزمان روی یک سوکت رو می‌گیره (پیام دوم قبل از پایان اولی یک فریم
  `error` می‌گیره، نه interleave شدن توکن‌ها).
- **⚠️ باگ واقعی پیدا/فیکس‌شده حین نوشتن تست**: گذاشتن `requirePermission`
  (یک تابع sync و void) به‌صورت مستقیم توی آرایه‌ی `preHandler` یک مسیر
  websocket باعث **hang ابدی** می‌شد — Fastify تشخیص می‌ده یک هوک یا باید
  Promise واقعی برگردونه یا آرگومان سوم (`done`) رو صدا بزنه؛ یک آرو
  function با فقط ۱ پارامتر که `undefined` برمی‌گردونه هیچ‌کدوم رو نداره،
  پس Fastify تا ابد منتظر می‌مونه. این باگ فقط با تست واقعی
  (`app.injectWS()`) پیدا شد، نه با inspection — علامتش این بود که یک
  اتصال با اجازه‌ی رد شده (۴۰۳) فوری برمی‌گشت، ولی همون اتصال با اجازه‌ی
  قبول‌شده هیچ‌وقت جواب نمی‌داد. فیکس: `async (request) => requirePermission(...)`
  به‌جای فرم sync.
- **تست‌ها**: `routes/chat-ws.test.ts` (جدید، ۴ تست) — اولین تست
  route-level این ریپو با `buildApp()` + `app.injectWS()` واقعی (نه
  mock)، شامل: استریم واقعی token/reasoning/done، رد هندشیک بدون توکن،
  رد هندشیک با `organizationId` ناهماهنگ با claim توکن، فریم خطا برای
  JSON نامعتبر بدون قطع اتصال. `web/lib/api-client.ts`'s `streamChat()`
  بازنویسی شد (WebSocket بومی به‌جای `fetch()` + پارس دستی SSE)، همون
  امضای `StreamCallbacks` حفظ شد تا `chat/page.tsx` بدون تغییر بمونه.
- **تست end-to-end واقعی**: یک اسکریپت Node با `WebSocket` global بومی
  (همون کلاسی که مرورگر داره، نه یک کتابخونه‌ی جدا) — لاگین واقعی، ساخت
  Agent واقعی، اتصال WS واقعی با query-param auth، چت واقعی با یک مدل
  Ollama واقعی (`gemma3:4b`) — استریم token-به-token و رویداد `done`
  تأیید شد. یک اسکریپت دوم رد هندشیک بدون توکن و رفتار busy-guard (دو
  پیام پشت‌سرهم روی یک سوکت) رو هم تأیید کرد. `next build` واقعی وب هم
  بدون خطا کامل شد.
- **مستند API**: `docs/spect/04_API/00-openapi-v0.1.yaml`'s
  `/agents/{agent_id}/chat/stream` (POST/SSE) با `/agents/{agent_id}/chat/ws`
  (GET/WebSocket) جایگزین شد، شامل شرح کامل پروتکل فریم‌ها در `description`
  (OpenAPI 3.0 اسکیمای بومی WS نداره).
- **نیمه‌ی دوم عمداً باقی‌مونده**: رویدادهای real-time اجرای Tool/Skill
  (که خودِ عنوان RT-090 هم بهش اشاره کرده) منتظر RT-085 می‌مونه — چون
  حلقه‌ی tool/skill-calling هنوز اصلاً وجود نداره که رویدادی ازش پخش بشه؛
  این کانال WebSocket طوری طراحی شده که وقتی RT-085 ساخته بشه، فریم‌های
  جدیدی مثل `tool_call`/`tool_result` بدون تغییر پروتکل پایه اضافه بشن.

---

### RT-085 — Native tool/skill-calling loop در چت (agentic/ReAct) (۲۰۲۶-۰۷-۱۸، subset)

> Scope واقعی: دو Tool موجود (`telegram-send`/`webhook-send`)، نه Skillهای
> دلخواه کاربر — چون Skillهای امروز پارامترهای از پیش تعیین‌شده‌ی ثابت دارن
> (بدون ورودی dynamic runtime)، نامناسب برای اینکه مدل خودش محتوا رو در لحظه
> تصمیم بگیره. تعمیم به Skillهای دلخواه یک تسک جدا و بزرگ‌تره (نیاز به
> پشتیبانی از پارامتر runtime در `skill-executor.ts`)، عمداً خارج از این batch.

- **`@o2n/llm-providers`**: انواع جدید `LlmToolDefinition` (نام/شرح/JSON Schema
  پارامترها) و `LlmToolCall` (id/نام/آرگومان‌های parse‌شده). `LlmMessage` یک
  role جدید `'tool'` گرفت + فیلدهای اختیاری `toolCallId`/`toolCalls` برای
  round-trip واقعی. `LlmCompletionRequest.tools؟`/`LlmCompletionResult.toolCalls؟`.
  **هر دو** provider سیم‌کشی شدن: `openai-compatible-provider.ts` (شکل
  function-calling رسمی OpenAI، کار می‌کنه با Ollama/DeepSeek/OpenAI خودش چون
  همه از همون endpoint سازگار استفاده می‌کنن) و `anthropic-provider.ts` (شکل
  `tool_use`/`tool_result` بومی Anthropic — یک پارامتر اختیاری `baseUrl` هم
  اضافه شد تا اولین‌بار قابل تست واقعی HTTP بشه، چون این provider قبلاً هیچ
  تستی نداشت).
- **`gateway/src/services/agentic-tools.ts` (جدید)**: JSON Schema دستی دو
  Tool موجود (مطابق `TelegramSendSchema`/`WebhookSendSchema` موجود در
  `packages/shared`، بدون نیاز به وابستگی zod-to-json-schema برای این دو
  اسکیمای ساده). `buildAvailableTools(userPermissions)` فقط Toolهایی رو
  advertise می‌کنه که خودِ کاربر واقعاً RBAC permission‌شون رو داره
  (`tools:telegram-send`/`tools:webhook-send`) — دقیقاً همون permission که
  مسیر HTTP مستقیم (`routes/tools.ts`) enforce می‌کنه، پس مدل حتی نمی‌تونه
  ببینه Toolای وجود داره که کاربر پشت این چت اجازه‌ی صداکردنش رو نداره.
- **`chat-service.ts`'s `runToolLoop()`**: حلقه‌ی ReAct واقعی — تا
  `MAX_TOOL_ITERATIONS=5` دور تصمیم‌گیری؛ هر دور مدل رو با Toolهای موجود صدا
  می‌زنه، اگه `toolCalls` برگردوند هرکدوم رو اجرا می‌کنه (از طریق
  `tool-dispatcher.ts`'s `executeTool()` موجود — **بدون** ساخت مسیر اجرای
  جدید، فقط استفاده‌ی مجدد از همون connectorها) و نتیجه رو به‌عنوان یک پیام
  `role:'tool'` برای دور بعد اضافه می‌کنه؛ اگه دیگه `toolCalls`ای نبود، همون
  جواب نهاییه. اگه سقف دور بزنه، یک تماس آخر **بدون** Tool اجباری می‌کنه تا
  مدل مجبور به جواب متنی بشه (جلوگیری از حلقه‌ی ابدی).
  **حسابداری هزینه/توکن روی تمام دورها جمع می‌شه**، نه فقط دور آخر — یک باگ
  واقعی که حین نوشتن این خلاصه پیدا و فیکس شد قبل از رسیدن به تست (حلقه‌های
  چند-دوره‌ای هزینه‌ی واقعی چند تماس LLM دارن، نه فقط یکی).
- **Policy gate (RT-008/RT-056) رعایت شد، نه دور زده شد**: یک Tool call که
  توسط policy سازمانی نیاز به تأیید داره **اجرا نمی‌شه** — چون مکانیزم
  «ادامه‌ی این turn چت بعد از تأیید انسانی» هنوز وجود نداره (این‌کار یک
  async resume-workflow واقعی می‌خواد، خارج از scope این batch). به‌جاش به
  مدل یک پیام خطا برمی‌گرده («این اکشن نیاز به تأیید دستی داره») که مدل
  می‌تونه به کاربر منتقلش کنه — این یک bypass امنیتی نیست، دقیقاً همون گیت
  مسیر HTTP مستقیم `routes/tools.ts` رعایت می‌شه، فقط این‌جا نمی‌شه صبر کرد.
- **persistTurn()**: هر Tool call این turn، به ترتیب، به‌عنوان یک ردیف
  `role:'tool'` جدید نوشته می‌شه (پیش از ردیف `thought`/`agent`) —
  `content` یک خلاصه‌ی کوتاه انسانی (`Called webhook_send`)، `metadata`
  ساختاریافته (`name`/`arguments`/`result` یا `error`). `toLlmRole()` هنوز
  `'tool'` رو `null` می‌کنه (RT-084's رفتار برای `'thought'` هم همینه) —
  یعنی این ردیف‌ها هرگز به‌عنوان تاریخچه‌ی مکالمه در turn بعدی replay
  نمی‌شن؛ فقط round-trip داخلِ همین یک turn (بین دورهای runToolLoop) معنا
  داره.
- **`chatStream()`**: وقتی Toolای موجود باشه، دورهای تصمیم‌گیری از طریق
  تماس‌های non-streaming `complete()` انجام می‌شن (اجرای یک Tool واقعی به
  آرگومان کامل نیاز داره، نه JSON استریم‌شده‌ی نصفه) و فریم‌های `tool_call`/
  `tool_result` بلافاصله پخش می‌شن؛ وقتی مدل دیگه Tool صدا نزنه، محتوای
  نهایی (که از همون آخرین `complete()` کامله) به‌عنوان یک فریم `token`
  واحد پخش می‌شه — **نه** یک تماس `stream()` جداگانه‌ی دوم فقط برای گرفتن
  همون متن token-به-token (که هزینه‌ی یک تماس اضافه‌ی LLM رو به هر turn
  اضافه می‌کرد، حتی وقتی Tool واقعاً صدا زده نشه). Agentهای بدون هیچ
  permission ابزاری همچنان دقیقاً همون مسیر قدیمی `stream()` مستقیم رو
  می‌گیرن — صفر تغییر رفتار/هزینه براشون.
- **`routes/chat.ts`**: هر دو مسیر (`POST /chat` و `GET /chat/ws`)
  `request.auth.permissions` رو به‌عنوان `userPermissions` پاس می‌دن.
  **عمداً محدود به چت تعاملی انسانی** — بقیه‌ی call siteها
  (`approvals.ts`, `webhooks.ts`, `agent-message-scheduler.ts`,
  `scheduler.ts`, `workflow-executor.ts`) این پارامتر رو پاس نمی‌دن (پیش‌فرض
  خالی → بدون Tool)، چون هیچ انسان مسئولی پشت یک اجرای خودکار/webhook/
  scheduled نیست که بشه بابت یک Tool call خودمختار پاسخ‌گو دونستش.
- **تست‌های واقعی (نه mock)**: ۶ تست جدید در `chat-service.test.ts` با یک
  fake provider کنترل‌شده (اجرای واقعی webhook به `postman-echo.com`،
  policy gate واقعی، نام Tool نامعتبر از یک «مدل توهم‌زده»، و برخورد واقعی
  با سقف ۵ دوره) + ۵ تست HTTP واقعی جدید در `llm-providers` (۳ برای
  OpenAI-compat، ۲ برای Anthropic که اولین تست این provider هم بود) که
  پروتکل سیمی واقعی هر دو ارائه‌دهنده رو با پاسخ‌های به‌درستی‌شکل‌دهی‌شده
  تأیید می‌کنن (نه فقط typecheck).
- **⚠️ محدودیت واقعی کشف‌شده حین تست زنده**: مدل‌های Ollama محلی موجود در
  این محیط (`qwen2.5-coder:14b`، هم از `/v1/chat/completions` سازگار-OpenAI
  هم از `/api/chat` بومی خودِ Ollama با پارامتر `tools` امتحان شد) عملاً
  `tool_calls` واقعی برنمی‌گردونن — فقط متن JSON‌شکل داخل خودِ `content`
  می‌نویسن، بدون اینکه فیلد ساختاریافته‌ی `tool_calls` پر بشه. این یک
  محدودیت واقعیِ خودِ مدل/قالب چتشه (این build خاص از GGUF ظاهراً template
  function-calling نداره)، **نه باگی در کد این‌جا** — کد دقیقاً طبق پروتکل
  رسمی سیمی هر دو provider پیاده‌سازی و با پاسخ‌های صحیح تست شده. کلید API
  واقعی OpenAI/Anthropic برای اثبات با یک مدل واقعاً tool-capable در این
  محیط موجود نبود؛ این باقی‌مونده‌ی صادقانه‌ست، نه چیزی که پنهان بشه.
- **UI**: `web/lib/api-client.ts`'s `StreamCallbacks` گرفت
  `onToolCall`/`onToolResult` (اختیاری، سازگار با کد قدیمی). صفحه‌ی چت یک
  بلوک مجزا («🔧 Show/Hide tool calls»، collapsed پیش‌فرض، دقیقاً همون الگوی
  بلوک reasoning) بالای حباب پاسخ نشون می‌ده، شامل نام/آرگومان/نتیجه یا
  خطای هر Tool call. `toDisplayMessages()` ردیف‌های `'tool'` رو (مثل
  `'thought'`) با ردیف `'agent'` بعدی جفت می‌کنه. `next build` واقعی وب هم
  بدون خطا کامل شد.

---

### RT-086 — Agent-to-agent delegation خودکار (۲۰۲۶-۰۷-۱۸)

> ساخته شده روی همون agentic loop RT-085 — نه یک سیستم جدا. مدل هیچ‌وقت
> تصمیم نمی‌گیره «delegate کنم یا نه»؛ فقط اسم یک Skill رو صدا می‌زنه، و
> سیستم پشت صحنه تصمیم می‌گیره خودش اجراش کنه یا از یک Agent دیگه بخواد.

- **تبلیغ Skill به مدل، مستقل از grant**: `agentic-tools.ts`'s
  `buildSkillTools(skills)` تابعی جدید — هر Skill فعال سازمان (نه فقط ۲
  Tool ثابت RT-085) یک تابع قابل‌فراخوانی می‌شه با نام پایدار
  `skill_<نام‌پاکسازی‌شده>_<۸ کاراکتر اول id>` (چون اسم Skillها می‌تونه
  تکراری باشه ولی id نه). این تبلیغ **صرف‌نظر از اینکه خودِ Agent فعلی
  اون Skill رو grant داره یا نه** انجام می‌شه — چک واقعی grant موقع
  _اجراست_، نه موقع تصمیم مدل. دقیقاً همین چیزی که «خودکار» رو معنا
  می‌ده: مدل هیچ‌وقت لازم نیست بدونه یا اهمیت بده کدوم Agent واقعاً
  کارش رو انجام می‌ده.
- **کوئری معکوس جدید**: `SkillGrantService.findGrantedAgent(organizationId,
skillId, excludeAgentId)` — برعکسِ `listForAgent()` موجود (که
  Agent→Skillهاش رو می‌ده)؛ این یکی Skill→کدوم Agent دیگه‌ی همون سازمان
  grant داره رو پیدا می‌کنه (جدیدترین grant، تساوی دلبخواهی ولی
  deterministic). قبلاً چنین کوئری‌ای اصلاً وجود نداشت.
- **`chat-service.ts`'s `runSkillCall()`**: وقتی مدل یک تابع Skill-محور
  صدا می‌زنه: (۱) اگه Agent فعلی grant داره → مستقیم `executeSkill()`.
  (۲) اگه نداره → `findGrantedAgent()`؛ اگه یک delegate پیدا شد، یک ردیف
  **واقعی** `agent_messages` (from=Agent فعلی, to=delegate) برای
  audit/inbox ثبت می‌شه، Skill **سینکرون** (نه از طریق چرخه‌ی async
  فعلی ۳۰ثانیه‌ای زمان‌بند پیام‌ها) روی delegate اجرا می‌شه — چون این
  turn چت به نتیجه‌ی فوری نیاز داره، نه یک پاسخ دیرتر — و پیام
  `delivered`/`failed` می‌شه بسته به نتیجه. (۳) اگه هیچ Agent‌ای grant
  نداشت، خطای روشن «No agent in this organization has ... granted»
  برمی‌گرده.
- **تفاوت آگاهانه با سیستم پیام‌رسانی موجود**: `agent_messages` امروز
  کاملاً async/fire-and-forget بود (زمان‌بند هر ۳۰ ثانیه یه‌بار پیام‌های
  pending رو با یک تماس کامل `chat()` جدید به Agent مقصد تحویل می‌ده، و
  پاسخ هیچ‌وقت به فرستنده برنمی‌گرده). RT-086 از همون جدول برای
  **audit trail** استفاده می‌کنه (پس در inbox واقعی Agent مقصد هم دیده
  می‌شه) ولی خودِ اجرا رو مستقیم (نه از طریق آن چرخه‌ی async) صدا می‌زنه،
  چون منتظر ماندن ۳۰ ثانیه برای یک ابزار داخل یک چت زنده قابل‌قبول نیست.
- **narrowing وابستگی executeSkill()**: مثل `executeTool()` در RT-085،
  `executeSkill(ctx, ...)` به `executeSkill(db, env, ...)` تبدیل شد —
  فقط همون دو تیکه‌ای که واقعاً لازم داشت، نه کل `AppContext`. این
  اجازه داد `ChatService` مستقیم صداش بزنه (هم برای اجرای محلی هم برای
  اجرا به‌نمایندگی از یک delegate) بدون نیاز به AppContext کامل توی
  constructor. `routes/skills.ts` و `skill-executor.test.ts` تطبیق دادن
  شدن.
- **persistTurn()**: ردیف `role:'tool'` برای یک Skill delegate‌شده
  `metadata.delegatedTo` (اسم Agent مقصد) رو هم داره، و `content` یک
  پسوند «(delegated to X)» می‌گیره — قابل‌مشاهده در تاریخچه بدون نیاز
  به کاوش دستی.
- **UI**: بلوک tool-call (RT-085) حالا وقتی `delegatedTo` ست باشه، اسم
  Skill رو با «(delegated to X)» نشون می‌ده — هم برای پیام‌های تاریخی
  هم استریم زنده (`onToolResult` callback گرفت پارامتر چهارم).
- **تست‌های واقعی (نه mock)**: ۳ تست جدید `chat-service.test.ts` — اجرای
  مستقیم وقتی Agent فعلی grant داره؛ delegation واقعی با یک **Agent
  دوم واقعی** (نه فیک) که واقعاً grant داره، تأیید یک ردیف واقعی
  `agent_messages` با وضعیت `delivered` و `fromAgentId` درست؛ و خطای
  روشن وقتی هیچ Agent‌ای grant نداره. همه با اجرای واقعی webhook به
  `postman-echo.com` (همون الگوی RT-085).
- **smoke test واقعی end-to-end**: gateway واقعی بالا آورده شد، ۲ Agent
  واقعی ساخته شد، یک Skill واقعی + grant فقط به Agent دوم، و تأیید شد
  مسیر HTTP مستقیم اجرای Skill روی Agent اول درست رد می‌شه («This agent
  has not been granted this skill») — دقیقاً همون سناریویی که RT-086
  قراره به‌جاش خودکار delegate کنه به‌جای رد کردن با خطا.
- **کل مجموعه‌ی gateway (۴۷ فایل، ۲۴۵ تست) + typecheck/lint هر دو ریپو
  (gateway/web) پاس شد؛ `next build` واقعی وب هم بدون خطا.**

---

### RT-087 — Skills مطابق استاندارد باز Agent Skills (۲۰۲۶-۰۷-۱۸، subset تأییدشده)

> تصمیم معماری (سوال از کاربر، ۲۰۲۶-۰۷-۱۸): «فرمت جدید، فقط دستورالعمل
> (توصیه‌شده)» — یک فرمت جدید و **افزوده** به کنار مدل JSON قدیمی (نه
> جایگزینش)، بدون اجرای `scripts/` (که یک تصمیم sandboxing/امنیتی جدا و
> بزرگ‌تره، عمداً به تسک بعدی موکول شد). این یعنی هیچ‌کدوم از RT-085/RT-086
> نیازی به تغییر نداشتن.

- **جدول‌های کاملاً جدید**: `migrations/0032_skill_packages.sql` —
  `agent_skill_packages` (name/description/instructions/status) و
  `agent_skill_package_grants` (mirror دقیق `agent_skill_grants` موجود).
  `skills`/`agent_skill_grants` قدیمی دست‌نخورده موندن.
- **`packages/shared/src/schemas/skill-package.ts` (جدید)**:
  `SkillPackageCreateSchema` (فرم ساختاریافته no-code)،
  `SkillPackageImportSchema` (متن خام SKILL.md).
- **`gateway/src/services/skill-package-markdown.ts` (جدید)**: parser دستی
  frontmatter (`---\nname: ...\ndescription: ...\n---\n<body>`) — بدون
  وابستگی yaml جدید، چون این subset فقط دو مقدار flat رشته‌ای می‌خواد،
  نه ساختار تودرتو. تست شده با ۶ مورد واقعی (فایل خوش‌فرم، quote‌های
  اطراف مقدار، بدون frontmatter، بدون name، بدون description، body خالی).
- **`SkillPackageService`/`SkillPackageGrantService` (جدید)**: CRUD کامل +
  `importFromMarkdown()` + `listGrantedForAgent()` (یک JOIN، برای
  ساخت لیست ابزارهای هر turn چت). `SkillPackageGrantService` بدون
  `findGrantedAgent()`ی شبیه RT-086 — مستندات محض هیچ side effectای نداره
  که بشه delegate کرد.
- **`routes/skill-packages.ts` (جدید)**: CRUD کامل + `/import` + grant/revoke
  - لیست grantهای هر Agent — mirror دقیق `routes/skills.ts` با همون قرارداد
    permission (پیشوند `skills:` — مثل `skills:package-create` — تا زیر
    wildcard موجود `skills:*` نقش admin بیفته، بدون نیاز به migration جدید
    RBAC).
- **`agentic-tools.ts`'s `buildSkillPackageTools()`**: برخلاف RT-086's
  `buildSkillTools()` (که همه‌ی Skillهای سازمان رو تبلیغ می‌کنه، صرف‌نظر از
  grant، برای delegation)، این‌جا **فقط Skill packageهایی که به همین Agent
  granted شدن** تبلیغ می‌شن — چون مستندات محض چیزی برای delegate کردن نداره،
  gate کردن در لحظه‌ی تبلیغ هم ساده‌تره هم به همون اندازه درسته. نام تابع
  همیشه با `read_skill_` شروع می‌شه — واضحه که فقط-خواندنیه.
- **`chat-service.ts`'s `runSkillPackageRead()`**: «activation» در مدل
  progressive disclosure استاندارد — صدا زدن این تابع هیچ side effectای
  نداره، فقط `instructions` رو به‌عنوان نتیجه‌ی tool برمی‌گردونه (بدون
  policy gate، بدون delegation — چون خواندن محض هیچ اکشنی نیست که نیاز
  به تأیید یا واگذاری داشته باشه).
- **باگ واقعی پیدا/فیکس‌شده حین تست**: `test-support/fixtures.ts`'s
  `cleanupTestFixture()` جدول جدید `agent_skill_packages` رو نمی‌شناخت —
  حذف یک organization با یک Skill package باقی‌مونده به خطای FK می‌خورد.
  فیکس شد (همون الگوی موجود برای جدول `skills`).
- **UI**: بخش جدید «Agent Skills (open standard)» در صفحه‌ی `/skills`،
  کاملاً جدا از بخش Skills قدیمی — جدول Skill packageها با
  grant/revoke/delete، و یک فرم دوحالته (no-code فیلددار Name/Description/
  Instructions **یا** Import متن خام SKILL.md).
- **تست‌های واقعی**: ۶ تست parser + ۳ تست `SkillPackageService`/
  `SkillPackageGrantService` (Postgres واقعی) + ۲ تست جدید integration در
  `chat-service.test.ts` (یک Skill package granted واقعاً به‌عنوان تابع
  فقط-خواندنی تبلیغ و صدا زده می‌شه و instructionsش برمی‌گرده؛ یک Skill
  package grant-نشده اصلاً تبلیغ نمی‌شه). smoke test واقعی end-to-end با
  gateway واقعی (ساخت via فرم، import از متن خام، لیست، grant، revoke،
  update، delete — همه روی Postgres واقعی).
- **کل مجموعه‌ی gateway (۴۹ فایل، ۲۵۶ تست) + typecheck/lint هر دو ریپو
  (gateway/web) پاس شد؛ `next build` واقعی وب هم بدون خطا.**
- **صریحاً باقی‌مونده (عمدی، طبق تصمیم کاربر)**: اجرای `scripts/` و ذخیره‌ی
  `references/`/`assets/` — یک تصمیم sandboxing/امنیتی جدا که عمداً از این
  batch بیرون گذاشته شد.

---

### RT-088 — Agent Schedule غنی‌تر (۲۰۲۶-۰۷-۱۸)

> گسترش RT-007 (docs/spect/06_MEETINGS's بخش)، نه جایگزینی — self-scheduling
> فعلی (`intervalMinutes`+`prompt` تخت) هیچ‌جا حذف نشد؛ `target`/`timing`
> جدید کاملاً اختیاری‌ان و فقط وقتی موجود باشن اولویت دارن.

- **`packages/shared/src/schemas/agent.ts`**: `AgentScheduleTargetSchema`
  (discriminated union: `chat` با `prompt` — دقیقاً رفتار قدیمی؛ `tool` با
  `tool: 'telegram-send'|'webhook-send'` + `params`؛ `skill` با `skillId` +
  `params`؛ `workflow` با `workflowId`) و `AgentScheduleTimingSchema`
  (`interval` با `intervalMinutes` — همون رفتار قدیمی، شکل جدید؛ `cron` با
  `minute` + `hour` اختیاری (خالی=هر ساعت) + `daysOfWeek` اختیاری (خالی=هر
  روز) + `dayOfMonth` اختیاری). عمداً یک subset دوستانه no-code، نه پیاده‌سازی
  کامل cron syntax (بدون step/range) — پوشش می‌ده «هر روز ساعت ۹»، «هر
  دوشنبه ساعت ۹»، «روز اول ماه نیمه‌شب» و مشابه.
- **`organizations.timezone`** (migration جدید، پیش‌فرض `'UTC'`) — mirror
  دقیق ستون `language` RT-083 (org-level، بدون override per-user، چون
  scheduling سطح Agent هست نه سطح کاربر). اعتبارسنجی سمت schema با
  `Intl.supportedValuesOf('timeZone')` واقعی (نه یک regex دستی) — یک اسم
  timezone اشتباه رو موقع request رد می‌کنه، نه بی‌صدا ذخیره می‌کنه چیزی که
  بعداً `Intl.DateTimeFormat` نتونه ارزیابیش کنه. `OrgService`/`Organization`
  type دقیقاً همون الگوی `language` رو گرفتن.
- **`services/scheduler.ts` بازنویسی شد**: `isDue(schedule, now, timezone)`
  (خالص، export شده برای تست) — وقتی `timing` ست باشه اولویت داره، وگرنه به
  `intervalMinutes` تخت قدیمی برمی‌گرده. برای `cron`: `Intl.DateTimeFormat`
  با `hourCycle:'h23'` و `timeZone` سازمان، minute/hour/weekday/day رو
  استخراج می‌کنه و با pattern می‌سنجه؛ یک گارد ۵۵ثانیه‌ای (`MIN_CRON_RE_FIRE_GAP_MS`)
  جلوی دوباره‌اجرایی توی همون پنجره‌ی ~۶۰ثانیه‌ای تطبیق minute (۲ تیک پشت‌سرهم
  با cadence ۳۰ثانیه‌ای) رو می‌گیره. `executeTarget()` روی نوع `target` dispatch
  می‌کنه: `chat` → همون `ChatService.chat()` قدیمی؛ `tool` → مستقیم
  `executeTool()` (tool-dispatcher.ts، بدون چرخه‌ی چت)؛ `skill` →
  `executeSkill()` مستقیم؛ `workflow` → `WorkflowExecutor.start()` (همون
  چیزی که workflow-trigger-scheduler.ts خودش برای triggerهای زمان‌بندی‌شده
  استفاده می‌کنه).
- **UI**: صفحه‌ی `/agents`'s فرم Schedule کاملاً بازطراحی شد — انتخاب
  «When» (Every N minutes / Specific time-day، با فیلدهای hour/minute/
  daysOfWeek چک‌باکسی/dayOfMonth برای حالت دوم) و انتخاب «What to run»
  (Chat message / Tool مستقیم با یک textarea JSON برای params / Skill از
  یک select واقعی لیست Skillهای سازمان / Workflow از یک select واقعی لیست
  Workflowهای سازمان). خلاصه‌ی جمع‌شده‌ی کارت هم به‌روز شد («at 09:00» یا
  «every 60m» به‌جای همیشه فقط interval). صفحه‌ی `/settings` یک انتخابگر
  timezone (لیست curated از IANA رایج، سرور همچنان با لیست کامل واقعی
  اعتبارسنجی می‌کنه) کنار انتخابگر زبان موجود گرفت.
- **تست‌های واقعی**: ۱۲ تست خالص `isDue()` (رفتار legacy بدون تغییر، cron با
  minute/hour/daysOfWeek/dayOfMonth هرکدوم جدا، گارد ضد دوباره‌اجرایی، و
  **تبدیل timezone واقعی** — Asia/Tehran یعنی UTC+۳:۳۰، تست می‌کنه همون لحظه
  در Asia/Tehran «۹ صبح» حساب می‌شه ولی در UTC نه) + ۲ تست جدید `OrgService`
  برای timezone (پیش‌فرض UTC، update مستقل از name/settings/language).
- **smoke test واقعی end-to-end (نه mock، نه unit)**: یک agent واقعی روی
  یک gateway واقعی ساخته شد، یک schedule واقعی با `timing.cron` دقیقاً
  برابر با دقیقه/ساعت «همین الان» (UTC) و `target.tool: webhook-send` تنظیم
  شد، ۴۰ ثانیه صبر شد (بدون هیچ mock روی زمان یا تیک زمان‌بند)، و
  scheduler واقعی (همون تیک ۳۰ثانیه‌ای production) واقعاً pattern رو تشخیص
  داد، webhook واقعی به postman-echo.com فرستاد، و `lastRunAt` رو در دیتابیس
  واقعی ست کرد.
- **باگ‌های واقعی این batch**: هیچ‌کدوم پیدا نشد — تمام تست‌ها از همون اول
  پاس شدن (برخلاف batchهای قبلی این نشست که هرکدوم حداقل یک باگ واقعی رو
  حین تست پیدا کردن).
- **کل مجموعه‌ی gateway (۵۱ فایل، ۲۷۰ تست) + typecheck/lint هر دو ریپو
  (gateway/web) پاس شد؛ `next build` واقعی وب هم بدون خطا.**

---

## RT-095 (تکمیل) — token‌سازی صفحه Chat + تأیید اینکه بخش A سه‌پلین دیگه از قبل تمام شده

بعد از commit/push مستندات RT-088، وضعیت CI/Docker Build کامیت `7522097`
چک شد: Docker Build سبز؛ CI روی همون job/step همیشگی (`Lint, typecheck,
test`) قرمز بود — دقیقاً همون الگوی شناخته‌شده‌ی [[ci_postgres_schema_flake]]
(نه رگرسیون واقعی؛ تأیید شد با اجرای محلی همون دستور scoped توربو —
۵۰/۵۰ فایل تست، ۲۷۰ تست پاس).

سپس پلن قبلی «تکمیل بخش A در Control Plane/Marketplace/Memory» بازبینی شد:
مشخص شد **همه‌ی این کار از قبل، در ۲۰۲۶-۰۷-۱۵، کامل انجام و مستند شده بود**
(بخش «بازبینی وضعیت — Control Plane + Memory + Marketplace» بالاتر در همین
فایل) — پلن ذخیره‌شده مال قبل از اون تاریخ بود. با curl زنده روی gateway
در حال اجرا (پورت ۴۱۰۰) دوباره تک‌تک تأیید شد: `/health`، `/metrics`،
UUID نامعتبر → ۴۰۰ (نه ۵۰۰)، CORS preflight از origin غیرمجاز بدون
`Access-Control-Allow-Origin` و از `localhost:3300` با اون header. کاری
اضافه لازم نبود.

**RT-095's باقی‌مانده (Chat page):** صفحه‌ی Chat از قبل رنگ‌ها رو با
`var(--color-*)` می‌گرفت، ولی مقادیر خام px برای `fontSize`/`gap`/
`margin*`/`padding*` توی inline `style={{...}}` هنوز هاردکد بودن (۳۴ مورد).
همه با token متناظر جایگزین شدن: `fontSize: 11/12/13` →
`var(--font-size-2xs/xs/sm)`, `gap: 6/8/10/16` → `var(--space-1-5/2/2-5/4)`,
`margin{Top,Bottom}`/`padding{Top,Bottom}: 4/6/8/10/14` → token متناظر.
یک استثنای آگاهانه باقی موند: `marginTop: 2` (کوچک‌تر از کوچک‌ترین token،
`--space-1`=4px — فاصله‌ی مویی بین عنوان جلسه و شمارنده‌ی پیام).
مقادیر عددی px هیچ تغییری نکردن (`--space-1-5` دقیقاً ۶px با ریشه‌ی
پیش‌فرض ۱۶px مرورگر) — یعنی از نظر رندر بصری هیچ تفاوتی نباید ایجاد بشه،
فقط منبع واحد شدن. `typecheck`/`lint`/`next build` هر سه واقعاً پاس شدن.

**به‌روزرسانی همون روز:** محدودیت بالا (نبود ابزار مرورگر) با نصب مستقیم
پکیج `playwright` (نه MCP server — کاربر این گزینه رو صریحاً انتخاب کرد)
رفع شد. جزئیات کامل زیر، بخش RT-100.

---

## RT-100 (تکمیل) — بازبینی responsive واقعی با Playwright؛ ۴ باگ واقعی پیدا و فیکس شد

کاربر پرسید Playwright رو چطور باید استفاده کنیم؛ دو گزینه مطرح شد (نصب
مستقیم پکیج در برابر یک MCP server رسمی) — کاربر نصب مستقیم رو انتخاب کرد.
پکیج `playwright` در یک پوشه‌ی scratch جدا (نه داخل هیچ‌کدوم از دو ریپو)
نصب شد؛ Chromium از قبل روی این ماشین cache شده بود (`~/AppData/Local/
ms-playwright`)، پس دانلود جدیدی لازم نشد.

**کشف جانبی قبل از تست:** پورت ۳۰۰۰ که قبلاً فرض شده بود متعلق به وب
Runtime است، در واقع یک container Docker بی‌ربط (Open WebUI، مال خودِ
کاربر) بود — نه چیزی که این session ساخته باشه. وب Runtime واقعی با
`NEXT_PUBLIC_API_URL=http://localhost:4123` (پورت واقعی gateway در حال
اجرا، نه پیش‌فرض `.env`'s ۴۰۰۰) روی پورت ۳۰۰۱ بالا آورده شد.

**روش:** یک اسکریپت Node، از طریق `/v1/auth/token` (dev-auth بوت‌استرپ‌کننده)
واقعاً لاگین کرد، یک agent واقعی ساخت، و session token رو مستقیم توی
`localStorage` مرورگر (headless) ست کرد (بدون شبیه‌سازی فرم لاگین — دقیقاً
همون چیزی که خودِ صفحات از `loadSession()` می‌خونن). بعد ۱۶ صفحه (همه‌ی
صفحات اصلی وب) رو در ۴ عرض viewport گرفت: دسکتاپ (۱۴۴۰px)، بالای breakpoint
sidebar (۹۶۰px)، زیر آن breakpoint (۸۶۰px)، و موبایل (۳۹۰px) — مجموعاً ۶۴
اسکرین‌شات واقعی (`fullPage`), همه با Read tool واقعاً دیده شدن (نه فرض).

**۴ باگ واقعی پیدا و فیکس شد:**

1. **صفحه‌ی Chat اصلاً responsive نبود.** لایوت ۳پنلی (`width: 240` /
   `flex: 1` / `width: 280`) هیچ breakpoint نداشت. در ۳۹۰px، عرض واقعی
   سند به ۵۶۸px می‌رسید (اندازه‌گیری شد از هدر PNG) — یعنی ۱۷۸px overflow
   افقی واقعی، با پنل session‌ها و Workspace files عملاً خارج از دید.
   **فیکس:** flex-direction دیگه inline نیست (چون inline style همیشه روی
   هر قانون CSS با هر @media غالبه) — به کلاس‌های `chat-layout`/
   `chat-layout-rtl` منتقل شد در `globals.css`، همراه با `chat-panel-control`/
   `chat-panel-main`/`chat-panel-workspace`. یک قانون جدید داخل همون
   `@media (max-width: 900px)` که RT-097 برای sidebar ساخته بود اضافه شد:
   زیر ۹۰۰px، `flex-direction: column` + پنل‌های کناری `width: 100%`.
   دوباره با Playwright تأیید شد: عرض PNG حالا دقیقاً ۳۹۰px است (نه ۵۶۸).
2. **صفر padding افقی در `<td>`های تمام جدول‌های اپ.** الگوی
   `padding: '8px 0'` (یا `'6px 0'`/`'4px 0'`) در ۴۴+۷ مورد، توی ۱۰ فایل
   (`approvals`, `dashboard`, `marketplace`, `marketplace/publisher`,
   `policies`, `skill-proposals`, `skills`, `users`, `workspaces`,
   `agents`, `workflows`) — یعنی هیچ فاصله‌ای بین ستون‌های مجاور نبود. روی
   دسکتاپ (عرض زیاد، layout خودکار جدول جبران می‌کرد) کمتر محسوس بود، ولی
   روی موبایل کاملاً غیرقابل‌خواندن: صفحه‌ی Users مقدار واقعی
   «AdminAdmin» چسبیده نشون می‌داد (ستون Name «Admin» + ستون Role «Admin»
   بدون فاصله). **فیکس:** همه به `padding: 'var(--space-*) var(--space-3)
var(--space-*) 0'` تغییر کردن (فاصله‌ی ۱۲px بعد از هر سلول، صفر قبل از
   اولی). دوباره با اسکرین‌شات تأیید شد — «Admin» و «Admin» حالا واضح جدا.
3. **ردیف آپلود دو-لوگو در Settings/Branding** (`display:'flex', gap:24`
   بدون `flexWrap`) روی موبایل کلمه‌ی «Logo» رو از چپ و «Choose File»/
   «No file chosen» رو از راست می‌برید. **فیکس:** `flexWrap: 'wrap'` +
   `flex: '1 1 200px'` روی هر دو فیلد (به‌جای `flex: 1` بدون basis).
4. **ردیف category+file در Marketplace/self-hosted plugins** همون کلاس
   باگ رو داشت (کوچیک‌تر — چند پیکسل از «No file chosen» بریده می‌شد).
   **فیکس:** همون `flexWrap: 'wrap'`.

**بازبینی بدون باگ (تأیید شد، نه فقط فرض):** Dashboard، Agents (مودال
انتخاب زبان اول‌بار)، Skills، Workflows، Policies، Audit Log، Roles &
Permissions (طولانی ولی بدون overflow افقی، عرض PNG دقیقاً ۳۹۰px)،
Outcomes، Webhooks، Skill Proposals — همه در هر ۴ عرض viewport چک شدن.

**بعد از هر فیکس:** `typecheck`/`lint` واقعاً روی `@o2n/web` اجرا و پاس
شدن؛ کل ۶۴ اسکرین‌شات دوباره گرفته شد تا فیکس‌ها واقعاً روی صفحه‌ی زنده
تأیید بشن، نه فقط روی کد. سازمان تست (`rt100-review`) و همه‌ی داده‌هاش
بعد از پایان کار با همون ترتیب cascading delete که `cleanupTestFixture()`
استفاده می‌کنه پاک شد.

**نکته‌ی جانبی، نه باگ:** نشانگر dev-mode خود Next.js (دایره‌ی سیاه با
حرف N، گوشه‌ی پایین‌چپ) روی چند اسکرین‌شات روی متن واقعی می‌افته — این
فقط در `next dev` ظاهر می‌شه، در build production نیست، پس گزارش نشد
به‌عنوان باگ اپ.

---

## صریحاً انجام‌نشده (شناخته‌شده، نه فراموش‌شده)

- **T-009 (Secrets/KMS واقعی):** فقط نسخه MVP env-first + رمزنگاری envelope در DB برای BYOK per-org ساخته شده؛ یکپارچگی با Vault/secret manager واقعی (برای production/enterprise) ساخته نشده.
- **RBAC — Policy Layer (ABAC، §6 سند `10-rbac-and-policy.md`):** جدول `roles`/`role_permissions`/`user_role_bindings` («minimum» §4/§8)، UI مدیریت نقش‌ها، ساخت/تغییر‌نقش/غیرفعال‌سازی کاربر (RT-004)، و ساخت/حذف نقش سفارشی (RT-003) ساخته و تست شده (بالا). جدول `policies` با یک subset حداقلی از شرایط ABAC (`cost_gt_cents`, `outside_hours`) در RT-008 ساخته و تست شده (بالا) — condition typeهای بیشتر (layer/tag/environment) هنوز نیست. همچنین هنوز نیست: حذف فیزیکی کاربر (فقط soft-deactivate — عمدی، به‌خاطر FK با audit_logs/conversations)، و per-user credential واقعی (auth هنوز یک API key مشترک org-wide هست، فقط email مشخص می‌کنه کدوم کاربر — RT-012).
- **حافظه معنایی/vector search:** برای Layer 2 (Conversation Memory) در Runtime ساخته و تست شده (بالا) — عمداً فقط با openai/ollama کار می‌کند. Layers 3-6 (Project/Company/Personal/Global Knowledge) و Neo4j Memory Graph از 2026-07-12 در `apps/openon4net-memory` ساخته شدن (بخش «Memory (Plane 3)» بالا) — مسیر ILIKE fallback تست شده، مسیر semantic واقعی هنوز end-to-end تست نشده.
- **اجرای پلاگین/marketplace:** خارج از scope فعلی.
- **CP-058 (Discord)، CP-059 (Google Chat)، CP-060 (WeChat) Channel Plugin سمت Platform:** عمداً ساخته نشدن — هر سه نیاز به یک الگوی معماری جدید دارن که هیچ جلسه‌ای تصمیمش نگرفته (Discord: WebSocket Gateway دائمی خروجی به‌جای وب‌هوک ورودی؛ Google Chat: تأیید JWT audience-check؛ WeChat: XML+امضای اختصاصی). جزئیات و دلیل کامل در بخش «CP-066 + CP-064 + CP-065» بالا (۲۰۲۶-۰۷-۲۳).
- **Memory / Marketplace:** طبق تصمیم صریح کاربر، فقط با درخواست جداگانه پیش می‌رود. Memory از 2026-07-09 با اسکلت contract شروع شد و طبق `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` §3.3/§5 عمداً متوقف بود، تا این‌که در 2026-07-12 کاربر صریحاً guardrail رو عبور داد و backend واقعی Layers 3-6 + Memory Graph ساخته شد (MEM-008..013، جزئیات در بخش «Memory (Plane 3)» بالا). Marketplace از 2026-07-10 شروع شده — MVP-lite برای Plane 4 طبق §۵ واقعاً «کار کردن» می‌خواد نه فقط contract، پس MKT-002..MKT-006 پیاده‌سازی واقعی روی Postgres است (جزئیات در بخش «Marketplace (Plane 4)» بالا). ثبت رسمی در `pnpm-workspace.yaml` ریشه (MKT-001) و بخش‌های B/C Marketplace هنوز باقی‌ان. (Control Plane از 2026-07-09 شروع شده — جزئیات در بخش بالا.)

---

## نحوه به‌روزرسانی این فایل

بعد از هر تسک/فیچر تکمیل‌شده: یک ردیف جدید یا تغییر وضعیت یک ردیف موجود،
با ستون تست دقیق (✅/⚠️/🔧/❌ — نه خوش‌بینانه). اگر تسکی نیمه‌کاره موند، همینجا
با ⚠️ یا یادداشت کوتاه مشخص بشه، نه اینکه حذف بشه.
