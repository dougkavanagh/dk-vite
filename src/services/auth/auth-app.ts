import cookieParser from "cookie-parser";
import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import { paths, SESSION_SECRET } from "../core/env";

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// import AppleStrategyConfig from "./strategy/apple";
// AppleStrategyConfig(app, passport);

// import GoogleStrategyConfig from "./strategy/google";
// GoogleStrategyConfig(app, passport);

// import GitHubStrategyConfig from "./strategy/github";
// GitHubStrategyConfig(app, passport);

// import LocalStrategyConfig from "./strategy/local";
// LocalStrategyConfig(app, passport);

app.get(paths("/"), (req) => {
  console.log(req);
});
export default app;
