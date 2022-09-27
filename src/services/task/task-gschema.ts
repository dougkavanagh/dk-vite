import { gql } from "graphql-tag";

export default gql`
  type Task {
    owners: [String!]!
  }
  input TaskInput {
    _id: String
    owners: [String!]!
  }
  extend type Query {
    getUserActiveTasks: [Task!]!
    getPatientTasks(patientId: String!): [Task!]!
  }
  extend type Mutation {
    addTask(task: TaskInput!): Error
    updateTask(task: TaskInput!): Error
  }
`;
