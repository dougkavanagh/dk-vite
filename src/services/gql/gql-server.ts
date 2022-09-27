import { ApolloServer } from "apollo-server-lambda";
import { makeExecutableSchema } from "@graphql-tools/schema";
import DbClient from "../core/db-client";

import { getUser } from "../session/session-service";
import { Context } from "./context";
import { gql } from "graphql-tag";

const resolvers = [];
const permissions = [];

// import { DateResolver, DateTimeResolver, JSONResolver } from "graphql-scalars";
// resolvers.push(DateResolver);
// resolvers.push(DateTimeResolver);
// resolvers.push(JSONResolver);

import CoreSchema from "./core-gschema";

import UserSchema from "../user/user-gschema";
import { resolvers as UserResolvers } from "../user/user-resolvers";
resolvers.push(UserResolvers);

import SmsSchema from "../sms/sms-gschema";
import { resolvers as SmsResolvers } from "../sms/sms-resolvers";
resolvers.push(SmsResolvers);

import PractitionerSchema from "../practitioner/practitioner-gschema";
import { resolvers as PractitionerResolvers } from "../practitioner/practitioner-resolvers";
resolvers.push(PractitionerResolvers);

import PatientSchema from "../patient/patient-gschema";
import { resolvers as PatientResolvers } from "../patient/patient-resolvers";
resolvers.push(PatientResolvers);

import PatientResourceSchema from "../patient/resource/patient-resource-gschema";
import { resolvers as PatientResourceResolvers } from "../patient/resource/patient-resource-resolvers";
resolvers.push(PatientResourceResolvers);

import SessionSchema from "../session/session-gschema";
import { resolvers as SessionResolvers } from "../session/session-resolvers";
resolvers.push(SessionResolvers);

import SiteSchema from "../site/site-gschema";
import { resolvers as SiteResolvers } from "../site/site-resolvers";
resolvers.push(SiteResolvers);

import SiteCredentialsSchema from "../site/site-credentials-gschema";
import { resolvers as SiteCredentialsResolvers } from "../site/site-credentials-resolvers";
resolvers.push(SiteCredentialsResolvers);

import SchedulingSchema from "~/services/scheduling/scheduling-gschema";
import {
  resolvers as SchedulingResolvers,
  permissions as SchedulingPermissions,
} from "~/services/scheduling/scheduling-resolvers";
permissions.push(SchedulingPermissions);
resolvers.push(SchedulingResolvers);

const typeDefs = gql`
  ${CoreSchema}
  ${UserSchema}
  ${SmsSchema}
  ${PractitionerSchema}
  ${PatientSchema}
  ${PatientResourceSchema}
  ${SessionSchema}
  ${SiteSchema}
  ${SiteCredentialsSchema}
  ${SchedulingSchema}
`;

import { setupPermissions } from "./permissions";
import { applyMiddleware } from "graphql-middleware";
const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  setupPermissions(permissions)
);

DbClient.dbConnect();
export default new ApolloServer({
  schema,
  context: async (values): Promise<Context> => {
    await DbClient.dbConnect();
    const jwt = getAuthorizationJwt(values.event.headers);
    const user = getUser(jwt);
    const siteId = user?.siteId;
    return {
      user,
      setSessionUser: values.context.setSessionUser,
      ensureSiteId: () => {
        if (!siteId) {
          throw new Error(
            "There is no site in context but it is needed for this call."
          );
        }
        return siteId;
      },
    };
  },
});
function getAuthorizationJwt(headers: any): string {
  if (headers.authorization) {
    return headers.authorization.replace("Bearer ", "");
  }
  if (headers.cookie) {
    return headers.cookie;
  }
  return "";
}
