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

export interface Workspace {
  readonly id: string;
  organizationId: string;
  name: string;
  description: string | null;
  settings: Record<string, unknown>;
  readonly createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

export interface User {
  readonly id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  settings: Record<string, unknown>;
  isActive: boolean;
  readonly createdAt: string;
}
