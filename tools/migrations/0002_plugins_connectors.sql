-- 0002_plugins_connectors.sql — Skills, Plugins, Connector installs

-- Skills
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(20) DEFAULT '1.0.0',
    definition JSONB NOT NULL,
    source VARCHAR(20) DEFAULT 'auto',
    status VARCHAR(20) DEFAULT 'active',
    execution_count BIGINT DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 100.00,
    avg_duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plugins
CREATE TABLE IF NOT EXISTS plugins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publisher_id UUID REFERENCES users(id),
    publisher_account_id UUID,
    name VARCHAR(255) NOT NULL,
    package_name VARCHAR(255) UNIQUE NOT NULL,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    manifest JSONB NOT NULL,
    permissions TEXT[],
    is_verified BOOLEAN DEFAULT false,
    price_cents INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plugin_installs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
    config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, plugin_id)
);

-- Connectors (Integrations)
CREATE TABLE IF NOT EXISTS connector_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  plugin_install_id UUID REFERENCES plugin_installs(id) ON DELETE CASCADE,
  connector_type VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS connector_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_install_id UUID REFERENCES connector_installs(id) ON DELETE CASCADE,
  auth_type VARCHAR(20) NOT NULL,
  encrypted_secret BYTEA NOT NULL,
  secret_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS connector_sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_install_id UUID REFERENCES connector_installs(id) ON DELETE CASCADE,
  job_type VARCHAR(30) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'queued',
  cursor JSONB DEFAULT '{}'::jsonb,
  stats JSONB DEFAULT '{}'::jsonb,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

