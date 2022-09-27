// http://localhost:8888/api/smart-client/launch?iss=http://localhost:8888/api/smart-server/fhir

// Test URL:
// https://launch.smarthealthit.org/?auth_error=&fhir_version_2=r4&iss=&launch_ehr=1&launch_url=http%3A%2F%2Flocalhost%3A8888%2Fapi%2Fsmart-client%2Flaunch&patient=&prov_skip_auth=1&prov_skip_login=1&provider=e443ac58-8ece-4385-8d55-775c1b8f3a37&pt_skip_auth=1&public_key=&sde=&sim_ehr=0&token_lifetime=15&user_pt=

// redirects to:

import express from "express";
import cors from "cors";
import launchHandler from "./launch-handler";
import redirectHandler from "./redirect-handler";
import config from "./smart-client-config";
import cookieParser from "cookie-parser";

const app: express.Application = express();
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const router = express.Router();

router.get("/launch", launchHandler);
router.get("/redirect", redirectHandler);

app.use(express.json());
app.use(config.paths("/smart-client"), router);
export default app;
