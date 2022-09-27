import { connect, createTestContext, TEST_SITE } from "~/test/db-mock";
import {
  ServiceRequestModel,
  newServiceRequest,
  ServiceRequestStatus,
  ServiceRequest,
} from "./service-request-model";
import { PtResourceService } from "~/services/patient/pt-resource-service";
import { beforeAll, describe, it, expect } from "vitest";

beforeAll(async () => {
  await connect();
});

describe("insert", () => {
  it("inserts", async () => {
    const context = createTestContext();
    const mock = newServiceRequest({
      status: ServiceRequestStatus.sent,
      ptId: "123",
      date: new Date(),
      siteIds: [TEST_SITE],
      sourceId: "12345",
    });
    await ServiceRequestModel.create(mock);
    const inserted = (await PtResourceService.findById(
      context,
      mock._id
    )) as ServiceRequest;
    expect(inserted?.status).toEqual(ServiceRequestStatus.sent);
    const patientResources = await PtResourceService.findByPatientId(mock.ptId);
    expect(patientResources.map((r) => r._id)).toEqual([mock._id]);
  });
});
