import { model, Schema } from "mongoose";
import {
  Address,
  AddressSchema,
  Code,
  CodeSchema,
  Contact,
  ContactPoint,
  ContactPointSchema,
  ContactSchema,
  GenderInfo,
  Id,
  Identifier,
  IdentifierSchema,
  Language,
  LanguageSchema,
  Name,
  NameSchema,
  PatientStatus,
  SiteAssociated,
  SiteBound,
  StringDate,
} from "~/services/core/core-model";
import {
  Organization,
  OrganizationSchema,
  Practitioner,
  PractitionerSchema,
} from "~/services/practitioner/practitioner-model";
import { DbFile, DbFileSchema } from "~/services/file/file-model";

export const HN_CODE = "JHN";

export interface PatientContact {
  contact: Contact;
  relationship?: string;
  poa?: boolean;
  forEmergency?: boolean;
}
const PatientContactSchema = {
  contact: { type: ContactSchema, required: true },
  relationship: { type: String },
  poa: { type: Boolean },
  forEmergency: { type: Boolean },
};
export interface PatientSiteInfo extends SiteBound {
  patientId: string;
  status: PatientStatus;
  mrp?: Practitioner;
  rosterInfo?: RosterInfo;
  subscriptions?: Subscription[];
  privacySettings?: {
    usersAllowedAccess?: string[];
    usersDeniedAccess?: string[];
  };
  alerts?: {
    booking?: Alert;
    billing?: Alert;
    charting?: Alert;
  };
  custom?: Map<string, string>;
  comments: string;
}
export type Alert = {
  text: string;
  color?: string;
  startDate?: Date;
  endDate?: Date;
};
export enum CareTeamParticipantType {
  PCP = "pcp",
  REFERRER = "referrer",
  PHARMACY = "pharmacy",
}
export type CareTeamParticipant = {
  role: string; // e.g. 'pcp', 'referrer', 'pharmacy'
  practitioner?: Practitioner;
  organization?: Organization;
  delegateOfPractitionerId?: string;
  delegationType?: string;
  expiryDate?: Date;
  note?: string;
};
const CareTeamParticipantSchema = {
  role: { type: String, required: true },
  practitioner: { type: PractitionerSchema },
  organization: { type: OrganizationSchema },
  delegateOfPractitionerId: { type: String },
  delegationType: { type: String },
  expiryDate: { type: Date },
  note: { type: String },
};
export type CareTeam = {
  participants: CareTeamParticipant[];
};
const CareTeamSchema = {
  participants: { type: [CareTeamParticipantSchema], required: true },
};
export type RosterInfo = {
  rosterType: string;
  practitionerId?: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  terminationReason?: string;
};
export type Subscription = {
  siteId: string;
  subscriptionType?: string;
  startDate?: Date;
  expiryDate?: Date;
};
export type Family = {
  _id: Id;
  addresseePatientId: string;
  patientIds: string[];
};

import { id, name } from "~/services/core/core-model";

export function newPatient(
  spec?: Omit<Patient, "_id" | "siteIds" | "telecom">
): Patient {
  const now = new Date();
  return {
    ...spec,
    _id: id(),
    siteIds: [],
    ids: [],
    telecom: [],
    createdAt: now,
    updatedAt: now,
    ...spec,
    name:
      spec?.name && spec.name.length > 0 ? spec.name : [name("Unknown", "")],
  };
}
export interface BookingConstraints {
  allowed: boolean;
  minDaysBeforeRebooking: string;
  minAppointmentDuration: string;
}
export interface Patient extends SiteAssociated {
  _id: Id;
  ids?: Identifier[];
  name: Name[];
  telecom: ContactPoint[];
  gender?: GenderInfo;
  birthDate?: StringDate;
  deceased?: {
    deceasedBoolean: boolean;
    deceasedDateTime?: Date;
  };
  maritalStatus?: Code;
  address?: Address[];
  photo?: DbFile[];
  contacts?: PatientContact[];
  careTeam?: CareTeam;
  languages?: Language[];
  bookingConstraints?: BookingConstraints;
}
const schema = new Schema<Patient>(
  {
    siteIds: { type: [String], required: true },
    _id: { type: String, required: true },
    ids: [IdentifierSchema],
    name: [NameSchema],
    telecom: { type: [ContactPointSchema] },
    gender: {},
    birthDate: {},
    deceased: {
      deceasedBoolean: { type: Boolean },
      deceasedDateTime: { type: Date },
    },
    maritalStatus: { type: CodeSchema },
    address: [AddressSchema],
    photo: { type: [DbFileSchema] },
    contacts: [PatientContactSchema],
    careTeam: {
      type: CareTeamSchema,
    },
    languages: {
      type: [LanguageSchema],
    },
  },
  { timestamps: true }
);

export const PatientModel = model<Patient>("Patient", schema);
