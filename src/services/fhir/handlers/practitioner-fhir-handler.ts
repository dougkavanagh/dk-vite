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
import { bundle } from "../fhir-utils";

const getHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const context = getContext(req);
  if (req.query.active) {
    const result: Practitioner[] = await PractitionerService.findBySite(
      context,
      ensureSiteId(context)
    );
    const fhirObject: fhirR4.Practitioner[] = result.map(practitionerToFhir);
    res.status(200).json(bundle(fhirObject));
  } else if (req.query.id) {
    const result: Practitioner | null = await PractitionerService.findById(
      context,
      req.params.id
    );
    if (!result) {
      res.status(404);
      return;
    }
    const fhirObject: fhirR4.Practitioner = practitionerToFhir(result);
    res.status(200).json(fhirObject);
  }
};

function setup(router: Router) {
  router.get("/Practitioner", getHandler);
  router.get("/Practitioner/:id", getHandler);
}

export const PractitionerFhirHandler = {
  setup,
};
