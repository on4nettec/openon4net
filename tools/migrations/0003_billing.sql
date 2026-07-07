-- 0003_billing.sql — Wallet/Credits + Usage events + Publishers

CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    owner_type VARCHAR(20) NOT NULL,
    owner_id UUID,
    currency VARCHAR(10) NOT NULL DEFAULT 'O2N',
    balance_credits BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallets_org ON wallets(organization_id);
CREATE INDEX IF NOT EXISTS idx_wallets_workspace ON wallets(workspace_id);

CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    amount_credits BIGINT NOT NULL,
    reference_type VARCHAR(30),
    reference_id UUID,
    idempotency_key VARCHAR(128),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'ux_credit_tx_idempotency'
  ) THEN
    CREATE UNIQUE INDEX ux_credit_tx_idempotency
      ON credit_transactions(wallet_id, idempotency_key)
      WHERE idempotency_key IS NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_credit_tx_wallet_time ON credit_transactions(wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_tx_org_time ON credit_transactions(organization_id, created_at DESC);

CREATE TABLE IF NOT EXISTS usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    event_type VARCHAR(30) NOT NULL,
    provider VARCHAR(50),
    model VARCHAR(100),
    plugin_id UUID REFERENCES plugins(id) ON DELETE SET NULL,
    plugin_install_id UUID REFERENCES plugin_installs(id) ON DELETE SET NULL,
    cost_credits BIGINT NOT NULL DEFAULT 0,
    cost_cents INTEGER DEFAULT 0,
    trace_id VARCHAR(64),
    audit_log_id UUID REFERENCES audit_logs(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'success',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_events_org_time ON usage_events(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_agent_time ON usage_events(agent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_plugin_time ON usage_events(plugin_id, created_at DESC);

CREATE TABLE IF NOT EXISTS publishers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    display_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plugins_publisher_account
  ON plugins(publisher_account_id);

CREATE TABLE IF NOT EXISTS marketplace_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
    pricing_model VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

