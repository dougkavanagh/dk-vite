import { Strategy as GitHubStrategy } from "passport-github2";
import {
  signSessionUser,
  setSessionJwtCookie,
} from "../../session/session-service";
import { Request, Response } from "express";
import {
  toSessionUser,
  findByExternalId,
  create,
  User,
  findByEmail,
} from "../../user/user-service";
import { Express } from "express";
import { PassportStatic, Profile } from "passport";

import {
  DEPLOY_URL,
  ENDPOINT_ACTUAL_PREFIX,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  paths,
} from "../../core/env";
import logger from "../../core/logger";
import { dbConnect } from "~/services/core/db-client";

interface JwtUser {
  jwt?: string;
  email?: string;
}

export default function GitHubStrategyConfig(
  app: Express,
  passport: PassportStatic
) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${DEPLOY_URL}${ENDPOINT_ACTUAL_PREFIX}/auth/github/callback`,
        scope: [`user:email`],
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: string | null, user?: JwtUser) => Promise<void>
      ) => {
        try {
          logger.info(`github authorized ${JSON.stringify(profile)}`);
          const email = (profile.emails || [{ value: "" }])[0].value;
          await dbConnect();

          let user = await findByExternalId({ github: profile.id });
          if (!user) {
            const existingUserWithEmail = await findByEmail(email);
            if (existingUserWithEmail) {
              throw new Error("A user with this email already exists");
            }
            user = await createUserDynamically(user, email, profile);
          }
          const jwt = signSessionUser(toSessionUser(user));
          return done(null, { email, jwt });
        } catch (error) {
          return done((error as Error).message ?? new String(error));
        }
      }
    )
  );
  app.get(
    paths("/auth/github"),
    passport.authenticate(`github`, { session: false })
  );
  app.get(
    paths("/auth/github/callback"),
    passport.authenticate(`github`, { failureRedirect: `/`, session: false }),
    (req: Request, res: Response) => {
      logger.info("got /auth/github/callback");
      const gitHubUser = req.user as JwtUser;
      if (gitHubUser?.jwt) {
        setSessionJwtCookie(res, gitHubUser.jwt);
      }
      res.json({ success: true });
    }
  );
}
async function createUserDynamically(
  user: Omit<User, "_id"> | null,
  email: string,
  profile: Profile
): Promise<User> {
  user = {
    siteIds: [],
    email,
    ids: {
      github: profile.id,
    },
    profile: {
      displayName: profile.displayName ?? email,
    },
    roles: {
      admin: false,
    },
    ...user,
  };
  const newUser = await create(user);
  return newUser;
}
