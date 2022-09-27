import { gql } from "graphql-tag";

export default gql`
  input SiteCredentialsInput {
    name: String!
  }
  type SiteCredentialsListItem {
    name: String!
    clientId: String!
  }
  type SiteCredentials {
    name: String!
    clientId: String!
    clientSecret: String!
  }
  extend type Query {
    listCredentials: [SiteCredentialsListItem!]!
  }
  extend type Mutation {
    addCredentials(credentials: SiteCredentialsInput!): Error
    removeCredentials(clientId: String!): Error
    viewCredential(clientId: String!): SiteCredentials
  }
`;
