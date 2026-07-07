# Monitoring & Observability — Open on4net

> **فایل:** 09_TASKS/03-monitoring.md
> **نسخه:** 1.0

---

## ۱. فلسفه Monitoring

در O₂N، Monitoring فقط "آیا سرور بالاست؟" نیست. باید بدانیم:
- Agentها چقدر سریع پاسخ می‌دهند؟
- کدام مدل بیشترین هزینه را دارد؟
- کدام Skill بیشترین خطا را دارد؟
- آیا Memory Engine latency نرمال است؟

---

## ۲. Metrics Stack

```
                    ┌─────────────────────────────────────┐
                    │          GRAFANA DASHBOARD           │
                    └────────────────┬────────────────────┘
                                     │
                    ┌────────────────▼────────────────────┐
                    │           PROMETHEUS                 │
                    └────────────────┬────────────────────┘
                                     │
        ┌──────────────┬──────────────┼──────────────┬──────────────┐
        │              │              │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │  API    │   │  Agent  │   │ Memory  │   │  AI     │   │  System │
   │ Metrics │   │ Metrics │   │ Metrics │   │ Gateway │   │ Metrics │
   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
```

---

## ۳. Metrics به تفکیک

### ۳.۱ API Metrics
```
http_requests_total{method, path, status}
├── Rate: درخواست/ثانیه
├── Latency: P50, P95, P99
├── Error Rate: ۵xx / total
└── Active Connections

Targets:
├── P50 latency < 50ms
├── P95 latency < 200ms
├── P99 latency < 500ms
└── Error rate < 0.1%
```

### ۳.۲ Agent Metrics
```
agent_messages_total{agent_id, role, status}
├── Messages Sent/Received
├── Response Time
├── Skills Executed
├── Memory Queries
└── Cost Accumulated

agent_health_status{agent_id}
├── 0 = offline
├── 1 = healthy
├── 2 = degraded
└── 3 = out_of_budget
```

### ۳.۳ AI Gateway Metrics
```
ai_gateway_requests_total{model, provider, status}
├── Requests Per Model
├── Cost Per Model ($)
├── Latency Per Model
├── Cache Hit Rate
├── Fallback Count
└── Rate Limited Requests

Targets:
├── Cache Hit Rate > 40%
├── Fallback Rate < 5%
└── Rate Limited < 1%
```

### ۳.۴ Memory Engine Metrics
```
memory_engine_operations{layer, operation, status}
├── Read Latency
├── Write Latency
├── Graph Query Latency
├── Memory Size Per Agent
├── Prune Operations
└── Vector Search Latency

Targets:
├── Read Latency < 20ms
├── Write Latency < 50ms
├── Graph Query < 100ms
└── Vector Search < 200ms
```

### ۳.۵ System Metrics
```
system_resources{service}
├── CPU Usage (%)
├── Memory Usage (%)
├── Disk Usage (%)
├── Network I/O
└── Goroutine/Thread Count

Targets:
├── CPU < 70%
├── Memory < 80%
└── Disk < 70%
```

---

## ۴. Logging

### ۴.۱ Log Levels
```yaml
levels:
  error:   "Something is wrong"          → Pager/Slack
  warn:    "Something might go wrong"    → Slack/Daily report
  info:    "Normal operation"            → Elastic/Loki
  debug:   "Troubleshooting only"         → Local development
  trace:   "Function entry/exit"          → Local development
```

### ۴.۲ Log Format
```json
{
  "timestamp": "2026-07-07T14:30:00.123Z",
  "level": "info",
  "service": "api",
  "request_id": "req_a1b2c3d4",
  "message": "Agent response received",
  "metadata": {
    "agent_id": "marketing-01",
    "model": "gpt-4o",
    "latency_ms": 1234,
    "cost_cents": 4,
    "tokens_used": 456
  }
}
```

### ۴.۳ Log Shipping
```
Application → stdout → Vector/Fluentd → Loki/Elastic → Grafana
```

---

## ۵. Tracing (Distributed Tracing)

### برای رهگیری یک درخواست از User تا Agent تا Model

```
User Request
  │ trace_id: "trace_abc123"
  │
  ├── API Gateway       [span_1: auth, 5ms]
  ├── Agent Framework   [span_2: load context, 45ms]
  ├── Memory Engine     [span_3: query, 23ms]
  ├── AI Gateway        [span_4: model call, 1234ms]
  │   └── OpenAI API    [span_5: external, 1200ms]
  ├── Memory Store      [span_6: write, 15ms]
  └── Response          [total: 1322ms]
```

### Tools:
- **OpenTelemetry:** جمع‌آوری traces
- **Jaeger / Grafana Tempo:** visualization
- **Baggage:** context propagation بین سرویس‌ها

---

## ۶. Alerts

### ۶.۱ Alert Rules

