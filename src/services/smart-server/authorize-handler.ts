import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import Url from "url";
import ScopeSet from "./scope-set";
import config from "./smart-server-config";
import Lib from "./lib";
import SMARTHandler from "./smart-handler";
import logger from "../../services/core/logger";
import { getUser, getSignInUrl } from "../session/session-service";
import { SessionUser } from "../session/session-model";

interface Sim {
  sde: string;
  sim_ehr: string;
  context: unknown;
  launch_pt: string;
  auth_error: string;
  aud_validated: string;
  skip_login: string;
  skip_auth: string;
  encounter: string;
  provider: string;
  patient: string;
}
class AuthorizeHandler extends SMARTHandler {
  sim: Sim;
  scope: ScopeSet;
  nonce?: string;
  user: SessionUser | null;

  static handleRequest(req: Request, res: Response) {
    return new AuthorizeHandler(req, res).handle();
  }

  constructor(req: Request, res: Response) {
    super(req, res);
    this.sim = this.getRequestedSIM() ?? ({} as Sim);
    const scope = req.query.scope?.toString();
    this.scope = new ScopeSet(decodeURIComponent(scope ?? ""));
    this.nonce = req.query.nonce
      ? decodeURIComponent(req.query.nonce.toString())
      : undefined;
    this.user = getUser(this.request.headers.cookie?.toString());
  }

  /**
   * Extracts and returns the sim portion of the URL. If it is missing or invalid,
   * an empty object is returned. NOTE: the "sim" is the "launch" query parameter
   * for EHR launches or an URL segment for standalone launches
   * @returns {Object}
   */
  getRequestedSIM(): Sim | null {
    const sim = null;
    const request = this.request;
    if (request.query.launch || request.params.sim) {
      // set sim if appropriate
    }
    return sim;
  }

  /**
   * Creates and returns the signet JWT code that contains some authorization
   * details.
   */
  createAuthCode() {
    interface Code {
      context: {
        need_patient_banner: boolean;
        smart_style_url: string;
        patient?: string;
        encounter?: string;
      };
      client_id?: string;
      scope?: string;
      sde: string;
      user?: string;
      nonce?: string;
    }
    const sim = this.sim;
    const scope = this.scope;
    const code: Code = {
      context: Object.assign({}, sim.context || {}, {
        need_patient_banner: !sim.sim_ehr,
        smart_style_url: config.serviceUrl + "/smart-style.json",
      }),
      client_id: this.request.query.client_id?.toString(),
      scope: this.request.query.scope?.toString(),
      sde: sim.sde,
    };

    // patient
    if (sim.patient && sim.patient != "-1") {
      if (scope.has("launch") || scope.has("launch/patient")) {
        code.context.patient = sim.patient;
      }
    }

    // encounter
    if (sim.encounter && sim.encounter != "-1") {
      if (scope.has("launch") || scope.has("launch/encounter")) {
        code.context.encounter = sim.encounter;
      }
    }

    // user
    if (
      scope.has("openid") &&
      (scope.has("profile") || scope.has("fhirUser"))
    ) {
      // patient as user
      if (sim.launch_pt) {
        if (sim.patient && sim.patient != "-1") {
          code.user = `Patient/${sim.patient}`;
        }
      } else if (sim.provider && sim.provider != "-1") {
        code.user = `Practitioner/${sim.provider}`;
      } else if (this.user) {
        code.user = `User/${this.user.userId}`;
      }
    }

    // Add nonce, if provided, so it can be reflected back in the subsequent
    // token request.
    if (this.nonce) {
      code.nonce = this.nonce;
    }

    return jwt.sign(code, config.jwtSecret, { expiresIn: "5m" });
  }

