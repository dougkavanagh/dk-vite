import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUM,
} from "../core/env";
import { Twilio } from "twilio";

export async function sendSms(args: { target: string; text: string }) {
  const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: args.text,
    to: args.target,
    from: TWILIO_PHONE_NUM,
  });
}
