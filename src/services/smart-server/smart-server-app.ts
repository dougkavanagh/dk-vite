// localhost:8888/api/smart-server/auth/authorize?redirect_uri=localhost:8888&response_type=code&aud=http://localhost:8888/api/smart-server/fhir

// http://examples.smarthealthit.org/growth-chart-app/launch.html?fhirServiceUrl=http://localhost:8888/api/fhir/patient?patientId=dk123&sim=W29iamVjdCBPYmplY3Rd

import express from "express";
import cors from "cors";
import wellKnownOIDC from "./well-known-oidc-configuration";
import wellKnownSmart from "./well-known-smart-configuration";
import config from "./smart-server-config";
import AuthorizeHandler from "./authorize-handler";
import TokenHandler from "./token-handler";

const app: express.Application = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const router = express.Router();

router.get(
  config.fhirPath + "/.well-known/openid-configuration/",
  wellKnownOIDC
);
router.get(
  config.fhirPath + "/.well-known/smart-configuration",
  wellKnownSmart
);
router.get(config.authPath, AuthorizeHandler.handleRequest);
router.post(
  config.tokenPath,
  express.urlencoded({ extended: false }),
  TokenHandler.handleRequest
);

router.get(config.keysPath, (req: express.Request, res: express.Response) => {
  res.json({
    keys: [config.publicJwk],
  });
});
app.use(express.json());

app.use(config.paths(config.servicePath), router); // path must route to lambda
export default app;
