import { Schema } from "mongoose";
import {
  Annotation,
  Code,
  CodeSchema,
  Quantity,
  QuantitySchema,
  Reference,
} from "~/services/core/core-model";
import {
  PractitionerSchema,
  Practitioner,
} from "~/services/practitioner/practitioner-model";
import {
  PtResourceModel,
  PtResource,
  newPtResource,
} from "../pt-resource-model";

const TYPE = "Observation";

export function newNote(obj: Omit<Observation, "_id" | "type">): PtResource {
  return newPtResource({
    type: TYPE,
    ...obj,
  });
}

export interface ReferenceRange {
  low?: Quantity;
  high?: Quantity;
  text?: string;
  appliesTo?: Code[] | null;
}
const ReferenceRangeSchema = {
  low: { type: QuantitySchema, required: false },
  high: { type: QuantitySchema, required: false },
  text: { type: String, required: false },
  appliesTo: { type: [CodeSchema], required: false },
};

export interface Observation extends PtResource {
  // https://www.hl7.org/fhir/observation.html
  code: Code | null;
  status: string; // registered | preliminary | final | amended | corrected | cancelled | entered-in-error | unknown
  category?: Code | null;
  encounter?: string;
  effectiveDateTime?: Date | null;
  valueQuantity?: number | null;
  unit?: string | null;
  valueString?: string | null;
  valueBoolean?: boolean | null;
  note?: Annotation[] | null;
  performer?: Reference<Practitioner>[] | null;
  referenceRange?: ReferenceRange[] | null;
}

const ObservationSchema: Schema = new Schema({
  code: { type: CodeSchema, required: true },
  status: { type: String, required: true },
  category: { type: CodeSchema, required: true },
  encounter: { type: String, required: false },
  effectiveDateTime: { type: Date, required: false },
  valueQuantity: { type: Number, required: false },
  unit: { type: String, required: false },
  valueString: { type: String, required: false },
  valueBoolean: { type: Boolean, required: false },
  note: { type: String, required: false },
  performer: { type: PractitionerSchema, required: false },
  referenceRange: { type: [ReferenceRangeSchema] },
});

export const ObservationModel = PtResourceModel.discriminator<Observation>(
  TYPE,
  ObservationSchema
);
