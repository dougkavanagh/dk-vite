import {
  SESSION_SECRET,
  paths,
  prod,
  DEPLOY_URL,
  ENDPOINT_PUBLIC_PREFIX,
} from "../core/env";

export interface Config {
  iss: string;
}

const allowedConfigs: Config[] = [
  {
    iss: "http://localhost:8888/api/smart-server/fhir",
  },
  {
    iss: "https://launch.smarthealthit.org/v/r4/fhir",
  },
];

export function lookup(iss: string): Config | null {
  return (
    allowedConfigs.find((config) => {
      return config.iss === iss;
    }) || null
  );
}

export const redirectUrl =
  DEPLOY_URL + ENDPOINT_PUBLIC_PREFIX + "/smart-client/redirect";

export const ISS_COOKIE = "smart-iss";
export const CLIENT_ID = "zELcpfANLqY7Oqas";

const config = {
  lookup,
  SESSION_SECRET,
  paths,
  prod,
  CLIENT_ID,
  ISS_COOKIE,
  redirectUrl,
};
export default config;
