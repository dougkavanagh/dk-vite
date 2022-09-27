import { gql } from "graphql-tag";

export default gql`
  interface PtResource {
    _id: ID!
    ptId: String!
  }
  input ContentInput {
    attachment: AttachmentInput!
  }
  input AttachmentInput {
    contentType: String
    language: String
    text: String
    url: String
    size: Int
    hash: String
    title: String
  }
  input DocumentReferenceInput {
    _id: ID
    ptId: String!
    identifier: [IdentifierInput!]
    docType: CodeInput!
    category: [CodeInput!]
    author: [ReferenceInput!]
    authenticator: ReferenceInput
    description: String
    content: [ContentInput!]!
  }
  extend type Mutation {
    saveDocumentReference(resource: DocumentReferenceInput!): SaveResult!
  }
`;
