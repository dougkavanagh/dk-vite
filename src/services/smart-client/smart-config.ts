export type ScopeType = "patient" | "user" | "system";
export type AccessModifier = "read" | "write" | "*";
export type IdentityType =
  | "Patient"
  | "Practitioner"
  | "Person "
  | "RelatedPerson";

export type FhirResource = {
  hostname: string;
  resourceType: string;
  id: string;
};

export interface UserIdentity {
  scopes: string[];
  fhirUserObject?: FhirResource;
  patientLaunchContext?: FhirResource;
}

export interface SMARTServerConfig {
  version: number;
  expectedAudValue: string;
  expectedIssValue: string;
  fhirUserClaimPath: "fhirUser" | "profile" | string;
  jwksEndpoint?: string;
}
