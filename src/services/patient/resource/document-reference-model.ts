import { Practitioner } from "@smile-cdr/fhirts/dist/FHIR-R3";
import { Schema } from "mongoose";
import {
  Code,
  Identifier,
  Markdown,
  Period,
  Reference,
} from "~/services/core/core-model";
import { Patient } from "../patient-model";
import {
  PtResourceModel,
  PtResource,
  newPtResource,
} from "../pt-resource-model";

const TYPE = "DocumentReference";
export const DOCUMENT_REFERENCE_TYPE = TYPE;

export function newDocumentReference(
  obj: Omit<DocumentReference, "_id" | "type">
): PtResource {
  return newPtResource({
    type: TYPE,
    ...obj,
  });
}

export enum CompositionStatus {
  PRELIMINARY = "preliminary",
  FINAL = "final",
  AMENDED = "amended",
  ENTERED_IN_ERROR = "entered-in-error",
}

type StatusEnum = "current" | "superseded" | "entered-in-error";
type RelatesToCode = "replaces" | "transforms" | "signs" | "appends";

export interface DocumentReference extends PtResource {
  // https://www.hl7.org/fhir/documentreference.html
  identifier?: Identifier[];
  status?: StatusEnum;
  docStatus?: CompositionStatus;
  docType?: Code;
  category?: Code[];
  author?: Reference<unknown>[];
  authenticator?: Reference<unknown>;
  relatesTo?: {
    code?: RelatesToCode;
    target: Reference<unknown>;
  }[];
  description?: string;
  //securityLabel: - see Lockbox code
  content: {
    attachment: {
      contentType?: string;
      language?: string;
      text?: Markdown;
      url?: string;
      size?: number;
      hash?: string;
      title?: string;
    };
  }[];
  context?: {
    encounter?: Reference<unknown>[];
    event?: Code[];
    period?: Period;
    facilityType?: Code;
    practiceSetting?: Code;
    sourcePatientInfo?: Patient;
    related?: Reference<unknown>[];
  };
}

const DocumentReferenceSchema: Schema = new Schema({
  text: { type: String, required: true },
});

export const DocumentReferenceModel =
  PtResourceModel.discriminator<DocumentReference>(
    TYPE,
    DocumentReferenceSchema
  );
