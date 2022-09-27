import { Schema, model } from "mongoose";
import { SiteBound } from "~/services/core/core-model";
export interface AuthorizationCode extends SiteBound {
  id: string;
  clientId: string;
  siteId: string;
  scopes: string[];
  codeChallenge?: string | null;
  codeChallengeMethod?: string | null;
  expiresAt: Date;
}

const schema = new Schema<AuthorizationCode>({
  id: { type: String, required: true },
  clientId: { type: String, required: false },
  codeChallenge: { type: String, required: false },
  codeChallengeMethod: { type: String, required: false },
  scopes: [{ type: String, required: true }],
  expiresAt: { type: Date, required: true },
});
schema.index({ id: 1 }, { unique: true });
export const AuthorizationCodeModel = model<AuthorizationCode>(
  "AuthorizationCode",
  schema
);
