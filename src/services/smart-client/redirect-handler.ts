import { Request, Response, RequestHandler, NextFunction } from "express";
import { Issuer, Client, TokenSet } from "openid-client";
import { CLIENT_ID, redirectUrl, lookup } from "./smart-client-config";
import { verifyJwt } from "../session/session-service";
import { ClientLaunchState } from "./smart-client-types";
import logger from "../../services/core/logger";

// https://www.npmjs.com/package/openid-client

const handler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tokenSet = await checkOIDC(req, res, next);
    if (!tokenSet) {
      return;
    }
    const claims = tokenSet.claims();
    const smartUserId = tokenSet.claims().sub + "@" + claims.iss;
    res.json({
      body: { smartUserId },
      status: 200,
    });
  } catch (e: unknown) {
    logger.error(e);
    next(
      e instanceof Error ? e.message : `Error returned from SMART server: ${e}`
    );
  }
};
async function checkOIDC(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<TokenSet | void> {
  if (req.query.error) {
    return next(
      `Error returned from SMART server as part of the redirect: ${req.query.error}`
    );
  }
  if (!req.query.state) {
    return next(`Missing state parameter from SMART redirect`);
  }
  let state: ClientLaunchState | null = null;
  try {
    state = verifyJwt(req.query.state.toString()) as ClientLaunchState;
  } catch (e) {
    return next(`Bad state token`);
  }
  const issuerUrl = state.issuerUrl;
  if (!issuerUrl) {
    return next(
      `Issuer value was not available in the SMART client redirect; it should have been stored in the state from the initial launch`
    );
  }

  const issuerConfig = lookup(issuerUrl);
  if (!issuerConfig) {
    return next(`Issuer from SMART server is not in allowlist: ${issuerUrl}`);
  }

  const issuer: Issuer<Client> = await Issuer.discover(issuerUrl);
  const client = new issuer.Client({
    client_id: CLIENT_ID,
    token_endpoint_auth_method: "none",
  });
  client.grant({
    grant_type: "authorization_code",
    code: req.query.code,
  });
  //https://github.com/panva/node-openid-client/blob/main/docs/README.md#clientcallbackredirecturi-parameters-checks-extras

  const params = client.callbackParams(req);
  try {
    const tokenSet = await client.callback(redirectUrl, params, {
      state: req.query.state.toString(),
    });
    logger.info(`received and validated tokens for ${issuerUrl}`);
    return tokenSet;
  } catch (e: unknown) {
    logger.error(`Error returned from SMART server while fetching token: ${e}`);
  }
}
export default handler;

// interface TokenResponse {
//   need_patient_banner: boolean;
//   smart_style_url: string;
//   patient?: string;
//   encounter?: string;
//   refresh_token?: string;
//   token_type: "bearer";
//   expires_in: number;
//   scope: string;
//   client_id: string;
//   id_token?: string;
//   access_token: string;
//   code: string;
//   state: string;
// }
