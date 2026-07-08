# Coding Standards — Open on4net

> **فایل:** 08_CODING_STANDARD/01-standards.md
> **نسخه:** 1.0

---

## ۱. اصول کلی

| اصل | توضیح |
|-----|--------|
| **TypeScript First** | همه‌ی بک‌اندها و کلاینت وب TypeScript هستند. **استثنا:** کلاینت چندسکویی (`apps/openon4net-runtime/mobile`) با Flutter/Dart نوشته می‌شود؛ برای آن بخش، conventionهای Dart رسمی (نه این سند) مرجع است. |
| **Test Coverage > 80%** | unit + integration + e2e |
| **Documentation as Code** | TSDoc برای همه functions |
| **Clean Code** | SOLID, DRY, KISS |
| **Security First** | input validation, rate limiting, auth |

---

## ۲. ساختار پروژه

ساختار پوشه‌ها دیگر در این فایل تکرار نمی‌شود تا از drift بین اسناد جلوگیری شود.

**مرجع واحد ساختار monorepo:** `02_ARCHITECTURE/14-monorepo-layout.md`

آن سند ساختار plane-محور (`apps/openon4net-runtime`, `apps/openon4net-control-plane`, `apps/openon4net-memory`, `apps/openon4net-marketplace` + `packages/*` مشترک) را مشخص می‌کند، چون هر Plane واحد دیپلوی مستقلی با مالکیت و مدل مالی متفاوت است (Runtime رایگان/self-hosted روی سرور مشتری؛ بقیه SaaS مرکزی on4net). naming conventionهای زیر (فایل، کلاس، تابع و…) صرف‌نظر از اینکه کد در کدام app/package باشد، یکسان اعمال می‌شوند.

---

## ۳. naming conventions

| مورد | Convention | مثال |
|------|-----------|-------|
| **فایل‌ها** | kebab-case | `memory-engine.ts` |
| **کلاس‌ها** | PascalCase | `class MemoryEngine` |
| **توابع** | camelCase | `function getMemory()` |
| **متغیرها** | camelCase | `const agentMemory` |
| **ثابت‌ها** | UPPER_CASE | `const MAX_LAYERS = 6` |
| **نوع‌ها** | PascalCase + prefix | `type AgentConfig` |
| **Interfaceها** | PascalCase + prefix | `interface IMemoryLayer` |
| **Enumها** | PascalCase | `enum MemoryLayer` |
| **فایل‌های تست** | `.test.ts` | `memory-engine.test.ts` |

---

## ۴. TypeScript Style

```typescript
// ✅ خوب
interface AgentConfig {
    readonly id: string;
    name: string;
    role: AgentRole;
    status: AgentStatus;
    monthlyBudgetCents: number;
}

// ❌ بد
interface agent_config {
    id: string;
    name: string;
    role: string;
    status: string;
    monthly_budget_cents: number;
}

// توابع
async function getAgentMemory(
    agentId: string,
    layers: MemoryLayer[],
    options?: MemoryQueryOptions
): Promise<MemoryResult> {
    // validation
    if (!agentId || layers.length === 0) {
        throw new ValidationError('Agent ID and layers required');
    }
    
    // implementation
    const results = await Promise.all(
        layers.map(layer => queryLayer(agentId, layer))
    );
    
    return mergeResults(results, options);
}
```

---

## ۵. Error Handling

```typescript
// Error Classes
export class O2NError extends Error {
    constructor(
        public code: string,
        message: string,
        public statusCode: number = 500,
        public details?: unknown
    ) {
        super(message);
    }
}

export class ValidationError extends O2NError {
    constructor(message: string) {
        super('VALIDATION_ERROR', message, 400);
    }
}

export class BudgetExceededError extends O2NError {
    constructor(agentId: string, budget: number) {
        super(
            'BUDGET_EXCEEDED',
            `Agent ${agentId} exceeded monthly budget of $${budget}`,
            402
        );
    }
}

// استفاده
try {
    const result = await memoryEngine.query(params);
} catch (error) {
    if (error instanceof ValidationError) {
        // validation error → 400
        throw error;
    }
    // unknown error → log + 500
    logger.error('Memory query failed', { error, params });
    throw new O2NError('INTERNAL_ERROR', 'Something went wrong');
}
```

---

## ۶. Testing Standards

```typescript
// Unit Test
describe('MemoryEngine', () => {
    let engine: MemoryEngine;
    
    beforeEach(() => {
        engine = new MemoryEngine(mockDb, mockCache);
    });
    
    describe('query()', () => {
        it('should return results for valid layers', async () => {
            const result = await engine.query('agent-1', [1, 2]);
            expect(result).toBeDefined();
            expect(result.layers).toHaveLength(2);
        });
        
        it('should throw for invalid layer', async () => {
            await expect(
                engine.query('agent-1', [99])
            ).rejects.toThrow(ValidationError);
        });
    });
});
```

---

## ۷. Git Workflow

```
branch strategy:
├── main        → production-ready
├── develop     → integration branch
├── feature/*   → new features
├── fix/*       → bug fixes
└── release/*   → release candidates

commit convention:
┌─────────┬──────────────────────────────┐
│ type    │ usage                        │
├─────────┼──────────────────────────────┤
│ feat    │ new feature                  │
│ fix     │ bug fix                      │
│ docs    │ documentation                │
│ style   │ formatting, linting          │
│ refactor│ code refactoring             │
│ test    │ adding/updating tests        │
│ chore   │ maintenance, dependencies    │
└─────────┴──────────────────────────────┘

example: feat(memory): add graph query support
```

---

## ۸. Code Review Checklist

- [ ] آیا کد از TypeScript strict mode استفاده می‌کند؟
- [ ] آیا types به درستی تعریف شده‌اند؟ (نه any)
- [ ] آیا validation وجود دارد؟
- [ ] آیا error handling درست است؟
- [ ] آیا تست نوشته شده؟
- [ ] آیا مستندات (TSDoc) وجود دارد؟
- [ ] آیا از naming conventions پیروی شده؟
- [ ] آیا security issues وجود دارد؟ (SQL injection, XSS, ...)
- [ ] آیا performance بهینه است؟
- [ ] آیا log مناسب وجود دارد؟

---

## ۹. Performance

```typescript
// ✅ Async parallel
const [memory, skills, kpis] = await Promise.all([
    memoryEngine.query(agentId),
    skillEngine.list(agentId),
    outcomeEngine.getKpis(agentId),
]);

// ❌ Sequential
const memory = await memoryEngine.query(agentId);
const skills = await skillEngine.list(agentId);
const kpis = await outcomeEngine.getKpis(agentId);

// Cache results
const cached = await cache.get(`agent:${agentId}:config`);
if (cached) return cached;

const config = await loadAgentConfig(agentId);
await cache.set(`agent:${agentId}:config`, config, { ttl: 300 });
```

---

> **خلاصه:** کد O₂N TypeScript strict mode, test coverage >80%, clean architecture, و مستندات کامل. هر تابع TSDoc دارد، هر ماژول تست، و هر commit از conventional commits پیروی می‌کند.
