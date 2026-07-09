# Sprint Plan — برنامه اسپرینت‌ها (۲ هفته‌ای)

> مبنا: Roadmap ۱۲ ماهه `docs/spect/01_ROADMAP/01-roadmap-12-months.md`  
> بازه‌ها به شکل `YYYY-MM-DD..YYYY-MM-DD` هستند و **end-exclusive** (یعنی `[start, end)`).

---

## وضعیت واقعی (بروزرسانی 2026-07-09)

پیاده‌سازی واقعی روی `apps/openon4net-runtime` جلوتر از تقویم این سند رفته — SP-00 کامل، و بخش زیادی از SP-01/SP-02/SP-03 هم انجام شده، همه verified روی یک استک واقعی (docker + Postgres/Redis واقعی + یک مدل Ollama واقعی، نه mock). جزئیات:

- **SP-00 (T-001–T-008): ✅ کامل.**
- **SP-01:** T-012 (rate limiting) ✅، T-014 (cost tracking) ✅، T-013 (retry) ⚠️ فقط یک retry ساده دارد نه circuit-breaker کامل، T-009 (secrets store) ❌ هنوز نشده (کلیدها فقط در `.env` هستند).
  **تناقض مهم با T-010/T-011:** این‌جا «multi-model routing + failover» فرض می‌کند Runtime خودش بین چند مدل route می‌کند. ولی طی گفتگوی معماری با کاربر (`docs/spect/02_ARCHITECTURE/14-monorepo-layout.md` نسخه ۲) تصمیم گرفته شد که Runtime فقط BYOK (یک provider فعال، انتخاب‌شده با env) دارد، و routing/failover بین چند مدل مسئولیت انحصاری `openon4net-control-plane` (Plane 2, هنوز شروع نشده) است. در عوض Runtime چهار provider را از طریق یک آداپتور مشترک OpenAI-compatible پشتیبانی می‌کند (anthropic/openai/deepseek/ollama) — یعنی T-010 از نظر «چند provider را می‌شناسد» برآورده شده، ولی T-011 (router/failover) عمداً در Runtime پیاده نمی‌شود؛ باید به بک‌لاگ Control Plane منتقل شود.
- **SP-02:** T-016 (conversation store) ✅، T-019 (error taxonomy) ✅، T-015/T-018/T-020 ⚠️ جزئی (وضعیت agent هست ولی endpoint جدا ندارد؛ SSE پایه کار می‌کند ولی reconnect ندارد؛ trace_id هست ولی متریک/OTel نیست)، T-017 (tool registry) ❌ هنوز شروع نشده.
- **SP-03:** T-021 (auth) ✅، T-022 (RBAC) ✅، T-023/T-024/T-025 ⚠️ جزئی (CRUD از UI فقط create+list دارد نه edit/enable-disable؛ settings فقط read-only است بدون «test connection»؛ چت کار می‌کند ولی history بعد از refresh صفحه لود نمی‌شود)، T-026 (onboarding doc) ❌.
- اضافه بر این سند: approve/reject برای `approval_queue` (بخشی از SP-13 Governance) هم زودتر از موعد ساخته و verify شد، چون بدونش صف تأیید هیچ‌وقت resolve نمی‌شد.

---

## Definition of Done (خلاصه)

- قابلیت قابل دمو + مسیر کاربری مشخص (Storyboard)
- API contract مطابق Spec + خطاهای پایه
- Observability پایه برای مسیرهای اصلی (log + trace id)
- امنیت پایه (secrets + RBAC) برای قابلیت‌های همان اسپرینت

---

## نقشه فازها → اسپرینت‌ها

- Phase 0 (Core Engine | Weeks 1–8): `SP-00` تا `SP-03`
- Phase 1 (Memory | Weeks 9–16): `SP-04` تا `SP-07`
- Phase 2 (Skills | Weeks 17–24): `SP-08` تا `SP-11`
- Phase 3 (Organization | Weeks 25–32): `SP-12` تا `SP-15`
- Phase 4 (Ecosystem | Weeks 33–40): `SP-16` تا `SP-19`
- Phase 5 (Enterprise | Weeks 41–48): `SP-20` تا `SP-23`

---

## تقویم اسپرینت‌ها (Final)