  validateParams() {
    const req = this.request;
    const res = this.response;
    const sim = this.sim;

    // Assert that all the required params are present
    // NOTE that "redirect_uri" MUST be first!
    const requiredParams = [
      "redirect_uri",
      "response_type",
      "client_id",
      "scope",
      "state",
    ];
    if (!sim.aud_validated) {
      requiredParams.push("aud");
    }

    const missingParams = requiredParams.filter((param) => req.query.param);
    if (missingParams.length > 0) {
      const missingParam = missingParams[0];
      if (missingParam == "redirect_uri") {
        Lib.replyWithError(res, "missing_parameter", 400, [missingParam]);
      } else {
        Lib.redirectWithError(req, res, "missing_parameter", [missingParam]);
      }
      return false;
    }

    // bad_redirect_uri if we cannot parse it
    let redirectURL;
    try {
      redirectURL = Url.parse(
        decodeURIComponent(req.query.redirect_uri?.toString() ?? ""),
        true
      );
    } catch (e) {
      Lib.replyWithError(res, "bad_redirect_uri", 400, [(<Error>e).message]);
      return false;
    }

    // Relative redirect_uri like "whatever" will eventually result in wrong
    // URLs like "/auth/whatever". We must only support full URLs.
    if (!redirectURL.protocol) {
      Lib.replyWithError(res, "no_redirect_uri_protocol", 400, [
        req.query.redirect_uri,
      ]);
      return false;
    }

    // The "aud" param must match the apiUrl (but can have different protocol)
    if (!sim.aud_validated) {
      const apiUrl = config.fhirUrl;
      const normalizedAudUrl = Lib.normalizeUrl(req.query.aud?.toString() ?? "")
        .replace(/^https?/, "")
        .replace(/^:\/\/localhost/, "://127.0.0.1");
      const normalizedApiUrl = Lib.normalizeUrl(apiUrl)
        .replace(/^https?/, "")
        .replace(/^:\/\/localhost/, "://127.0.0.1");
      if (normalizedAudUrl != normalizedApiUrl) {
        logger.warn(
          `There is an aud (audience) mismatch in the authorize request sent from the SMART client: ${normalizedAudUrl} != ${normalizedApiUrl}`
        );
        Lib.redirectWithError(req, res, "bad_audience");
        return false;
      }
      sim.aud_validated = "1";
    }

    return true;
  }

  handle() {
    const req = this.request;
    const res = this.response;
    const sim = this.sim;

    // Handle response from picker, login or auth screen
    if (req.query.patient) sim.patient = req.query.patient as string;
    if (req.query.provider) sim.provider = req.query.provider as string;
    if (req.query.encounter) sim.encounter = req.query.encounter as string;
    if (req.query.auth_success) sim.skip_auth = "1";
    if (req.query.login_success) sim.skip_login = "1";
    if (req.query.aud_validated) sim.aud_validated = "1";

    // User decided not to authorize the app launch
    if (req.query.auth_success == "0") {
      return Lib.redirectWithError(req, res, "unauthorized");
    }

    // Simulate auth_invalid_client_id error if requested
    if (sim.auth_error == "auth_invalid_client_id") {
      return Lib.redirectWithError(req, res, "sim_invalid_client_id");
    }

    // Simulate auth_invalid_redirect_uri error if requested
    if (sim.auth_error == "auth_invalid_redirect_uri") {
      return Lib.redirectWithError(req, res, "sim_invalid_redirect_uri");
    }

    // Simulate auth_invalid_scope error if requested
    if (sim.auth_error == "auth_invalid_scope") {
      return Lib.redirectWithError(req, res, "sim_invalid_scope");
    }

    // Validate query parameters
    if (!req.query.redirect_uri) {
      Lib.replyWithError(res, "bad_redirect_uri", 400);
      return;
    }
    if (!this.validateParams()) {
      return;
    }

    if (this.redirectToEhrPromptIfNecessary()) {
      return;
    }

    // LAUNCH!
    const redirectURL = Url.parse(
      decodeURIComponent(req.query.redirect_uri.toString()),
      true
    );
    redirectURL.query.code = this.createAuthCode();
    if (req.query.state) {
      redirectURL.query.state = req.query.state.toString();
    }
    const url = Url.format(redirectURL);
    logger.info(`redirecting to ${url}`);
    res.redirect(url);
  }

  redirectToEhrPromptIfNecessary(): boolean {
    if (!this.user) {
      this.response.redirect(getSignInUrl());
      return true;
    }
    return false;
  }
}

export default AuthorizeHandler;
