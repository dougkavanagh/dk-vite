import { connect } from "~/test/db-mock";
import { SiteCredentialsService } from "~/services/site/site-credentials-service";
import { beforeAll, describe, it, expect } from "vitest";
import { agent } from "supertest";
// https://www.npmjs.com/package/supertest

import app from "./fhir-app";

beforeAll(async () => {
  await connect();
  SiteCredentialsService.init();
});

describe("FHIR CapabilityStatement", () => {
  it("responds with FHIR json", async function (done) {
    const response = await agent(app)
      .get("/api/fhir/CapabilityStatement")
      // .auth("username", "password")
      .set("Accept", "application/fhir+json");
    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toEqual(
      "application/fhir+json; charset=utf-8"
    );
  });
});
