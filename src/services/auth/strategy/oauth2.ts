import { Express } from "express";
import { PassportStatic } from "passport";
export default function OAuthStrategyConfig(
  app: Express,
  passport: PassportStatic
) {
  // passport.use(
  //   new OAuth2Strategy(
  //     {
  //       authorizationURL: "https://www.example.com/oauth2/authorize",
  //       tokenURL: "/oauth2/token",
  //       callbackURL: "http://localhost:3000/auth/example/callback"
  //       clientID: process.env["CLIENT_ID"],
  //       clientSecret: process.env["CLIENT_SECRET"],
  //       state: true,
  //       pkce: true,
  //     },
  //     function (accessToken: string, refreshToken: string, profile, cb) {
  //     // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
  //     //   return cb(err, user);
  //     // });
  //     }
  //   )
  // );
  //   app.post(
  //     paths(`/auth/login`),
  //     passport.authenticate(`local`, { session: false }),
  //     (req: Request, res: Response) => {
  //       logger.info("local authentication");
  //       if (req.user) {
  //         const jwt = signSessionUser(req.user as SessionUser);
  //         setSessionJwtCookie(res, jwt);
  //       }
  //       res.json({ success: true });
  //     }
  //   );
}
