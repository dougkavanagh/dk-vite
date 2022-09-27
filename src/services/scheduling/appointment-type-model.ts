import { model, Schema } from "mongoose";
import { IdSchema, SiteBoundSchema } from "~/services/core/core-model";
import { CodeSchema, SiteBound, HasId } from "../core/core-model";

import { ValueSetItem } from "~/services/core/core-model";

export interface AppointmentType extends HasId, SiteBound, ValueSetItem {
  defaultDuration?: number;
}

export const AppointmentTypeSchema = {
  ...IdSchema,
  ...CodeSchema,
  ...SiteBoundSchema,
  defaultDuration: { type: Number, required: true },
};

const schema = new Schema<AppointmentType>(AppointmentTypeSchema);

export const AppointmentTypeModel = model<AppointmentType>(
  "AppointmentType",
  schema
);
