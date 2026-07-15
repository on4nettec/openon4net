# Tutorial: Ask a natural-language question about your data

## What actually happens

Your question is **never** turned into SQL. It goes through two constrained
LLM calls:

1. The question is translated into **one fixed, Zod-validated intent**:
   `{metric: 'action_count' | 'cost_cents' | 'success_rate', agentId: string | null, windowDays: number}`.
   Anything the LLM returns that doesn't match this exact shape is rejected
   outright — there is no path from "user's question" to "arbitrary query."
2. The matching safe aggregate runs against `audit_logs` (the same
   functions the KPI dashboard uses).
3. A second LLM call turns the number back into a one-sentence answer.

## Ask a question

```sh
curl -X POST http://localhost:4000/v1/insights/ask \
  -H "Authorization: Bearer $TOKEN" -H "X-Organization-Id: $ORG" -H "Content-Type: application/json" \
  -d '{"question":"How many actions have we taken in the last 7 days?"}'
```

This is a real captured response (not a mock) — with 11 audit-log rows in
the last 7 days for this org, and BYOK LLM config pointed at a real
provider:

```json
{
  "answer": "Eleven.",
  "intent": { "metric": "action_count", "agentId": null, "windowDays": 7 },
  "value": 11
}
```

The `intent` field is returned alongside the answer specifically so a UI
(or you, reading the raw response) can see _what was actually queried_ —
trust/debuggability, not just a black-box answer.

## Asking about one specific agent

If your question names an agent by something the LLM can match to an
actual agent id in your org, `intent.agentId` will be set instead of
`null`, and the aggregate is scoped to just that agent
(`kpi-computation-service.ts`'s `computeMetric`, vs. `computeOrgMetric` for
the org-wide case above). The route itself rejects any `agentId` the LLM
returns that doesn't belong to your organization — a hallucinated or
cross-org id is a hard error, not silently ignored.

## What this doesn't do

- No arbitrary metrics — only `action_count`, `cost_cents`, and
  `success_rate` exist as answerable questions in v1. "What's our churn
  rate?" will fail to translate into a valid intent and return an error,
  not a made-up number.
- No multi-turn conversation — every question is answered fresh, with no
  memory of previous questions in the same session.
- Needs a configured LLM provider (BYOK) — this uses the same
  `packages/llm-providers` connection as chat, not a separate service.
