import { gql } from "graphql-tag";

export default gql`
  type Practitioner {
    _id: ID
    name: Name!
    gender: GenderInfo
    birthDate: String
    professionalId: String
    billingId: String
    qualifications: [Qualification]
  }
  input PractitionerInput {
    _id: ID
    name: NameInput!
    gender: GenderInfoInput
    birthDate: String
    professionalId: String
    billingId: String
    qualifications: [QualificationInput!]
  }
  extend type Query {
    getPractitioner(id: String!): Practitioner
    getPractitionersBySite(siteId: String!): [Practitioner!]
  }
  extend type Mutation {
    addPractitioner(practitioner: PractitionerInput!): SaveResult!
    updatePractitioner(practitioner: PractitionerInput!): SaveResult!
    deletePractitioner(id: String!): SaveResult!
  }
`;
