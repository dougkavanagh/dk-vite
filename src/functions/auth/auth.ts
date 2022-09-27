import serverless from "serverless-http";
import authServer from "~/services/auth/auth-app";
export const handler = serverless(authServer);
