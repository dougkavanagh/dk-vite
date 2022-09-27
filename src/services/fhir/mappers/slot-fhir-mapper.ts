import { fhirR4 } from "@smile-cdr/fhirts";
import { Slot } from "~/services/scheduling/slot-model";

export function slotToFhir(model: Slot): fhirR4.Slot {
  return {
    resourceType: "Slot",
    ...model,
    serviceCategory: model.serviceCategory ?? undefined,
    serviceType: model.serviceType ?? undefined,
    specialty: model.specialty ?? undefined,
    start: model.start?.toString() ?? undefined,
    end: model.end?.toString() ?? undefined,
    schedule: { reference: "Schedule/" + model.scheduleId?.toString() ?? "" },
  };
}
