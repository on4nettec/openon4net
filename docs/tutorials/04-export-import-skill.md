# Tutorial: Export a Skill and import it into another organization

There is no dedicated "import" endpoint. Export returns exactly the shape
`POST /v1/skills` already accepts as input — importing is just calling that
same create endpoint with the exported JSON (plus an `agentId` for the
destination org, since a Skill always belongs to one agent). This tutorial
was run against two real organizations on the same gateway instance.

## 1. Create a Skill in the source org

```sh
curl -X POST http://localhost:4000/v1/skills \
  -H "Authorization: Bearer $TOKEN" -H "X-Organization-Id: $ORG" -H "Content-Type: application/json" \
  -d '{
    "agentId": "f26e7316-dbd7-44d3-97b6-df82440c8f2b",
    "name": "Ping status page",
    "description": "Sends a status ping",
    "definition": { "trigger": { "type": "manual" }, "steps": [ { "id": "step-1", "type": "tool", "tool": "webhook-send", "params": { "url": "https://postman-echo.com/post", "payload": {} } } ] }
  }'
```

## 2. Export it

```sh
curl http://localhost:4000/v1/skills/145ce5fd-b1ba-4755-9014-dc16eb373340/export \
  -H "Authorization: Bearer $TOKEN" -H "X-Organization-Id: $ORG"
```

```json
{
  "name": "Ping status page",
  "description": "Sends a status ping",
  "definition": {
    "steps": [
      {
        "id": "step-1",
        "tool": "webhook-send",
        "type": "tool",
        "params": { "url": "https://postman-echo.com/post", "payload": {} }
      }
    ],
    "trigger": { "type": "manual" }
  }
}
```

Notice what's **not** in this payload: no `id`, `organizationId`,
`version`, `executionCount`, or `successRate` — only the portable subset
that another org's create call can actually accept.

## 3. Import it into a different org

Sign in to the destination org, add the exported JSON's `agentId` for
_that_ org, and `POST` it as-is:

```sh
curl -X POST http://localhost:4000/v1/skills \
  -H "Authorization: Bearer $TOKEN2" -H "X-Organization-Id: $ORG2" -H "Content-Type: application/json" \
  -d '{
    "agentId": "bc442c6f-5981-4e9c-8434-9fb1d10899eb",
    "name": "Ping status page",
    "description": "Sends a status ping",
    "definition": { "steps": [{ "id": "step-1", "tool": "webhook-send", "type": "tool", "params": { "url": "https://postman-echo.com/post", "payload": {} } }], "trigger": { "type": "manual" } }
  }'
```

```json
{
  "id": "5ef9a2c1-ce6d-4bc7-9282-4f241c8a9b0e",
  "agentId": "bc442c6f-5981-4e9c-8434-9fb1d10899eb",
  "organizationId": "355fa60e-a40b-49e4-818f-550f03245716",
  "name": "Ping status page",
  "description": "Sends a status ping",
  "version": "1.0.0",
  "definition": {
    "steps": [
      {
        "id": "step-1",
        "tool": "webhook-send",
        "type": "tool",
        "params": { "url": "https://postman-echo.com/post", "payload": {} }
      }
    ],
    "trigger": { "type": "manual" }
  },
  "source": "manual",
  "status": "active",
  "executionCount": 0,
  "successRate": 100
}
```

Same `name`/`description`/`definition` as the export, a fresh `id` scoped
to the new org — a clean round trip.

## Workflows work the same way

`GET /v1/workflows/:id/export` returns `{name, description, definition}`
just like Skills — `POST /v1/workflows` is the corresponding import.

## Troubleshooting: `PERMISSION_DENIED: skills:create`

If you hit this on an org's `admin` role, it means that org's role was
seeded before RT-075 fixed a real pre-existing gap: `skills:*` was missing
from the default admin permission set entirely (every role, including
admin, had zero Skills permissions out of the box). Fix an existing org
with:

```sh
curl -X PUT http://localhost:4000/v1/roles/<admin-role-id>/permissions \
  -H "Authorization: Bearer $TOKEN" -H "X-Organization-Id: $ORG" -H "Content-Type: application/json" \
  -d '{"permissions": [...existing permissions, "skills:*"]}'
```

Organizations created after this fix get `skills:*` by default and don't
need this step.
