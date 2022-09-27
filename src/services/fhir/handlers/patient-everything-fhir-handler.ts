import { NextFunction, Request, RequestHandler, Response } from "express";
import { PatientService } from "~/services/patient/patient-service";
import { PtResource, PtResourceService } from "~/services/patient/pt-resource-service";
import { getContext, SessionContext } from "~/services/session/session-service";
import { patientToFhir } from "../mappers/patient-fhir-mapper";
import { Router } from "express";
import { fhirR4 } from "@smile-cdr/fhirts";
import { ptResourceToFhir } from "../mappers/pt-resource-fhir-mapper";
import { careTeamToFhir } from "../mappers/care-team-fhir-mapper";
import { AppointmentService } from "~/services/scheduling/appointment-service";
import { appointmentToFhir } from "../mappers/appointment-fhir-mapper";

const getHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const context = getContext(req);
  const patientId = req.params.id;
  const resourceTypesToInclude = req.params._type
    ?.split(",")
    .map((t) => t.trim().toLowerCase());

  const patient = await PatientService.findById(context, patientId);
  if (!patient) {
    res.status(404).send("Patient not found");
    return;
  }
  const fhirPt = patientToFhir(patient);
  const fhirCareTeam = patient.careTeam
    ? careTeamToFhir(patient.careTeam)
    : null;
  const ptResourcesInDb = await PtResourceService.findByPatientId(
    context,
    patientId
  );
  const fhirPtResources = mapToFhirResources(
    ptResourcesInDb,
    fhirPt,
    fhirCareTeam,
    resourceTypesToInclude
  );
  await includeAppointmentsIfRequested(
    resourceTypesToInclude,
    fhirPtResources,
    context,
    patientId
  );
  const bundle: fhirR4.Bundle = {
    resourceType: "Bundle",
    entry: [fhirPt, ...fhirPtResources].map((resource) => {
      return {
        resource,
      };
    }),
  };
  res.status(200).json(bundle);
};

function mapToFhirResources(
  ptResourcesInDb: PtResource[],
  fhirPt: fhirR4.Patient,
  fhirCareTeam: fhirR4.CareTeam | null,
  resourceTypesToInclude: string[]
) {
  return ptResourcesInDb
    .map(ptResourceToFhir)
    .concat(fhirPt, fhirCareTeam)
    .filter((resource) => {
      return (
        resource &&
        (!resourceTypesToInclude ||
          (resource.resourceType &&
            resourceTypesToInclude.includes(
              resource.resourceType.toLowerCase()
            )))
      );
    }) as fhirR4.Resource[];
}

async function includeAppointmentsIfRequested(
  resourceTypesToInclude: string[],
  fhirPtResources: fhirR4.Resource[],
  context: SessionContext,
  patientId: string
) {
  if (
    !resourceTypesToInclude ||
    resourceTypesToInclude.includes("appointment")
  ) {
    fhirPtResources.push(
      ...(await AppointmentService.findByPatientId({ context, patientId })).map(
        appointmentToFhir
      )
    );
  }
}

function setup(router: Router) {
  router.get("/Patient/:id/$everything", getHandler);
}

export const PatientEverythingFhirHandler = {
  setup,
};
