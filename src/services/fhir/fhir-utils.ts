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
