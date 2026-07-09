/**
 * First-party, in-process tools only (Level 0 sandbox per
 * docs/spect/02_ARCHITECTURE/09-plugin-sandbox.md). Not the full Plugin/
 * Connector/Marketplace model from 07-connectors-and-tools.md — no manifest,
 * no OAuth, no per-org credential storage. That's a later-sprint upgrade.
 */
export interface ToolDefinition {
  readonly id: string;
  name: string;
  description: string;
  requiredPermission: string;
}
