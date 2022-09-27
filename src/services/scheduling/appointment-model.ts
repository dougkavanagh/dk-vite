import { model, Schema } from "mongoose";
import {
  Code,
  ForeignKey,
  ForeignKeySchema,
  Identifier,
  Period,
  Reference,
} from "~/services/core/core-model";
import { Patient } from "~/services/patient/patient-chart";
import { Practitioner } from "~/services/practitioner/practitioner-model";
import {
  Annotation,
  AnnotationSchema,
  CodeSchema,
  IdentifierSchema,
  Markdown,
  PeriodSchema,
  ReferenceSchema,
  SiteBound,
} from "../core/core-model";
import { ServiceRequest } from "../patient/resource/service-request-model";
import { Schedule } from "./schedule-model";
import { Slot } from "./slot-model";

export interface Participant {
  type?: Code[];
  period?: Period;
  actor?: Reference<Practitioner | Patient | Location>;
  required?: "required" | "optional" | "information-only";
  status?: ParticipationStatus;
}
export const ParticipantSchema = {
  type: { type: [CodeSchema], required: false },
  period: { type: PeriodSchema, required: false },
  actor: { type: ReferenceSchema, required: false },
  required: { type: Boolean, required: false },
  status: { type: String, required: false },
};

export enum ParticipationStatus {
  Accepted = "accepted",
  Declined = "declined",
  Tentative = "tentative",
  NeedsAction = "needs-action",
}

export enum AppointmentStatus {
  proposed = "proposed",
  pending = "pending",
  booked = "booked",
  arrived = "arrived",
  fulfilled = "fulfilled",
  cancelled = "cancelled",
  noshow = "noshow",
  entered_in_error = "entered-in-error",
  checked_in = "checked-in",
  waitlist = "waitlist",
}

export interface Appointment extends SiteBound {
  // https://build.fhir.org/appointment.html#Appointment
  _id: string;
  ids?: Identifier[];
  scheduleIds: ForeignKey<Schedule>[];
  patientIds: ForeignKey<Patient>[];
  status: AppointmentStatus;
  cancellationReason?: string;
  serviceCategory?: Code[];
  serviceType?: Code[];
  appointmentType?: Code;
  reason?: Code[];
  priority?: number; // The priority of the appointment. Can be used to make informed decisions if needing to re-prioritize appointments. (The iCal Standard specifies 0 as undefined, 1 as highest, 9 as lowest priority).
  description?: string;
  replaces?: Reference<Appointment>[];
  start?: Date;
  end?: Date;
  minutesDuration?: number; // estimated
  //account?; Reference<Account>[];
  notes?: Annotation[];
  patientInstruction?: Markdown;
  basedOn?: Reference<ServiceRequest>[];
  participant: Participant[];
  requestedPeriod?: Period[];
  slot?: Reference<Slot>[];
  //bills?: Reference<Account>[];
  //billingStatus?: string;
}
export type AppointmentCandidate = Omit<
  Appointment,
  "_id" | "siteId" | "scheduleIds"
>;
export const AppointmentBaseSchema = {
  scheduleIds: { type: [ForeignKeySchema], required: true },
  ids: { type: [IdentifierSchema], required: false },
  patientIds: { type: [ForeignKeySchema], required: false },
  status: { type: String, required: true },
  cancellationReason: { type: String, required: false },
  serviceCategory: { type: [CodeSchema], required: false },
  serviceType: { type: [CodeSchema], required: false },
  appointmentType: { type: CodeSchema, required: false },
  reason: { type: [CodeSchema], required: false },
  priority: { type: Number, required: false },
  description: { type: String, required: false },
  replaces: { type: [ReferenceSchema], required: false },
  start: { type: Date, required: false },
  end: { type: Date, required: false },
  minutesDuration: { type: Number, required: false },
  notes: { type: [AnnotationSchema], required: false },
  patientInstruction: { type: String, required: false },
  basedOn: { type: [ReferenceSchema], required: false },
  participant: { type: [ParticipantSchema], required: true },
  requestedPeriod: { type: [PeriodSchema], required: false },
  slot: { type: [ReferenceSchema], required: false },
};

const schema = new Schema<Appointment>({
  ...AppointmentBaseSchema,
  _id: { type: String, required: true },
});

export const AppointmentModel = model<Appointment>("Appointment", schema);
