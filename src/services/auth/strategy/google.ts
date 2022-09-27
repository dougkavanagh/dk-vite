// https://www.passportjs.org/concepts/authentication/google/

import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth2";
import {
  signSessionUser,
  setSessionJwtCookie,
} from "~/services/session/session-service";
import { Request, Response } from "express";
import {
  toSessionUser,
  findByExternalId,
  createUserDynamically,
  setUserIds,
  findByEmail,
  SessionUser,
  User,
} from "~/services/user/user-service";
import { Express } from "express";
import { PassportStatic, Profile } from "passport";
import { getUser } from "~/services/session/session-service";

import {
  DEPLOY_URL,
  ENDPOINT_ACTUAL_PREFIX,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  paths,
} from "~/services/core/env";
import logger from "~/services/core/logger";
import { dbConnect } from "~/services/core/db-client";
import { Result } from "~/services/core/core-model";

interface JwtUser {
  jwt?: string;
  email?: string;
}

export default function GoogleStrategyConfig(
  app: Express,
  passport: PassportStatic
) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user as SessionUser);
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${DEPLOY_URL}${ENDPOINT_ACTUAL_PREFIX}/auth/google/callback`,
        passReqToCallback: true,
      },
      async function (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) {
        try {
          logger.info(`google authorized ${JSON.stringify(profile)}`);
          await dbConnect();
          if (!profile.id) {
            return done("no id provided by Google");
          }
          let user: User | null = await findByExternalId({
            google: profile.id,
          });
          let result: Result<User>;
          if (!user) {
            result = await handleMissingUser(req, profile);
          } else {
            result = { value: user };
          }
          if (!result.value) {
            return done(result.error?.message ?? "no user found");
          }
          user = result.value;
          const jwt = signSessionUser(toSessionUser(user));
          return done(null, { email: user.email, jwt });
        } catch (error) {
          return done((error as Error).message ?? new String(error));
        }
      }
    )
  );
  app.get(
    paths("/auth/google"),
    passport.authenticate("google", {
      scope: ["email", "profile"],
      session: true,
    })
  );
  app.get(
    paths("/auth/google/callback"),
    passport.authenticate("google", {
      failureRedirect: "/sign-in",
      failureMessage: true,
      session: true,
    }),
    (req: Request, res: Response) => {
      logger.info("authenticated via google");
      const jwtUser = req.user as JwtUser;
      if (jwtUser?.jwt) {
        setSessionJwtCookie(res, jwtUser.jwt);
      }
      logger.info("logged in via Google successfully");
      res.redirect("/");
    }
  );
}

async function updateExistingUser(
  sessionUser: SessionUser,
  profile: Profile
): Promise<Result<User>> {
  if (!sessionUser.email) {
    return { error: { message: "user is missing email" } };
  }
  const user = await findByEmail(sessionUser.email);
  if (!user) {
    return { error: { message: "user not found" } };
  }
  user.ids.google = profile.id;
  setUserIds(user.email, user.ids);
  return {
    value: user,
  };
}

async function handleMissingUser(
  req: Request,
  profile: Profile
): Promise<Result<User>> {
  const sessionUser = getUser(req.headers.cookie ?? "");
  if (sessionUser) {
    return await updateExistingUser(sessionUser, profile);
  } else {
    const email = (profile.emails || [{ value: "" }])[0].value;
    return await createUserDynamically(profile.id, email, {
      google: profile.id,
    });
  }
}
