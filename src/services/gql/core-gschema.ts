import { gql } from "graphql-tag";

export default gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Error {
    message: String!
    code: String
  }
  type SaveResult {
    id: String
    error: String
  }
  type Name {
    given: [String!]!
    family: String!
    prefix: String
    suffix: String
    use: String
  }
  input NameInput {
    given: [String!]!
    family: String!
    prefix: String
    suffix: String
    use: String
  }
  type GenderInfo {
    identity: Gender
    sexForClinicalUse: Code
    recordedSexOrGender: Code
    pronouns: Pronouns
  }
  input GenderInfoInput {
    identity: GenderInput
    sexForClinicalUse: CodeInput
    recordedSexOrGender: CodeInput
    pronouns: PronounsInput
  }
  type Gender {
    value: String!
    context: String
  }
  input GenderInput {
    value: String!
    context: String
  }
  type Pronouns {
    subject: String
    object: String
    possessive: String
    self: String
    text: String
  }
  type DbFile {
    _id: ID!
    mimeType: String!
    fileName: String!
    usedFor: String!
    ownerId: String!
  }
  input PronounsInput {
    subject: String
    object: String
    possessive: String
    self: String
    text: String
  }
  type Qualification {
    code: Code!
  }
  input QualificationInput {
    code: CodeInput!
  }
  type Language {
    code: String!
    preferred: Boolean
  }
  input LanguageInput {
    code: String!
    preferred: Boolean
  }
  type Code {
    value: String
    text: String
  }
  input CodeInput {
    value: String!
    text: String!
  }
  type ValueSetItem {
    _id: ID!
    value: String
    text: String
  }
  input ValueSetItemInput {
    _id: ID
    value: String
    text: String
  }
  type Contact {
    name: Name
    purpose: String
    telecom: [ContactPoint!]
    address: Address
    gender: GenderInfo
  }
  input ContactInput {
    name: NameInput
    purpose: String
    telecom: [ContactPointInput!]
    address: AddressInput
    gender: GenderInfoInput
  }
  type ContactPoint {
    value: String!
    system: String
    use: String
    rank: Int
  }
  input ContactPointInput {
    value: String!
    use: String!
    rank: Int
  }
  type Address {
    use: String
    type: String
    line: [String!]
    city: String
    province: String
    country: String
    postalCode: String
  }
  input AddressInput {
    use: String
    type: String
    line: [String!]
    city: String
    province: String
    country: String
    postalCode: String
  }
  type Contact {
    name: Name
    purpose: String
    telecom: [ContactPoint]
    address: Address
    gender: GenderInfo
  }
  input LocationInput {
    status: String!
    name: String!
    contact: [ContactInput!]
    address: AddressInput!
  }
  type Period {
    start: DateTime
    end: DateTime
  }
  input PeriodInput {
    start: DateTime
    end: DateTime
  }
  type Reference {
    reference: String
    identifiSaveResult: Identifier
    type: String
    display: String
  }
  input ReferenceInput {
    reference: String
    identifier: IdentifierInput
    type: String
    display: String
  }
  type Extension {
    id: String
    type: String
    value: String
  }
  input ExtensionInput {
    id: String
    type: String
    value: String
  }
  type Identifier {
    type: Code
    value: String
    ext: Extension
  }
  input IdentifierInput {
    type: CodeInput
    value: String
    ext: ExtensionInput
  }
  scalar Date
  scalar DateTime
`;
