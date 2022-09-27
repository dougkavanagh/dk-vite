import { Handler } from "@netlify/functions";
import logger from "../../services/core/logger";

// import { sendMail } from "../../services/mail/mail-service";

export const handler: Handler = async (event, _context) => {
  const { name = "stranger" } = event.queryStringParameters || {};
  logger.info("hello called2");
  //sendMail();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name}!`,
    }),
  };
};
