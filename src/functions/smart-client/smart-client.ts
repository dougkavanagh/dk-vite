// http://localhost:8888/api/smart-client/launch?iss=http://localhost:8888/api/smart-server/fhir

// Test URL:
// https://launch.smarthealthit.org/?auth_error=&fhir_version_2=r4&iss=&launch_ehr=1&launch_url=http%3A%2F%2Flocalhost%3A8888%2Fapi%2Fsmart-client%2Flaunch&patient=&prov_skip_auth=1&prov_skip_login=1&provider=e443ac58-8ece-4385-8d55-775c1b8f3a37&pt_skip_auth=1&public_key=&sde=&sim_ehr=0&token_lifetime=15&user_pt=

// redirects to:

import { HandlerResponse } from "@netlify/functions";
import { APIGatewayProxyEvent as Event, Context } from "aws-lambda";
import app from "../../services/smart-client/smart-client-app";
import serverless from "serverless-http";

const expressHandler = serverless(app);

export const handler = async (
  event: Event,
  context: Context
): Promise<HandlerResponse> => {
  try {
    const expressResponse = expressHandler(event, context);
    return {
      statusCode: (await expressResponse).statusCode || 500,
      body: (await expressResponse).body,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    };
  }
};
