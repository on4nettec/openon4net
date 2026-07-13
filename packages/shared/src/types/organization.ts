export type OrganizationPlan = 'starter' | 'team' | 'business' | 'enterprise';
export type OrganizationStatus = 'active' | 'suspended' | 'canceled';

export interface Organization {
  readonly id: string;
  name: string;
  slug: string;
  plan: OrganizationPlan;
  status: OrganizationStatus;
  settings: Record<string, unknown>;
  readonly createdAt: string;
  updatedAt: string;
}

export type WorkspaceStatus = 'active' | 'archived';

export interface Workspace {
  readonly id: string;
  organizationId: string;
  name: string;
  description: string | null;
  status: WorkspaceStatus;
  settings: Record<string, unknown>;
  readonly createdAt: string;
  updatedAt: string;
}

/** The 4 seeded system roles (used only for DEFAULT_ROLE_PERMISSIONS' seed map, see packages/governance/src/permissions.ts). */
export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

export interface User {
  readonly id: string;
  email: string;
  name: string;
  /**
   * A role NAME, not restricted to UserRole — org admins can create custom
   * roles (see routes/roles.ts) and assign them to users. `users.role` is a
   * plain VARCHAR at the DB level; permission resolution goes entirely
   * through user_role_bindings -> role_permissions (services/permission-
   * service.ts), never through this field directly, except a few
   * `role === 'admin'` bypass checks that only ever need an exact match.
   */
  role: string;
  organizationId: string;
  settings: Record<string, unknown>;
  isActive: boolean;
  readonly createdAt: string;
}
