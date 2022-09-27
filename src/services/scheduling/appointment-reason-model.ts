import { model, Schema } from "mongoose";
import { IdSchema, SiteBoundSchema } from "~/services/core/core-model";
import { CodeSchema, SiteBound, HasId } from "../core/core-model";

import { ValueSetItem } from "~/services/core/core-model";

export interface AppointmentReason extends HasId, SiteBound, ValueSetItem {}

export const AppointmentReasonSchema = {
  ...IdSchema,
  ...CodeSchema,
  ...SiteBoundSchema,
};

const schema = new Schema<AppointmentReason>(AppointmentReasonSchema);

export const AppointmentReasonModel = model<AppointmentReason>(
  "AppointmentReason",
  schema
);
