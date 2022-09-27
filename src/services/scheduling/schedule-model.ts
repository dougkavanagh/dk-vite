import { Schema, model } from "mongoose";
import {
  SiteBound,
  Period,
  CodeSchema,
  ReferenceSchema,
} from "~/services/core/core-model";
import { Practitioner } from "~/services/practitioner/practitioner-model";
import { Code, Reference } from "~/services/core/core-model";
import { PeriodSchema } from "../core/core-model";

export interface Schedule extends SiteBound {
  // https://www.hl7.org/fhir/schedule.html
  _id: string;
  active: boolean;
  serviceCategory?: Code[]; // https://www.hl7.org/fhir/valueset-service-category.html
  serviceType?: Code[]; // https://www.hl7.org/fhir/codesystem-service-type.html e.g. {"text": "General Practice", "value": "124"}
  specialty?: Code[]; // https://www.hl7.org/fhir/valueset-c80-practice-codes.html
  actor: Reference<Practitioner | Location>[];
  planningHorizon?: Period;
  comment?: string;
}

export const ScheduleSchema = {
  _id: { type: String, required: true },
  siteId: { type: String, required: true },
  active: { type: Boolean, required: false },
  serviceCategory: { type: [CodeSchema], required: false },
  serviceType: { type: [CodeSchema], required: false }, //
  specialty: { type: [CodeSchema], required: false },
  actor: { type: [ReferenceSchema], required: true },
  planningHorizon: { type: PeriodSchema, required: false },
  comment: { type: String, required: false },
};

const schema = new Schema<Schedule>({
  ...ScheduleSchema,
  _id: { type: String, required: true },
});

export const ScheduleModel = model<Schedule>("Schedule", schema);
