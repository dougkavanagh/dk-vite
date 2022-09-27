import { gql } from "graphql-tag";

export default gql`
  input SmsInput {
    target: String!
    text: String!
    targetDescription: String
  }
  type Result {
    error: String
  }
  extend type Mutation {
    sendSms(params: SmsInput!): Result
  }
  extend type Query {
    empty: String
  }
`;
