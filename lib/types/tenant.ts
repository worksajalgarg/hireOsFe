export enum UserRole {
  Recruiter = "recruiter",
  HiringManager = "hiring_manager",
  Admin = "admin",
  Auditor = "auditor",
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  logoUrl?: string | null;
  settingsJson?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  jobTitle?: string | null;
  preferencesJson?: Record<string, unknown>;
}

export interface User {
  id: string;
  email: string;
  status: string;
  isMfaEnabled: boolean;
  createdAt: string;
  tenantId?: string;
  roleName?: string;
  roleId?: string;
  permissions?: string[];
  profile?: UserProfile | null;
  tenant?: Tenant;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: "Bearer";
  user: User;
  tenant: Tenant;
}

export interface WorkspaceSettings {
  tenant: Tenant;
  policy: {
    id: string;
    tenantId: string;
    retentionDays: number;
    audioStorageEnabled: boolean;
    humanOverrideRequired: boolean;
    updatedAt: string;
  };
}

export interface TeamMember {
  userId: string;
  email: string;
  status: string;
  roleId: string;
  roleName: string;
  firstName?: string | null;
  lastName?: string | null;
  joinedAt: string;
}

export interface RolesMatrix {
  permissions: Array<{ id: string; slug: string; module: string; description: string }>;
  roles: Array<{
    id: string;
    name: string;
    description?: string | null;
    isSystemRole: boolean;
    permissions: string[];
  }>;
}
