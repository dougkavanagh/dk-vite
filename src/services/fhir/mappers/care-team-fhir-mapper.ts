import { fhirR4 } from "@smile-cdr/fhirts";
import { CareTeam } from "~/services/patient/patient-model";

export function careTeamToFhir(model: CareTeam): fhirR4.CareTeam {
  return {
    resourceType: "CareTeam",
    ...model,
  };
}
