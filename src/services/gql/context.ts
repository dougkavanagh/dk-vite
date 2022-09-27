import { SessionContext, SessionUser } from "../session/session-model";

export interface Context extends SessionContext {
  user: SessionUser | null;
  // ~/functions/gql/gql.ts -> setSessionCookie:
  setSessionUser: (user: SessionUser | null) => void;
  ensureSiteId: () => string;
}
