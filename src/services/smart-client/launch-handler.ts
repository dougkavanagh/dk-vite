import { RequestHandler, NextFunction, Request, Response } from "express";
import { signObject } from "../session/session-service";
import { Issuer, Client } from "openid-client";
import config from "./smart-client-config";
import { ClientLaunchState } from "./smart-client-types";

// https://www.npmjs.com/package/openid-client

const handler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const issuerUrl = req.query.iss?.toString();
    if (!issuerUrl) {
      throw "missing iss";
    }

    const redirectUrl = config.redirectUrl;
    const issuer: Issuer<Client> = await Issuer.discover(issuerUrl);
    const clientId = config.CLIENT_ID;
    const client = new issuer.Client({
      client_id: clientId,
      redirect_uris: [redirectUrl],
      response_types: ["code"],
    });
    const state: ClientLaunchState = {
      issuerUrl: issuerUrl,
    };

    const smartServerRedirectUrl = client
      .authorizationUrl({
        response_type: "code",
        client_id: clientId,
        aud: issuerUrl,
        scope: [
          "launch",
          "launch/patient",
          "online_access",
          "openid",
          "profile",
          "fhirUser",
          "patient/Patient.read",
          "patient/Observation.read",
          "user/*.*",
          "user/Practitioner.read",
        ].join(" "),
        redirect_uri: redirectUrl,
        launch: req.query.launch?.toString(),
        state: signObject(state),
      })
      .replace("https://localhost", "http://localhost");
    res.redirect(smartServerRedirectUrl);
  } catch (e: unknown) {
    next(e);
  }
};
export default handler;
