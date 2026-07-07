# Database Bible — Open on4net

> **فایل:** 03_DATABASE/01-schema-master.md
> **نسخه:** 1.0

---

## ۱. استراتژی دیتابیس

| نیاز | دیتابیس | دلیل |
|------|---------|------|
| داده‌های اصلی | PostgreSQL ۱۶ | قابلیت اطمینان، ACID، pgvector |
| Cache | Redis ۷ | سرعت، Pub/Sub, TTL |
| Memory Graph | Neo4j | گراف عمیق، Cypher Query |
| Vector Embeddings | pgvector در PostgreSQL | یک دیتابیس کمتر |
| فایل‌ها | MinIO (S3-compatible) | مقیاس‌پذیر، ارزان |
| Message Queue | RabbitMQ / Redis Streams | ارتباط Agentها |

---

## ۲. PostgreSQL — Schema اصلی

### ۲.۱ Organizations & Workspaces

```sql
-- سازمان‌ها (شرکت‌ها)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'starter', -- starter, team, business, enterprise
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, canceled
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace (هر شرکت می‌تواند چندین workspace داشته باشد)
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- کاربران انسانی
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member', -- admin, manager, editor, viewer
    organization_id UUID REFERENCES organizations(id),
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### ۲.۲ Agents (Digital Employees)

```sql
-- Agentها (کارمندان دیجیتال)
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL, -- ceo, marketing, sales, support, ...
    status VARCHAR(20) DEFAULT 'active', -- active, paused, archived, terminated
    reports_to UUID REFERENCES agents(id), -- مدیر Agent
    department VARCHAR(100),
    
    -- Budget
    monthly_budget_cents BIGINT DEFAULT 50000, -- $500
    used_budget_cents BIGINT DEFAULT 0,
    
    -- Config
    model_preferences JSONB DEFAULT '{}', -- {"primary": "claude-3.5", "fallback": "gpt-4o"}
    permissions JSONB DEFAULT '{}',
    schedule JSONB DEFAULT '{}',
    kpi_config JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- تیم‌بندی Agentها
CREATE TABLE agent_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    team_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    role VARCHAR(100), -- member, lead
    UNIQUE(agent_id, team_id)
);
```

### ۲.۳ Skills & Plugins

```sql
-- Skillها
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(20) DEFAULT '1.0.0',
    definition JSONB NOT NULL, -- YAML/JSON مراحل Skill
    source VARCHAR(20) DEFAULT 'auto', -- auto, manual, marketplace
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, deprecated
    execution_count BIGINT DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 100.00,
    avg_duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pluginها
CREATE TABLE plugins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publisher_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    package_name VARCHAR(255) UNIQUE NOT NULL, -- com.on4net.sms-sender
    version VARCHAR(20) NOT NULL,
    description TEXT,
    manifest JSONB NOT NULL,
    permissions TEXT[],
    is_verified BOOLEAN DEFAULT false,
    price_cents INTEGER DEFAULT 0, -- 0 = free
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- نصب Plugin در سازمان
CREATE TABLE plugin_installs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, plugin_id)
);
```

### ۲.۴ Memory System

```sql
-- Conversation Memory (لایه ۲)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    summary TEXT,
    tags TEXT[],
    message_count INTEGER DEFAULT 0,
    token_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, summarized, archived
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- پیام‌های مکالمه
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- user, agent, system, tool
    content TEXT NOT NULL,
    model VARCHAR(100),
    cost_cents INTEGER DEFAULT 0,
    tokens INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memory Graph (Neo4j از این برای sync استفاده می‌کند)
