# Deployment Bible — Open on4net

> **فایل:** 09_TASKS/02-deployment.md
> **نسخه:** 1.0

---

## ۱. Development Environment

### پیش‌نیازها:
- Docker + Docker Compose
- Node.js 20+
- pnpm
- Git

### شروع کار:
```bash
git clone https://github.com/on4nettec/openon4net.git
cd openon4net
pnpm install
docker compose up -d
pnpm dev
```

### docker-compose.yml:
```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: o2n
      POSTGRES_PASSWORD: o2n_dev
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  minio:
    image: minio/minio
    ports: ["9000:9000", "9001:9001"]
    environment:
      MINIO_ROOT_USER: o2n
      MINIO_ROOT_PASSWORD: o2n_dev
    command: server /data --console-address ":9001"

  api:
    build: ./apps/api
    ports: ["3000:3000"]
    depends_on: [postgres, redis, minio]
    environment:
      DATABASE_URL: postgres://postgres:o2n_dev@postgres:5432/o2n

  web:
    build: ./apps/web
    ports: ["3001:3000"]
    depends_on: [api]

volumes:
  pgdata:
```

## ۲. Production Deployment (Docker Compose)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: o2n
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes: ["pgdata:/var/lib/postgresql/data"]
    deploy:
      resources:
        limits:
          memory: 4G

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    deploy:
      resources:
        limits:
          memory: 2G

  neo4j:
    image: neo4j:5-community
    environment:
      NEO4J_AUTH: neo4j/${NEO4J_PASSWORD}
    volumes: ["neo4jdata:/data"]

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    volumes: ["miniodata:/data"]

  api:
    build: ./apps/api
    ports: ["3000:3000"]
    depends_on: [postgres, redis, neo4j, minio]
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://postgres:${DB_PASSWORD}@postgres:5432/o2n
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      NEO4J_URI: bolt://neo4j:7687
      MINIO_ENDPOINT: minio:9000
      JWT_SECRET: ${JWT_SECRET}
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 2G

  web:
    build: ./apps/web
    ports: ["3001:3000"]
    environment:
      NEXT_PUBLIC_API_URL: https://api.on4net.com
    deploy:
      replicas: 2

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on: [api, web]

volumes:
  pgdata:
  neo4jdata:
  miniodata:
```

## ۳. Kubernetes (Enterprise)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: o2n-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: o2n-api
  template:
    metadata:
      labels:
        app: o2n-api
    spec:
      containers:
      - name: api
        image: on4net/o2n-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: o2n-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: o2n-api
spec:
  selector:
    app: o2n-api
  ports:
  - port: 3000
  type: ClusterIP
```

### HPA (Horizontal Pod Autoscaler):
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: o2n-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: o2n-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## ۴. Monitoring

### Prometheus + Grafana:
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'o2n-api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'
```

### Metrics ردیابی:
- Request rate و latency
- Model cost per Agent
- Memory query time
- Skill execution success rate
- Error rate per service

### Alerts:
- **Pager:** API down > 1 min
- **Warning:** Memory > 80%, Cost > 80% budget
- **Info:** New skill detected, New plugin published

## ۵. Backup Strategy

| داده | روش | دوره |
|------|------|------|
| PostgreSQL | pg_dump + WAL archiving | روزانه |
| Neo4j | Neo4j dump | روزانه |
| MinIO | S3 sync to backup | لحظه‌ای |
| Redis | RDB snapshot | هر ۶ ساعت |
| Configs | Git | هر تغییر |

---

> Deploy O₂N از Docker Compose (dev) تا Kubernetes (production). Monitor با Prometheus + Grafana. Backup اتوماتیک همه داده‌ها.
