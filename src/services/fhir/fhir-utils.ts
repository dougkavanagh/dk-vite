import { Bundle } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/bundle";
import { Resource } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/resource";
import { Response } from "express";

export function parseStartDateParam(dateParam: string): Date {
  if (dateParam.startsWith("gt") || dateParam.startsWith("ge")) {
    dateParam = dateParam.substring(2);
  }
  return new Date(dateParam);
}

export function parseEndDateParam(dateParam: string): Date {
  if (dateParam.startsWith("lt") || dateParam.startsWith("le")) {
    dateParam = dateParam.substring(2);
  }
  return new Date(dateParam);
}

export function bundle(resources: Resource[], bundleType?: Bundle.TypeEnum): Bundle {
  return {
    resourceType: "Bundle",
    type: bundleType ?? "searchset",
    total: resources.length,
    entry: resources.map((resource) => ({
      resource,
    }))
  };
}

export function validateResource(
  resource: { resourceType: string },
  resourceType: string,
  res: Response
): boolean {
  if (resource.resourceType !== resourceType) {
    res.status(400).send(`Resource type must be ${resourceType}`);
    return false;
  }
  return true;
}
