import { gql } from "graphql-tag";

export default gql`
  type User {
    _id: String!
    email: String!
    profile: Profile!
    roles: Roles!
    tagLine: String
  }
  type Profile {
    displayName: String!
  }
  type Roles {
    admin: Boolean!
  }
  input NewUserInput {
    email: String!
    password: String!
    siteToJoin: String
  }
  extend type Query {
    users: [User]
    user(email: String!): [User]
  }
  extend type Mutation {
    signup(user: NewUserInput!): Error
    setAdmin(userId: String!, admin: Boolean!): Error
    sendResetPasswordEmail(email: String!): Error
    resetPassword(
      email: String!
      token: String!
      newPassword: String!
      twoFactorToken: String
    ): Error
    changePassword(
      userId: String!
      oldPassword: String!
      newPassword: String!
      twoFactorToken: String
    ): Error
    setDisplayName(userId: String!, displayName: String!): Error
    setSiteAccess(
      userId: String!
      access: Boolean!
      defaultSite: Boolean
    ): Error
  }
`;
