# Master Project Task Index — Open on4net (O₂N)

> **هدف:** یک نقشه‌ی واحد از همه‌ی taskهای پروژه، نه فقط MVP.
> اگر خواستی بعداً، می‌توانیم هر بخش را از این index به یک فایل task-table جداگانه
> expand کنیم.

---

## 1) Task Families

| Family                |                Range | Count | Source                                         |
| --------------------- | -------------------: | ----: | ---------------------------------------------- |
| Sprint roadmap        |       `T-001..T-160` |   160 | `docs/sprint-plan/03_sprint-plan.md`           |
| Control plane backlog | `T-CP-001..T-CP-024` |    24 | `docs/sprint-plan/04_control-plane-backlog.md` |
| Runtime TODO          |     `RT-001..RT-031` |    31 | `docs/spect/TODO-openon4net-runtime.md`        |
| Memory TODO           |   `MEM-001..MEM-013` |    13 | `docs/spect/TODO-openon4net-memory.md`         |
| Marketplace TODO      |   `MKT-001..MKT-016` |    16 | `docs/spect/TODO-openon4net-marketplace.md`    |

---

## 2) Roadmap Coverage

### Phase 0 — Core Engine

- `T-001..T-008`

### Phase 1 — AI Gateway Core

- `T-009..T-014`

### Phase 2 — Runtime Hardening

- `T-015..T-026`

### Phase 3 — Memory

- `T-027..T-050`

### Phase 4 — Skills / Plugins / Sandbox / Marketplace MVP

- `T-051..T-076`

### Phase 5 — Organization / Governance

- `T-077..T-090`

### Phase 6 — Digital Employee

- `T-091..T-097`

### Phase 7 — Teams / Workflow

- `T-098..T-104`

### Phase 8 — Ecosystem / Billing / Marketplace

- `T-105..T-111`

### Phase 9 — BI / Outcomes / Analytics

- `T-112..T-125`

### Phase 10 — Integrations Hub

- `T-126..T-132`

### Phase 11 — Enterprise Security

- `T-133..T-139`

### Phase 12 — Scale / Performance

- `T-140..T-146`

### Phase 13 — Reliability / DR

- `T-147..T-153`

### Phase 14 — Launch Prep

- `T-154..T-160`

---

## 3) Control Plane Coverage

- `T-CP-001..T-CP-008` — foundation + activation
- `T-CP-009..T-CP-014` — wallet, policy, web panel, observability, security
- `T-CP-015..T-CP-019` — managed AI gateway
- `T-CP-020..T-CP-024` — payment, settlement, budget, cost estimate

---

## 4) Runtime TODO Coverage

- `RT-001..RT-010` — already completed or blocked-by-user items
- `RT-011..RT-018` — auth / secrets / provider foundations
- `RT-019..RT-020` — key management hardening
- `RT-021..RT-031` — post-core UX, access, plugins, branding, context contract

---

## 5) Memory TODO Coverage

- `MEM-001..MEM-007` — scaffold, CI, auth, trace, docs
- `MEM-008..MEM-013` — real storage, retrieval, graph, encryption, import/export, retention

---

## 6) Marketplace TODO Coverage

- `MKT-001..MKT-006` — local/private marketplace MVP-lite
- `MKT-007..MKT-011` — hardening, security, docs
- `MKT-012..MKT-016` — public marketplace, signing, payouts, kill switch

---

## 7) Post-MVP Focus

The main post-MVP buckets are:

- `RT-031` — Context Contract + Prompt Builder
- `CP-012..CP-024` — managed control plane and billing
- `MEM-008..MEM-013` — real long-term memory
- `MKT-012..MKT-016` — public marketplace

---

## 8) Review Order پیشنهادی

1. `docs/sprint-plan/03_sprint-plan.md`
2. `docs/sprint-plan/04_control-plane-backlog.md`
3. `docs/spect/TODO-openon4net-runtime.md`
4. `docs/spect/TODO-openon4net-memory.md`
5. `docs/spect/TODO-openon4net-marketplace.md`
6. `docs/spect/09_TASKS/11-post-mvp-task-index.md`