| Sprint | date_range             | Phase        | هدف                                    |
| ------ | ---------------------- | ------------ | -------------------------------------- |
| SP-00  | 2026-07-07..2026-07-21 | Core Engine  | Foundation + اولین demo (chat)         |
| SP-01  | 2026-07-21..2026-08-04 | Core Engine  | AI Gateway core (multi-model)          |
| SP-02  | 2026-08-04..2026-08-18 | Core Engine  | Agent runtime MVP + streaming          |
| SP-03  | 2026-08-18..2026-09-01 | Core Engine  | Dashboard MVP + Auth/RBAC پایه         |
| SP-04  | 2026-09-01..2026-09-15 | Memory       | L1/L2 + query + summarization          |
| SP-05  | 2026-09-15..2026-09-29 | Memory       | L3/L4 + semantic search MVP            |
| SP-06  | 2026-09-29..2026-10-13 | Memory       | L5/L6 + Graph MVP                      |
| SP-07  | 2026-10-13..2026-10-27 | Memory       | Optimization + benchmarks              |
| SP-08  | 2026-10-27..2026-11-10 | Skills       | Skill registry/format/versioning       |
| SP-09  | 2026-11-10..2026-11-24 | Skills       | Skill execution + permissions + logs   |
| SP-10  | 2026-11-24..2026-12-08 | Skills       | Auto-skill detection + approvals       |
| SP-11  | 2026-12-08..2026-12-22 | Skills       | Plugin SDK + Sandbox + Marketplace MVP |
| SP-12  | 2026-12-22..2027-01-05 | Organization | Multi-tenant + Org/Workspace CRUD      |
| SP-13  | 2027-01-05..2027-01-19 | Organization | Governance: audit/HITL/budgets         |
| SP-14  | 2027-01-19..2027-02-02 | Organization | Digital Employee: roles/KPI/schedule   |
| SP-15  | 2027-02-02..2027-02-16 | Organization | Agent Teams + Workflow engine          |
| SP-16  | 2027-02-16..2027-03-02 | Ecosystem    | Payments + revshare + trust            |
| SP-17  | 2027-03-02..2027-03-16 | Ecosystem    | Outcome engine + BI dashboard          |
| SP-18  | 2027-03-16..2027-03-30 | Ecosystem    | Smart features (reports/anomaly/NL)    |
| SP-19  | 2027-03-30..2027-04-13 | Ecosystem    | Integration hub (webhooks/automation)  |
| SP-20  | 2027-04-13..2027-04-27 | Enterprise   | SSO + SOC2-ready controls + VPC        |
| SP-21  | 2027-04-27..2027-05-11 | Enterprise   | K8s + autoscaling + sharding/CDN       |
| SP-22  | 2027-05-11..2027-05-25 | Enterprise   | Multi-region + DR + SLA monitoring     |
| SP-23  | 2027-05-25..2027-06-08 | Enterprise   | Launch prep + docs + enablement        |

---

## SP-00 — Foundation + First Demo

```yaml
id: SP-00
date_range: 2026-07-07..2026-07-21
goal: 'محیط توسعه و اولین نسخه قابل دمو (Agent chat + UI ساده)'
```

| Task  | Title                           | Epic  | Est | Dependencies | Output                                     |
| ----- | ------------------------------- | ----- | --- | ------------ | ------------------------------------------ |
| T-001 | Monorepo setup (turborepo+pnpm) | E-001 | M   | -            | ساختار repo + config مشترک                 |
| T-002 | Docker compose dev environment  | E-001 | L   | -            | PostgreSQL+Redis+MinIO+services بالا بیاید |
| T-003 | AI Gateway: اولین اتصال مدل     | E-002 | L   | T-001        | پاسخ ساده از مدل                           |
| T-004 | Basic chat API (incl. SSE)      | E-003 | L   | T-003        | چت کار کند + استریم                        |
| T-005 | Next.js dashboard MVP           | E-004 | L   | T-001        | UI: agents + chat + settings               |
| T-006 | CI/CD pipeline پایه             | E-001 | S   | T-001        | lint/typecheck/test/build                  |
| T-007 | Memory L1/L2 اسکلت اولیه        | E-010 | M   | T-002        | ذخیره history اولیه                        |
| T-008 | Agent lifecycle CRUD            | E-003 | M   | T-001        | create/enable/disable/delete               |

**Demo**

- مسیر SB-01 تا اولین چت کامل شود.

**Risks**

- هم‌زمانی infra + UI + gateway (تقسیم کار ضروری است).

---

