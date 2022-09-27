import { gql } from "graphql-tag";

export default gql`
  type HealthcareService {
    name: String
  }
  input HealthcareServiceInput {
    name: String
  }
  extend type Query {
    findHealthcareServiceById(id: String!): HealthcareService
  }
  extend type Mutation {
    saveHealthcareService(obj: HealthcareServiceInput!): SaveResult!
  }
`;
