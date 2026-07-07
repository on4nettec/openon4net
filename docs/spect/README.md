# Open on4net (on4net) — AI Operating System

> **شرکت:** on4net
> **محصول:** AI Operating System شرکتی
> **آخرین بروزرسانی:** July 2026
> **فایل‌ها:** ۴۸ | **حجم:** ~۶۰۰KB

---

## ساختار کامل مستندات

```
docs/spect/
│
├── 00_VISION/ (۸ فایل)
│   ├── 01-executive-summary.md   ✅ | خلاصه اجرایی، Vision، Mission، Business Model
│   ├── 02-market-analysis.md     ✅ | تحلیل بازار و رقبا، GTM Strategy
│   ├── 03-memory-engine.md       ✅ | ۶ لایه حافظه + Memory Graph
│   ├── 04-digital-employee.md    ✅ | Digital Employee + Governance + Outcome
│   ├── 05-ux-ui-design.md        ✅ | طراحی UI/UX کامل
│   ├── 06-glossary.md            ✅ | دیکشنری تخصصی O₂N
│   └── 07-competitive-positioning.md ✅ | تفاوت با OpenClaw/Hermes + پیام محصول
│   └── 08-i18n-l10n.md           ✅ | چندزبانه (RTL/LTR) + زبان در prompt/memory
│
├── 01_ROADMAP/ (۱ فایل)
│   └── 01-roadmap-12-months.md   ✅ | ۶ فاز · ۴۸ هفته · تحویل هر فاز
│
├── 02_ARCHITECTURE/ (۱۵ فایل)
│   ├── 01-system-overview.md     ✅ | معماری کلی، Tech Stack، Data Flow
│   ├── 02-ai-gateway.md          ✅ | Model Router · Cost · Failover
│   ├── 03-skill-engine.md        ✅ | Skill Engine + Plugin SDK + Marketplace
│   ├── 04-agent-communication.md ✅ | پروتکل ارتباط بین Agentها
│   ├── 05-workflow-engine.md     ✅ | Workflow Engine · DAG · State Machine
│   └── 06-economy-and-marketplace.md ✅ | Credits/Coin داخلی + Marketplace monetization
│   └── 07-connectors-and-tools.md ✅ | Connector/Tool/Plugin spec + Google Drive/Social ingest
│   └── 08-observability-otel.md   ✅ | OpenTelemetry spec (tracing/attrs/sampling/export)
│   └── 09-plugin-sandbox.md       ✅ | Sandbox spec (WASM/capabilities/metering)
│   └── 10-rbac-and-policy.md      ✅ | RBAC + Policy enforcement (ABAC-lite)
│   └── 11-secrets-and-key-management.md ✅ | Secret store + envelope encryption + rotation
│   └── 12-marketplace-service.md  ✅ | Marketplace architecture (review/registry/signing)
│   └── 13-four-plane-architecture.md ✅ | معماری ۴ بخش (Runtime/AI Control/Memory/Marketplace)
│   └── 14-monorepo-layout.md      ✅ | ساختار monorepo و نام سرویس‌ها بر اساس ۴ Plane
│   └── 15-rbac-default-matrix.md  ✅ | ماتریس نقش/دسترسی پیش‌فرض (MVP)
│
├── 03_DATABASE/ (۲ فایل)
│   ├── 01-schema-master.md       ✅ | PostgreSQL + Redis + Neo4j کامل
│   └── 02-billing-schema.md      ✅ | Wallet/Credits + Ledger + Publisher schema
│
├── 04_API/ (۴ فایل)
│   ├── 00-openapi-v0.1.yaml      ✅ | OpenAPI قرارداد اجرایی MVP
│   ├── 01-rest-api-spec.md       ✅ | REST + WebSocket + Webhook + Error Codes
│   └── 02-billing-and-marketplace-api.md ✅ | Billing + Marketplace + Publisher API
│   └── 03-connectors-memory-ingestion-api.md ✅ | Connectors + Memory ingestion + Skill manual create
│
├── 05_DECISIONS/ (۱ فایل)
│   └── 01-adr-index.md           ✅ | ۱۱ ADR معماری
│
├── 06_MEETINGS/ (۱ فایل)
│   └── 01-template.md            ✅ | قالب صورت جلسات
│
├── 07_PROMPTS/ (۱ فایل)
│   └── 01-master-prompts.md      ✅ | System + Agent + Template Prompts
│
├── 08_CODING_STANDARD/ (۴ فایل)
│   ├── 01-standards.md           ✅ | TypeScript · Testing · Git
│   ├── 02-security.md            ✅ | Security Bible · چندلایه
│   └── 03-testing.md             ✅ | Testing Bible · Unit·Integration·E2E·AI
│   └── 04-threat-model.md         ✅ | STRIDE threat model + LLM-specific threats
│
├── 09_TASKS/ (۱۰ فایل)
│   ├── 00-claude-build-pack.md   ✅ | CTO Spec برای ساخت پروژه توسط Claude
│   ├── 01-current-sprint.md      ✅ | Sprint 0 · ۸ Task اولویت‌بندی شده
│   ├── 02-deployment.md          ✅ | Docker · K8s · Helm · Monitoring
│   ├── 03-monitoring.md          ✅ | Prometheus · Grafana · Alerts
│   ├── 04-performance.md         ✅ | Caching · Pooling · Optimization
│   ├── 05-disaster-recovery.md   ✅ | RTO·RPO · Backup · Failover
│   └── 06-onboarding.md          ✅ | Onboarding · ۵ مرحله · ۴۵ دقیقه
│   └── 07-security-ops-runbook.md ✅ | Incident response + rotation + kill switch
│   └── 08-scope-guardrails-mvp.md ✅ | Guardrails برای جلوگیری از scope creep در MVP
│   └── 10-production-artifacts.md ✅ | OpenAPI + migrations + OTel configs + RBAC + i18n
│
└── README.md                     ✅ | این فایل
```

---

## آمار نهایی

| شاخص | مقدار |
|------|-------|
| **فایل‌ها** | ۴۸ |
| **حجم کل** | ~۶۰۰KB |
| **بخش‌ها** | ۱۰ از ۱۰ تکمیل ✅ |
| **عمق متوسط** | ~۱۲KB per file |
| **وضعیت** | ✅ کامل |

---
