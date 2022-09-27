import { fhirR4 } from "@smile-cdr/fhirts";
import { Practitioner } from "~/services/practitioner/practitioner-model";
import {
  genderInfoFromFhir,
  genderToFhir,
  nameFromFhir,
  nameToFhir,
} from "./core-fhir-mapper";

export function practitionerToFhir(model: Practitioner): fhirR4.Practitioner {
  return {
    resourceType: "Practitioner",
    ...model,
    name: model.name ? [nameToFhir(model.name)] : undefined,
    gender: genderToFhir(model.gender),
  };
}

export function practitionerFromFhir(fhir: fhirR4.Practitioner): Practitioner {
  return {
    ...fhir,
    name: fhir.name?.map(nameFromFhir).shift() ?? {
      given: [],
      family: "",
    },
    gender: genderInfoFromFhir(fhir.gender),
  };
}
