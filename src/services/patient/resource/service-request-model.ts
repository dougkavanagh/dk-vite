import { Schema } from "mongoose";
import {
  Annotation,
  AnnotationSchema,
  Code,
  CodeSchema,
  Identifier,
  IdentifierSchema,
  Location,
  Quantity,
  QuantitySchema,
  Reference,
  ReferenceSchema,
} from "~/services/core/core-model";
import {
  Organization,
  Practitioner,
} from "~/services/practitioner/practitioner-model";
import { Patient } from "../patient-model";
import {
  newPtResource,
  PtResource,
  PtResourceModel,
} from "../pt-resource-model";
import { DocumentReference } from "./document-reference-model";

const TYPE = "Note";

export function newServiceRequest(
  obj: Omit<ServiceRequest, "_id" | "type">
): ServiceRequest {
  return newPtResource({
    type: TYPE,
    ...obj,
  });
}

export enum RequestStatus {
  incomplete = "incomplete",
  sent = "sent",
  accepted = "accepted",
  booked = "booked",
  completed = "completed",
  cancelled = "cancelled",
  declined = "declined",
}

export enum RequestPriority {
  routine = "routine",
  urgent = "urgent",
  asap = "asap",
  stat = "stat",
}
export enum RequestIntent {
  proposal = "proposal",
  plan = "plan",
  directive = "directive",
  order = "order",
  original_order = "original-order",
  reflex_order = "reflex-order",
  filler_order = "filler-order",
  instance_order = "instance-order",
  option = "option",
}
export interface ServiceRequest extends PtResource {
  // https://www.hl7.org/fhir/servicerequest.html
  identifier?: Identifier[];
  basedOn?: Array<Reference<ServiceRequest | unknown>>;
  requisition?: Identifier;
  status: RequestStatus;
  intent: RequestIntent;
  category?: Array<Code>;
  priority?: RequestPriority;
  doNotPerform?: boolean;
  replaces?: Array<Reference<ServiceRequest>>;
  orderDetail?: Array<Code>;
  quantity?: Quantity;
  occurenceDateTime?: Date;
  authoredOn?: Date; // When the request transitioned to being actionable.
  requester?: Reference<Practitioner | Patient | Organization>;
  performerType?: Code;
  performer?: Array<Reference<Practitioner | Organization>>;
  locationReference?: Array<Reference<Location>>;
  reasonCode?: Array<Code>;
  reasonReference?: Array<Reference<DocumentReference>>;
  supportingInfo?: Array<Reference<unknown>>;
  bodySite?: Array<Code>;
  note?: Array<Annotation>;
  patientInstruction?: string;
}

const schema: Schema = new Schema({
  identifier: { type: [IdentifierSchema], required: false },
  basedOn: { type: ReferenceSchema, required: false },
  requisition: { type: IdentifierSchema, required: false },
  status: { type: String, required: true },
  intent: { type: String, required: true },
  category: { type: [CodeSchema], required: false },
  priority: { type: String, required: false },
  doNotPerform: { type: Boolean, required: false },
  replaces: { type: ReferenceSchema, required: false },
  orderDetail: { type: [CodeSchema], required: false },
  quantity: { type: QuantitySchema, required: false },
  occurenceDateTime: { type: Date, required: false },
  authoredOn: { type: Date, required: false },
  requester: { type: ReferenceSchema, required: false },
  performerType: { type: CodeSchema, required: false },
  performer: { type: [ReferenceSchema], required: false },
  locationReference: { type: [ReferenceSchema], required: false },
  reasonCode: { type: [CodeSchema], required: false },
  reasonReference: { type: [ReferenceSchema], required: false },
  supportingInfo: { type: [ReferenceSchema], required: false },
  bodySite: { type: [CodeSchema], required: false },
  note: { type: [AnnotationSchema], required: false },
  patientInstruction: { type: String, required: false },
});

export const ServiceRequestModel =
  PtResourceModel.discriminator<ServiceRequest>(TYPE, schema);
