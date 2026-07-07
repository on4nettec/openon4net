# Performance Bible — Open on4net

> **فایل:** 09_TASKS/04-performance.md
> **نسخه:** 1.0

---

## ۱. اهداف Performance

| شاخص | هدف | بحرانی |
|------|------|--------|
| **Chat Response** (first token) | < ۵۰۰ms | 🔴 |
| **Chat Response** (full) | < ۵s | 🔴 |
| **Memory Read** | < ۲۰ms | 🔴 |
| **Memory Write** | < ۵۰ms | 🔴 |
| **Memory Graph Query** | < ۱۰۰ms | 🟡 |
| **Vector Search** | < ۲۰۰ms | 🟡 |
| **Skill Execution** | < ۲s | 🟡 |
| **API Request** (non-AI) | < ۵۰ms | 🔴 |
| **Page Load** (TTFB) | < ۲۰۰ms | 🟡 |
| **Page Load** (fully interactive) | < ۲s | 🟡 |
| **Concurrent Agents** | ۱۰۰۰+ | 🔴 |
| **Model Switch** (failover) | < ۵۰۰ms | 🟡 |

---

## ۲. Caching Strategy

### ۲.۱ Cache Layers

```
Request
  │
  ├── L1: Browser Cache (CDN/Service Worker)
  │     TTL: ۵ دقیقه برای static assets
  │
  ├── L2: API Gateway Cache (Redis)
  │     TTL: ۳۰ ثانیه تا ۱ ساعت
  │     Cache Key: method + path + body hash
  │
  ├── L3: Application Cache (In-memory)
  │     TTL: ۵ ثانیه
  │     Cache Key: function + params hash
  │
  └── L4: Database Cache (PostgreSQL shared buffers)
        TTL: تا وقتی داده تغییر نکند
```

### ۲.۲ Semantic Cache در AI Gateway

```yaml
semantic_cache:
  enabled: true
  engine: pgvector
  threshold: 0.95    # شباهت > ۹۵٪ = cache hit
  ttl_minutes: 30
  max_entries: 10000
  
  # اگر سوال مشابه قبلی پرسیده شود، cache hit
  # مثال:
  # Q1: "بودجه امسال چقدر است؟"
  # Q2: "بودجه‌مون چقده؟" → cache hit (similarity 0.97)
```

---

## ۳. Connection Pooling

### PostgreSQL:
```yaml
pool:
  min: 10
  max: 50
  idle_timeout_ms: 30000
  max_lifetime_ms: 3600000
  acquire_timeout_ms: 5000
```

### Redis:
```yaml
pool:
  min: 5
  max: 30
  idle_timeout_ms: 10000
```

### HTTP Connections (to LLM providers):
```yaml
http_pool:
  max_sockets: 50
  max_free_sockets: 25
  socket_timeout_ms: 30000
  keep_alive: true
```

---

## ۴. Query Optimization

### ۴.۱ N+1 Problem Prevention
```typescript
// ❌ Bad: N+1 queries
for (const agent of agents) {
  const memory = await db.query('SELECT * FROM memories WHERE agent_id = $1', [agent.id]);
}

// ✅ Good: Batch query
const agentIds = agents.map(a => a.id);
const memories = await db.query(
  'SELECT * FROM memories WHERE agent_id = ANY($1)',
  [agentIds]
);
```

### ۴.۲ PostgreSQL Indexes
```sql
-- Critical indexes for performance
CREATE INDEX CONCURRENTLY idx_messages_created_at 
  ON messages(conversation_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_audit_logs_org_time
  ON audit_logs(organization_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_memory_nodes_embedding
  ON memory_graph_nodes 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Partial indexes for active data
CREATE INDEX CONCURRENTLY idx_active_agents
  ON agents(organization_id)
  WHERE status = 'active';
```

### ۴.۳ Materialized Views
```sql
-- For dashboard queries
CREATE MATERIALIZED VIEW mv_dashboard_summary AS
SELECT 
  o.id as org_id,
  COUNT(DISTINCT a.id) as total_agents,
  COUNT(DISTINCT CASE WHEN a.status = 'active' THEN a.id END) as active_agents,
  COALESCE(SUM(al.cost_cents), 0) as total_cost,
  COUNT(al.id) as total_actions
FROM organizations o
LEFT JOIN agents a ON a.organization_id = o.id
LEFT JOIN audit_logs al ON al.organization_id = o.id 
  AND al.created_at > NOW() - INTERVAL '24 hours'
GROUP BY o.id;

REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_summary;
```