## SP-01 — AI Gateway Core (Multi-model)

```yaml
id: SP-01
date_range: 2026-07-21..2026-08-04
goal: 'AI Gateway پایدار با multi-model routing و کنترل خطا/هزینه'
```

| Task  | Title                                      | Epic  | Est | Dependencies | Output                        |
| ----- | ------------------------------------------ | ----- | --- | ------------ | ----------------------------- |
| T-009 | Secrets store + key rotation policy (MVP)  | E-006 | M   | T-003        | keys امن + rotation guideline |
| T-010 | Multi-provider adapters (حداقل 2 provider) | E-002 | L   | T-003        | OpenAI + Claude (یا معادل)    |
| T-011 | Router rules + failover policy             | E-002 | M   | T-010        | route/fallback قابل تنظیم     |
| T-012 | Rate limiting + quotas                     | E-002 | M   | T-003        | جلوگیری از abuse              |
| T-013 | Circuit breaker + retries/timeouts         | E-002 | M   | T-003        | پایداری بهتر                  |
| T-014 | Cost tracking per-request (MVP)            | E-002 | M   | T-010        | گزارش هزینه پایه              |

> **⚠️ T-011 منسوخ برای Runtime.** طبق تصمیم معماری بعدی (بخش «وضعیت واقعی» بالای این فایل)، routing/failover بین چند مدل مسئولیت `openon4net-control-plane` است، نه `openon4net-runtime`. این task باید به بک‌لاگ Control Plane منتقل شود، نه این‌که در Runtime پیاده شود.

**Demo**

- یک درخواست در صورت fail مدل A به مدل B failover کند. _(منسوخ — دموی جایگزین برای Runtime: BYOK provider با یک retry ساده، که همین الان verify شده.)_

---

## SP-02 — Agent Runtime MVP + Streaming

```yaml
id: SP-02
date_range: 2026-08-04..2026-08-18
goal: 'runtime Agent پایدار + ابزارهای پایه + UX استریم'
```

| Task  | Title                                             | Epic  | Est | Dependencies | Output                     |
| ----- | ------------------------------------------------- | ----- | --- | ------------ | -------------------------- |
| T-015 | Agent runtime state model + status endpoint       | E-003 | M   | T-008        | status: idle/running/error |
| T-016 | Conversation store integration (L1/L2 MVP harden) | E-010 | L   | T-007        | history پایدارتر           |
| T-017 | Tool registry API + basic tool execution          | E-003 | L   | T-004        | tool-call ساده             |
| T-018 | Streaming UX: SSE reliability + reconnect         | E-003 | M   | T-004        | استریم بدون قطع            |
| T-019 | Error taxonomy + error codes (API)                | E-003 | M   | T-004        | خطاهای استاندارد           |
| T-020 | Observability پایه برای chat/gateway              | E-005 | M   | T-004        | trace id + metrics اولیه   |

**Demo**

- چت استریم با trace id قابل مشاهده.

---

## SP-03 — Dashboard MVP + Auth/RBAC پایه

```yaml
id: SP-03
date_range: 2026-08-18..2026-09-01
goal: 'UI پایدار برای مسیر SB-01 + auth و RBAC پایه'
```

| Task  | Title                                        | Epic  | Est | Dependencies | Output                     |
| ----- | -------------------------------------------- | ----- | --- | ------------ | -------------------------- |
| T-021 | Auth (session/token) MVP                     | E-004 | L   | T-005        | login/logout               |
| T-022 | RBAC enforcement MVP (server-side)           | E-006 | L   | T-021        | نقش‌ها enforce شود         |
| T-023 | UI: Agents CRUD کامل                         | E-004 | M   | T-005        | create/edit/enable/disable |
| T-024 | UI: Settings (keys/models) + test connection | E-004 | M   | T-021        | تست اتصال از UI            |
| T-025 | UI: Chat polish (history, errors)            | E-004 | M   | T-004        | تجربه قابل دمو             |
| T-026 | Onboarding doc (dev) + run scripts           | E-005 | S   | T-001        | شروع کار تیم سریع          |

**Demo**

- مسیر SB-01 کامل از UI.

---

## SP-04 — Memory L1/L2 + Query + Summarization

```yaml
id: SP-04
date_range: 2026-09-01..2026-09-15
goal: 'حافظه L1/L2 production-ready با query و خلاصه‌سازی'
```

