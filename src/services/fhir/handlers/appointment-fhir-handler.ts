import { fhirR4 } from "@smile-cdr/fhirts";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { UpdateResult } from "mongodb";
import { Appointment } from "~/services/scheduling/appointment-model";
import { AppointmentService } from "~/services/scheduling/appointment-service";
import { ScheduleService } from "~/services/scheduling/schedule-service";
import { getContext } from "~/services/session/session-service";
import {
  parseEndDateParam,
  parseStartDateParam,
  validateResource,
} from "../fhir-utils";
import {
  appointmentFromFhir,
  appointmentToFhir,
} from "../mappers/appointment-fhir-mapper";

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

  const result: Appointment[] = await AppointmentService.findByScheduleAndDate({
    context,
    scheduleId,
    start,
    end,
  });
  const fhirObject: fhirR4.Appointment[] = result.map(appointmentToFhir);
  res.status(200).json(fhirObject);
};

const postHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const context = getContext(req);
  const fhirAppointment = req.body as fhirR4.Appointment;
  if (!validateResource(fhirAppointment, "Appointment", res)) {
    return;
  }
  const appointmentCandidate = appointmentFromFhir(fhirAppointment);
  // find the schedule based on the practitioner
  const practitionerParticipants = appointmentCandidate.participant?.filter(
    (p) => {
      return p.actor?.reference?.startsWith("Practitioner");
    }
  );
  const schedules = await ScheduleService.findByActors(
    context,
    practitionerParticipants.map((p) => {
      return p.actor?.reference!;
    })
  );
  if (schedules.length === 0) {
    res.status(400).send("No schedule found for practitioner actor");
  }
  const appointment = await AppointmentService.createAppointment(context, {
    ...appointmentCandidate,
    scheduleIds: schedules.map((s) => s._id),
  });
  // https://simplifier.net/guide/Ocean-Cloud-Connect-FHIR-Implementation-Guide/Overview/OnlineBooking.page.md?version=current
  res
    .status(201)
    .header("Location", `Appointment/${appointment._id}/_history/1`)
    .json(appointmentToFhir(appointment));
};

const putHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const context = getContext(req);
  const fhirAppointment: fhirR4.Appointment = req.body as fhirR4.Appointment;
  if (!validateResource(fhirAppointment, "Appointment", res)) {
    return;
  }
  if (!fhirAppointment.id) {
    res.status(400).send("Appointment id is required");
    return;
  }
  const existing = await AppointmentService.findById(
    context,
    fhirAppointment.id
  );
  if (!existing) {
    res.status(404).send("Appointment not found");
    return;
  }
  const updateCandidate = {
    ...existing,
    ...appointmentFromFhir(fhirAppointment),
  };
  const updateResult: UpdateResult = await AppointmentService.updateAppointment(
    context,
    updateCandidate
  );
  if (updateResult.matchedCount !== 1) {
    res.status(4).send("Appointment not updated");
    return;
  }
  const updatedAppointment =
    (await AppointmentService.findById(context, fhirAppointment.id)) ??
    updateCandidate;
  res.status(200).json(appointmentToFhir(updatedAppointment));
};

function setup(router: Router) {
  router.get("/appointment", getHandler);
  router.post("/appointment", postHandler);
  router.put("/appointment", putHandler);
}

export const AppointmentFhirHandler = {
  setup,
};
