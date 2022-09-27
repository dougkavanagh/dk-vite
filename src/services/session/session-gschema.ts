import { gql } from "graphql-tag";

export default gql`
  input LoginInput {
    email: String!
    password: String!
    siteId: String
    rememberMe: Boolean!
    returnJwt: Boolean
  }
  type LoginResult {
    success: Boolean!
    jwt: String
  }
  type SessionUser {
    email: String
    profile: SessionUserProfile!
    roles: SessionUserRoles!
  }
  type SessionUserProfile {
    displayName: String!
  }
  type SessionUserRoles {
    admin: Boolean!
  }
  extend type Query {
    currentUser: SessionUser
  }
  extend type Mutation {
    login(creds: LoginInput!): LoginResult!
    logout: Boolean!
  }
`;
