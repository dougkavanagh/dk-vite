import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import base64url from "base64-url";
//import jwkToPem from "jwk-to-pem";
import config from "./smart-server-config";
import SMARTHandler from "./smart-handler";
import Lib from "./lib";
import ScopeSet from "./scope-set";
import { Request, Response } from "express";

// Generate this PEM cert once when the server starts and use it later to sign
// the id tokens
let PRIVATE_KEY: string | null = null;

interface ClientDetailsToken extends JwtPayload {
  auth_error?: string;
  iss: string;
  user: string;
  client_id: string;
  nonce?: string;
}

class TokenHandler extends SMARTHandler {
  /**
   * This is the typical public static entry point designed to be easy to use
   * as route handler.
   * @param {Object} req
   * @param {Object} res
   */
  static handleRequest(req: Request, res: Response) {
    return new TokenHandler(req, res).handle();
  }

  /**
   * Validates that the request is form-urlencoded" POST and then uses the
   * grant_type parameter to pick the right flow
   */
  handle() {
    const req = this.request;
    const res = this.response;

    // Require "application/x-www-form-urlencoded" POSTs
    const ct = req.headers["content-type"] || "";
    if (ct.indexOf("application/x-www-form-urlencoded") !== 0) {
      return Lib.replyWithError(res, "form_content_type_required", 401);
    }

    switch (req.body.grant_type) {
      case "client_credentials":
        return this.handleBackendService();
      case "authorization_code":
        return this.handleAuthorizationCode();
      case "refresh_token":
        return this.handleRefreshToken();
    }

    Lib.replyWithError(res, "bad_grant_type", 400);
  }

  /**
   * Handles the backend service authorization requests. Parses and validates
   * input params and eventually calls this.finish() with the parsed client
   * details token.
   */
  handleBackendService() {
    const req = this.request;
    const res = this.response;

    // client_assertion_type is required (not used by Ocean though)
    // if (!req.body.client_assertion_type) {
    //   return Lib.replyWithError(res, "missing_client_assertion_type", 401);
    // }

    // client_assertion_type must have a fixed value
    if (
      req.body.client_assertion_type !=
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
    ) {
      return Lib.replyWithError(res, "invalid_client_assertion_type", 401);
    }

    // client_assertion must be a token
    let authenticationToken;
    try {
      authenticationToken = Lib.parseToken(req.body.client_assertion);
    } catch (ex) {
      return Lib.replyWithError(
        res,
        "invalid_registration_token",
        401,
        (ex as Error).message
      );
    }

    // The client_id must be a token
    let clientDetailsToken: ClientDetailsToken;
    try {
      clientDetailsToken = Lib.parseToken(
        authenticationToken.sub
      ) as ClientDetailsToken;
    } catch (ex) {
      return Lib.replyWithError(
        res,
        "invalid_client_details_token",
        401,
        (ex as Error).message
      );
    }

    // simulate expired_registration_token error
    if (clientDetailsToken.auth_error == "token_expired_registration_token") {
      return Lib.replyWithError(res, "token_expired_registration_token", 401);
    }

    // Validate authenticationToken.aud (must equal this url)
    const tokenUrl = config.baseUrl + req.originalUrl;
    if (
      tokenUrl.replace(/^https?/, "") !==
      authenticationToken.aud.replace(/^https?/, "")
    ) {
      return Lib.replyWithError(res, "invalid_aud", 401, tokenUrl);
    }

    // Validate authenticationToken.iss (must equal whatever the user entered at
    // registration time, i.e. clientDetailsToken.iss)
    if (authenticationToken.iss !== clientDetailsToken.iss) {
      return Lib.replyWithError(res, "invalid_token_iss", 401, [
        authenticationToken.iss,
        clientDetailsToken.iss,
      ]);
    }

    // simulated invalid_jti error
    if (clientDetailsToken.auth_error == "invalid_jti") {
      return Lib.replyWithError(res, "invalid_jti", 401);
    }

    // Validate scope
    const tokenError = ScopeSet.getInvalidSystemScopes(req.body.scope);
    if (tokenError) {
      return Lib.replyWithError(res, "invalid_scope", 401, tokenError);
    }

    // simulated token_invalid_scope
    if (clientDetailsToken.auth_error == "token_invalid_scope") {
      return Lib.replyWithError(res, "token_invalid_scope", 401);
    }

    try {
      jwt.verify(
        req.body.client_assertion,
        base64url.decode(clientDetailsToken.pub_key),
        { algorithms: ["RS256"] }
      );
    } catch (e) {
      return Lib.replyWithError(
        res,
        "invalid_token",
        401,
        (e as Error).message
      );
    }

    return this.finish(clientDetailsToken);
  }

  /**
   * Handles the common authorization requests. Parses and validates
   * token from request.body.code and eventually calls this.finish() with it.
   */
  handleAuthorizationCode() {
    try {
      const token = jwt.verify(
        this.request.body.code,
        config.jwtSecret
      ) as ClientDetailsToken;
      return this.finish(token);
    } catch (e: unknown) {
      return Lib.replyWithError(
        this.response,
        "invalid_token",
        401,
        (e as Error).message ?? e
      );
    }
  }

