// localhost:8888/api/smart-server/auth/authorize?redirect_uri=localhost:8888&response_type=code&aud=http://localhost:8888/api/smart-server/fhir

// http://examples.smarthealthit.org/growth-chart-app/launch.html?fhirServiceUrl=http://localhost:8888/api/fhir/patient?patientId=dk123&sim=W29iamVjdCBPYmplY3Rd

import app from "../../services/smart-server/smart-server-app";
import serverless from "serverless-http";
export const handler = serverless(app);
