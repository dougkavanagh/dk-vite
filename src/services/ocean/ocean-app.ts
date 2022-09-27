import express from "express";
import { Request, Response } from "express";
import { paths } from "~/services/core/env";
import logger, { info } from "~/services/core/logger";
import { dbConnect } from "~/services/core/db-client";
import { handleMessage } from "./service-request-handler";
import {
  getContext,
  SessionContext,
  verifyBearerToken,
} from "~/services/session/session-service";

const app: express.Application = express();
app.use(
  express.json({
    type: ["application/json", "application/fhir+json"],
    limit: "10mb",
  })
);
const router = express.Router();
router.get("", (_, res: Response) => {
  res.send(
    "Webhook endpoint; expecting a POST for a challenge reply or a service request payload"
  );
});
router.post("", async (req: Request, res: Response): Promise<void> => {
  info(`Received POST request at /ocean {$req.body}`);
  const { challenge } = req.body;
  if (challenge) {
    res.status(200).type("application/json").send({
      challenge: challenge,
    });
  } else {
    await dbConnect();
    try {
      const jwt = verifyBearerToken(req);
      req.context = {
        user: jwt.user,
      } as SessionContext;
    } catch (e) {
      logger.error(e);
      res.status(401).send("Invalid Bearer token");
      return;
    }
    handleMessage(getContext(req), req.body);
    res.status(200).type("application/json").send({
      success: true,
    });
  }
});
app.use(paths("/ocean"), router);
export default app;
