export const ROLES = {
  ARCHITECT: 'Architect',
  CLIENT: 'Client',
  ADMIN: 'Admin',
  DESIGNER: 'Designer',
  VIEWER: 'Viewer',
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export const STUDIO_ROLES: AppRole[] = [ROLES.ARCHITECT, ROLES.ADMIN, ROLES.DESIGNER];
export const CLIENT_ROLES: AppRole[] = [ROLES.CLIENT, ROLES.VIEWER];

export const ROLE_LABELS: Record<AppRole, string> = {
  [ROLES.ARCHITECT]: 'Architect',
  [ROLES.CLIENT]: 'Client',
  [ROLES.ADMIN]: 'Owner',
  [ROLES.DESIGNER]: 'Designer',
  [ROLES.VIEWER]: 'Viewer',
};

export const ROLE_HOME: Record<string, string> = {
  [ROLES.ARCHITECT]: '/dashboard',
  [ROLES.ADMIN]: '/dashboard',
  [ROLES.DESIGNER]: '/dashboard',
  [ROLES.CLIENT]: '/portal',
  [ROLES.VIEWER]: '/portal',
};

export function isStudioRole(role: string): boolean {
  if (role === 'User') return true;
  return STUDIO_ROLES.includes(role as AppRole);
}

export function isClientRole(role: string): boolean {
  return CLIENT_ROLES.includes(role as AppRole);
}

export function getHomeForRole(role: string): string {
  return ROLE_HOME[role] || '/dashboard';
}

// 🔥 Policy-based UI Definitions
export const POLICIES = {
  // Can access full workspace analytics and management
  ADMIN_ACCESS: [ROLES.ADMIN],

  // Can create/edit/delete projects and assets
  STUDIO_ACCESS: [ROLES.ADMIN, ROLES.ARCHITECT, ROLES.DESIGNER],

  // Can only view and comment
  VIEWER_ACCESS: [ROLES.CLIENT, ROLES.VIEWER],

  // High-level financial/subscription management
  OWNER_ONLY: [ROLES.ADMIN],
} as const;

export type AppPolicy = keyof typeof POLICIES;
