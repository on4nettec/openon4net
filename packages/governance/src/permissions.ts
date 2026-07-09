import type { UserRole } from '@o2n/shared';

/**
 * Hardcoded role -> permission map for Sprint 0. No `roles`/`policies` DB
 * tables exist yet (see docs/spect/09_TASKS/00-claude-build-pack.md §5 —
 * "Auth: در MVP می‌تواند ساده باشد"). Keyed on `users.role` as actually
 * defined in docs/spect/03_DATABASE/01-schema-master.md §2.1
 * (admin/manager/editor/viewer), not the richer org_admin/workspace_admin/…
 * set from 02_ARCHITECTURE/10-rbac-and-policy.md — that full model has no
 * backing table in Sprint 0's migrations and is a later-sprint upgrade.
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['agents:*', 'memory:*', 'audit:read', 'approvals:*', 'billing:wallet:read', 'tools:*'],
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

export function hasPermission(role: UserRole, permission: string): boolean {
  const granted = ROLE_PERMISSIONS[role] ?? [];
  const [resource] = permission.split(':');
  return granted.includes(permission) || granted.includes(`${resource}:*`);
}
