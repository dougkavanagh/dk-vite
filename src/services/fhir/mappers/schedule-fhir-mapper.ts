import { fhirR4 } from "@smile-cdr/fhirts";
import { Schedule } from "~/services/scheduling/schedule-model";

export function scheduleToFhir(model: Schedule): fhirR4.Schedule {
  return {
    resourceType: "Schedule",
    ...model,
    serviceCategory: model.serviceCategory ?? undefined,
    serviceType: model.serviceType ?? undefined,
    specialty: model.specialty ?? undefined,
    comment: model.comment ?? undefined,
  };
}
