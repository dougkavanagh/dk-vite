// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from "@sendgrid/mail";

import { SENDGRID_API_KEY } from "../core/env";

export async function sendMailViaSendGrid() {
  sgMail.setApiKey(SENDGRID_API_KEY);
  const msg = {
    to: "dougkavanagh@gmail.com", // Change to your recipient
    from: "dougkavanagh@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere",
    html: "<strong>and easy to do anywhere</strong>",
  };
  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
}

// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
import {
  SESClient,
  SendEmailCommand,
  //SendEmailRequest,
} from "@aws-sdk/client-ses";

import {
  APP_AWS_REGION,
  APP_AWS_S3_ACCESS_KEY,
  APP_AWS_S3_SECRET_KEY,
} from "../core/env";

export async function sendMailViaSES() {
  // a client can be shared by different commands.
  const client = new SESClient({
    region: APP_AWS_REGION,
    credentials: {
      accessKeyId: APP_AWS_S3_ACCESS_KEY,
      secretAccessKey: APP_AWS_S3_SECRET_KEY,
    },
  });

  const request = {
    Source: "dougkavanagh@gmail.com",
    Destination: {
      ToAddresses: ["dougkavanagh@gmail.com"],
    },
    Message: {
      Subject: {
        Data: "Sending with SES is Fun",
      },
      Body: {
        Text: {
          Data: "Testing email body",
        },
      },
    },
  };
  const command = new SendEmailCommand(request);
  // async/await.
  try {
    const data = await client.send(command);
    console.log(data);
  } catch (error) {
    console.error(error);
    // error handling.
  } finally {
    // finally.
  }
}

export function sendMail() {
  sendMailViaSES();
}
