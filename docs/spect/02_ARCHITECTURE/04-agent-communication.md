# Agent-to-Agent Communication Protocol — Open on4net

> **فایل:** 02_ARCHITECTURE/04-agent-communication.md
> **نسخه:** 1.0

---

## ۱. چرا Agent-to-Agent Communication؟

در O₂N، Agentها تیمی کار می‌کنند. Marketing Agent به Designer Agent می‌گوید "یک بنر طراحی کن". Sales Agent به Finance Agent می‌گوید "قیمت‌گذاری محصول جدید رو تأیید کن".

این Agent-to-Agent Communication قلب سازمان دیجیتال O₂N است.

---

## ۲. معماری Communication Bus

```
                    ┌─────────────────────────────────────────┐
                    │           COMMUNICATION BUS              │
                    ├─────────────────────────────────────────┤
                    │                                         │
                    │  ┌──────────┐  ┌──────────┐             │
                    │  │  Request │  │ Response │  Sync/Async │
                    │  │  Queue   │  │  Queue   │  Mode      │
                    │  └──────────┘  └──────────┘             │
                    │                                         │
                    │  ┌──────────────────────────────────┐   │
                    │  │  Message Router                  │   │
                    │  │  - به Agent مقصد هدایت می‌کند    │   │
                    │  │  - اولویت‌بندی پیام‌ها           │   │
                    │  │  - Timeout و Retry               │   │
                    │  └──────────────────────────────────┘   │
                    │                                         │
                    └─────────────────────────────────────────┘
                                │           ▲
                    ┌───────────┘           │
                    ▼                       │
            ┌──────────────┐      ┌──────────────────┐
            │  Agent A     │─────▶│  Agent B          │
            │  (Marketing) │      │  (Designer)       │
            └──────────────┘      └──────────────────┘
```

---

## ۳. پروتکل پیام (Message Protocol)

### فرمت پایه یک پیام:

```json
{
  "message_id": "msg_a1b2c3d4",
  "type": "request",
  "protocol_version": "1.0",
  
  "source": {
    "agent_id": "marketing-01",
    "agent_role": "marketing",
    "workspace_id": "ws-alpha"
  },
  
  "target": {
    "agent_id": "designer-01",
    "agent_role": "designer",
    "workspace_id": "ws-alpha"
  },
  
  "action": {
    "type": "create_design",
    "priority": "high",
    "timeout_ms": 300000
  },
  
  "payload": {
    "design_type": "social_media_post",
    "specifications": {
      "platform": "instagram",
      "size": "1080x1080",
      "style": "modern_minimal",
      "colors": ["#FF6B35", "#004E89"],
      "text": "تخفیف تابستونه - ۴۰٪",
      "deadline": "2026-07-08T10:00:00Z"
    }
  },
  
  "context": {
    "project_id": "proj-summer-campaign",
    "campaign_id": "camp-027",
    "priority": "high",
    "budget_impact_cents": 5000
  },
  
  "governance": {
    "requires_approval": false,
    "audit_level": "full",
    "budget_check": true
  },
  
  "timestamp": "2026-07-07T14:30:00Z",
  "ttl_ms": 300000
}
```

---

## ۴. انواع پیام (Message Types)

### ۴.۱ Request / Response
```
Agent A ──Request──▶ Agent B
Agent A ◀──Response── Agent B

زمانی که Agent A نیاز به انجام کاری توسط Agent B دارد.
Agent B نتیجه را برمی‌گرداند.
```

### ۴.۲ Broadcast
```
CEO AI ──Broadcast──▶ همه Agentها
موضوع: "تغییر استراتژی به تخفیف تابستونه"

همه Agentها این پیام را دریافت می‌کنند.
هر Agent خودش تصمیم می‌گیرد چه واکنشی نشان دهد.
```

