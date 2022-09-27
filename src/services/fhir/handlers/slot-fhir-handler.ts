import { fhirR4 } from "@smile-cdr/fhirts";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { Slot } from "~/services/scheduling/slot-model";
import { getContext } from "~/services/session/session-service";
import { ScheduleService } from "../../scheduling/schedule-service";
import { parseEndDateParam, parseStartDateParam } from "../fhir-utils";
import { slotToFhir } from "../mappers/slot-fhir-mapper";

const getHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const context = getContext(req);
  const scheduleId = req.query.schedule?.toString() ?? "";
  const start = parseStartDateParam(req.query.start?.toString() ?? "");
  if (isNaN(start.getTime())) {
    res.status(400).send("Invalid start date");
    return;
  }
  const end = parseEndDateParam(req.query.end?.toString() ?? "");
  if (isNaN(start.getTime())) {
    res.status(400).send("Invalid end date");
    return;
  }

  const result: Slot[] = await ScheduleService.findSlots(
    context,
    scheduleId,
    start,
    end
  );
  const fhirObject: fhirR4.Slot[] = result.map(slotToFhir);
  res.status(200).json(fhirObject);
};

function setup(router: Router) {
  router.get("/slot", getHandler);
}

export const ScheduleFhirHandler = {
  setup,
};
