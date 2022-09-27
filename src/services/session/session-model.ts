// SessionUsers can either be database-stored users or credentialed access (eg OAuth2 site credentials)
export interface SessionUser {
  userId?: string;
  clientId?: string;
  email?: string;
  profile: {
    displayName: string;
  };
  roles: {
    admin: boolean;
  };
  siteId: string;
  accessibleSiteIds: string[];
}
export interface SessionContext {
  user?: SessionUser | null;
}
export const emptySession = () => ({});

declare module "express" {
  // this extends the standard Request type with our own SessionContext:
  interface Request {
    context?: SessionContext;
  }
}
