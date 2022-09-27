import { fhirR4 } from "@smile-cdr/fhirts";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import {
  Practitioner,
  PractitionerService,
} from "~/services/practitioner/practitioner-service";
import { getContext } from "~/services/session/session-service";
import { practitionerToFhir } from "../mappers/practitioner-fhir-mapper";
import { ensureSiteId } from "../../session/session-service";

const getHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const context = getContext(req);
  const result: Practitioner[] = await PractitionerService.findBySite(
    context,
    ensureSiteId(context)
  );
  const fhirObject: fhirR4.Practitioner[] = result.map(practitionerToFhir);
  res.status(200).json(fhirObject);
};

function setup(router: Router) {
  router.get("/Practitioner", getHandler);
}

export const PractitionerFhirHandler = {
  setup,
};
