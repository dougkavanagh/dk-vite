import { fhirR4 } from "@smile-cdr/fhirts";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { PatientService } from "~/services/patient/patient-service";
import { PtResourceService } from "~/services/patient/pt-resource-service";
import { ensureSiteId, getContext } from "~/services/session/session-service";
import { idFromFhir } from "../mappers/core-fhir-mapper";
import { Router } from "express";
import {
  observationFromFhir,
  observationToFhir,
} from "../mappers/observation-fhir-mapper";
import { Observation } from "~/services/patient/resource/observation-model";

const getHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const context = getContext(req);
  const record: Observation = (await PtResourceService.findById(
    context,
    req.params.id
  )) as Observation;
  if (!record) {
    res.status(404).send("Not found");
    return;
  }
  const fhirObject = observationToFhir(record);
  res.status(200).json(fhirObject);
};

const postHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const context = getContext(req);
  const fhirObservation = req.body as fhirR4.Observation;
  if (fhirObservation.resourceType !== "Observation") {
    res.status(400).send("Resource type must be Observation");
    return;
  }
  const observation = observationFromFhir(fhirObservation);
  if (!fhirObservation.subject?.identifier) {
    res.status(400).send("Observation needs a patient subject identifier");
    return;
  }
  const subjectId = idFromFhir(fhirObservation.subject.identifier);
  const pt = await PatientService.findByIdentifier(context, subjectId);
  if (!pt) {
    res.status(400).send("Patient not found");
    return;
  }
  PtResourceService.insert(context, {
    ...observation,
    ptId: pt._id,
    siteIds: [ensureSiteId(context)],
  });
  res.status(200);
};

function setup(router: Router) {
  router.get("/observation/:id", getHandler);
  router.post("/patient", postHandler);
}

export const ObservationFhirHandler = {
  setup,
};
