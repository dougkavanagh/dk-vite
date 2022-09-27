import { fhirR4 } from "@smile-cdr/fhirts";
import { ValueSetItem } from "../../core/core-model";
import { PUBLIC_PROD_URL } from "~/services/core/env";
export function valueSetToFhir({
  name,
  title,
  system,
  items,
}: {
  name: string;
  title: string;
  system?: string;
  items: ValueSetItem[];
}): fhirR4.ValueSet {
  const baseUrl = PUBLIC_PROD_URL;
  return {
    resourceType: "ValueSet",
    url: `${baseUrl}/fhir/ValueSet/${name}`,
    title,
    name,
    status: "active",
    compose: {
      include: [
        {
          system: system ?? `${baseUrl}/fhir/CodeSystem/${name}`,
          concept: items.map((item) => {
            return {
              code: item.value,
              display: item.text,
            };
          }),
        },
      ],
    },
  };
}