| Task  | Title                              | Epic  | Est | Dependencies | Output               |
| ----- | ---------------------------------- | ----- | --- | ------------ | -------------------- |
| T-027 | Memory schema/migrations (L1/L2)   | E-010 | M   | T-002        | جداول پایدار         |
| T-028 | Memory CRUD API (L1/L2)            | E-010 | L   | T-027        | endpoints کامل       |
| T-029 | Summarization job + policy         | E-010 | L   | T-028        | summary پس از N پیام |
| T-030 | Memory query API (filters, paging) | E-010 | M   | T-028        | query سریع           |
| T-031 | UI: History + Summary panel        | E-004 | M   | T-029        | نمایش در UI          |
| T-032 | Benchmarks اولیه latency           | E-014 | S   | T-030        | baseline اندازه‌گیری |

---

## SP-05 — L3/L4 + Semantic Search MVP

```yaml
id: SP-05
date_range: 2026-09-15..2026-09-29
goal: 'دانش پروژه/سازمان + semantic search حداقلی'
```

| Task  | Title                                    | Epic  | Est | Dependencies | Output            |
| ----- | ---------------------------------------- | ----- | --- | ------------ | ----------------- |
| T-033 | pgvector integration + indexes           | E-011 | M   | T-027        | vector storage    |
| T-034 | Ingestion pipeline MVP (project/company) | E-011 | L   | T-033        | ingest batch ساده |
| T-035 | Semantic search API (top-k)              | E-011 | M   | T-033        | جستجوی معنایی     |
| T-036 | Auto-classification rules (MVP)          | E-011 | M   | T-034        | لایه‌بندی داده    |
| T-037 | Retrieval-augmented prompting (MVP)      | E-003 | M   | T-035        | تزریق context     |
| T-038 | UI: Knowledge search view                | E-004 | S   | T-035        | تست دستی          |

---

## SP-06 — L5/L6 + Memory Graph MVP

```yaml
id: SP-06
date_range: 2026-09-29..2026-10-13
goal: 'دانش شخصی/عمومی + گراف دانش حداقلی'
```

| Task  | Title                                      | Epic  | Est | Dependencies | Output                    |
| ----- | ------------------------------------------ | ----- | --- | ------------ | ------------------------- |
| T-039 | Personal knowledge model + access controls | E-012 | M   | T-022        | privacy enforce شود       |
| T-040 | Global knowledge ingestion MVP             | E-012 | M   | T-034        | داده عمومی قابل اضافه شدن |
| T-041 | Neo4j setup + schema                       | E-013 | M   | T-002        | graph DB بالا بیاید       |
| T-042 | Graph CRUD API (nodes/edges)               | E-013 | L   | T-041        | endpoints کامل            |
| T-043 | Graph query API (basic)                    | E-013 | M   | T-042        | query نمونه               |
| T-044 | Graph-aware retrieval (MVP)                | E-003 | M   | T-043        | استفاده در پاسخ           |

---

## SP-07 — Memory Optimization + Benchmarks

```yaml
id: SP-07
date_range: 2026-10-13..2026-10-27
goal: 'بهینه‌سازی حافظه و رسیدن به latency هدف‌گذاری‌شده'
```

| Task  | Title                                      | Epic  | Est | Dependencies | Output              |
| ----- | ------------------------------------------ | ----- | --- | ------------ | ------------------- |
| T-045 | Memory pruning policies                    | E-014 | M   | T-028        | prune خودکار        |
| T-046 | Context compression pipeline               | E-014 | M   | T-029        | prompt budget کنترل |
| T-047 | Ranking (relevance + time decay)           | E-014 | M   | T-030        | نتایج بهتر          |
| T-048 | Performance benchmarks + dashboard metrics | E-014 | M   | T-032        | P95/P99 ثبت شود     |
| T-049 | Caching strategy برای retrieval            | E-014 | S   | T-035        | latency کمتر        |
| T-050 | Load testing smoke                         | E-051 | S   | T-048        | ظرفیت اولیه         |

---

## SP-08 — Skill Registry/Format/Versioning

```yaml
id: SP-08
date_range: 2026-10-27..2026-11-10
goal: 'هسته Skill Engine: registry + YAML format + versioning'
```