| نام | شرط | severity | action |
|-----|------|----------|--------|
| **API Down** | up == 0 > 1min | 🔴 P1 | Slack + SMS |
| **High Error Rate** | error_rate > 5% > 5min | 🔴 P1 | Slack |
| **High Latency** | p99 > 1s > 5min | 🟡 P2 | Slack |
| **Model Unavailable** | model_health == 0 | 🟡 P2 | Slack |
| **Budget Warning** | budget_used > 80% | 🟡 P2 | In-app |
| **Budget Exhausted** | budget_used == 100% | 🟠 P3 | In-app |
| **Memory Slow** | memory_latency > 500ms | 🟡 P2 | Slack |
| **Certificate Expiry** | cert_expires < 7d | 🔴 P1 | Slack + Email |

### ۶.۲ Alert Channels
```
P1: Slack + SMS + Phone Call (۲۴/۷ on-call)
P2: Slack + In-app notification
P3: In-app notification + Daily report
P4: Log only
```

---

## ۷. Dashboards

### ۷.۱ Executive Dashboard (برای سروش)
```
┌──────────────────────────────────────────────────────┐
│  📊 O₂N Executive Dashboard — July 7, 2026           │
├──────────────────────────────────────────────────────┤
│                                                        │
│  🟢 All Systems Operational                           │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ ۱,۲۳۴        │  │ $۲۳۴.۵۶     │  │ ۹۹.۸۷٪     │ │
│  │ Requests Today│  │ Cost Today   │  │ Uptime     │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ Cost by Model (Today)                         │   │
│  │ ████████████████ GPT-4o           $۱۲۰ (۴۸٪)   │   │
│  │ ██████████      Claude 3.5        $۸۰ (۳۲٪)   │   │
│  │ ████             Gemini           $۳۰ (۱۲٪)   │   │
│  │ ██               DeepSeek         $۱۵ (۶٪)    │   │
│  │ ▏                Qwen (local)     $۰ (۰٪)     │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ Active Agents (۱۲ total)                      │   │
│  │ 🟢 Marketing     🟢 Sales      🟢 Support     │   │
│  │ 🟢 HR            🟢 Finance    🟡 Legal (low $)│   │
│  │ 🟢 Programmer    🟢 SEO        ⚪ Designer     │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
└──────────────────────────────────────────────────────┘
```

### ۷.۲ Technical Dashboard (برای DevOps)
```
┌──────────────────────────────────────────────────────┐
│  O₂N Technical Dashboard                              │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Service     │ Status │ Latency │ Error │ Load        │
│  ────────────┼────────┼─────────┼───────┼────────┤   │
│  API         │ 🟢     │ ۴۵ms    │ ۰.۱٪  │ ۶۵٪    │   │
│  Agent       │ 🟢     │ ۱.۲s    │ ۰.۳٪  │ ۵۲٪    │   │
│  Memory      │ 🟢     │ ۲۳ms    │ ۰.۰٪  │ ۳۴٪    │   │
│  AI Gateway  │ 🟢     │ ۱.۵s    │ ۱.۲٪  │ ۴۵٪    │   │
│  PostgreSQL  │ 🟢     │ ۵ms     │ ۰.۰٪  │ ۳۸٪    │   │
│  Redis       │ 🟢     │ ۱ms     │ ۰.۰٪  │ ۲۲٪    │   │
│  Neo4j       │ 🟢     │ ۱۲ms    │ ۰.۱٪  │ ۱۸٪    │   │
│  MinIO       │ 🟢     │ ۳۴ms    │ ۰.۰٪  │ ۱۲٪    │   │
│                                                        │
└──────────────────────────────────────────────────────┘
```

---

## ۸. Health Check Endpoints

```yaml
GET /health
→ {
    "status": "healthy",
    "version": "1.0.0",
    "uptime_seconds": 86400,
    "services": {
      "postgres": { "status": "healthy", "latency_ms": 3 },
      "redis": { "status": "healthy", "latency_ms": 1 },
      "neo4j": { "status": "healthy", "latency_ms": 8 },
      "minio": { "status": "healthy", "latency_ms": 15 },
      "openai": { "status": "healthy", "latency_ms": 450 },
      "claude": { "status": "degraded", "latency_ms": 3200 },
      "gemini": { "status": "healthy", "latency_ms": 680 }
    },
    "checks": {
      "memory_usage": "68%",
      "disk_usage": "42%",
      "active_agents": 12,
      "queue_depth": 3
    }
  }

GET /ready
→ { "status": "ready", "message": "Accepting traffic" }
```

---

> **خلاصه:** Monitoring O₂N با Prometheus + Grafana + OpenTelemetry. Metrics در ۵ دسته (API, Agent, AI Gateway, Memory, System). Alerts در ۴ سطح (P1-P4) با Slack, SMS, In-app. Dashboards هم برای Executive و هم Technical.
