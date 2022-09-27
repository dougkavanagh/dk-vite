import server from "~/services/gql/gql-server";
import { DEPLOY_URL } from "~/services/core/env";
import { HandlerContext } from "@netlify/functions";
import { APIGatewayProxyEvent as Event, Context } from "aws-lambda";
import { APIGatewayProxyResult } from "aws-lambda";
import { SessionUser } from "~/services/session/session-model";

import {
  cookieSetterString,
  signSessionUser,
} from "~/services/session/session-service";

interface ContextWithSession extends HandlerContext {
  sessionCookie?: string;
  setSessionUser?: (user: SessionUser | null) => void;
}

function setSessionCookieToReturnToClient(
  contextWithSession: ContextWithSession,
  result: APIGatewayProxyResult | undefined
) {
  const sessionCookie = contextWithSession.sessionCookie;
  if (typeof sessionCookie === "string" && result?.headers) {
    result.headers["Set-Cookie"] = cookieSetterString(sessionCookie);
  }
}

const apolloHandler = server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: [DEPLOY_URL, "https://studio.apollographql.com"],
      credentials: true,
      // allowedHeaders: "client_id,client_secret",
    },
  },
});

function setupContext(context: Context, event: Event) {
  const contextWithSession = context as ContextWithSession;
  contextWithSession.setSessionUser = (user: SessionUser | null) =>
    (contextWithSession.sessionCookie = user ? signSessionUser(user) : "");
  (event as any).requestContext = context;
  return contextWithSession;
}

export const handler = async (
  event: Event,
  context: Context,
  callback: (error: Error | null, result: APIGatewayProxyResult) => void
): Promise<void> => {
  const contextWithSession = setupContext(context, event);
  try {
    const result: APIGatewayProxyResult | undefined = await apolloHandler(
      event,
      context,
      (error, result: APIGatewayProxyResult | undefined) => {
        setSessionCookieToReturnToClient(contextWithSession, result);
        if (callback) {
          callback(error as Error, result as APIGatewayProxyResult);
        }
      }
    );
    setSessionCookieToReturnToClient(contextWithSession, result);
    if (callback) {
      callback(null, result as APIGatewayProxyResult);
    }
  } catch (e) {
    const error = e as Error;
    callback(error, { statusCode: 500, body: error.message });
  }
};
