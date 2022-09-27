import { gql } from "graphql-tag";

export default gql`
type XYZ {
  test: String
}
  type PatientChart {
    patient: Patient
    resources: [PtResource!]
    siteInfo: SiteInfo
    cpp: [CppSection!]
    error: Error
  }
  type SiteInfo {
    status: String!
  }
  type CppSection {
    title: String!
  }
  type PtResource {
    _id: ID!
  }
  type DeceasedInfo {
    deceasedBoolean: Boolean!
    deceasedDateTime: DateTime
  }
  input DeceasedInfoInput {
    deceasedBoolean: Boolean!
    deceasedDateTime: DateTime
  }
  type CareTeam {
    participants: [CareTeamParticipant!]!
  }
  input CareTeamInput {
    participants: [CareTeamParticipantInput!]!
  }
  type CareTeamParticipant {
    role: String!
    practitioner: Practitioner
    organization: Organization
    delegateOfPractitionerId: String
    delegationType: String
    expiryDate: DateTime
    note: String
  }
  input CareTeamParticipantInput {
    role: String!
    practitioner: PractitionerInput
    organization: OrganizationInput
    delegateOfPractitionerId: String
    delegationType: String
    expiryDate: DateTime
    note: String
  }
  type Organization {
    name: String!
    kind: String!
    contacts: [Contact!]
  }
  input OrganizationInput {
    name: String!
    kind: String!
    contacts: [ContactInput!]
  }
  type Patient {
    _id: ID!
    name: [Name!]!
    telecom: [ContactPoint!]!
    gender: GenderInfo
    birthDate: String
    deceased: DeceasedInfo
    maritalStatus: Code
    address: [Address!]
    photo: [DbFile!]
    contacts: [PatientContact!]
    careTeam: CareTeam
    languages: [Language!]
  }
  input PatientInput {
    name: [NameInput!]!
    telecom: [ContactPointInput!]!
    gender: GenderInfoInput
    birthDate: String
    deceased: DeceasedInfoInput
    maritalStatus: CodeInput
    address: [AddressInput!]
    contacts: [PatientContactInput!]
    careTeam: CareTeamInput
    languages: [LanguageInput!]
  }
  type PatientContact {
    contact: Contact
    relationship: String
    poa: Boolean
    forEmergency: Boolean
  }
  input PatientContactInput {
    contact: ContactInput!
    relationship: String
    poa: Boolean
    forEmergency: Boolean
  }
  type DbFile {
    _id: ID!
    mimeType: String!
    fileName: String!
    usedFor: String!
    ownerId: String!
  }
  input DocumentReferenceInput {
    note: String!
    base: PtResourceInput!
  }
  input PtResourceInput {
    ptId: String!
    siteId: String!
  }

  extend type Query {
    findRecentPatients: [Patient!]!
    findByPatientId(ptId: String!): PatientChart
  }
  extend type Mutation {
    savePatient(patient: PatientInput!): SaveResult!
  }
`;
