import { Schema, model } from "mongoose";
import { SiteBound } from "~/services/core/core-model";
export interface SiteCredentials extends SiteBound {
  clientId: string;
  clientSecretEncrypted: string;
  creationUser: string;
  name: string;
  failedAttempts: number;
}

const schema = new Schema<SiteCredentials>({
  siteId: { type: String, required: true },
  clientId: { type: String, required: true },
  clientSecretEncrypted: { type: String, required: true },
  creationUser: { type: String, required: true },
  name: { type: String, required: true },
  failedAttempts: { type: Number, required: true, default: 0 },
});
schema.index({ siteId: 1 }, { unique: true });
schema.index({ clientId: 1 }, { unique: true });
export const SiteCredentialsModel = model<SiteCredentials>(
  "SiteCredentials",
  schema
);
