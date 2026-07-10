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
 * role set from 02_ARCHITECTURE/10-rbac-and-policy.md, and its separate
 * ABAC "Policy Layer" (§6), are still not implemented.
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
    'roles:read',
  ],
  editor: [
    'agents:read',
    'agents:update',
    'agents:chat',
    'memory:read',
    'memory:write',
    'tools:read',
    'tools:telegram-send',
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
