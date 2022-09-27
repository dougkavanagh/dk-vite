import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { getContext } from "~/services/session/session-service";
import { valueSetToFhir } from "../mappers/value-set-fhir-mapper";
import { ensureSiteId } from "../../session/session-service";
import { SessionContext } from "../../session/session-model";
import { SchedulingService } from "~/services/scheduling/scheduling-service";
import { AppointmentStatus } from "~/services/scheduling/appointment-model";

const getHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const context = getContext(req);
  const vsName = req.path.split("/").pop();
  if (!vsName) {
    res.status(400).json({
      message: "ValueSet name must be specified in path",
    });
    return;
  }
  const valueSet = await loadValueSet(vsName, context);
  if (valueSet) {
    res.status(200).json(valueSet);
  } else {
    res.status(404).json({
      message: "Value set not found",
    });
  }
};

async function loadValueSet(vsName: string, context: SessionContext) {
  if (vsName === "appointment-type") {
    return loadAppointmentTypes(vsName, context);
  } else if (vsName === "schedule-reason") {
    return loadScheduleReasons(vsName, context);
  } else if (vsName === "schedule-code") {
    return loadScheduleCodes(vsName, context);
  } else if (vsName === "appointment-status") {
    return loadAppointmentStatuses(vsName, context);
  }
}

async function loadAppointmentStatuses(name: string, context: SessionContext) {
  return valueSetToFhir({
    name,
    title: "Appointment Status",
    items: Object.entries(AppointmentStatus).map((entry) => {
      return {
        value: entry[0],
        text: entry[1],
      };
    }),
  });
}

async function loadScheduleCodes(name: string, context: SessionContext) {
  return valueSetToFhir({
    name,
    title: "Schedule Code",
    items: await SchedulingService.findSlotSuggestionsBySite(
      context,
      ensureSiteId(context)
    ),
  });
}

async function loadScheduleReasons(name: string, context: SessionContext) {
  return valueSetToFhir({
    name,
    title: "Appointment Reason",
    items: await SchedulingService.findAppointmentReasonsBySite(
      context,
      ensureSiteId(context)
    ),
  });
}

async function loadAppointmentTypes(name: string, context: SessionContext) {
  return valueSetToFhir({
    name,
    title: "Appointment Type",
    items: await SchedulingService.findAppointmentTypesBySite(
      context,
      ensureSiteId(context)
    ),
  });
}

function setup(router: Router) {
  router.get("/ValueSet/*", getHandler);
}

export const ValueSetFhirHandler = {
  setup,
};
