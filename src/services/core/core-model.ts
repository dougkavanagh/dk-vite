import { nanoid } from "nanoid";
import { Schema } from "mongoose";
import { Practitioner } from "~/services/practitioner/practitioner-model";

export type Id = string;

export type ForeignKey<T> = string;
export interface Service {
  init(): Promise<void>;
}

export function id(length?: number) {
  return nanoid(length ?? 12);
}

export interface HasId {
  _id?: Id;
}
export const IdSchema = {
  _id: { type: String, required: true },
};
export interface Result<T> {
  value?: T;
  error?: ErrorMessage;
}
export class ErrorMessage {
  message: string;
  code?: string;
  constructor(message: string, code?: string) {
    this.message = message;
    this.code = code;
  }
}
export interface MongoDocument {
  createdAt?: Date;
  updatedAt?: Date;
}
export interface SiteBound extends MongoDocument {
  siteId: string;
}
export const SiteBoundSchema = {
  siteId: { type: String, required: true },
};
export function isSiteBound(object: object): object is SiteBound {
  return "siteId" in object;
}
export interface SiteAssociated extends MongoDocument {
  siteIds: string[];
}

export function isSiteAssociated(object: object): object is SiteAssociated {
  return "siteIds" in object;
}
export interface Code {
  // simplified version of https://www.hl7.org/fhir/datatypes.html#CodeableConcept
  value?: string;
  system?: string;
  text?: string;
}
export interface ValueSetItem extends Code, HasId {}

export const UnknownCode = {
  value: "unknown",
};
export const CodeSchema = {
  value: { type: String },
  system: { type: String },
  text: { type: String },
};
export interface Extension {
  id?: string;
  url?: string;
  value?: string;
}
export const ExtensionSchema = Schema.Types.Mixed;

export interface Quantity {
  value?: number;
  unit?: string;
}
export const QuantitySchema = {
  value: { type: Number },
  unit: { type: String },
};

export type Period = {
  start?: Date;
  end?: Date;
};
export const PeriodSchema = {
  start: { type: Date },
  end: { type: Date },
};

export type Identifier = {
  type?: Code; // http://hl7.org/fhir/v2/0203 eg JHN
  value?: string;
  extension?: Extension[];
  period?: Period;
  assigner?: Reference<unknown>;
  eligibilityCode?: string;
};
export const IdentifierSchema = {
  type: CodeSchema,
  value: { type: String, required: true },
  extension: { type: Schema.Types.Mixed },
  period: PeriodSchema,
  eligibilityCode: { type: String },
  assigner: {
    reference: { type: String },
    identifier: {
      type: CodeSchema,
      value: { type: String, required: true },
    },
  },
};
export const ForeignKeySchema = {
  type: String,
};
export type Markdown = string;
export interface Reference<T> {
  reference?: string; // used to look up the referenced object by id
  identifier?: Identifier; // use for the Reference itself, not for lookups
  type?: string;
  extension?: Extension[];
  display?: string;
}
export const ReferenceSchema = {
  reference: { type: String },
  identifier: IdentifierSchema,
  type: { type: String },
  extension: [ExtensionSchema],
  display: { type: String },
};
export const INFOWAY_NAMING_PREFIX =
  "https://fhir.infoway-inforoute.ca/NamingSystem/ca-";
export const INFOWAY_NAMING_HN_SUFFIX = "-patient-hcn";

export function getHnSystem(hnProv: string) {
  return (
    INFOWAY_NAMING_PREFIX + hnProv.toLowerCase() + INFOWAY_NAMING_HN_SUFFIX
  );
}
export function isHnSystem(system?: string): Boolean {
  return !!(
    system &&
    system.match(
      new RegExp(
        INFOWAY_NAMING_PREFIX + "[a-z][a-z]" + INFOWAY_NAMING_HN_SUFFIX
      )
    )
  );
}
export type Name = {
  given: string[];
  family: string;
  prefix?: string;
  suffix?: string;
  period?: Period;
  use?: string;
};
export const NameSchema = {
  given: { type: [String], required: true },
  family: { type: String, required: true },
  prefix: { type: String },
  suffix: { type: String },
  period: PeriodSchema,
  use: { type: String },
};
export function name(firstName: string, family: string): Name {
  return {
    given: [firstName],
    family: family,
  };
}
export type Gender = {
  value: string; // see CommonGender
  context?: string;
};
export enum CommonGender {
  male,
  female,
  other,
  unknown,
}
export const GenderSchema = {
  value: { type: String },
  context: { type: String },
};
export type Pronouns = {
  subject?: string; // she
  object?: string; // her
  possessive?: string; // hers
  self?: string; // herself
  text?: string; // e.g. "she/her"
};
export const PronounsSchema = {
  subject: { type: String },
  object: { type: String },
  possessive: { type: String },
  self: { type: String },
  text: { type: String },
};
export type GenderInfo = {
  identity?: Gender;
  sexForClinicalUse?: Code;
  recordedSexOrGender?: Code;
  pronouns?: Pronouns;
};
export const GenderInfoSchema = {
  identity: { type: GenderSchema },
  sexForClinicalUse: { type: CodeSchema },
  recordedSexOrGender: { type: CodeSchema },
  pronouns: { type: PronounsSchema },
};
export type Language = {
  code: string;
  preferred?: boolean;
};
export const LanguageSchema = {
  code: { type: String, required: true },
  preferred: { type: Boolean },
};
export type ContactPoint = {
  value: string;
  system?: string; //"phone" | "fax" | "email" | "pager" | "url" | "sms" | "other";
  use?: string; //"home" | "work" | "temp" | "old" | "mobile";
  rank?: number;
};
export const ContactPointSchema = {
  value: { type: String, required: true },
  system: { type: String },
  use: { type: String },
  rank: { type: Number },
};
export type PatientStatus = "active" | "inactive" | "left" | "deceased";
export type Address = {
  use?: string; //"home" | "work" | "temp" | "old" | "billing";
  type?: string; //"postal" | "physical" | "both";
  line?: string[];
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
};
export const AddressSchema = {
  use: { type: String },
  type: { type: String },
  line: { type: [String] },
  city: { type: String },
  province: { type: String },
  country: { type: String },
  postalCode: { type: String },
};
export type Contact = {
  name?: Name;
  purpose?: string;
  telecom?: ContactPoint[];
  address?: Address;
  gender?: GenderInfo;
};
export const ContactSchema = {
  name: NameSchema,
  purpose: { type: String },
  telecom: { type: [ContactPointSchema] },
  address: { type: AddressSchema },
  gender: { type: GenderInfoSchema },
};
export type Annotation = {
  id?: string;
  extension?: Array<Extension>;
  authorReference?: Reference<Practitioner | unknown>;
  authorString?: string;
  time?: Date;
  text?: string;
};
export const AnnotationSchema = {
  id: { type: String },
  extension: { type: ExtensionSchema },
  authorReference: { type: ReferenceSchema },
  authorString: { type: String },
  time: { type: Date },
  text: { type: String },
};

export type StringDate = string;

export type LocationStatus = "active" | "inactive";
export interface Location {
  // https://build.fhir.org/location.html
  _id?: Id;
  ids?: Identifier[];
  status: LocationStatus;
  name: string;
  contact?: Contact[];
  address?: Address;
}
export const LocationSchema = {
  _id: { type: String },
  ids: { type: [IdentifierSchema] },
  status: { type: String },
  name: { type: String },
  contact: { type: [ContactSchema] },
  address: AddressSchema,
};
