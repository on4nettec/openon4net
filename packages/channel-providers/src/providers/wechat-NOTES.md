# WeChat (RT-144) — deferred

Not implemented in this package. Two blockers make a guessed-at implementation
unverifiable and likely wrong:

1. **Inbound**: WeChat Official Account webhooks deliver signed XML bodies
   (`msg_signature`, `timestamp`, `nonce` query params plus an XML payload),
   verified with a per-account token set in the WeChat admin console. This is a
   different verification/parsing shape from every other provider in this
   package, which all consume JSON.
2. **Outbound**: Sending requires a periodically-refreshed `access_token`
   (expires ~2h, must be cached and refreshed) exchanged via `appid`/`secret`,
   plus resolving a user's `openid` — neither of which this package's
   `ChannelProvider` interface (`sendMessage(externalSenderId, text)`) or the
   Runtime's existing config/relay plumbing has a home for yet.

Revisit once there's a real WeChat Official Account to test against, or once
the access-token refresh/caching concern has an owner elsewhere in the
Runtime (e.g. `providerConfigService`).
