import { fhirR4 } from "@smile-cdr/fhirts";
import { UnknownCode } from "~/services/core/core-model";
import { Observation } from "~/services/patient/resource/observation-model";

export function observationToFhir(model: Observation): fhirR4.Observation {
  return {
    resourceType: "Observation",
    status:
      model.status in fhirR4.Observation.StatusEnum
        ? (model.status as fhirR4.Observation.StatusEnum)
        : fhirR4.Observation.StatusEnum.Unknown,
    code: {
      coding: [],
    },
    text: model.narrative
      ? {
          div: model.narrative,
        }
      : undefined,
  };
}
export function observationFromFhir(
  fhir: fhirR4.Observation
): Omit<Observation, "_id" | "ptId" | "siteIds"> {
  return {
    type: "Observation",
    date: fhir.effectiveDateTime ? new Date(fhir.effectiveDateTime) : undefined,
    code: fhir.code.coding?.shift() ?? UnknownCode,
    effectiveDateTime: fhir.effectiveDateTime
      ? new Date(fhir.effectiveDateTime)
      : null,
    status: fhir.status,
    valueQuantity: fhir.valueQuantity?.value,
    valueString: fhir.valueString,
    valueBoolean: fhir.valueBoolean,
    unit: fhir.valueQuantity?.unit,
    category: fhir.category?.shift()?.coding?.shift() ?? null,
    note:
      fhir.note?.map((annotation) => {
        return {
          text: annotation.text,
        };
      }) ?? null,
    performer: fhir.performer ?? null,
    referenceRange: fhir.referenceRange,
  };
}
