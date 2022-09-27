import { gql } from "graphql-tag";

export default gql`
  type Site {
    id: String!
    title: String!
  }
  input NewSiteInput {
    title: String!
    location: LocationInput!
  }
  input SiteInput {
    siteId: String!
    title: String!
  }
  extend type Query {
    getSites: [Site!]!
  }
  extend type Mutation {
    addSite(site: NewSiteInput!): Error
    updateSite(site: SiteInput!): Error
  }
`;
