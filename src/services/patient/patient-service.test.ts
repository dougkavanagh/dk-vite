import { connect, createTestContext } from "~/test/db-mock";
import {
  PatientService,
  PatientChart,
} from "~/services/patient/patient-service";
import { beforeAll, describe, it, expect } from "vitest";
beforeAll(async () => {
  await connect();
  PatientService.init();
});

describe("insert", () => {
  it("creates a patient", async () => {
    const context = createTestContext();
    const mock = PatientChart({
      patient: PatientService.newPatient({
        name: [{ given: ["Doug"], family: "Doe" }],
      }),
    });
    mock.setHn("123456789", "ON");
    await PatientService.create(context, mock.patient);
    const hn = mock.getHn();
    if (!hn || !hn.value) {
      throw new Error("hn not set");
    }
    const inserted = await PatientService.findByHn(context, hn.value);
    expect(inserted).toBeTruthy();
    expect(inserted?.name[0].family).toEqual("Doe");
  });
});
