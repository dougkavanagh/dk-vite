import { Request, Response } from "express";
import {
  SiteCredentialsService,
  SiteCredentials,
} from "~/services/site/site-credentials-service";
import { dbConnect } from "~/services/core/db-client";
import {
  AuthorizationCode,
  AuthorizationCodeService,
} from "~/services/auth/authorization-code-service";
import { URL } from "url";
import base64url from "base64-url";
import { getContext, getSignInUrl } from "~/services/session/session-service";

function stringIsAValidUrl(s: string) {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
}

export async function handleAuthorizeRequest(req: Request, res: Response) {
  const {
    response_type,
    client_id,
    client_secret,
    redirect_uri,
    scope,
    state,
    access_type,
    code_challenge,
    code_challenge_method,
  } = req.method === "POST" ? req.body : req.query;
  const contentType = req.header("content-type");
  if (
    req.method === "POST" &&
    !contentType?.includes("application/x-www-form-urlencoded")
  ) {
    return res
      .status(400)
      .send(
        `Content-Type must be application/x-www-form-urlencoded; was ${contentType}`
      );
  }
  if (response_type !== "code") {
    return res.status(401).send("response_type must be 'code'");
  }
  if (!scope?.trim()) {
    return res.status(401).send("scope must be populated");
  }
  const scopes = scope.split(" ");
  if (!client_id) {
    return res.status(401).send("Missing client_id headers");
  }
  if (access_type && access_type !== "offline") {
    return res.status(401).send("access_type must be 'offline'");
  }
  if (!stringIsAValidUrl(redirect_uri)) {
    return res.status(401).send("redirect_uri must be a valid URL");
  }
  if (!code_challenge) {
    return res.status(401).send("code_challenge must be specified");
  }
  if (code_challenge_method !== "S256") {
    return res.status(401).send("code_challenge_method must be 'S256'");
  }
  dbConnect();
  if (client_secret) {
    handleClientCredentials();
  } else {
    handleSessionBasedAuth();
  }

  async function handleClientCredentials() {
    const creds: SiteCredentials | null = await SiteCredentialsService.validate(
      client_id,
      client_secret
    );
    if (!creds) {
      return res.status(401).send("Invalid client_id or client_secret");
    }
    const code = await AuthorizationCodeService.createFromSiteCredentials({
      credentials: creds,
      codeChallenge: code_challenge,
      codeChallengeMethod: code_challenge_method,
      scopes,
    });
    if (!code) {
      return res
        .status(400)
        .send("Unable to create authorization code based on site credentials");
    }
    redirect(code);
  }
  async function handleSessionBasedAuth() {
    const context = getContext(req);
    if (!context.user) {
      return res.redirect(getSignInUrl());
    }
    if (!context.user?.roles.admin) {
      return res
        .status(400)
        .send(
          "You must be signed in as an administrator user to request an authorization code"
        );
    }
    const code = await AuthorizationCodeService.createFromSessionContext({
      context,
      clientId: client_id,
      codeChallenge: code_challenge,
      codeChallengeMethod: code_challenge_method,
      scopes,
    });
    if (!code) {
      return res
        .status(400)
        .send("Unable to create authorization code based on seession context");
    }
    redirect(code);
  }
  function redirect(code: AuthorizationCode) {
    res.redirect(
      redirect_uri +
        `?code=${base64url.encode(JSON.stringify(code))}&state=${state}`
    );
  }
}
