import { connect } from "~/test/db-mock";
import { SiteCredentialsService } from "./site-credentials-service";
import { beforeAll, describe, it, expect } from "vitest";

beforeAll(async () => {
  await connect();
  SiteCredentialsService.init();
});

describe("insert", () => {
  it("creates one", async () => {
    const mock = await SiteCredentialsService.create({
      siteId: "123",
      clientSecretEncrypted: "test_clientSecretEncrypted",
      creationUser: "test",
      name: "test credentials",
      failedAttempts: 0,
    });
    const atSite = await SiteCredentialsService.findBySite(mock.siteId);
    expect(atSite.length).toBe(1);
    const inserted = await SiteCredentialsService.findByClientId(mock.clientId);
    expect(inserted?.clientId).toEqual(mock.clientId);
    await SiteCredentialsService.remove(mock.clientId);
    expect((await SiteCredentialsService.findBySite(mock.siteId)).length).toBe(
      0
    );
  });
});
