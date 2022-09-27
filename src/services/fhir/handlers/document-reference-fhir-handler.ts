import { fhirR4 } from "@smile-cdr/fhirts";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { PtResourceService } from "~/services/patient/pt-resource-service";
import { DocumentReference } from "~/services/patient/resource/document-reference-model";
import { ensureSiteId, getContext } from "~/services/session/session-service";
import { validateResource } from "../fhir-utils";
import {
  documentReferenceFromFhir,
  documentReferenceToFhir,
} from "../mappers/document-reference-fhir-mapper";

const getHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const context = getContext(req);
  const id = req.query.id?.toString() ?? "";
  const docRef = (await PtResourceService.findById(
    context,
    id
  )) as DocumentReference;
  if (!docRef || docRef.type !== "DocumentReference") {
    res.status(404).send("Document not found");
    return;
  }
  const fhirObject: fhirR4.DocumentReference = documentReferenceToFhir(docRef);
  res.status(200).json(fhirObject);
};

const postHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const context = getContext(req);
  const fhirObject = req.body as fhirR4.DocumentReference;
  if (!validateResource(fhirObject, "DocumentReference", res)) {
    return;
  }
  const postedDocRef = documentReferenceFromFhir(
    fhirObject,
    ensureSiteId(context)
  );
  if (postedDocRef._id) {
    res.status(400).send("DocumentReference id must not be specified");
    return;
  }
  const newDocRef = await PtResourceService.insert<DocumentReference>(context, {
    ...postedDocRef,
  });
  res
    .status(201)
    .header("Location", `DocumentReference/${newDocRef._id}/_history/1`)
    .json(documentReferenceToFhir(newDocRef));
};

function setup(router: Router) {
  router.get("/documentreference", getHandler);
  router.post("/documentreference", postHandler);
}

export const DocumentReferenceFhirHandler = {
  setup,
};
