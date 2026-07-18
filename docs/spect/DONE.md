# Done Log

> به‌روزرسانی می‌شود بعد از هر تسک تکمیل‌شده. هدف: تصویر سریع از اینکه چقدر
> پروژه واقعاً ساخته شده، بدون نیاز به مرور کل تاریخچه commitها.
>
> **Scope:** `apps/openon4net-runtime` (Plane 1) + از 2026-07-09 به‌صراحت
> `apps/openon4net-control-plane` (Plane 2) هم شروع شد. از 2026-07-10
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
> `openon4net-control-plane`'s `migrate.mjs`)، و زیر یک Postgres advisory lock (برای چند-replica).

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
> `apps/openon4net-control-plane/` (بدون دست‌زدن به `openon4net-runtime`).
> **2026-07-10 (وصل به workspace):** با اجازه کاربر، `apps/openon4net-control-plane/{gateway,web}`
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

| #                | تسک                                                                                                                                                                                                                                                                                                           | وضعیت      | تست                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| T-CP-012 (تکمیل) | `Dockerfile.web` + سرویس `web` در `docker-compose.yml`                                                                                                                                                                                                                                                        | ✅         | ✅ `docker compose build` + `docker compose up -d` واقعی، هر دو container بالا اومدن                                                               |
| —                | **باگ ۱ (preexisting، هر دو Dockerfile):** `corepack enable` بدون pin کردن نسخه، pnpm 11.x رو می‌کشه که به Node 22.13+ نیاز داره → کرش «Unknown built-in module: node:sqlite» روی `node:20-slim`                                                                                                              | ✅ فیکس شد | ✅ با `corepack prepare pnpm@9.12.0 --activate` (همون نسخه‌ی `packageManager` روت) فیکس شد، هر دو Dockerfile                                       |
| —                | **باگ ۲ (preexisting، هر دو Dockerfile):** نبود `.dockerignore` باعث می‌شد `COPY web ./` (یا `COPY gateway ./`) در stage «build»، `node_modules` تازه‌نصب‌شده‌ی stage «deps» رو با `node_modules` هاست (symlinkهای pnpm که به مسیرهای هاست اشاره دارن) خراب کنه → «Cannot find module .../next/dist/bin/next» | ✅ فیکس شد | ✅ با اضافه‌کردن `apps/openon4net-control-plane/.dockerignore` (چون context خودِ همین پوشه‌ست، نه ریشه‌ی مونوریپو که `.dockerignore` خودش رو داره) |

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

## صریحاً انجام‌نشده (شناخته‌شده، نه فراموش‌شده)

- **T-009 (Secrets/KMS واقعی):** فقط نسخه MVP env-first + رمزنگاری envelope در DB برای BYOK per-org ساخته شده؛ یکپارچگی با Vault/secret manager واقعی (برای production/enterprise) ساخته نشده.
- **RBAC — Policy Layer (ABAC، §6 سند `10-rbac-and-policy.md`):** جدول `roles`/`role_permissions`/`user_role_bindings` («minimum» §4/§8)، UI مدیریت نقش‌ها، ساخت/تغییر‌نقش/غیرفعال‌سازی کاربر (RT-004)، و ساخت/حذف نقش سفارشی (RT-003) ساخته و تست شده (بالا). جدول `policies` با یک subset حداقلی از شرایط ABAC (`cost_gt_cents`, `outside_hours`) در RT-008 ساخته و تست شده (بالا) — condition typeهای بیشتر (layer/tag/environment) هنوز نیست. همچنین هنوز نیست: حذف فیزیکی کاربر (فقط soft-deactivate — عمدی، به‌خاطر FK با audit_logs/conversations)، و per-user credential واقعی (auth هنوز یک API key مشترک org-wide هست، فقط email مشخص می‌کنه کدوم کاربر — RT-012).
- **حافظه معنایی/vector search:** برای Layer 2 (Conversation Memory) در Runtime ساخته و تست شده (بالا) — عمداً فقط با openai/ollama کار می‌کند. Layers 3-6 (Project/Company/Personal/Global Knowledge) و Neo4j Memory Graph از 2026-07-12 در `apps/openon4net-memory` ساخته شدن (بخش «Memory (Plane 3)» بالا) — مسیر ILIKE fallback تست شده، مسیر semantic واقعی هنوز end-to-end تست نشده.
- **اجرای پلاگین/marketplace:** خارج از scope فعلی.
- **Memory / Marketplace:** طبق تصمیم صریح کاربر، فقط با درخواست جداگانه پیش می‌رود. Memory از 2026-07-09 با اسکلت contract شروع شد و طبق `docs/spect/09_TASKS/08-scope-guardrails-mvp.md` §3.3/§5 عمداً متوقف بود، تا این‌که در 2026-07-12 کاربر صریحاً guardrail رو عبور داد و backend واقعی Layers 3-6 + Memory Graph ساخته شد (MEM-008..013، جزئیات در بخش «Memory (Plane 3)» بالا). Marketplace از 2026-07-10 شروع شده — MVP-lite برای Plane 4 طبق §۵ واقعاً «کار کردن» می‌خواد نه فقط contract، پس MKT-002..MKT-006 پیاده‌سازی واقعی روی Postgres است (جزئیات در بخش «Marketplace (Plane 4)» بالا). ثبت رسمی در `pnpm-workspace.yaml` ریشه (MKT-001) و بخش‌های B/C Marketplace هنوز باقی‌ان. (Control Plane از 2026-07-09 شروع شده — جزئیات در بخش بالا.)

---

## نحوه به‌روزرسانی این فایل

بعد از هر تسک/فیچر تکمیل‌شده: یک ردیف جدید یا تغییر وضعیت یک ردیف موجود،
با ستون تست دقیق (✅/⚠️/🔧/❌ — نه خوش‌بینانه). اگر تسکی نیمه‌کاره موند، همینجا
با ⚠️ یا یادداشت کوتاه مشخص بشه، نه اینکه حذف بشه.
