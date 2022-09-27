import { CapabilityStatement } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/capabilityStatement";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";

const getHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const capabilityStatement: CapabilityStatement = {
    resourceType: "CapabilityStatement",
    id: "ocean-cc-fhir-cs-eg",
    text: {
      status: "generated",
      div: "",
    },
    name: "Ocean Cloud Connect-compatible CapabilityStatement Example",
    title: "Ocean Cloud Connect-compatible CapabilityStatement Example",
    status: "draft",
    experimental: true,
    date: new Date(),
    publisher: "Ocean Cloud Connect FHIR Implementation Guide - CognisantMD",
    contact: [
      {
        telecom: [
          {
            system: "url",
            value: "https://www.cognisantmd.com",
          },
          {
            system: "url",
            value:
              "https://simplifier.net/ocean-cloud-connect-fhir-implementation-guide",
          },
          {
            system: "url",
            value: "https://your.emrehr.vendor.website.com",
          },
        ],
      },
    ],
    description:
      "This is an example of a CapabilityStatement that could be adapated by an integrated EMR/EHR system and returned to Ocean CC. The CapabilityStatement provides important information for Cloud Connect to use when determining which endpoints and resources are available. See the CapabilityStatement profile for more information.",
    kind: "capability",
    fhirVersion: "4.0.0",
    format: ["application/fhir+json"],
    rest: [
      {
        mode: "server",
        documentation: "EHR REST CapabilityStatement",
        security: {
          cors: true,
          service: [
            {
              text: "OAuth",
            },
            {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/restful-security-service",
                  code: "SMART-on-FHIR",
                  display: "SMART-on-FHIR",
                },
              ],
              text: "See http://docs.smarthealthit.org",
            },
          ],
          description:
            "Expected services include OAuth2, SMART on FHIR (for contextual launch), and the FHIR Resources as discused in the the iguide.",
        },
        resource: [
          {
            type: "Patient",
            interaction: [
              {
                code: "read",
              },
              {
                code: "search-type",
                documentation: "Supports identifier search.",
              },
              {
                code: "create",
              },
              {
                code: "update",
              },
            ],
            operation: [
              {
                name: "$everything",
                definition:
                  "https://hl7.org/fhir/operation-patient-everything.html",
              },
            ],
          },
          {
            type: "Condition",
            interaction: [
              {
                code: "create",
                documentation: "POST implemented per the specification",
              },
            ],
          },
          {
            type: "QuestionnaireResponse",
            interaction: [
              {
                code: "create",
                documentation: "POST implemented per the specification",
              },
            ],
          },
          {
            type: "Consent",
            interaction: [
              {
                code: "create",
                documentation: "POST implemented per the specification",
              },
            ],
          },
        ],
      },
    ],
  };
  res.type("application/fhir+json");
  res.status(200).json(capabilityStatement);
};

function setup(router: Router) {
  router.get("/CapabilityStatement", getHandler);
}

export const CapabilityStatementFhirHandler = {
  setup,
};
