# Disaster Recovery — Open on4net

> **فایل:** 09_TASKS/05-disaster-recovery.md
> **نسخه:** 1.0

---

## ۰. پیاده‌سازی واقعی (RT-071، ۲۰۲۶-۰۷-۱۵)

> این فایل از اول یک سند طراحی هدف (target-state) بود — WAL-G، cross-region
> replica، MinIO/Neo4j backup، DR test خودکار هفتگی/ماهانه. **هیچ‌کدوم از
> این‌ها هنوز ساخته نشده.** چیزی که RT-071 واقعاً ساخت خیلی محدودتره:

- `gateway/src/services/backup-service.ts` — `pg_dump -Fc` (custom format،
  خودش compressed) روی کل دیتابیس، نه continuous WAL archiving. `pg_restore
--clean --if-exists` برای بازیابی.
- `gateway/src/services/backup-scheduler.ts` — opt-in (`BACKUP_ENABLED`)،
  فقط local disk (`BACKUP_DIR`)، بدون آپلود به S3/MinIO/هر storage خارجی —
  اون قدم صراحتاً یک TODO مستندشده در کده، نه چیزی که جعل شده باشه، چون این
  محیط credential واقعی cloud نداره.
- `gateway/scripts/backup-db.mjs` / `restore-db.mjs` — CLI دستی
  (`pnpm run backup` / `pnpm run restore <file> --confirm`).
- **RTO/RPO واقعی این پیاده‌سازی** (نه اهداف بخش ۱ زیر که هنوز architecture
  هدفه): RPO = فاصله‌ی `BACKUP_INTERVAL_HOURS` (پیش‌فرض ۲۴ ساعت — خیلی
  دورتر از هدف &lt;۱۵ دقیقه‌ی بخش ۱)؛ RTO = زمان دستی اجرای `pg_restore` روی
  یک instance تازه، بدون failover خودکار.
- Neo4j/MinIO/Redis backup، cross-region replication، DR test خودکار، و
  Failover خودکار (بخش‌های ۲-۶ زیر) هنوز اصلاً شروع نشدن.

---

## ۱. RTO و RPO

| شاخص                     | مقدار هدف  | توضیح                     |
| ------------------------ | ---------- | ------------------------- |
| **RTO** (Recovery Time)  | < ۱ ساعت   | زمان بازگردانی کامل سرویس |
| **RPO** (Recovery Point) | < ۱۵ دقیقه | حداکثر داده از دست رفته   |

---

## ۲. سناریوهای Disaster

### ۲.۱ Single Service Failure

```
سناریو: یکی از سرویس‌ها کرش کرد (مثلاً API)
تأثیر: کاربران نمی‌توانند چت کنند
راه‌حل:
  - Kubernetes自动 restart
  - اگر > ۳ بار کرش کرد → جایگزین پاد
  - Alert به team
RTO: < ۲ دقیقه
```

### ۲.۲ Database Failure

```
سناریو: PostgreSQL down
تأثیر: همه چیز متوقف می‌شود
راه‌حل:
  - Failover به Read Replica
  - اگر replica هم down → فوری Alert
  - Restore از backup اخیر
RTO: < ۱۵ دقیقه
RPO: < ۵ دقیقه
```

### ۲.۳ LLM Provider Outage

```
سناریو: OpenAI API down
تأثیر: درخواست‌های GPT-4o fail
راه‌حل:
  - Auto-failover به Claude
  - اگر چند provider down → محدود به local models
  - اطلاع به کاربر: "Some models temporarily unavailable"
RTO: < ۳۰ ثانیه (automatic)
```

### ۲.۴ Region Failure

```
سناریو: کل region آفلاین (AWS us-east-1 down)
تأثیر: همه سرویس‌ها down
راه‌حل:
  - Multi-region deployment
  - DNS failover به region دوم
  - Database replication cross-region
RTO: < ۳۰ دقیقه
RPO: < ۱۵ دقیقه
```