| Task  | Title                                  | Epic  | Est | Dependencies | Output           |
| ----- | -------------------------------------- | ----- | --- | ------------ | ---------------- |
| T-051 | Skill data model + migrations          | E-020 | M   | T-027        | جداول مهارت      |
| T-052 | Skill registry API (CRUD)              | E-020 | M   | T-051        | endpoints        |
| T-053 | Skill YAML schema + validation         | E-020 | M   | T-052        | format استاندارد |
| T-054 | Skill versioning + compatibility rules | E-020 | M   | T-052        | نسخه‌بندی        |
| T-055 | Skill discovery UI (internal)          | E-004 | S   | T-052        | لیست مهارت‌ها    |
| T-056 | Observability برای skill operations    | E-005 | S   | T-052        | trace/log        |

---

## SP-09 — Skill Execution + Permissions + Logs

```yaml
id: SP-09
date_range: 2026-11-10..2026-11-24
goal: 'اجرای مهارت در runtime با permission gate و لاگ'
```

| Task  | Title                                 | Epic  | Est | Dependencies | Output          |
| ----- | ------------------------------------- | ----- | --- | ------------ | --------------- |
| T-057 | Execution engine MVP (runner)         | E-020 | L   | T-053        | اجرای مهارت     |
| T-058 | Permission model برای skills          | E-023 | M   | T-022        | perms تعریف شود |
| T-059 | HITL approval flow (MVP)              | E-032 | M   | T-058        | تایید قبل اجرا  |
| T-060 | Execution logs + trace attributes     | E-005 | M   | T-057        | دیباگ ممکن      |
| T-061 | Chat integration: tool calls → skills | E-003 | M   | T-057        | استفاده در چت   |
| T-062 | UI: approvals inbox (MVP)             | E-004 | S   | T-059        | تایید از UI     |

---

## SP-10 — Auto-Skill Detection + Approvals

```yaml
id: SP-10
date_range: 2026-11-24..2026-12-08
goal: 'تشخیص الگو و پیشنهاد مهارت با کنترل انسانی'
```

| Task  | Title                            | Epic  | Est | Dependencies | Output             |
| ----- | -------------------------------- | ----- | --- | ------------ | ------------------ |
| T-063 | Pattern detector MVP             | E-021 | M   | T-057        | سیگنال‌های استفاده |
| T-064 | Proposal system (store + API)    | E-021 | M   | T-063        | پیشنهادها          |
| T-065 | Validation pipeline برای پیشنهاد | E-021 | M   | T-064        | جلوگیری از junk    |
| T-066 | Approval workflow integration    | E-032 | M   | T-059        | تایید/رد           |
| T-067 | UI: proposals review page        | E-004 | S   | T-064        | review             |
| T-068 | Metrics: adoption/false-positive | E-005 | S   | T-063        | اندازه‌گیری        |

---

## SP-11 — Plugin SDK + Sandbox + Marketplace MVP

```yaml
id: SP-11
date_range: 2026-12-08..2026-12-22
goal: 'SDK و Marketplace MVP برای اکوسیستم'
```

| Task  | Title                                          | Epic  | Est | Dependencies | Output             |
| ----- | ---------------------------------------------- | ----- | --- | ------------ | ------------------ |
| T-069 | Plugin manifest spec + validator               | E-022 | M   | T-053        | manifest استاندارد |
| T-070 | SDK package (npm) skeleton                     | E-022 | M   | T-069        | ابزار توسعه‌دهنده  |
| T-071 | Plugin lifecycle APIs (install/enable/disable) | E-022 | L   | T-070        | مدیریت پلاگین      |
| T-072 | WASM sandbox MVP (capabilities)                | E-023 | L   | T-071        | ایزولیشن           |
| T-073 | Metering + limits (MVP)                        | E-023 | M   | T-072        | کنترل منابع        |
| T-074 | Marketplace listing + search (MVP)             | E-024 | M   | T-071        | لیست پلاگین‌ها     |
| T-075 | Publisher dashboard MVP                        | E-024 | M   | T-074        | publish/manage     |
| T-076 | Analytics (downloads/ratings) MVP              | E-024 | S   | T-074        | آمار پایه          |

---

## SP-12 — Multi-tenant + Org/Workspace CRUD

```yaml
id: SP-12
date_range: 2026-12-22..2027-01-05
goal: 'Organization/Workspace چندمستاجری + دعوت کاربران'
```

