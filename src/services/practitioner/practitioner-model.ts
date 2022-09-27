import { Schema, model } from "mongoose";
import {
  Name,
  ContactPoint,
  GenderInfo,
  StringDate,
  Address,
  Contact,
  Code,
  CodeSchema,
  NameSchema,
  GenderInfoSchema,
  ContactPointSchema,
  AddressSchema,
  ContactSchema,
  Period,
} from "~/services/core/core-model";

export type Qualification = {
  // Certification, licenses, or training pertaining to the provision of care
  code: Code;
};
export const QualificationSchema = {
  code: CodeSchema,
};

export interface Organization {
  name: string;
  kind: string;
  contacts?: Contact[];
}
export const OrganizationSchema = {
  name: { type: String, required: true },
  kind: { type: String, required: true },
  contacts: { type: [ContactSchema], required: false },
};

function snomed(value: string, text: string): Code {
  return {
    system: "http://snomed.info/sct",
    value,
    text,
  };
}

export const SpecialtyCodes = {
  FAMILY_PHYSICIAN: snomed("419772000", "Family practice"),
  CARDIOLOGY: snomed("394579002", "Cardiology"),
  PHARMACIST: snomed("46255001", "Pharmacist"),
  //...
  // https://browser.ihtsdotools.org/?perspective=full&conceptId1=394733009&edition=MAIN/2022-07-31&release=&languages=en
  // https://bioportal.bioontology.org/ontologies/SNOMEDCT?p=classes&conceptid=394733009
  // https://www.findacode.com/snomed/394658006--clinical-specialty.html
};

// Services
export type PractitionerRole = {
  // http://build.fhir.org/practitionerrole.html
  // https://simplifier.net/ereferral-ontario/ereferralpractitionerrole
  organization: Organization;
  telecom?: ContactPoint[];
  address?: Address[];
  notes?: string;
  period?: Period;
  specialty?: Code[];
  //healthcareService?: HealthcareServiceRef[];
  notAvailable?: {
    description: string;
    during: Period;
  };
  availabilityExceptions?: string;
  // HSO-like fields:
  // indigenousServices?: boolean;
  // french language?
  // acceptingNewPatients?: boolean;
  // availability
  // wait time?
  // patient eligibility?
  // catchment area?
  // accessibility?
  // services offered?
  // fees?
};
const PractitionerRoleSchema = {
  organization: { type: OrganizationSchema, required: true },
  telecom: { type: [ContactPointSchema], required: false },
  address: { type: [AddressSchema], required: false },
  notes: { type: String, required: false },
  specialty: { type: [CodeSchema], required: false },
};
export interface Practitioner {
  // https://www.hl7.org/fhir/practitioner.html
  _id?: string;
  externalId?: Code;
  name: Name;
  gender?: GenderInfo;
  birthDate?: StringDate;
  professionalId?: string;
  billingId?: string;
  qualifications?: Qualification[];
  roles?: PractitionerRole[];
}
export const PractitionerSchema = {
  _id: { type: String, required: false },
  externalId: { type: CodeSchema, required: false },
  name: { type: NameSchema, required: true },
  gender: { type: GenderInfoSchema },
  birthDate: { type: String },
  professionalId: { type: String },
  billingId: { type: String },
  qualifications: { type: QualificationSchema },
  roles: { type: [PractitionerRoleSchema] },
};

const schema = new Schema<Practitioner>({
  ...PractitionerSchema,
  _id: { type: String, required: true },
});

export const PractitionerModel = model<Practitioner>("Practitioner", schema);
