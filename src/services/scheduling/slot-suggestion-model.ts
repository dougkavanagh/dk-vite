import { model, Schema } from "mongoose";
import { IdSchema, SiteBoundSchema } from "~/services/core/core-model";
import { CodeSchema, SiteBound, HasId } from "../core/core-model";

import { ValueSetItem } from "~/services/core/core-model";

export interface SlotSuggestion extends HasId, SiteBound, ValueSetItem {}

export const SlotSuggestionSchema = {
  ...IdSchema,
  ...CodeSchema,
  ...SiteBoundSchema,
};

const schema = new Schema<SlotSuggestion>(SlotSuggestionSchema);

export const SlotSuggestionModel = model<SlotSuggestion>(
  "SlotSuggestion",
  schema
);
