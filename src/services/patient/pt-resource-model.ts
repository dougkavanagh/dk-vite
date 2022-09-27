import { Code } from "mongodb";
import { Schema, model } from "mongoose";
import { ForeignKey, id, SiteAssociated } from "~/services/core/core-model";
import { Patient } from "./patient-model";

export function newPtResource<T extends PtResource>(obj: Omit<T, "_id">): T {
  const now = new Date();
  return {
    _id: id(),
    createdAt: now,
    updatedAt: now,
    ...obj,
  } as T;
}

export interface Lockbox extends PtResource {
  securityLabel?: Code; // https://www.hl7.org/fhir/valueset-security-labels.html
  note?: string;
}
export interface PtResource extends SiteAssociated {
  _id: string;
  type: string;
  ptId: ForeignKey<Patient>;
  sourceId?: string;
  date?: Date;
  firstSavedBy?: string;
  lastSavedBy?: string;
  narrative?: string;
  lockboxId?: ForeignKey<Lockbox>;
}

const collectionName = "PtResource";
const schema = new Schema<PtResource>(
  {
    _id: { type: String, required: true },
    siteIds: { type: [String], required: true },
    ptId: { type: String, required: true },
    sourceId: { type: String, required: true },
  },
  {
    collection: collectionName,
    discriminatorKey: "type",
    timestamps: true,
  }
);
schema.index({ ptId: 1, siteIds: 1, effectiveDate: 1 }, { unique: true });

export const PtResourceModel = model<PtResource>(collectionName, schema);
