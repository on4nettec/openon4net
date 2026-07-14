export interface AgentRoleCatalogEntry {
  value: string;
  label: string;
  department?: string;
}

/**
 * Suggested roles matching the org-chart example in
 * docs/spect/00_VISION/04-digital-employee.md §2 — a picklist, not an
 * enum: `agents.role` stays a free VARCHAR (migrations/0002_agents.sql),
 * so a custom/"other" role name is always still valid.
 */
export const AGENT_ROLE_CATALOG: AgentRoleCatalogEntry[] = [
  { value: 'ceo', label: 'CEO', department: 'Executive' },
  { value: 'marketing', label: 'Marketing Manager', department: 'Marketing' },
  { value: 'sales', label: 'Sales Manager', department: 'Sales' },
  { value: 'support', label: 'Support', department: 'Support' },
  { value: 'hr', label: 'HR', department: 'HR' },
  { value: 'finance', label: 'Finance', department: 'Finance' },
  { value: 'legal', label: 'Legal', department: 'Legal' },
  { value: 'programmer', label: 'Programmer', department: 'Engineering' },
  { value: 'seo', label: 'SEO', department: 'Marketing' },
  { value: 'designer', label: 'Designer', department: 'Marketing' },
  { value: 'copywriter', label: 'Copywriter', department: 'Marketing' },
  { value: 'sdr', label: 'SDR', department: 'Sales' },
];
