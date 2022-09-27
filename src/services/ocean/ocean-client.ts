import fetch from "node-fetch";
import * as fs from "fs";
import { Response } from "node-fetch";
const oceanHost = "http://localhost:8080";

(async () => {
  try {
    const bearerToken: string = await getOAuthBearerToken();
    updateReferralAppointment(bearerToken);
    readReferralPdf(bearerToken, "referral-1");
    console.log("done");
  } catch (err) {
    console.log(err); //can be console.error
  }
})();

function updateReferralAppointment(bearerToken: string) {
  fs.readFile(
    "./fhirclient/referralUpdateFhirBundle.json",
    {},
    async function (err: NodeJS.ErrnoException | null, data: Buffer) {
      if (err) {
        console.log(err);
        return;
      }
      const json = data.toString();
      console.log("sending referral payload");
      const res = await authPost(
        bearerToken,
        "/svc/fhir/v1/$process-messages",
        json
      );
      console.log(res.status);
      const jsonResponse = await res.json();
      console.log(jsonResponse);
      console.log("done");
    }
  );
}

async function readReferralPdf(bearerToken: string, referralRef: string) {
  const res: Response = await authGet(
    bearerToken,
    `/svc/fhir/v1/ServiceRequest/{referralRef}/$letter`
  );
  const fileStream = fs.createWriteStream("testJul15.pdf");
  await readPdf(res, fileStream);
}

async function readPdf(
  res: Response,
  fileStream: fs.WriteStream
): Promise<void> {
  await new Promise((resolve, reject) => {
    res.body?.pipe(fileStream);
    res.body?.on("error", reject);
    fileStream.on("finish", resolve);
  });
  res.body?.resume();
}

function authPost(bearerToken: string, path: string, bodyJson: string) {
  return fetch(oceanHost + path, {
    method: "POST",
    body: bodyJson,
    headers: authHeaders(bearerToken),
  });
}

function authGet(bearerToken: string, path: string) {
  return fetch(oceanHost + path, {
    method: "GET",
    headers: authHeaders(bearerToken),
  });
}

function authHeaders(bearerToken: string, method?: string) {
  return {
    Authorization: "Bearer " + bearerToken,
    "Content-Type": "application/json",
  };
}

async function getOAuthBearerToken(): Promise<string> {
  const creds = {
    client_id: "FkbDSUFcDM2cf5eKnB1k0f1kdxERhoGZ",
    client_secret: "cdb2914c-991b-4d66-89be-6be15d233c39",
  };
  const authorization =
    "basic " +
    Buffer.from(creds.client_id + ":" + creds.client_secret).toString("base64");
  const res = await fetch(
    oceanHost + "/svc/oauth2/token?grant_type=client_credentials",
    {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    }
  );
  const token = await res.json();
  return token.access_token;
}
