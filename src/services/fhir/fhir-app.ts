import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response, Router } from "express";
import { handleAuthorizeRequest } from "~/services/auth/authorize-handler";
import { handleTokenRequest } from "~/services/auth/token-handler";
import { paths } from "~/services/core/env";
import logger from "~/services/core/logger";
import { verifyBearerToken } from "~/services/session/session-service";
import { AppointmentFhirHandler } from "./handlers/appointment-fhir-handler";
import { AppointmentResponseFhirHandler } from "./handlers/appointment-response-fhir-handler";
import { CapabilityStatementFhirHandler } from "./handlers/capability-statement-fhir-handler";
import { ConsentFhirHandler } from "./handlers/consent-fhir-handler";
import { DocumentReferenceFhirHandler } from "./handlers/document-reference-fhir-handler";
import { ObservationFhirHandler } from "./handlers/observation-fhir-handler";
import { PatientFhirHandler } from "./handlers/patient-fhir-handler";
import { PractitionerFhirHandler } from "./handlers/practitioner-fhir-handler";
import { QuestionnaireResponseFhirHandler } from "./handlers/questionnaire-response-fhir-handler";
import { ScheduleFhirHandler } from "./handlers/schedule-fhir-handler";
import { ValueSetFhirHandler } from "./handlers/value-set-fhir-handler";

const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
createRouters();
export default app;

function createRouters() {
  createAuthRouter();
  const fhirRouter = createAuthorizedFhirRouter();
  createFhirRoutes(fhirRouter);
}
function createAuthorizedFhirRouter() {
  const fhirRouter = express.Router();
  app.use(paths("/fhir"), fhirRouter);
  app.get(
    paths("/test"),
    async (req: Request, res: Response, NextFunction): Promise<void> => {
      res.status(200).json("{}");
    }
  );
  fhirRouter.use(async (req: Request, res: Response, next) => {
    if (req.path === "/CapabilityStatement") {
      return next();
    }
    try {
      req.context = {
        user: verifyBearerToken(req).user,
      };
    } catch (e) {
      logger.error(e);
      return res.status(401).send("Invalid Bearer token");
    }
    next();
  });
  fhirRouter.use(function (req, res, next) {
    if (
      (req.method === "PUT" || req.method === "POST") &&
      "application/fhir+json" !== req.headers["content-type"]
    ) {
      return res.send(415);
    }
    res.type("application/fhir+json");
    next();
  });
  return fhirRouter;
}

function createAuthRouter() {
  const authRouter = express.Router();
  authRouter.all("/authorize", handleAuthorizeRequest);
  authRouter.post("/token", handleTokenRequest);
  app.use(paths("/fhir/auth"), authRouter);
}

function createFhirRoutes(fhirRouter: Router) {
  CapabilityStatementFhirHandler.setup(fhirRouter);
  PatientFhirHandler.setup(fhirRouter);
  ObservationFhirHandler.setup(fhirRouter);
  ScheduleFhirHandler.setup(fhirRouter);
  PractitionerFhirHandler.setup(fhirRouter);
  AppointmentFhirHandler.setup(fhirRouter);
  DocumentReferenceFhirHandler.setup(fhirRouter);
  ValueSetFhirHandler.setup(fhirRouter);
  AppointmentResponseFhirHandler.setup(fhirRouter);
  QuestionnaireResponseFhirHandler.setup(fhirRouter);
  ConsentFhirHandler.setup(fhirRouter);
}
