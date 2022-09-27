import { model, Schema } from "mongoose";
import { Code, ForeignKey, ForeignKeySchema } from "~/services/core/core-model";
import { CodeSchema, SiteBound } from "../core/core-model";
import { Schedule } from "./schedule-model";

enum SlotStatus {
  Busy = "busy",
  Free = "free",
  // FHIR has other statuses, but we don't support them
}

export interface Slot extends SiteBound {
  // https://build.fhir.org/slot.html
  _id?: string;
  scheduleId: ForeignKey<Schedule>;
  status: SlotStatus;
  serviceCategory?: Code[]; // A broad categorization of the service that is to be performed during this appointment - https://www.hl7.org/fhir/valueset-service-category.html
  serviceType?: Code[]; // The type of appointments that can be booked into this slot (ideally this would be an identifiable service - which is at a location, rather than the location itself). If provided then this overrides the value provided on the availability resource - https://www.hl7.org/fhir/valueset-service-type.html
  specialty?: Code[]; // https://www.hl7.org/fhir/valueset-c80-practice-codes.html
  appointmentType?: Code; // aka the slot's "suggestion" and/or schedule code
  start: Date;
  end: Date;
  comments?: string;
}

export const SlotSchema = new Schema<Slot>({
  _id: { type: String, required: true },
  scheduleId: ForeignKeySchema,
  status: { type: String, required: true },
  serviceCategory: { type: [CodeSchema], required: false },
  serviceType: { type: [CodeSchema], required: false },
  specialty: { type: [CodeSchema], required: false },
  appointmentType: CodeSchema,
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  comments: { type: String, required: false },
});

export const SlotModel = model<Slot>("Slot", SlotSchema);
