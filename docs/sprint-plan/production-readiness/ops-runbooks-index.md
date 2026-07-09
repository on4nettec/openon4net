# Ops Runbooks — فهرست و شاخص

هدف: وقتی incident یا اختلال رخ می‌دهد، تیم دقیقاً بداند «چه کار کند».

---

## Runbookهای موجود (در Spec)

- Deployment: `docs/spect/09_TASKS/02-deployment.md`
- Monitoring: `docs/spect/09_TASKS/03-monitoring.md`
- Performance: `docs/spect/09_TASKS/04-performance.md`
- Disaster recovery: `docs/spect/09_TASKS/05-disaster-recovery.md`
- Onboarding: `docs/spect/09_TASKS/06-onboarding.md`
- Security ops runbook: `docs/spect/09_TASKS/07-security-ops-runbook.md`

---

## Runbookهای پیشنهادی (برای production واقعی)

> این‌ها می‌توانند به مرور در `docs/spect/09_TASKS/` اضافه شوند. این فایل فقط index است.

### AI / Model providers

- Provider outage / timeouts spike (failover فعال‌سازی، circuit breaker tuning)
- Cost spike (budget enforcement، rate limit، model downgrade)

### Datastores

- PostgreSQL connection exhaustion (pooling/limits/scale)
- Redis eviction / TTL misconfig (cache policy/alerts)
- Neo4j slow queries (index/constraints)

### Marketplace / Plugins

- Plugin install failures (rollback version، quarantine)
- Sandbox policy violations (disable plugin، rotate keys، incident)

### Security

- Suspicious login / token leak (rotate، revoke، audit)
- Secret rotation emergency (kill switch، redeploy)

---

## قالب Runbook (Minimal)

```md
# Runbook: <Title>

## Symptoms

- ...

## Impact

- ...

## Immediate actions (0–15 min)

1. ...

## Mitigation / Workaround

- ...

## Verification

- ...

## Root cause follow-up

- ...
```
