import {
  OIDC_PRIVATE_KEY,
  OIDC_PUBLIC_KEY,
  OIDC_KID,
  paths,
  DEPLOY_URL,
  SESSION_SECRET,
  ENDPOINT_PUBLIC_PREFIX,
} from "../core/env";
import { pem2jwk } from "pem-jwk";

const servicePath = "/smart-server";
const serviceUrl = DEPLOY_URL + ENDPOINT_PUBLIC_PREFIX + servicePath;
const fhirPath = "/fhir";
const authPath = "/auth/authorize";
const tokenPath = "/auth/token";
const introspectPath = "/introspect";
const keysPath = "/keys";

const JWK = pem2jwk(OIDC_PRIVATE_KEY);
const publicJwk = {
  alg: "RS256",
  kid: OIDC_KID,
  use: "sig",
  e: JWK.e,
  n: JWK.n,
  kty: JWK.kty,
};

const config = {
  paths,
  baseUrl: DEPLOY_URL,
  servicePath: servicePath,
  serviceUrl: serviceUrl,
  authPath,
  authUrl: serviceUrl + authPath,
  fhirPath,
  fhirUrl: serviceUrl + fhirPath,
  tokenPath,
  tokenUrl: serviceUrl + tokenPath,
  introspectPath,
  introspectUrl: serviceUrl + introspectPath,
  keysPath,
  keysUrl: serviceUrl + keysPath,
  jwtSecret: SESSION_SECRET,
  accessTokenLifetime: process.env.ACCESS_TOKEN_LIFETIME || 60, // minutes
  refreshTokenLifeTime: (process.env.REFRESH_TOKEN_LIFETIME ||
    60 * 24 * 365) as number, // minutes
  backendServiceAccessTokenLifetime:
    process.env.BACKEND_ACCESS_TOKEN_LIFETIME || 15, // minutes
  publicJwk: publicJwk,
  publicKey: OIDC_PUBLIC_KEY,
  privateKey: OIDC_PRIVATE_KEY,
  errors: {
    missing_parameter: "Missing %s parameter",
    invalid_parameter: "Invalid %s parameter",
    missing_response_type_parameter: "Missing response_type parameter",
    missing_client_id_parameter: "Missing client_id parameter",
    missing_scope_parameter: "Missing scope parameter",
    missing_state_parameter: "Missing state parameter",
    missing_redirect_uri_parameter: "Missing redirect_uri parameter",
    bad_redirect_uri: "Bad redirect_uri: %s",
    bad_audience: "Bad audience value",
    no_redirect_uri_protocol:
      "Invalid redirect_uri parameter '%s' (must be full URL)",
    unauthorized: "Unauthorized",
    form_content_type_required:
      "Invalid request content-type header (must be 'application/x-www-form-urlencoded')",
    sim_invalid_client_id: "Simulated invalid client_id parameter error",
    sim_invalid_redirect_uri: "Simulated invalid redirect_uri parameter error",
    sim_invalid_scope: "Simulated invalid scope error",
    sim_invalid_client_secret: "Simulated invalid client secret error",
    sim_invalid_token: "Simulated invalid token error",
    sim_expired_refresh_token: "Simulated expired refresh token error",
    invalid_token: "Invalid token: %s",
    empty_auth_header: "The authorization header '%s' cannot be empty",
    bad_auth_header: "Bad authorization header '%s': %s",
    missing_client_assertion_type: "Missing client_assertion_type parameter",
    invalid_client_assertion_type:
      "Invalid client_assertion_type parameter. Must be 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'.",
    invalid_jti: "Invalid 'jti' value",
    invalid_aud: "Invalid token 'aud' value. Must be '%s'.",
    invalid_token_iss:
      "The given service url '%s' does not match the registered '%s'",
    token_expired_registration_token: "Registration token expired",
    invalid_registration_token: "Invalid registration token: %s",
    invalid_client_details_token: "Invalid client details token: %s",
    invalid_scope: 'Invalid scope: "%s"',
    missing_scope: "Empty scope",
    token_invalid_scope: "Simulated invalid scope error",
    bad_grant_type: "Unknown or missing grant_type parameter",
  } as Record<string, string>,
  includeEncounterContextInStandaloneLaunch: true,
};
export default config;
