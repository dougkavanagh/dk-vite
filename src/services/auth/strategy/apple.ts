// https://help.apple.com/developer-account/#/devcdfbb56a3

import { Strategy as AppleStrategy } from "passport-apple";
import {
  signSessionUser,
  setSessionJwtCookie,
} from "../../session/session-service";
import { Request } from "express";
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
  APPLE_CLIENT_ID,
  APPLE_CLIENT_SECRET,
  paths,
} from "../../core/env";
import logger from "../../core/logger";
import { dbConnect } from "../../core/db-client";

interface JwtUser {
  jwt?: string;
  email?: string;
}

// https://www.npmjs.com/package/passport-apple
export default function AppleStrategyConfig(
  app: Express,
  passport: PassportStatic
) {
  // passport.use(
  //   new AppleStrategy(
  //     {
  //       clientID: APPLE_CLIENT_ID,
  //       clientSecret: APPLE_CLIENT_SECRET,
  //       callbackURL: `${DEPLOY_URL}${ENDPOINT_ACTUAL_PREFIX}/auth/apple/callback`,
  //       passReqToCallback: true,
  //     },
  //     async (
  //       req: Request,
  //       accessToken: string,
  //       refreshToken: string,
  //       idToken: string,
  //       profile: Profile,
  //       done: (error: string | null, user?: JwtUser) => Promise<void>
  //     ) => {
  //       try {
  //         // The idToken returned is encoded. You can use the jsonwebtoken library via jwt.decode(idToken)
  //         // to access the properties of the decoded idToken properties which contains the user's
  //         // identity information.
  //         // Here, check if the idToken.sub exists in your database!
  //         // idToken should contains email too if user authorized it but will not contain the name
  //         // `profile` parameter is REQUIRED for the sake of passport implementation
  //         // it should be profile in the future but apple hasn't implemented passing data
  //         // in access token yet https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse

  //         logger.info(`apple authorized ${JSON.stringify(profile)}`);
  //         const email = (profile.emails || [{ value: "" }])[0].value;
  //         await dbConnect();

  //         let user = await findByExternalId({ github: profile.id });
  //         if (!user) {
  //           const existingUserWithEmail = await findByEmail(email);
  //           if (existingUserWithEmail) {
  //             throw new Error("A user with this email already exists");
  //           }
  //           user = createUserDynamically(user, email, profile);
  //         }
  //         const jwt = signSessionUser(toSessionUser(user));
  //         return done(null, { email, jwt });
  //       } catch (error) {
  //         return done((error as Error).message ?? new String(error));
  //       }
  //     }
  //   )
  // );
  app.get(
    paths("/auth/apple"),
    passport.authenticate(`apple`, { session: false })
  );
  //app.get?
  app.post(paths("/auth/apple/callback"), function (req, res, next) {
    passport.authenticate("apple", function (err, user, info) {
      logger.info("got apple callback");
      if (err) {
        if (err === "AuthorizationError") {
          res.send(
            'Oops! Looks like you didn\'t allow the app to proceed. Please sign in again! <br /> \
                <a href="/login">Sign in with Apple</a>'
          );
        } else if (err === "TokenError") {
          res.send(
            "Oops! Couldn't get a valid token from Apple's servers! <br /> \
                <a href=\"/login\">Sign in with Apple</a>"
          );
        } else {
          res.send(
            'Oops! Something went wrong. <br /> \
                <a href="/login">Sign in with Apple</a>'
          );
        }
      } else {
        const appleUser = req.user as JwtUser;
        if (appleUser?.jwt) {
          setSessionJwtCookie(res, appleUser.jwt);
        }
        res.json(user);
      }
    })(req, res, next);
  });
}
function createUserDynamically(
  user: User | null,
  email: string,
  profile: Profile
) {
  const dbUser = {
    siteIds: [],
    email,
    ids: {
      // apple: profile.id,
    },
    profile: {
      displayName: profile.displayName ?? email,
    },
    roles: {
      admin: false,
    },
  };
  create(dbUser);
  return user;
}
