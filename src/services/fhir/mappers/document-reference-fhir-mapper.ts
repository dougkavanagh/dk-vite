import { fhirR4 } from "@smile-cdr/fhirts";
import { Patient } from "~/services/patient/patient-model";
import {
  CompositionStatus,
  DocumentReference,
  DOCUMENT_REFERENCE_TYPE,
} from "../../patient/resource/document-reference-model";

export function documentReferenceToFhir(
  model: DocumentReference
): fhirR4.DocumentReference {
  return {
    ...model,
    resourceType: "DocumentReference",
    date: model.date?.toISOString(),
    subject: {
      reference: "Patient/" + model.ptId,
    },
    type: model.docType,
    content: model.content?.map((content) => ({
      ...content,
      attachment: content.attachment.text
        ? {
            contentType: "text/plain",
            data: btoa(content.attachment.text),
          }
        : content.attachment,
    })),
    context: {
      ...model.context,
      sourcePatientInfo: model.context?.sourcePatientInfo
        ? {
            reference: `Patient/${model.context.sourcePatientInfo._id}`,
          }
        : undefined,
    },
  };
}

export function documentReferenceFromFhir(
  fhir: fhirR4.DocumentReference,
  siteId: string,
  sourcePatientInfo?: Patient
): DocumentReference {
  return {
    ...fhir,
    type: DOCUMENT_REFERENCE_TYPE,
    siteIds: [siteId],
    docStatus: fhir.docStatus as CompositionStatus,
    date: fhir.date ? new Date(fhir.date) : undefined,
    _id: fhir.id ?? "",
    ptId: fhir.subject?.reference?.split("/")[1] ?? "",
    docType: fhir.type,
    context: {
      ...fhir.context,
      sourcePatientInfo,
    },
  };
}