### ۴.۳ Event
```
Agent A ──Event──▶ Communication Bus
                    │
                    ├──▶ Agent B (مشترک این رویداد)
                    ├──▶ Agent C (مشترک این رویداد)
                    └──▶ Audit Log

زمانی که چیزی اتفاق می‌افتد و هرکس مشترک است مطلع می‌شود.
مثلاً: "کمپین جدید راه‌اندازی شد"
```

### ۴.۴ Delegation
```
CEO AI ──Delegate──▶ Marketing Agent
موضوع: "مدیریت کامل کمپین تابستونه"

Marketing Agent الآن اختیار کامل دارد.
می‌تواند به Designer, Copywriter, Publisher کار بدهد.
```

### ۴.۵ Escalation
```
Support Agent ──Escalate──▶ Programmer Agent
موضوع: "باگ بحرانی در ماژول پرداخت"

وقتی Agent سطح پایین‌تر نمی‌تواند حل کند،
به Agent متخصص‌تر ارجاع می‌دهد.
```

---

## ۵. صف پیام (Message Queue)

### ساختار صف:

```
Queue Architecture:
┌──────────────────────────────────────────────┐
│              RABBITMQ / REDIS STREAMS         │
├──────────────────────────────────────────────┤
│                                              │
│  queue:agent.designer-01.inbox               │
│  ├── msg_001 (از marketing-01) [PENDING]     │
│  ├── msg_002 (از ceo-01) [PROCESSING]        │
│  └── msg_003 (از sales-01) [PENDING]         │
│                                              │
│  queue:agent.designer-01.outbox              │
│  ├── msg_001_response [DELIVERED]            │
│  └── msg_003_response [PENDING]             │
│                                              │
│  queue:broadcast.workspace-alpha              │
│  └── msg_004 (تغییر استراتژی)                │
│                                              │
└──────────────────────────────────────────────┘
```

### Priority Queue:
```
Queue: agent.designer-01.inbox
┌──────────────────────────────────────┐
│ Priority │ Message                   │
│──────────│───────────────────────────│
│ CRITICAL │ از CEO (فوری)            │
│ HIGH     │ از Marketing (کمپین)     │
│ NORMAL   │ از Sales (بروشور)        │
│ LOW      │ از Support (آیکون کوچک)  │
└──────────────────────────────────────┘
```

---

## ۶. جریان یک مکالمه بین Agentها

### مثال واقعی: Marketing Agent می‌خواهد یک پست اینستاگرام طراحی کند

```
۱. Marketing Agent تعیین می‌کند نیاز به Designer دارد
                   │
                   ▼
۲. به Communication Bus درخواست می‌دهد:
   "بهترین Designer برای این کار کیست؟"
                   │
                   ▼
۳. Router بررسی می‌کند:
   - Designer Agent با مهارت "social-media" و
   - کمترین workload و
   - بالاترین success rate برای Instagram
                   │
                   ▼
۴. پیام به Designer Agent ارسال می‌شود
   (با priority: high, timeout: 5 min)
                   │
                   ▼
۵. Designer Agent دریافت می‌کند:
   - قبول یا رد؟ (busy, out of budget, etc)
   - اگر busy → Escalate به CEO یا صبر در صف
                   │
                   ▼
۶. Designer Agent شروع به کار می‌کند
   - Status updates هر ۳۰ ثانیه
   - "در حال طراحی", "نزدیک به اتمام", "انجام شد"
                   │
                   ▼
۷. نتیجه به Marketing Agent برمی‌گردد
                   │
                   ▼
۸. Memory Graph بروز می‌شود:
   "Marketing Agent از Designer Agent درخواست طراحی کرد
    برای پروژه summer-campaign. نتیجه: موفق. مدت: ۲۳۴ ثانیه"
```

---

## ۷. Timeout و Retry

| وضعیت | عکس‌العمل |
|-------|-----------|
| **Timeout** (Agent جواب نداد) | Retry ۲ بار با فاصله ۱۰ ثانیه |
| **Agent Busy** | صبر در صف با priority queue |
| **Agent Offline** | Escalate به Manager یا CEO |
| **Agent Out of Budget** | اطلاع به CEO برای تخصیص بودجه |
| **Error در اجرا** | خطا برگردانده می‌شود + Fallback به Agent دیگر |

