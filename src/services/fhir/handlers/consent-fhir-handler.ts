import { fhirR4 } from "@smile-cdr/fhirts";
import { Request, RequestHandler, Response, Router } from "express";
import { getContext } from "~/services/session/session-service";

const postHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const context = getContext(req);
  const fhirObject = req.body as fhirR4.Consent;
  res.status(200);
};

function setup(router: Router) {
  router.post("/consent", postHandler);
}

export const ConsentFhirHandler = {
  setup,
};