-- این جدول برای بکاپ و query سریع
CREATE TABLE memory_graph_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    node_type VARCHAR(50) NOT NULL, -- person, project, file, decision, task
    external_id VARCHAR(255), -- ID در سیستم خارجی
    label VARCHAR(255),
    properties JSONB DEFAULT '{}',
    embedding VECTOR(1536), -- pgvector
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE memory_graph_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_node_id UUID REFERENCES memory_graph_nodes(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES memory_graph_nodes(id) ON DELETE CASCADE,
    relationship VARCHAR(100) NOT NULL, -- decided, uses, created, affects
    properties JSONB DEFAULT '{}',
    weight DECIMAL(3,2) DEFAULT 1.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Knowledge (لایه ۴)
CREATE TABLE company_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    category VARCHAR(100), -- product, customer, policy, procedure
    title VARCHAR(255),
    content TEXT,
    embedding VECTOR(1536),
    tags TEXT[],
    source VARCHAR(50), -- manual, auto-generated, from-conversation
    is_confidential BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### ۲.۵ Governance & Audit

```sql
-- Audit Log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    agent_id UUID REFERENCES agents(id),
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(100) NOT NULL, -- send-email, create-contract, delete-file
    action_data JSONB NOT NULL,
    model_used VARCHAR(100),
    cost_cents INTEGER,
    status VARCHAR(20) DEFAULT 'success', -- success, failed, pending
    approval_status VARCHAR(20) DEFAULT 'auto', -- auto, pending, approved, rejected
    approved_by UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Human-in-the-Loop Queue
CREATE TABLE approval_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    agent_id UUID REFERENCES agents(id),
    action_data JSONB NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, expired
    assigned_to UUID REFERENCES users(id),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### ۲.۶ Outcome & BI

```sql
-- KPI Definitions
CREATE TABLE kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    agent_id UUID REFERENCES agents(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50), -- percent, count, dollars, minutes
    target_value DECIMAL(15,2),
    comparison VARCHAR(20) DEFAULT 'higher_is_better', -- higher_is_better, lower_is_better
    period VARCHAR(20) DEFAULT 'monthly', -- daily, weekly, monthly, quarterly
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI Records
CREATE TABLE kpi_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_id UUID REFERENCES kpi_definitions(id) ON DELETE CASCADE,
    value DECIMAL(15,2) NOT NULL,
    previous_value DECIMAL(15,2),
    change_percent DECIMAL(7,2),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    analysis TEXT, -- تحلیل خودکار Agent
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Reports
CREATE TABLE agent_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    report_type VARCHAR(50), -- daily, weekly, monthly
    period_start DATE,
    period_end DATE,
    content JSONB NOT NULL,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ۳. Redis Schema

```redis
# Short Memory (لایه ۱)
session:{session_id}:messages   → List (آخرین ۵۰ پیام)
session:{session_id}:expires_at → Timestamp

# Cache
cache:response:{hash}           → String (TTL: 1h)
cache:semantic:{embedding_hash} → String (TTL: 30min)

# Rate Limiting
ratelimit:{agent_id}:{period}   → Counter
ratelimit:{user_id}:{period}    → Counter

# Agent Communication
agent:bus:{queue_name}          → Pub/Sub Channel
agent:task:{task_id}            → Hash (Status, Result)

# Session Management
user:{user_id}:active_session   → String (session_id)
```

---

## ۴. Neo4j Graph Schema

```cypher
// Node Types
(:Person {
    id: UUID,
    name: String,
    role: String,
    organization: String
})

(:Project {
    id: UUID,
    name: String,
    status: String,
    startDate: Date
})

(:Decision {
    id: UUID,
    title: String,
    description: String,
    date: DateTime,
    outcome: String
})

(:File {
    id: UUID,
    name: String,
    type: String,
    path: String,
    size: Int
})

(:Task {
    id: UUID,
    title: String,
    status: String,
    priority: Int
})

// Relationships
(:Person)-[:MADE_DECISION {context: String}]->(:Decision)
(:Decision)-[:AFFECTS]->(:Project)
(:Person)-[:WORKS_ON {role: String}]->(:Project)
(:File)-[:BELONGS_TO]->(:Project)
(:Task)-[:IS_PART_OF]->(:Project)
(:Person)-[:CREATED]->(:File)
(:Decision)-[:RESULTED_IN {kpi: String}]->(:Task)
```

---

## ۵. شاخص‌ها (Indexes)

```sql
-- PostgreSQL Indexes
CREATE INDEX idx_agents_organization ON agents(organization_id);
CREATE INDEX idx_agents_role ON agents(role);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id, created_at);
CREATE INDEX idx_audit_logs_agent ON audit_logs(agent_id);
CREATE INDEX idx_company_knowledge_org ON company_knowledge(organization_id);

-- Vector Index (pgvector)
CREATE INDEX idx_company_knowledge_embedding 
    ON company_knowledge 
    USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX idx_memory_nodes_embedding
    ON memory_graph_nodes
    USING ivfflat (embedding vector_cosine_ops);
```

---

> **خلاصه:** دیتابیس O₂N ترکیبی از PostgreSQL (داده اصلی + وکتور), Redis (کش + حافظه کوتاه), Neo4j (گراف حافظه) و MinIO (فایل‌ها) است. این ترکیب هم ACID را می‌دهد، هم جستجوی معنایی، هم گراف روابط و هم مقیاس‌پذیری.

---

## ۶. Billing & Marketplace (Credits/Coin)

Schema مربوط به Wallet/Credits ledger، usage events و publisherها در فایل جدا نگهداری می‌شود:

- `03_DATABASE/02-billing-schema.md`
