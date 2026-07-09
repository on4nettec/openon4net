# Traceability — Spec → Epic → Sprint

> هدف: مطمئن شویم «همه خواسته‌ها»ی موجود در `docs/spect/` به یک Epic و حداقل یک Sprint نگاشت شده‌اند.
> اسپرینت‌ها مطابق `docs/sprint-plan/03_sprint-plan.md` هستند.

---

## Mapping table

| Spec                                                          | Primary Epics                     | Primary Sprints                        |
| ------------------------------------------------------------- | --------------------------------- | -------------------------------------- |
| `docs/spect/00_VISION/01-executive-summary.md`                | E-001, E-002, E-003, E-004        | SP-00..SP-03                           |
| `docs/spect/00_VISION/02-market-analysis.md`                  | E-040, E-053                      | SP-16..SP-23                           |
| `docs/spect/00_VISION/03-memory-engine.md`                    | E-010, E-011, E-012, E-013, E-014 | SP-04..SP-07                           |
| `docs/spect/00_VISION/04-digital-employee.md`                 | E-033, E-041                      | SP-14..SP-18                           |
| `docs/spect/00_VISION/05-ux-ui-design.md`                     | E-004                             | SP-00..SP-03                           |
| `docs/spect/00_VISION/06-glossary.md`                         | E-053                             | SP-23                                  |
| `docs/spect/00_VISION/07-competitive-positioning.md`          | E-053                             | SP-23                                  |
| `docs/spect/00_VISION/08-i18n-l10n.md`                        | E-004, E-053                      | SP-03, SP-23                           |
| `docs/spect/01_ROADMAP/01-roadmap-12-months.md`               | (همه)                             | SP-00..SP-23                           |
| `docs/spect/02_ARCHITECTURE/01-system-overview.md`            | E-001..E-006                      | SP-00..SP-03                           |
| `docs/spect/02_ARCHITECTURE/02-ai-gateway.md`                 | E-002                             | SP-01                                  |
| `docs/spect/02_ARCHITECTURE/03-skill-engine.md`               | E-020, E-021                      | SP-08..SP-10                           |
| `docs/spect/02_ARCHITECTURE/04-agent-communication.md`        | E-003, E-034                      | SP-02, SP-15                           |
| `docs/spect/02_ARCHITECTURE/05-workflow-engine.md`            | E-034                             | SP-15                                  |
| `docs/spect/02_ARCHITECTURE/06-economy-and-marketplace.md`    | E-024, E-040                      | SP-11, SP-16                           |
| `docs/spect/02_ARCHITECTURE/07-connectors-and-tools.md`       | E-043                             | SP-19                                  |
| `docs/spect/02_ARCHITECTURE/08-observability-otel.md`         | E-005, E-052                      | SP-02, SP-22                           |
| `docs/spect/02_ARCHITECTURE/09-plugin-sandbox.md`             | E-023, E-022                      | SP-11                                  |
| `docs/spect/02_ARCHITECTURE/10-rbac-and-policy.md`            | E-006, E-032                      | SP-03, SP-13                           |
| `docs/spect/02_ARCHITECTURE/11-secrets-and-key-management.md` | E-006, E-050                      | SP-01, SP-20                           |
| `docs/spect/02_ARCHITECTURE/12-marketplace-service.md`        | E-024, E-040                      | SP-11, SP-16                           |
| `docs/spect/02_ARCHITECTURE/13-four-plane-architecture.md`    | E-001                             | SP-00                                  |
| `docs/spect/02_ARCHITECTURE/14-monorepo-layout.md`            | E-001                             | SP-00                                  |
| `docs/spect/02_ARCHITECTURE/15-rbac-default-matrix.md`        | E-006, E-031                      | SP-03, SP-12                           |
| `docs/spect/03_DATABASE/01-schema-master.md`                  | E-010..E-014                      | SP-04..SP-07                           |
| `docs/spect/03_DATABASE/02-billing-schema.md`                 | E-040                             | SP-16                                  |
| `docs/spect/04_API/00-openapi-v0.1.yaml`                      | E-003, E-010, E-024               | SP-00..SP-11                           |
| `docs/spect/04_API/01-rest-api-spec.md`                       | E-003                             | SP-00..SP-02                           |
| `docs/spect/04_API/02-billing-and-marketplace-api.md`         | E-040                             | SP-16                                  |
| `docs/spect/04_API/03-connectors-memory-ingestion-api.md`     | E-043                             | SP-19                                  |
| `docs/spect/05_DECISIONS/01-adr-index.md`                     | E-001..E-053                      | SP-00..SP-23 (به‌روزرسانی در طول مسیر) |
| `docs/spect/06_MEETINGS/01-template.md`                       | E-001                             | SP-00                                  |
| `docs/spect/07_PROMPTS/01-master-prompts.md`                  | E-002, E-003, E-020               | SP-01, SP-02, SP-08                    |
| `docs/spect/08_CODING_STANDARD/01-standards.md`               | E-001                             | SP-00                                  |
| `docs/spect/08_CODING_STANDARD/02-security.md`                | E-006, E-050                      | SP-03, SP-20                           |
| `docs/spect/08_CODING_STANDARD/03-testing.md`                 | E-001, E-051                      | SP-00, SP-21                           |
| `docs/spect/08_CODING_STANDARD/04-threat-model.md`            | E-006, E-050                      | SP-03, SP-20                           |
| `docs/spect/09_TASKS/00-claude-build-pack.md`                 | E-001                             | SP-00                                  |
| `docs/spect/09_TASKS/01-current-sprint.md`                    | E-001..E-004                      | SP-00                                  |
| `docs/spect/09_TASKS/02-deployment.md`                        | E-001, E-051                      | SP-00, SP-21                           |
| `docs/spect/09_TASKS/03-monitoring.md`                        | E-005, E-052                      | SP-02, SP-22                           |
| `docs/spect/09_TASKS/04-performance.md`                       | E-014, E-051                      | SP-07, SP-21                           |
| `docs/spect/09_TASKS/05-disaster-recovery.md`                 | E-052                             | SP-22                                  |
| `docs/spect/09_TASKS/06-onboarding.md`                        | E-005, E-053                      | SP-03, SP-23                           |
| `docs/spect/09_TASKS/07-security-ops-runbook.md`              | E-032, E-052                      | SP-13, SP-22                           |
| `docs/spect/09_TASKS/08-scope-guardrails-mvp.md`              | E-006                             | SP-15                                  |
| `docs/spect/09_TASKS/10-production-artifacts.md`              | E-053                             | SP-23                                  |
| `docs/spect/README.md`                                        | E-053                             | SP-23                                  |

---

## Notes

- اگر بعداً spec جدیدی به `docs/spect/` اضافه شد، باید این جدول هم به‌روز شود تا «کامل بودن» حفظ شود.
