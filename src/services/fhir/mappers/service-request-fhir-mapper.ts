import { fhirR4 } from "@smile-cdr/fhirts";
import { ServiceRequest } from "~/services/patient/resource/service-request-model";

export function serviceRequestToFhir(
  model: ServiceRequest
): fhirR4.ServiceRequest {
  return {
    resourceType: "ServiceRequest",
    subject: {
      reference: "Patient/" + model.ptId,
    },
  };
}
