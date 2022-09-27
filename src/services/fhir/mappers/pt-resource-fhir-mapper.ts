import { fhirR4 } from "@smile-cdr/fhirts";
import { PtResource } from "~/services/patient/pt-resource-model";
import { DocumentReference } from "~/services/patient/resource/document-reference-model";
import { Observation } from "../../patient/resource/observation-model";
import { ServiceRequest } from "../../patient/resource/service-request-model";
import { documentReferenceToFhir } from "./document-reference-fhir-mapper";
import { observationToFhir } from "./observation-fhir-mapper";
import { serviceRequestToFhir } from "./service-request-fhir-mapper";

export function ptResourceToFhir(model: PtResource): fhirR4.Resource | null {
  switch (model.type) {
    case "Observation":
      return observationToFhir(model as Observation);
    case "ServiceRequest":
      return serviceRequestToFhir(model as ServiceRequest);
    case "Note":
      return documentReferenceToFhir(model as DocumentReference);
  }
  return null;
}
