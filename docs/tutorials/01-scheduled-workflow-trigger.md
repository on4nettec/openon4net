# Tutorial: Run a workflow on a schedule

Every request/response below was captured against a real running gateway
(`pnpm dev`), not guessed from the code — copy-paste them and they'll work
against your own local instance the same way.

## 1. Create a workflow with a scheduled trigger

`trigger.intervalMinutes` reuses the exact same shape as an agent's own
`schedule` field — no cron syntax to learn.

```sh
curl -X POST http://localhost:4000/v1/workflows \
  -H "Authorization: Bearer $TOKEN" -H "X-Organization-Id: $ORG" -H "Content-Type: application/json" \
  -d '{
    "name": "Daily status webhook",
    "description": "Pings a status URL every day",
    "definition": {
      "steps": [
        { "id": "step-1", "type": "tool", "tool": "webhook-send", "params": { "url": "https://example.com/status", "payload": { "status": "ok" } } }
      ]
    },
    "trigger": { "type": "scheduled", "intervalMinutes": 1440 }
  }'
```

```json
{
  "id": "06a9c118-36a5-446c-8e11-c9eb47313371",
  "organizationId": "f16f4c86-52be-4096-a1d5-9b37479e6747",
  "name": "Daily status webhook",
  "description": "Pings a status URL every day",
  "definition": {
    "steps": [
      {
        "id": "step-1",
        "tool": "webhook-send",
        "type": "tool",
        "params": { "url": "https://example.com/status", "payload": { "status": "ok" } }
      }
    ]
  },
  "status": "draft",
  "trigger": { "type": "scheduled", "intervalMinutes": 1440 },
  "createdByUserId": "80cf0c7d-2c14-4f67-9fe3-b476cc5ca5b8",
  "createdAt": "2026-07-15T06:09:55.595Z",
  "updatedAt": "2026-07-15T06:09:55.595Z"
}
```

## 2. Activate it

**A workflow created via `POST` always starts in `draft` status.** The
scheduler (`workflow-trigger-scheduler.ts`) only ever looks at workflows
with `status = 'active'` — a scheduled trigger on a draft workflow will
never fire. This is easy to miss and worth calling out explicitly.

```sh
curl -X PATCH http://localhost:4000/v1/workflows/06a9c118-36a5-446c-8e11-c9eb47313371 \
  -H "Authorization: Bearer $TOKEN" -H "X-Organization-Id: $ORG" -H "Content-Type: application/json" \
  -d '{"status":"active"}'
```

## 3. Wait for it to fire

The scheduler ticks every 30 seconds and compares `now - lastRunAt` against
`intervalMinutes` (`lastRunAt` is stored inside the `trigger` JSONB itself,
updated _before_ the run starts so an overlapping/slow tick can't double-fire
the same workflow). With `intervalMinutes: 1440` it'll run once a day; for
testing, use a small value like `1` and watch `GET /v1/workflows/:id/runs`
fill in within a minute or two — no manual `POST .../run` needed.

```sh
curl http://localhost:4000/v1/workflows/06a9c118-36a5-446c-8e11-c9eb47313371/runs \
  -H "Authorization: Bearer $TOKEN" -H "X-Organization-Id: $ORG"
```

## What this doesn't do

- No cron expressions (`* * * * *` syntax) — only a fixed interval in
  minutes, same limitation `agents.schedule` already has.
- No catch-up/backfill — if the gateway is down when a scheduled run was
  due, it just runs on the next tick after restart, it doesn't run once per
  missed interval.
