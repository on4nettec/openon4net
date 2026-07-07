# Billing & Marketplace Schema — Open on4net (O₂N)

> **فایل:** 03_DATABASE/02-billing-schema.md  
> **نسخه:** 1.0 | **تاریخ:** July 2026

---

## ۱) اصول دیتامدل مالی

هدف این schema:
- داشتن یک **ledger** قابل حسابرسی (append-only تا جای ممکن)
- جلوگیری از دوباره شارژ شدن (idempotency)
- امکان گزارش‌دهی دقیق (cost by agent/workflow/plugin/model)
- حمایت از revenue share برای publisherها

> توجه: این مدل “Coin” را به‌صورت **credits داخلی** پیاده می‌کند، نه توکن عمومی قابل معامله.

---

## ۲) Wallets

```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    owner_type VARCHAR(20) NOT NULL, -- organization | workspace | publisher
    owner_id UUID, -- برای publisher یا موارد خاص
    currency VARCHAR(10) NOT NULL DEFAULT 'O2N', -- credits unit
    balance_credits BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active | suspended
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wallets_org ON wallets(organization_id);
CREATE INDEX idx_wallets_workspace ON wallets(workspace_id);
```

---

## ۳) Credit Ledger (Transactions)

```sql
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,

    type VARCHAR(30) NOT NULL, -- topup | reserve | settle | refund | payout | adjustment
    direction VARCHAR(10) NOT NULL, -- credit | debit
    amount_credits BIGINT NOT NULL,

    reference_type VARCHAR(30), -- model_call | plugin_call | workflow_run | manual
    reference_id UUID,
    idempotency_key VARCHAR(128),

    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX ux_credit_tx_idempotency
  ON credit_transactions(wallet_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX idx_credit_tx_wallet_time ON credit_transactions(wallet_id, created_at DESC);
CREATE INDEX idx_credit_tx_org_time ON credit_transactions(organization_id, created_at DESC);
```

---

## ۴) Usage Events (برای گزارش‌گیری و revenue share)

```sql
CREATE TABLE usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,

    event_type VARCHAR(30) NOT NULL, -- model_call | plugin_call | tool_call | workflow_step
    provider VARCHAR(50),            -- openai | anthropic | local | ...
    model VARCHAR(100),

    plugin_id UUID REFERENCES plugins(id) ON DELETE SET NULL,
    plugin_install_id UUID REFERENCES plugin_installs(id) ON DELETE SET NULL,

    cost_credits BIGINT NOT NULL DEFAULT 0,
    cost_cents INTEGER DEFAULT 0, -- optional: real cost snapshot

    trace_id VARCHAR(64),          -- برای correlation با tracing
    audit_log_id UUID REFERENCES audit_logs(id) ON DELETE SET NULL,

    status VARCHAR(20) DEFAULT 'success', -- success | failed | canceled
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_events_org_time ON usage_events(organization_id, created_at DESC);
CREATE INDEX idx_usage_events_agent_time ON usage_events(agent_id, created_at DESC);
CREATE INDEX idx_usage_events_plugin_time ON usage_events(plugin_id, created_at DESC);
```

---

## ۵) Publisher Accounts (برای کسب درآمد سازنده)

```sql
CREATE TABLE publishers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    display_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | verified | suspended
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE plugins
  ADD COLUMN publisher_account_id UUID REFERENCES publishers(id);

CREATE INDEX idx_plugins_publisher ON plugins(publisher_account_id);
```

---

## ۶) Marketplace Purchases (اختیاری v1)

اگر plugin پولی/اشتراکی باشد:

```sql
CREATE TABLE marketplace_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
    pricing_model VARCHAR(20) NOT NULL, -- per_call | subscription | freemium
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active | canceled | expired
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);
```

---

> **خلاصه:** این schema یک ledger شفاف برای credits، رویدادهای مصرف برای گزارش‌گیری/Revenue Share، و اجزای لازم برای marketplace monetization فراهم می‌کند.

