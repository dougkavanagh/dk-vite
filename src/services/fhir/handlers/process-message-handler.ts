import { fhirR4, IfhirR4 } from "@smile-cdr/fhirts";
import { Request, RequestHandler, Response, Router } from "express";
import { getContext } from "~/services/session/session-service";
import { validateResource } from "../fhir-utils";

const postHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const context = getContext(req);
  const message = req.body as IfhirR4.IBundle;
  if (!validateResource(message, "Bundle", res)) {
    return;
  }
  const header = message.entry?.find((entry) => {
    return entry.resource?.resourceType === "MessageHeader";
  }) as fhirR4.MessageHeader;
  if (!header) {
    res.status(400).send("MessageHeader not found");
    return;
  }
  switch (header.eventCoding?.code) {
    // https://simplifier.net/eReferral-Ontario/MessageHeader-example/~json
    // https://simplifier.net/guide/eReferral-Ontario/BusinessRules?version=current
    // https://ocean.cognisantmd.com/public/fhirApiDocs.html#tag/Incoming-Message-Payloads
    case "add-service-request":
    case "notify-add-service-request":
      //addServiceRequest((ServiceRequest) messageFocus);
      break;
    case "update-service-request":
    case "notify-update-service-requests":
    case "notify-update-service-request":
      //updateServiceRequest((ServiceRequest) messageFocus);
      break;
    case "revoke-service-request":
    case "notify-revoke-service-request":
      //updateServiceRequest((ServiceRequest) messageFocus);
      break;
    case "add-appointment":
    case "notify-add-appointment":
      //addServiceRequestAppointment((Appointment) messageFocus, header);
      break;
    case "update-appointment":
    case "notify-update-appointment":
      //updateServiceRequestAppointment((Appointment) messageFocus, header);
      break;
    case "notify-update-status":
      //updateServiceRequestStatus((Task) messageFocus, header);
      break;
    case "send-communication-from-provider":
      //addMessageToReferral((Communication) messageFocus, header);
      break;
    case "send-communication-to-provider":
      //addMessageToReferral((Communication) messageFocus, header);
      break;
    case "update-patient-data":
      //syncPatient((Patient) messageFocus, header);
      break;
  }
};

function setup(router: Router) {
  router.get("/$process-message", postHandler);
}

export const PractitionerFhirHandler = {
  setup,
};