### استراتژی Retry:
```yaml
retry_policy:
  max_retries: 3
  backoff: "exponential"
  initial_delay_ms: 1000
  multiplier: 2
  max_delay_ms: 30000
  jitter: true

  on_exhausted:
    action: "escalate"
    escalate_to: "ceo-01"
    message: "Agent designer-01 بعد از ۳ بار تلاش پاسخ نداد"
```

---

## ۸. Governance در Communication

هر پیام بین Agentها باید Governance Check شود:

```yaml
governance_check:
  - آیا Agent مبدأ مجاز به درخواست از Agent مقصد است؟
    ✓ marketing → designer: مجاز
    ✗ support → ceo: فقط در شرایط بحرانی

  - آیا Budget کافی دارد؟
    ✓ marketing $۴۵۰/$۵۰۰: مجاز
    ✗ marketing $۵۰۰/$۵۰۰: رد شود

  - آیا نیاز به Human-in-the-Loop دارد؟
    ✓ درخواست > $۱۰۰: نیاز به تأیید
    ✗ درخواست عادی: خودکار

  - آیا Audit Log ثبت می‌شود؟
    ✓ همه پیام‌ها لاگ می‌شوند
```

---

## ۹. API بین Agentها

```typescript
// Interface Agent Communication
interface AgentBus {
  // ارسال پیام به یک Agent خاص
  send(targetAgentId: string, message: Message): Promise<Response>;
  
  // ارسال پیام و منتظر ماندن برای نتیجه
  sendAndWait(targetAgentId: string, message: Message, timeoutMs: number): Promise<Response>;
  
  // Broadcast به همه Agentهای یک Workspace
  broadcast(workspaceId: string, message: Message): Promise<void>;
  
  // انتشار یک رویداد
  publishEvent(eventType: string, payload: any): Promise<void>;
  
  // اشتراک در یک رویداد
  subscribe(eventType: string, handler: (event: Event) => void): Promise<void>;
  
  // بررسی وضعیت Agent دیگر
  healthCheck(agentId: string): Promise<AgentHealth>;
  
  // لغو یک درخواست
  cancelRequest(messageId: string): Promise<void>;
}
```

### Example Usage:
```typescript
// Marketing Agent wants a design
const result = await agentBus.sendAndWait(
  'designer-01',
  {
    type: 'request',
    action: 'create_design',
    payload: {
      design_type: 'social_media_post',
      platform: 'instagram',
      style: 'modern_minimal'
    },
    priority: 'high',
    timeout_ms: 300000
  },
  300000 // 5 minutes timeout
);

if (result.status === 'completed') {
  console.log('Design ready:', result.payload.imageUrl);
  // Update memory graph
  await memoryEngine.write('agent:communication', {
    source: 'marketing-01',
    target: 'designer-01',
    result: 'success',
    duration_ms: result.duration_ms
  });
}
```

---

## ۱۰. Security

| تهدید | راه‌حل |
|-------|--------|
| **Agent جعلی** | هر پیام امضای دیجیتال دارد |
| **اطلاعات حساس** | payload محرمانه رمز می‌شود |
| **حملات DoS** | Rate limit روی هر Agent |
| **اطلاعات اشتباه** | Verification قبل از اجرا |
| **پیامهای تکراری** | Idempotency key در هر پیام |

---

> **خلاصه:** Agent-to-Agent Communication Protocol قلب همکاری تیمی در O₂N است. هر Agent می‌تواند به دیگر Agentها درخواست بدهد، رویداد منتشر کند، کار واگذار کند، یا escalalate کند. همه پیام‌ها با Governance چک می‌شوند، اولویت‌بندی می‌شوند، و در Audit Log ثبت می‌شوند.
