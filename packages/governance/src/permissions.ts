import type { UserRole } from '@o2n/shared';

/**
 * Seed data only: what each of the 4 system roles is granted when a new
 * organization is bootstrapped (see gateway/src/services/org-service.ts) —
 * copied into the DB's `role_permissions` table (migrations/0007_rbac.sql),
 * which is the actual runtime source of truth as of that migration. Roles
 * are per-organization and editable from `PUT /v1/roles/:id/permissions`
 * (see gateway/src/routes/roles.ts), so a live org's permissions can now
 * diverge from these defaults — don't assume this map reflects current
 * behavior for an existing org. The richer org_admin/workspace_admin/…
 * role set from 02_ARCHITECTURE/10-rbac-and-policy.md is still not
 * implemented; its ABAC "Policy Layer" (§6) has a minimal cost/time-window
 * subset as of RT-008 (see gateway/src/services/policy-service.ts).
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'agents:*',
    'memory:*',
    'audit:read',
    'approvals:*',
    'billing:wallet:read',
    'tools:*',
    'config:write',
    'roles:read',
    'roles:write',
    'users:read',
    'users:write',
    'workspaces:read',
    'workspaces:write',
    'policies:read',
    'policies:write',
    'organization:read',
    'organization:write',
    'invitations:create',
    'invitations:read',
    'invitations:revoke',
    'billing:wallet:credit',
    'workflows:create',
    'workflows:read',
    'workflows:update',
    'workflows:run',
    // marketplace:read/install were missing from this seed entirely despite
    // routes/marketplace.ts requiring them since RT-035 — a pre-existing gap
    // (fresh orgs' admin role could never actually browse/install), fixed
    // here alongside adding marketplace:publish for the new publisher
    // dashboard (MKT-022).
    'marketplace:read',
    'marketplace:install',
    'marketplace:publish',
    // skills:* was missing from this seed entirely, for this role's whole
    // history — routes/skills.ts has required skills:create/read/update/
    // delete/grant/execute since RT-026, but no default role (not even
    // admin) was ever granted any of them, so a fresh org's Skills feature
    // was unusable via the API out of the box. Found while writing the
    // export/import tutorial (RT-075) and manually hitting POST /v1/skills
    // with a brand-new org's admin session — same class of gap as the
    // marketplace:read/install fix above.
    'skills:*',
  ],
  manager: [
    'agents:create',
    'agents:read',
    'agents:update',
    'agents:chat',
    'memory:read',
    'memory:write',
    'approvals:read',
    'approvals:approve',
    'tools:read',
    'tools:telegram-send',
    'tools:webhook-send',
    'roles:read',
    // manager can create agents, so it needs to see workspaces to pick one -
    // not workspaces:write, creating a workspace stays admin-only.
    'workspaces:read',
  ],
  editor: [
    'agents:read',
    'agents:update',
    'agents:chat',
    'memory:read',
    'memory:write',
    'tools:read',
    'tools:telegram-send',
    'tools:webhook-send',
  ],
  // viewer is deliberately read-only: it can inspect agents/memory/audit but
  // cannot chat (spends budget), approve/reject, or execute tools.
  viewer: ['agents:read', 'memory:read', 'audit:read', 'tools:read'],
};

/** Pure wildcard-aware check against an already-resolved permission list (from DB — see gateway/src/services/permission-service.ts). */
export function hasPermission(granted: string[], permission: string): boolean {
  const [resource] = permission.split(':');
  return granted.includes(permission) || granted.includes(`${resource}:*`);
}