### ۲.۵ Data Corruption

```
سناریو: باگ باعث خرابی داده شد
تأثیر: حافظه Agentها خراب
راه‌حل:
  - Point-in-time recovery
  - Wal-g backup restore
  - Validation بعد از restore
RTO: < ۱ ساعت
RPO: < ۱۵ دقیقه
```

---

## ۳. Backup Strategy

```yaml
backup:
  postgresql:
    tool: 'pg_dump + wal-g'
    full_backup: 'daily at 03:00 UTC'
    wal_archiving: 'continuous (every 5 min)'
    retention: '30 days'
    test_restore: 'weekly (automated)'

  neo4j:
    tool: 'neo4j-admin dump'
    full_backup: 'daily at 04:00 UTC'
    retention: '14 days'

  minio:
    tool: 'mc mirror to secondary'
    sync: 'continuous'
    retention: '90 days'

  redis:
    tool: 'RDB snapshots'
    frequency: 'every 6 hours'
    retention: '7 days'

  configs:
    tool: 'git'
    repo: 'github.com/on4nettec/infrastructure'
    frequency: 'every change'
```

---

## ۴. Recovery Runbook

### ۴.۱ Database Recovery

```bash
# ۱. شناسایی مشکل
pg_isready -h db-primary
# ... failed

# ۲. Failover به replica
pg_ctl promote db-replica
# Update connection string

# ۳. بررسی صحت داده
psql -c "SELECT count(*) FROM agents;"
psql -c "SELECT count(*) FROM messages;"

# ۴. تعمیر primary
pg_rewind --target-pgdata /var/lib/postgresql/data \
  --source-server='host=db-replica'

# ۵. برگرداندن primary به عنوان replica
```

### ۴.۲ Full Region Failover

```bash
# ۱. DNS تغییر
# Update DNS record به region دوم

# ۲. Database connection به replica در region دوم
export DATABASE_URL="postgres://db-replica-2:5432/o2n"

# ۳. Start services در region دوم
kubectl apply -f k8s/production/
kubectl scale deployment o2n-api --replicas=5

# ۴. Health check
curl https://api.on4net.com/health

# ۵. Alert به team که region اول fix شود
```

---

## ۵. Monitoring & Alerting برای DR

```yaml
dr_alerts:
  - name: 'Primary DB Down'
    condition: 'pg_isready fails > 30s'
    severity: 'P0'
    action: 'Automatic failover + Slack + SMS'

  - name: 'Backup Failed'
    condition: 'No successful backup in 24h'
    severity: 'P1'
    action: 'Slack + investigate'

  - name: 'Region Health'
    condition: 'Region latency > 500ms'
    severity: 'P1'
    action: 'Evaluate failover'

  - name: 'Certificate Expiry'
    condition: 'cert expires < 7 days'
    severity: 'P1'
    action: 'Auto-renew + notification'
```

---

## ۶. DR Test Schedule

```yaml
dr_tests:
  - type: 'single_service_failover'
    frequency: 'weekly'
    duration: '30 min'
    success_criteria: 'RTO < 2 min'

  - type: 'database_failover'
    frequency: 'monthly'
    duration: '1 hour'
    success_criteria: 'RTO < 15 min, RPO < 5 min'

  - type: 'full_region_failover'
    frequency: 'quarterly'
    duration: '2 hours'
    success_criteria: 'RTO < 30 min, no data loss'

  - type: 'backup_restore_test'
    frequency: 'weekly'
    duration: 'automated'
    success_criteria: 'data consistent, all services up'
```

---

> **خلاصه:** Disaster Recovery O₂N با RTO < ۱ ساعت و RPO < ۱۵ دقیقه طراحی شده. سناریوهای مختلف (service, database, provider, region, data corruption) هرکدام runbook مشخص دارند. Backup روزانه، DR test هفتگی/ماهانه.