| Task  | Title                                     | Epic  | Est | Dependencies | Output                |
| ----- | ----------------------------------------- | ----- | --- | ------------ | --------------------- |
| T-077 | Multi-tenant architecture decisions + ADR | E-030 | M   | -            | تصمیم‌های کلیدی       |
| T-078 | Org data model + APIs                     | E-030 | L   | T-077        | org CRUD              |
| T-079 | Workspace data model + APIs               | E-030 | L   | T-078        | workspace CRUD        |
| T-080 | User model (org-scoped) + roles           | E-031 | M   | T-079        | کاربر و نقش           |
| T-081 | Invitation flow (token/email) MVP         | E-031 | M   | T-080        | دعوت‌نامه             |
| T-082 | UI: org/workspace switcher                | E-004 | S   | T-079        | UI پایه               |
| T-083 | RBAC matrix enforcement update            | E-006 | M   | T-080        | enforce در همه مسیرها |

---

## SP-13 — Governance: Audit/HITL/Budgets

```yaml
id: SP-13
date_range: 2027-01-05..2027-01-19
goal: 'Governance کامل‌تر: audit log + approvals + budgets'
```

| Task  | Title                                    | Epic  | Est | Dependencies | Output            |
| ----- | ---------------------------------------- | ----- | --- | ------------ | ----------------- |
| T-084 | Audit log storage + API                  | E-032 | M   | T-078        | audit قابل جستجو  |
| T-085 | Approval queue service (generic)         | E-032 | L   | T-084        | queue مرکزی       |
| T-086 | Budget model + enforcement hooks         | E-032 | M   | T-014        | کنترل هزینه       |
| T-087 | Policy rules engine MVP (ABAC-lite)      | E-006 | L   | T-083        | policy قابل تنظیم |
| T-088 | UI: approvals/budgets admin              | E-004 | M   | T-085        | مدیریت از UI      |
| T-089 | Incident response runbook update         | E-052 | S   | T-084        | فرآیند ops        |
| T-090 | Security review checklist (release gate) | E-050 | S   | T-087        | gate پایه         |

---

## SP-14 — Digital Employee: roles/KPI/schedule

```yaml
id: SP-14
date_range: 2027-01-19..2027-02-02
goal: 'Agent → Digital Employee با نقش، KPI و برنامه'
```

| Task  | Title                            | Epic  | Est | Dependencies | Output       |
| ----- | -------------------------------- | ----- | --- | ------------ | ------------ |
| T-091 | Employee model (Agent extension) | E-033 | M   | T-008        | data model   |
| T-092 | Role system + templates          | E-033 | M   | T-091        | نقش‌ها       |
| T-093 | KPI definition model + API       | E-033 | M   | T-091        | KPI CRUD     |
| T-094 | Schedule model (cron/slots) MVP  | E-033 | M   | T-091        | برنامه اجرا  |
| T-095 | Hierarchy (reports_to) MVP       | E-033 | S   | T-091        | ساختار       |
| T-096 | UI: employee profile + KPIs      | E-004 | M   | T-093        | مشاهده       |
| T-097 | Outcome events emission (for BI) | E-041 | S   | T-093        | event stream |

---

## SP-15 — Agent Teams + Workflow Engine (simple DAG)

```yaml
id: SP-15
date_range: 2027-02-02..2027-02-16
goal: 'تیم‌ها و workflowهای چندمرحله‌ای'
```

| Task  | Title                              | Epic  | Est | Dependencies | Output            |
| ----- | ---------------------------------- | ----- | --- | ------------ | ----------------- |
| T-098 | Team model + APIs                  | E-034 | M   | T-078        | team CRUD         |
| T-099 | Agent-to-agent comms protocol MVP  | E-034 | M   | T-015        | پیام بین Agentها  |
| T-100 | Workflow DAG model + executor MVP  | E-034 | L   | T-099        | اجرای چندمرحله‌ای |
| T-101 | Task delegation (assign/claim) MVP | E-034 | M   | T-100        | delegation        |
| T-102 | UI: workflow builder (minimal)     | E-004 | M   | T-100        | ساخت workflow     |
| T-103 | Observability: workflow traces     | E-005 | S   | T-100        | trace             |
| T-104 | Guardrails: scope creep controls   | E-006 | S   | T-100        | کنترل ریسک        |

---

## SP-16 — Payments + RevShare + Trust

```yaml
id: SP-16
date_range: 2027-02-16..2027-03-02
goal: 'Marketplace بالغ‌تر با پرداخت و اعتماد'
```

