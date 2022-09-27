import { Strategy as LocalStrategy } from "passport-local";
import {
  signSessionUser,
  setSessionJwtCookie,
} from "../../session/session-service";
import { Request, Response, Express } from "express";
import { PassportStatic } from "passport";

import { paths } from "~/services/core/env";
import logger from "~/services/core/logger";
import {
  comparePassword,
  findByEmail,
  toSessionUser,
  SessionUser,
} from "~/services/user/user-service";

export default function LocalStrategyConfig(
  app: Express,
  passport: PassportStatic
) {
  passport.use(
    new LocalStrategy(async function (email, password, done) {
      const user = await findByEmail(email);
      if (!user || !user.passwordHash || !comparePassword(password, user.passwordHash)) {
        return done(null, false, { message: "Incorrect email or password." });
      }
      return done(null, toSessionUser(user));
    })
  );
  app.post(
    paths(`/auth/login`),
    passport.authenticate(`local`, { session: false }),
    (req: Request, res: Response) => {
      logger.info("local authentication");
      if (req.user) {
        const jwt = signSessionUser(req.user as SessionUser);
        setSessionJwtCookie(res, jwt);
      }
      res.json({ success: true });
    }
  );
}
