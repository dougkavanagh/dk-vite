import { Schema, model } from "mongoose";
import { Identifier } from "~/services/core/core-model";

export interface HealthcareService {
  //https://simplifier.net/packages/simplifier.core.r4.resources/4.0.0/files/19097
  _id: string;
  identifiers?: Identifier[];
  // ...
  // from OMD:
  // Legal status Legal status e.g. regulated, licensed practice
  // Name and Title of Director/Manager Name of the person responsible for service management
  // Email address Email Address
  // Website Website --> via ContactPoint
  // Referral Instructions Instructions for sending referrals. May also include details to accompany the referral e.g. patient
  // summary, lab work, imaging, etc.
  // Accessibility Details The degree to which a wheelchair user can move independently at a service location. Possible
  // values are: Not Applicable; Wheelchair Accessible; Partially Accessible; Not Wheelchair Accessible
  // Fees and other payments Indicate if there are any out-of-pocket fees for specific services
}

export const HealthcareServiceSchema = {
  _id: { type: String, required: false },
};

const schema = new Schema<HealthcareService>({
  ...HealthcareServiceSchema,
  _id: { type: String, required: true },
});

export const HealthcareServiceModel = model<HealthcareService>(
  "HealthcareService",
  schema
);