| Task  | Title                                       | Epic  | Est | Dependencies | Output       |
| ----- | ------------------------------------------- | ----- | --- | ------------ | ------------ |
| T-105 | Billing ledger model + migrations           | E-040 | M   | T-078        | ledger       |
| T-106 | Payment integration MVP (provider-agnostic) | E-040 | L   | T-105        | پرداخت       |
| T-107 | Revenue sharing calculation (70/30)         | E-040 | M   | T-105        | سهم ناشر     |
| T-108 | Reviews/ratings model + APIs                | E-040 | M   | T-074        | reviews      |
| T-109 | Publisher verification workflow             | E-040 | M   | T-085        | verified     |
| T-110 | UI: checkout + invoices (MVP)               | E-004 | M   | T-106        | پرداخت در UI |
| T-111 | Fraud/abuse checks (basic)                  | E-050 | S   | T-106        | کاهش ریسک    |

---

## SP-17 — Outcome Engine + BI Dashboard

```yaml
id: SP-17
date_range: 2027-03-02..2027-03-16
goal: 'اندازه‌گیری outcome و داشبورد BI'
```

| Task  | Title                                | Epic  | Est | Dependencies | Output       |
| ----- | ------------------------------------ | ----- | --- | ------------ | ------------ |
| T-112 | KPI tracking pipeline                | E-041 | M   | T-097        | جمع‌آوری KPI |
| T-113 | Outcome measurement model            | E-041 | M   | T-112        | outcome      |
| T-114 | BI dashboard MVP (charts)            | E-041 | L   | T-113        | داشبورد      |
| T-115 | Automated insights (rule-based MVP)  | E-041 | M   | T-114        | insights     |
| T-116 | Export reports (CSV/PDF placeholder) | E-043 | S   | T-114        | خروجی        |
| T-117 | RBAC for BI views                    | E-006 | S   | T-114        | امنیت        |
| T-118 | Observability for KPI pipeline       | E-005 | S   | T-112        | trace        |

---

## SP-18 — Smart Features (Reports/Anomaly/NL)

```yaml
id: SP-18
date_range: 2027-03-16..2027-03-30
goal: 'ویژگی‌های هوشمند روی داده و گزارش'
```

| Task  | Title                                 | Epic  | Est | Dependencies | Output     |
| ----- | ------------------------------------- | ----- | --- | ------------ | ---------- |
| T-119 | Auto-reporting (daily/weekly)         | E-042 | M   | T-114        | گزارش‌ها   |
| T-120 | Anomaly detection MVP                 | E-042 | M   | T-112        | هشدار      |
| T-121 | Predictive analytics MVP              | E-042 | M   | T-112        | پیش‌بینی   |
| T-122 | NL query endpoint (MVP)               | E-042 | L   | T-114        | پرسش زبانی |
| T-123 | UI: alerts + report subscriptions     | E-004 | M   | T-119        | UI         |
| T-124 | Data quality checks                   | E-042 | S   | T-112        | کیفیت      |
| T-125 | Security review for analytics surface | E-050 | S   | T-122        | کاهش ریسک  |

---

## SP-19 — Integration Hub (Webhooks/Automation/Import-Export)

```yaml
id: SP-19
date_range: 2027-03-30..2027-04-13
goal: 'هاب اتصال و اتوماسیون'
```

| Task  | Title                                       | Epic  | Est | Dependencies | Output         |
| ----- | ------------------------------------------- | ----- | --- | ------------ | -------------- |
| T-126 | Webhook system advanced (retries, signing)  | E-043 | M   | T-085        | وبهوک امن      |
| T-127 | Connector framework (interface + scheduler) | E-043 | L   | T-126        | چارچوب کانکتور |
| T-128 | Ingestion progress tracking + retry         | E-043 | M   | T-127        | progress       |
| T-129 | Zapier/Make-like workflow MVP               | E-043 | L   | T-100        | اتوماسیون      |
| T-130 | Import/Export endpoints (MVP)               | E-043 | M   | T-126        | import/export  |
| T-131 | UI: integrations catalog                    | E-004 | S   | T-127        | UI             |
| T-132 | Observability for connectors/ingestion      | E-005 | S   | T-128        | trace/metrics  |

---

## SP-20 — Enterprise Security (SSO/SOC2/VPC)

