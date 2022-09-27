import { connect } from "~/test/db-mock";
import { Site, SiteService } from "./site-service";
import { beforeAll, describe, it, expect } from "vitest";

beforeAll(async () => {
  await connect();
  SiteService.init();
});

describe("insert", () => {
  it("creates a site", async () => {
    const mock: Site = {
      siteId: "1234",
      location: {
        status: "active",
        name: "My Site",
        contact: [],
        address: {
          line: ["40 Applewood"],
          city: "Cambridge",
          province: "ON",
          country: "CAN",
          postalCode: "N1S 4K5",
        },
      },
    };
    const created = await SiteService.create(mock);
    const loaded = await SiteService.findById(created.siteId);
    expect(loaded?.siteId).toEqual(mock.siteId);
  });
});
