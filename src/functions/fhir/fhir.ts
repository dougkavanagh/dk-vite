import { HandlerResponse } from "@netlify/functions";
import { APIGatewayProxyEvent as Event, Context } from "aws-lambda";
import serverless from "serverless-http";
import app from "~/services/fhir/fhir-app";

dbConnect(); // concurrent load
const expressHandler = serverless(app);

import logger from "~/services/core/logger";
import { dbConnect } from "~/services/core/db-client";
export const handler = async (
  event: Event,
  context: Context
): Promise<HandlerResponse> => {
  try {
    await dbConnect();
    const expressResponse = await expressHandler(event, context);
    const result = {
      statusCode: expressResponse.statusCode || 500,
      body: expressResponse.body,
      headers: expressResponse.headers,
    };
    return result;
  } catch (error) {
    logger.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    };
  }
};
