# Tutorial: Trigger a workflow from an external webhook

Captured against a real running gateway — the workflow run below actually
executed and actually called out to `https://postman-echo.com/post`.

## 1. Create a workflow to trigger (manual trigger is fine)

The webhook endpoint's own `targetId` is what actually starts this
workflow — the workflow's `trigger` field doesn't need to say `"webhook"`
for this to work (that field is informational / for scheduled triggers).

```sh
curl -X POST http://localhost:4000/v1/workflows \
  -H "Authorization: Bearer $TOKEN" -H "X-Organization-Id: $ORG" -H "Content-Type: application/json" \
  -d '{
    "name": "Deploy notifier",
    "definition": {
      "steps": [
        { "id": "step-1", "type": "tool", "tool": "webhook-send", "params": { "url": "https://postman-echo.com/post", "payload": { "event": "deploy-finished" } } }
      ]
    }
  }'
```

## 2. Register a webhook endpoint pointing at it

```sh
curl -X POST http://localhost:4000/v1/webhooks \
  -H "Authorization: Bearer $TOKEN" -H "X-Organization-Id: $ORG" -H "Content-Type: application/json" \
  -d '{"name":"CI deploy hook","targetType":"workflow","targetId":"4c94e633-c825-4008-acfa-e8b5a235bd1e"}'
```

```json
{
  "id": "57061162-2d9b-4e4d-bef5-f3ae34ff08ff",
  "organizationId": "f16f4c86-52be-4096-a1d5-9b37479e6747",
  "name": "CI deploy hook v2",
  "targetType": "workflow",
  "targetId": "4c94e633-c825-4008-acfa-e8b5a235bd1e",
  "isActive": true,
  "createdAt": "2026-07-15T06:25:58.627Z",
  "lastTriggeredAt": null,
  "token": "ba5945b4fc1a301ac5cb89d113c48065692af9a05aef807c32786a6c6bf95bc1"
}
```

**`token` is only ever returned here, at creation time.** The database only
ever stores its SHA-256 hash — there's no way to retrieve it again later.
Copy it now, or delete-and-recreate the endpoint if you lose it.

## 3. POST to the webhook URL — no auth header needed

The unguessable token in the path _is_ the authentication (same trust
model as an invitation-accept link) — this is deliberately the one route
in this gateway with no `Authorization: Bearer` requirement.

```sh
curl -X POST "http://localhost:4000/v1/webhooks/ba5945b4fc1a301ac5cb89d113c48065692af9a05aef807c32786a6c6bf95bc1" \
  -H "Content-Type: application/json" -d '{}'
```

```json
{ "runId": "3402be95-be11-485b-9f0c-f6515a3d27d2" }
```

HTTP 202 — the workflow run was _started_, this doesn't wait for it to
finish. Check the result:

```sh
curl http://localhost:4000/v1/workflow-runs/3402be95-be11-485b-9f0c-f6515a3d27d2 \
  -H "Authorization: Bearer $TOKEN" -H "X-Organization-Id: $ORG"
```

```json
{
  "id": "3402be95-be11-485b-9f0c-f6515a3d27d2",
  "workflowId": "4c94e633-c825-4008-acfa-e8b5a235bd1e",
  "status": "success",
  "currentStepId": null,
  "context": { "step-1": { "statusCode": 200 } },
  "startedAt": "2026-07-15T06:26:10.402Z",
  "completedAt": "2026-07-15T06:26:10.732Z"
}
```

## Targeting an agent instead of a workflow

Set `targetType: "agent"` and `targetId: <agentId>` instead — the POST
body is sent as a chat message to that agent (`{"message": "..."}` in the
body, or the raw JSON body is stringified if there's no `message` field).

## What this doesn't do

- No signature verification (HMAC) of the caller — the token itself is
  the whole trust model, there's no secondary signing scheme like GitHub's
  `X-Hub-Signature-256`.
- No per-endpoint rate limit override — it reuses the same fixed-window
  limiter chat routes use, keyed by the target id.
