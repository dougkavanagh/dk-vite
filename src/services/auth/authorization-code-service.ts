import {
  AuthorizationCode,
  AuthorizationCodeModel,
} from "./authorization-code-model";
import { id } from "../core/core-model";
import { SiteCredentials } from "../site/site-credentials-service";
import { SessionContext } from "../session/session-model";

export type { AuthorizationCode };

export async function findAndRemoveById(
  id: AuthorizationCode["id"]
): Promise<AuthorizationCode | null> {
  return await AuthorizationCodeModel.findOneAndRemove({ id });
}

export async function createFromSiteCredentials(args: {
  credentials: SiteCredentials;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  scopes: string[];
}): Promise<AuthorizationCode> {
  const code: AuthorizationCode = {
    id: id(),
    siteId: args.credentials.siteId,
    expiresAt: expiresAt(),
    codeChallenge: args.codeChallenge,
    codeChallengeMethod: args.codeChallengeMethod,
    scopes: args.scopes,
    clientId: args.credentials.clientId,
  };
  return AuthorizationCodeModel.create(code);
}

export async function createFromSessionContext(args: {
  context: SessionContext;
  clientId: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  scopes: string[];
}): Promise<AuthorizationCode> {
  if (!args.context.user) {
    throw new Error("Missing session user");
  }
  if (!args.context.user.roles.admin) {
    throw new Error("User must be admin");
  }
  const code: AuthorizationCode = {
    id: id(),
    siteId: args.context.user.siteId,
    expiresAt: expiresAt(),
    codeChallenge: args.codeChallenge,
    codeChallengeMethod: args.codeChallengeMethod,
    scopes: args.scopes,
    clientId: args.clientId,
  };
  return AuthorizationCodeModel.create(code);
}
function expiresAt() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24);
}

export const AuthorizationCodeService = {
  createFromSiteCredentials,
  createFromSessionContext,
  findAndRemoveById,
};