  /**
   * Handles the refresh_token authorization requests. Parses and validates
   * token from request.body.refresh_token and eventually calls this.finish()
   * with it.
   */
  handleRefreshToken() {
    let token: ClientDetailsToken;
    try {
      token = jwt.verify(
        this.request.body.refresh_token,
        config.jwtSecret
      ) as ClientDetailsToken;
    } catch (e: unknown) {
      return Lib.replyWithError(
        this.response,
        "invalid_token",
        401,
        (e as Error).message ?? e
      );
    }

    if (token.auth_error == "token_expired_refresh_token") {
      return Lib.replyWithError(
        this.response,
        "sim_expired_refresh_token",
        401
      );
    }

    return this.finish(token);
  }

  /**
   * Validates authorization header and/or triggers custom authorization
   * errors for confidential clients
   */
  validateAuth(clientDetailsToken: ClientDetailsToken) {
    const authHeader = this.request.headers.authorization;
    if (authHeader && authHeader.search(/^basic\s*/i) === 0) {
      const req = this.request;
      const res = this.response;

      // Simulate invalid client secret error
      if (
        req.body.auth_error == "auth_invalid_client_secret" ||
        clientDetailsToken.auth_error == "auth_invalid_client_secret"
      ) {
        Lib.replyWithError(res, "sim_invalid_client_secret", 401);
        return false;
      }

      const auth: string = authHeader.replace(/^basic\s*/i, "");

      // Check for empty auth
      if (!auth) {
        Lib.replyWithError(res, "empty_auth_header", 401, authHeader);
        return false;
      }

      // Check for invalid base64
      let authParts: string[];
      try {
        authParts = new Buffer(auth, "base64").toString().split(":");
      } catch (e: unknown) {
        Lib.replyWithError(
          res,
          "bad_auth_header",
          401,
          [authHeader, (e as Error).message ?? ""].join("; ")
        );
        return false;
      }

      // Check for bad auth syntax
      if (authParts.length != 2) {
        const msg =
          "The decoded header must contain '{client_id}:{client_secret}'";
        Lib.replyWithError(res, "bad_auth_header", 401, [authHeader, msg]);
        return false;
      }
    }
    return true;
  }

  createIdToken(clientDetailsToken: ClientDetailsToken) {
    interface Payload {
      profile: string;
      fhirUser: string;
      aud: string;
      sub: string;
      iss: string;
      nonce?: string;
    }
    const iss = config.fhirUrl;
    const payload: Payload = {
      profile: clientDetailsToken.user,
      fhirUser: clientDetailsToken.user,
      aud: clientDetailsToken.client_id,
      sub: crypto
        .createHash("sha256")
        .update(clientDetailsToken.user)
        .digest("hex"),
      iss,
    };
    // Reflect back the nonce if it was provided in the original Authentication
    // Request.
    const { nonce } = clientDetailsToken;
    if (nonce) {
      payload.nonce = nonce;
    }
    if (!PRIVATE_KEY) {
      PRIVATE_KEY = config.privateKey; //jwkToPem(config.oidcKeyPair.jwk, { private: true });
    }
    return jwt.sign(payload, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: `${clientDetailsToken.accessTokensExpireIn || 60} minutes`,
    });
  }

  generateRefreshToken(code: JwtPayload) {
    type RefreshTokenPayload = {
      context?: string;
      client_id?: string;
      scope?: string;
      user?: string;
      iat?: number;
      auth_error?: string;
    };
    const token: RefreshTokenPayload = {};
    if (code.context) {
      token.context = code.context;
    }
    if (code.client_id) {
      token.client_id = code.client_id;
    }
    if (code.scope) {
      token.scope = code.scope;
    }
    if (code.user) {
      token.user = code.user;
    }
    if (code.iat) {
      token.iat = code.iat;
    }
    if (code.auth_error) {
      token.auth_error = code.auth_error;
    }
    return jwt.sign(token, config.jwtSecret, {
      expiresIn: config.refreshTokenLifeTime * 60,
    });
  }

  finish(clientDetailsToken: ClientDetailsToken) {
    try {
      const req = this.request;
      const res = this.response;

      // Request from confidential client
      if (!this.validateAuth(clientDetailsToken)) {
        return;
      }

      const scope = new ScopeSet(decodeURIComponent(clientDetailsToken.scope));

      if (clientDetailsToken.auth_error == "token_invalid_token") {
        return Lib.replyWithError(res, "sim_invalid_token", 401);
      }

      // refresh_token
      if (scope.has("offline_access") || scope.has("online_access")) {
        clientDetailsToken.context.refresh_token =
          this.generateRefreshToken(clientDetailsToken);
      }

      const expiresIn = 5 * 60; // 5 minutes

      const token = Object.assign({}, clientDetailsToken.context, {
        token_type: "bearer",
        scope: clientDetailsToken.scope,
        client_id: req.body.client_id,
        expires_in: expiresIn,
      });

      // sim_error
      if (clientDetailsToken.auth_error == "request_invalid_token") {
        token.sim_error = "Invalid token";
      } else if (clientDetailsToken.auth_error == "request_expired_token") {
        token.sim_error = "Token expired";
      }

      // id_token
      if (
        clientDetailsToken.user &&
        scope.has("openid") &&
        (scope.has("profile") || scope.has("fhirUser"))
      ) {
        token.id_token = this.createIdToken(clientDetailsToken);
      }

      if (clientDetailsToken.sde) {
        token.serviceDiscoveryURL = clientDetailsToken.sde;
      }

      // access_token
      token.access_token = jwt.sign(token, config.jwtSecret, { expiresIn });

      // The authorization servers response must include the HTTP
      // Cache-Control response header field with a value of no-store,
      // as well as the Pragma response header field with a value of no-cache.
      res.set({
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      });

      res.json(token);
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}

export default TokenHandler;
