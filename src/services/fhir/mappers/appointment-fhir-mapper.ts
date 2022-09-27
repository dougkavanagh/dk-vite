import { fhirR4 } from "@smile-cdr/fhirts";
import {
  Appointment,
  AppointmentCandidate,
  AppointmentStatus,
  ParticipationStatus,
} from "~/services/scheduling/appointment-model";

export function appointmentToFhir(model: Appointment): fhirR4.Appointment {
  return {
    resourceType: "Appointment",
    ...model,
    start: model.start?.toString() ?? undefined,
    end: model.end?.toString() ?? undefined,
  };
}

export function appointmentFromFhir(
  model: fhirR4.Appointment,
  defaultStatus: AppointmentStatus = AppointmentStatus.booked
): AppointmentCandidate {
  return {
    ...model,
    patientIds:
      (model.participant
        ?.map((p) => p.actor?.reference?.split("Patient/").pop())
        .filter(Boolean) as string[]) ?? [],
    start: model.start ? new Date(model.start) : undefined,
    end: model.end ? new Date(model.end) : undefined,
    participant: model.participant?.map((p) => ({
      ...p,
      status: p.status as ParticipationStatus,
    })),
    status: (model.status as AppointmentStatus) ?? defaultStatus ?? "booked",
  };
}
