import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { SiteCredentialsService } from "~/services/site/site-credentials-service";
import { signObject } from "~/services/session/session-service";
import { dbConnect } from "~/services/core/db-client";
import { DEPLOY_URL, ENDPOINT_PUBLIC_PREFIX } from "~/services/core/env";
import { SessionUser } from "~/services/session/session-model";
import crypto from "crypto";
import base64url from "base64-url";
import {
  AuthorizationCode,
  AuthorizationCodeService,
} from "~/services/auth/authorization-code-service";

export async function handleTokenRequest(req: Request, res: Response) {
  const { client_id, client_secret, grant_type, scope, code, code_verifier } =
    req.body;
  if (
    !req.header("content-type")?.includes("application/x-www-form-urlencoded")
  ) {
    return res
      .status(400)
      .send("Content-Type must be application/x-www-form-urlencoded");
  }
  dbConnect();
  if (grant_type === "authorization_code") {
    handleAuthorizationCode({
      req,
      res,
      client_id,
      code,
      code_verifier,
      scope,
    });
  } else if (grant_type === "client_credentials") {
    handleClientCredentials({ req, res, client_id, client_secret, scope });
  } else {
    return res
      .status(401)
      .send("grant_type must be code or client_credentials");
  }
}

async function handleClientCredentials(args: {
  req: Request;
  res: Response;
  client_id: string;
  client_secret: string;
  scope: string;
}) {
  const { req, res, client_id, client_secret, scope } = args;
  if (!client_id || !client_secret) {
    return res.status(401).send("Missing client_id and client_secret headers");
  }
  const creds = await SiteCredentialsService.validate(client_id, client_secret);
  if (!creds) {
    return res.status(401).send("Invalid client_id or client_secret");
  }
  const user = {
    siteId: creds.siteId,
    accessibleSiteIds: [creds.siteId],
    clientId: creds.clientId,
    roles: {
      admin: false,
    },
    profile: {
      displayName: `OAuth2 client_credentials user ${creds.clientId}`,
    },
  };
  sendAccessToken(req, res, client_id, user, scope);
}

async function handleAuthorizationCode(args: {
  req: Request;
  res: Response;
  client_id: string;
  code: string;
  code_verifier?: string;
  scope: string;
}) {
  const { req, res, client_id, code, code_verifier, scope } = args;
  if (!code) {
    return res.status(401).send("Missing authorization code");
  }
  const providedAuthCode = JSON.parse(
    base64url.decode(code)
  ) as AuthorizationCode;
  const storedAuthCode = await AuthorizationCodeService.findAndRemoveById(
    providedAuthCode.id
  );
  if (!storedAuthCode) {
    return res.status(401).send("Invalid authorization code");
  }
  if (storedAuthCode.expiresAt < new Date()) {
    return res.status(401).send("Authorization code has expired");
  }
  if (storedAuthCode.codeChallenge) {
    if (!code_verifier) {
      return res.status(401).send("Authorization code_verifier is missing");
    }
    if (code_verifier.length < 43) {
      return res
        .status(400)
        .send(
          "Authorization code_verifier is too short (must be at least 43 characters)"
        );
    }
    const codeChallenge = crypto
      .createHash("sha256")
      .update(code_verifier ?? "")
      .digest("base64");
    if (
      codeChallenge !==
      Buffer.from(storedAuthCode.codeChallenge, "base64").toString("base64")
    ) {
      return res.status(401).send("Authorization code challenge failed");
    }
  }
  const user = {
    siteId: storedAuthCode.siteId,
    accessibleSiteIds: [storedAuthCode.siteId],
    roles: {
      admin: false,
    },
    profile: {
      displayName: `OAuth2 authorization_code user`,
    },
  };
  sendAccessToken(req, res, client_id, user, scope);
}

function sendAccessToken(
  req: Request,
  res: Response,
  client_id: string,
  user: SessionUser,
  scope: string
) {
  const expiresIn = 60 * 60;
  const accessTokenPayload: JwtPayload = {
    iss: DEPLOY_URL + req.baseUrl,
    aud: DEPLOY_URL + ENDPOINT_PUBLIC_PREFIX + "/fhir",
    sub: client_id,
    exp: Math.floor(Date.now() / 1000) + expiresIn,
    iat: Math.floor(Date.now() / 1000),
    user,
  };
  const token = signObject(accessTokenPayload, {});
  res.status(200);
  res.json({
    access_token: token,
    refresh_token: token,
    token_type: "Bearer",
    expires_in: expiresIn,
    scope: scope,
  });
}
