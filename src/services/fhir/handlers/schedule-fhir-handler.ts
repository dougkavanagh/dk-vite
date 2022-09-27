import { fhirR4 } from "@smile-cdr/fhirts";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { Schedule } from "~/services/scheduling/schedule-model";
import { getContext } from "~/services/session/session-service";
import { ScheduleService } from "../../scheduling/schedule-service";
import { scheduleToFhir } from "../mappers/schedule-fhir-mapper";
import { ensureSiteId } from "../../session/session-service";

const getHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const context = getContext(req);
  const result: Schedule[] = await ScheduleService.findBySite(
    context,
    ensureSiteId(context)
  );
  const fhirObject: fhirR4.Schedule[] = result.map(scheduleToFhir);
  res.status(200).json(fhirObject);
};

function setup(router: Router) {
  router.get("/Schedule", getHandler);
}

export const ScheduleFhirHandler = {
  setup,
};