```yaml
id: SP-20
date_range: 2027-04-13..2027-04-27
goal: 'امنیت و compliance در سطح enterprise'
```

| Task  | Title                                    | Epic  | Est | Dependencies | Output             |
| ----- | ---------------------------------------- | ----- | --- | ------------ | ------------------ |
| T-133 | SSO (OIDC) MVP                           | E-050 | L   | T-021        | ورود SSO           |
| T-134 | SSO (SAML) design + spike                | E-050 | M   | T-133        | مسیر SAML          |
| T-135 | Encryption at rest (envelope) MVP        | E-050 | L   | T-009        | رمزنگاری           |
| T-136 | SOC2-ready controls checklist + evidence | E-050 | M   | T-090        | شواهد              |
| T-137 | VPC/private network deployment guide     | E-050 | M   | T-021        | راهنمای enterprise |
| T-138 | Key management + rotation automation     | E-050 | M   | T-009        | automation         |
| T-139 | Pen-test prep + threat model update      | E-050 | S   | T-135        | آماده‌سازی         |

---

## SP-21 — Performance & Scale (K8s/Autoscaling/Sharding/CDN)

```yaml
id: SP-21
date_range: 2027-04-27..2027-05-11
goal: 'مقیاس‌پذیری و استقرار enterprise'
```

| Task  | Title                                      | Epic  | Est | Dependencies | Output         |
| ----- | ------------------------------------------ | ----- | --- | ------------ | -------------- |
| T-140 | Kubernetes manifests (base)                | E-051 | L   | T-002        | k8s deploy     |
| T-141 | Horizontal scaling strategy + limits       | E-051 | M   | T-140        | scale plan     |
| T-142 | Autoscaling agents (HPA) MVP               | E-051 | M   | T-140        | autoscale      |
| T-143 | Database sharding strategy (doc + spike)   | E-051 | M   | T-027        | sharding plan  |
| T-144 | CDN setup for static assets (doc + config) | E-051 | S   | T-005        | CDN            |
| T-145 | Performance regression suite (smoke)       | E-051 | S   | T-048        | جلوگیری از افت |
| T-146 | Cost-performance dashboard (MVP)           | E-051 | S   | T-014        | هزینه/کارایی   |

---

## SP-22 — Reliability (Multi-region/DR/SLA)

```yaml
id: SP-22
date_range: 2027-05-11..2027-05-25
goal: 'پایداری: multi-region، DR، و SLA monitoring'
```

| Task  | Title                                        | Epic  | Est | Dependencies | Output       |
| ----- | -------------------------------------------- | ----- | --- | ------------ | ------------ |
| T-147 | Multi-region architecture (doc + config MVP) | E-052 | M   | T-140        | multi-region |
| T-148 | Backup/restore system                        | E-052 | M   | T-027        | backup       |
| T-149 | Disaster recovery runbook + drills           | E-052 | M   | T-148        | DR           |
| T-150 | SLA monitoring + alerting                    | E-052 | M   | T-147        | 99.9 target  |
| T-151 | Chaos testing smoke                          | E-052 | S   | T-150        | resilience   |
| T-152 | Incident management workflow (ops)           | E-052 | S   | T-089        | فرآیند       |
| T-153 | Release checklist v1.0                       | E-053 | S   | T-150        | آماده انتشار |

---

## SP-23 — Launch Prep (Docs/API/Tutorials/Sales Kit)

```yaml
id: SP-23
date_range: 2027-05-25..2027-06-08
goal: 'آماده‌سازی لانچ v1.0 با مستندات و enablement'
```

| Task  | Title                                     | Epic  | Est | Dependencies | Output           |
| ----- | ----------------------------------------- | ----- | --- | ------------ | ---------------- |
| T-154 | Documentation site structure              | E-053 | M   | -            | سایت docs        |
| T-155 | Public API docs (OpenAPI/Swagger publish) | E-053 | M   | T-028        | docs عمومی       |
| T-156 | Tutorials + examples (MVP)                | E-053 | M   | T-155        | نمونه‌ها         |
| T-157 | Case studies templates + 1 نمونه          | E-053 | S   | T-156        | case study       |
| T-158 | Enterprise sales kit (deck + one-pager)   | E-053 | S   | T-156        | sales enablement |
| T-159 | Release notes + migration notes           | E-053 | S   | T-153        | release آماده    |
| T-160 | Final demo script (end-to-end)            | E-053 | S   | T-159        | demo             |