---

## ۵. Rate Limiting

```yaml
rate_limits:
  # Per user
  user:
    anon:
      rps: 10
      burst: 20
    authenticated:
      rps: 100
      burst: 200
    enterprise:
      rps: 1000
      burst: 2000

  # Per Agent
  agent:
    standard:
      rpm: 100       # requests per minute
      tpm: 10000     # tokens per minute
    priority:
      rpm: 500
      tpm: 50000

  # Per model
  model:
    gpt-4o:
      rpm: 50
      tpm: 50000
    claude-3.5:
      rpm: 50
      tpm: 50000
    local-qwen:
      rpm: 500
      tpm: 200000
```

---

## ۶. Database Sharding Strategy

### برای Enterprise:

```yaml
sharding:
  strategy: "by_organization"
  shards: 4 to 64
  
  shard_key: "organization_id"
  
  routing:
    - org_1 to org_1000 → shard_0
    - org_1001 to org_2000 → shard_1
    - org_2001 to org_3000 → shard_2
    - org_3001+ → shard_3
  
  # Read replicas for analytics
  read_replicas:
    shard_0: 2 replicas
    shard_1: 2 replicas
    shard_2: 1 replica
    shard_3: 1 replica
```

---

## ۷. Async Processing

### Queue Architecture:
```
                    ┌─────────────────────────────┐
                    │         RABBITMQ             │
                    ├─────────────────────────────┤
                    │                             │
Request ───────────▶│  high_priority_queue        │──▶ Agent Worker
                    │    (CEO requests, urgent)   │
                    │                             │
                    │  default_queue              │──▶ Agent Worker
                    │    (normal requests)        │
                    │                             │
                    │  low_priority_queue         │──▶ Agent Worker
                    │    (batch jobs, reports)    │
                    │                             │
                    │  memory_queue               │──▶ Memory Worker
                    │    (memory writes, pruning) │
                    │                             │
                    │  skill_queue                │──▶ Skill Worker
                    │    (skill detection, exec)  │
                    └─────────────────────────────┘
```

### Worker Configuration:
```yaml
workers:
  agent_worker:
    concurrency: 10
    prefetch: 1
    max_retries: 3
    
  memory_worker:
    concurrency: 5
    prefetch: 5
    max_retries: 1
    
  skill_worker:
    concurrency: 3
    prefetch: 1
    max_retries: 2
```

---

## ۸. CDN & Asset Optimization

```yaml
cdn:
  provider: Cloudflare / BunnyCDN
  
  static_assets:
    - path: "/_next/static/*"
      ttl: "365d"
      compression: "br"
    
    - path: "/assets/*"
      ttl: "30d"
      compression: "br"
    
    - path: "/api/health"
      ttl: "10s"
      no_cache: false

  image_optimization:
    formats: ["webp", "avif"]
    sizes: [480, 768, 1024, 1920]
    quality: 80
```

---

## ۹. Startup Optimization

```typescript
// Lazy loading modules
const memoryEngine = lazy(() => import('./memory-engine'));
// فقط زمانی لود می‌شود که اولین بار استفاده شود

// Code splitting
const AgentChat = lazy(() => import('./pages/AgentChat'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Route-based splitting
<Routes>
  <Route path="/chat" element={<Suspense><AgentChat /></Suspense>} />
  <Route path="/dashboard" element={<Suspense><Dashboard /></Suspense>} />
</Routes>
```

---

## ۱۰. Benchmarking

### Benchmark Suite:
```yaml
benchmarks:
  memory_read:
    scenario: "10,000 sequential reads"
    target: "< 20ms p95"
    
  memory_write:
    scenario: "10,000 writes with graph update"
    target: "< 50ms p95"
    
  model_router:
    scenario: "100,000 routing decisions"
    target: "< 5ms p95"
    
  concurrent_agents:
    scenario: "500 agents chatting simultaneously"
    target: "< 2s p95 response"
    target_error_rate: "< 1%"
    
  database:
    scenario: "1M message history, complex query"
    target: "< 100ms"
```

---

> **خلاصه:** Performance در O₂N از Caching (۴ لایه), Connection Pooling, Query Optimization, Async Processing, CDN, Sharding, و Benchmarking تشکیل شده. اهداف Performance مشخص و قابل اندازه‌گیری هستند.
