// use jwt with same secret to decode
import cookie from "cookie";
import { Request, Response } from "express";
import { Jwt, JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";
import { Model } from "mongoose";
import { Id, isSiteAssociated, isSiteBound } from "../core/core-model";
import { prod, SESSION_SECRET } from "../core/env";
import { emptySession, SessionContext, SessionUser } from "./session-model";

export const SESSION_COOKIE_KEY = "session-jwt";
export type { SessionUser, SessionContext };
export { emptySession };
interface JwtWithUser extends Jwt {
  user?: SessionUser;
}
export function createContext({
  displayName,
  siteId,
  admin,
}: {
  displayName?: string;
  siteId?: string;
  admin?: boolean;
}): SessionContext {
  return {
    user: {
      profile: {
        displayName: displayName ?? "Test User",
      },
      roles: {
        admin: admin ?? false,
      },
      siteId: siteId ?? "",
      accessibleSiteIds: siteId ? [siteId] : [],
    },
  };
}

export function getContext(req: Request): SessionContext {
  return (
    req.context ?? {
      user: getUser(req.headers.cookie?.toString()),
    }
  );
}
export function ensureSiteId(context: SessionContext) {
  if (!context.user?.siteId) {
    throw new Error("Site not available");
  }
  validateSiteId(context.user.siteId);
  return context.user.siteId;
}

export function validateSiteId(siteId: string) {
  if (!siteId.match("[a-zA-Z0-9_]+")) {
    throw new Error("The siteId is in an invalid format");
  }
}

export function getUser(
  cookieHeaderValue: string | undefined | null
): SessionUser | null {
  try {
    const jwtObj = decodeJwtCookie(
      cookieHeaderValue,
      SESSION_COOKIE_KEY
    ) as JwtWithUser;
    if (!jwtObj?.user) {
      return null;
    }
    return jwtObj.user;
  } catch (e: unknown) {
    return null;
  }
}

function decodeJwtCookie(
  cookieHeaderValue: string | undefined | null,
  cookieName: string
): null | JwtPayload | string {
  const cookies = cookie.parse(cookieHeaderValue ?? "") as {
    [key: string]: string;
  };
  const cookieVal =
    Object.keys(cookies).length > 0 ? cookies[cookieName] : cookieHeaderValue;
  if (!cookieVal) {
    return null;
  }
  return verifyJwt(cookieVal);
}

export function verifyJwt(token: string): JwtPayload {
  const result = verify(token, SESSION_SECRET, {});
  if (typeof result === "string") {
    throw new Error("invalid jwt: " + result);
  }
  return result;
}

export function verifyBearerToken(req: Request): JwtPayload {
  const bearer = req.header("Authorization");
  if (!bearer || !bearer.startsWith("Bearer ")) {
    throw new Error("Missing Authorization header with 'Bearer ' prefix");
  }
  const token = bearer.split(" ")[1];
  return verifyJwt(token);
}

function sessionJwtCookieOptions() {
  return {
    httpOnly: true,
    secure: prod,
    maxAge: 60 * 60 * 24,
    path: "/",
  };
}

export function cookieSetterString(sessionCookie: string) {
  const options = sessionJwtCookieOptions();
  // SameSite=Lax is needed to ensure logged-in status is available to lookup the session
  // e.g.when Google auth redirects; it's otherwise like Strict
  return (
    `${SESSION_COOKIE_KEY}=${sessionCookie}; SameSite=Lax; HttpOnly;` +
    // omitting the max-age ensures the cookie expires with the browser Session:
    //(options.maxAge ? ` Max-Age=${options.maxAge};` : "") +
    (options.secure ? " Secure" : "") +
    " Path=" +
    options.path
  );
}

export function setSessionJwtCookie(res: Response, jwt: string) {
  res.cookie(SESSION_COOKIE_KEY, jwt, sessionJwtCookieOptions());
}

export function createSessionJwtCookie(jwt: string) {
  return cookie.serialize(SESSION_COOKIE_KEY, jwt, sessionJwtCookieOptions());
}

export function signSessionUser(user: SessionUser): string {
  return signObject({ user: user });
}

export function signObject(obj: object, options?: SignOptions): string {
  return sign(
    obj,
    SESSION_SECRET,
    options ?? {
      expiresIn: "24h",
    }
  );
}

export function getSignInUrl() {
  return "/sign-in";
}

export function permit(context: SessionContext, object: object): boolean {
  if (!object) {
    return true;
  }
  if (isSiteAssociated(object)) {
    return object.siteIds.some((siteId) =>
      context.user?.accessibleSiteIds.includes(siteId)
    );
  }
  if (isSiteBound(object)) {
    return context.user?.accessibleSiteIds.includes(object.siteId) ?? false;
  }
  return true;
}
export function checkIfPermitted<Type>(
  context: SessionContext,
  object: Type
): Type {
  if (Array.isArray(object)) {
    if (object.filter((o) => permit(context, o)).length !== object.length) {
      throw new Error("Access was denied for some items");
    }
  } else if (!permit(context, object as unknown as object)) {
    throw new Error("Access to this resource is not permitted");
  }
  return object;
}

export async function checkIfHasAccess(
  context: SessionContext,
  model: Model<unknown>,
  _id: Id
) {
  checkIfSite(context);
  if (!_id) {
    throw new Error("Missing _id");
  }
  checkIfPermitted(context, await model.findById(_id));
}

export function checkIfSite(context: SessionContext): string {
  if (!context.user?.siteId) {
    throw new Error("This resource requires a site");
  }
  return context.user?.siteId;
}

export const SessionService = {
  getUser,
  decodeJwtCookie,
  verifyJwt,
  sessionJwtCookieOptions,
  cookieSetterString,
  createSessionJwtCookie,
  signSessionUser,
  signObject,
  getSignInUrl,
  permit,
  checkIfPermitted,
};
