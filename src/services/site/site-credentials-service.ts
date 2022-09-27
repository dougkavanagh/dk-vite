import {
  SiteCredentials,
  SiteCredentialsModel,
} from "./site-credentials-model";
import { decrypt, encrypt } from "~/services/core/encryption";
import { id } from "~/services/core/core-model";

export type { SiteCredentials };

export async function findBySite(siteId: SiteCredentials["siteId"]) {
  return await SiteCredentialsModel.find({ siteId });
}
export async function findByClientId(clientId: SiteCredentials["clientId"]) {
  return await SiteCredentialsModel.findOne({ clientId });
}

export async function validate(
  clientId: SiteCredentials["clientId"],
  clientSecret: string
): Promise<SiteCredentials | null> {
  const existingCreds = await SiteCredentialsModel.findOne({ clientId });
  const decryptedExistingSecret = existingCreds
    ? await decrypt(existingCreds?.clientSecretEncrypted)
    : null;
  if (decryptedExistingSecret && decryptedExistingSecret === clientSecret) {
    return existingCreds;
  }
  return null;
}

export async function create(
  credentials: Omit<SiteCredentials, "clientId">
): Promise<SiteCredentials> {
  return SiteCredentialsModel.create({
    clientId: id(),
    ...credentials,
  });
}

export async function remove(
  clientId: SiteCredentials["clientId"]
): Promise<boolean> {
  return (await SiteCredentialsModel.deleteOne({ clientId })).deletedCount > 0;
}

export const SiteCredentialsService = {
  init: async function (): Promise<void> {
    await SiteCredentialsModel.syncIndexes();
  },
  findBySite,
  findByClientId,
  validate,
  create,
  remove,
};
