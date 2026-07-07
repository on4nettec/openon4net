-- 0005_marketplace_registry.sql — Marketplace registry extensions (optional for MVP)

CREATE TABLE IF NOT EXISTS plugin_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  artifact_url TEXT NOT NULL,
  checksum_sha256 VARCHAR(64) NOT NULL,
  signature TEXT,
  permissions TEXT[],
  pricing JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plugin_id, version)
);

CREATE TABLE IF NOT EXISTS plugin_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_version_id UUID REFERENCES plugin_versions(id) ON DELETE CASCADE,
  reviewer_user_id UUID REFERENCES users(id),
  status VARCHAR(20) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

