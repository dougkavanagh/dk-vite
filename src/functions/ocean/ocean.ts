import serverless from "serverless-http";
import app from "../../services/ocean/ocean-app";
export const expressHandler = serverless(app);
import { APIGatewayProxyEvent as Event, Context } from "aws-lambda";
import { HandlerResponse } from "@netlify/functions";
export const handler = async (
  event: Event,
  context: Context
): Promise<HandlerResponse> => {
  try {
    const expressResponse = expressHandler(event, context);
    const result = {
      statusCode: (await expressResponse).statusCode || 500,
      body: (await expressResponse).body,
      headers: {
        "Content-Type": "application/json",
      },
    };
    return result;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    };
  }
};
