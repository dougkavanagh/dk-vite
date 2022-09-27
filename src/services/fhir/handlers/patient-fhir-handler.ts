import { fhirR4 } from "@smile-cdr/fhirts";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { PatientService } from "~/services/patient/patient-service";
import { getContext, SessionContext } from "~/services/session/session-service";
import { validateResource } from "../fhir-utils";
import { patientFromFhir, patientToFhir } from "../mappers/patient-fhir-mapper";

const getHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const context = getContext(req);
  const patient = await loadPatient(context, req);
  if (!patient) {
    res.status(404).send("Patient not found");
    return;
  }
  const fhirPt = patientToFhir(patient);
  res.status(200).json(fhirPt);
};

const postHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const context = getContext(req);
  const fhirPatient = req.body as fhirR4.Patient;
  if (!validateResource(fhirPatient, "Patient", res)) {
    return;
  }
  const patient = patientFromFhir(fhirPatient);
  if (!patient.ids || !patient.ids.length) {
    res.status(400).send("Patient must have ids populated");
    return;
  }
  await PatientService.determineId(context, patient);
  if (
    !patient._id ||
    !(await PatientService.updateDemographics(context, patient))
  ) {
    res.status(404).send("Patient not found");
    return;
  }
  res.status(200);
};

async function loadPatient(context: SessionContext, req: Request) {
  if (req.params.id)
    return await PatientService.findById(context, req.params.id);
  if (req.params.identifier)
    return await PatientService.findByIdentifierValue(
      context,
      req.params.identifier
    );
}

function setup(router: Router) {
  router.get("/patient/:id", getHandler);
  router.get("/patient", getHandler);
  router.post("/patient", postHandler);
}

export const PatientFhirHandler = {
  setup,
};
