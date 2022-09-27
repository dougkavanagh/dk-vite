import logger from "./logger";

export const DEPLOY_URL = process.env.DEPLOY_URL ?? "";
export const PUBLIC_PROD_URL = process.env.PUBLIC_PROD_URL ?? DEPLOY_URL;
export const ENDPOINT_ACTUAL_PREFIX = "/.netlify/functions";
export const ENDPOINT_PUBLIC_PREFIX = "/api";

export const ENVIRONMENT = process.env.NODE_ENV;
export const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

// must be RS256
export const OIDC_PRIVATE_KEY = Buffer.from(
  process.env.OIDC_PRIVATE_KEY_BASE64 ?? "",
  "base64"
).toString();
export const OIDC_PUBLIC_KEY = Buffer.from(
  process.env.OIDC_PUBLIC_KEY_BASE64 ?? "",
  "base64"
).toString();
export const OIDC_KID = process.env.OIDC_KID ?? "";

export const SESSION_SECRET = process.env.SESSION_SECRET ?? "";
if (!SESSION_SECRET) {
  logger.error("No client secret. Set SESSION_SECRET environment variable.");
}

export const MONGODB_URI =
  (prod ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL) ?? "";
if (!MONGODB_URI) {
  if (prod) {
    logger.error(
      "No mongo connection string. Set MONGODB_URI environment variable."
    );
  } else {
    logger.error(
      "No mongo connection string. Set MONGODB_URI_LOCAL environment variable."
    );
  }
}
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? "";

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? "";
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? "";

export const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID ?? "";
export const APPLE_CLIENT_SECRET = process.env.APPLE_CLIENT_SECRET ?? "";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? "";
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? "";
export const TWILIO_PHONE_NUM = process.env.TWILIO_PHONE_NUM ?? "";

export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?? "";

export const APP_AWS_REGION = process.env.APP_AWS_REGION ?? "";
export const APP_AWS_S3_ACCESS_KEY = process.env.APP_AWS_S3_ACCESS_KEY ?? "";
export const APP_AWS_S3_SECRET_KEY = process.env.APP_AWS_S3_SECRET_KEY ?? "";
export const APP_AWS_S3_BUCKET = process.env.APP_AWS_S3_BUCKET ?? "";

export function paths(path: string): string[] {
  return [
    `${ENDPOINT_ACTUAL_PREFIX}${path}`,
    `${ENDPOINT_PUBLIC_PREFIX}${path}`,
  ];
}
