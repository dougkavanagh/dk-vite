import { gql } from "graphql-tag";

export default gql`
  type DbFileAccessInfo {
    getUrl: String
    putUrl: String
    file: DbFile
    error: Error
  }
  type DbFile {
    fileName: String!
    mimeType: String!
    usedFor: String!
    ownerId: String!
  }
  input DbFileUploadInput {
    fileName: String!
    mimeType: String!
    usedFor: String!
    ownerId: String!
  }
  input DbFileDownloadInput {
    _id: String!
  }
  extend type Mutation {
    prepareFileUpload(fileInfo: DbFileUploadInput!): DbFileAccessInfo!
    prepareFileDownload(fileInfo: DbFileDownloadInput!): DbFileAccessInfo!
  }
`;
