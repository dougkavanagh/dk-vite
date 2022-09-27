import jwt from "jsonwebtoken";
import Url from "url";
import config from "./smart-server-config";
import { Request, Response } from "express";

function formatErrorDescription(name: string, extras?: Array<unknown>): string {
  return name + (extras ? `: ${extras.join("; ")}` : "");
}

function redirectWithError(
  req: Request,
  res: Response,
  name: string,
  extras?: Array<unknown>
) {
  const redirectURL = Url.parse(req.query.redirect_uri?.toString() ?? "", true);
  redirectURL.query.error = name;
  redirectURL.query.error_description = formatErrorDescription(name, extras);
  if (req.query.state) {
    redirectURL.query.state = req.query.state.toString();
  }
  return res.redirect(Url.format(redirectURL));
}

function replyWithError(
  res: Response,
  name: string,
  code = 500,
  extras?: Array<unknown> | string
) {
  if (typeof extras == "string") {
    extras = [extras];
  }
  return res.status(code).send(formatErrorDescription(name, extras));
}

function bool(x: unknown) {
  const RE_FALSE = /^(0|no|false|off|null|undefined|NaN|)$/i;
  return !RE_FALSE.test(String(x).trim());
}

function parseToken(token: string) {
  if (typeof token != "string") {
    throw new Error("The token must be a string");
  }

  const parts = token.split(".");

  if (parts.length != 3) {
    throw new Error("Invalid token structure");
  }

  return JSON.parse(new Buffer(token[1], "base64").toString("utf8"));
}

// require a valid auth token if there is an auth token
function checkAuth(req: Request, res: Response, next: () => void) {
  if (req.headers.authorization) {
    try {
      jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret);
    } catch (e: unknown) {
      return res
        .status(401)
        .send(
          `${(e as Error).name ?? "Error"}: ${
            (e as Error).message ?? "Invalid token"
          }`
        );
    }
  }
  next();
}

function normalizeUrl(url: string) {
  return url.replace(/^\//g, "").replace(/\/$/g, "");
}

export default {
  redirectWithError,
  replyWithError,
  bool,
  parseToken,
  checkAuth,
  normalizeUrl,
};
