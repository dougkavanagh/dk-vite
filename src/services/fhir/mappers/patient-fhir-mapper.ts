import { fhirR4 } from "@smile-cdr/fhirts";
import { Reference } from "~/services/core/core-model";
import { Patient } from "~/services/patient/patient-chart";
import {
  CareTeam,
  CareTeamParticipant,
  CareTeamParticipantType,
} from "~/services/patient/patient-model";
import { Practitioner } from "~/services/practitioner/practitioner-model";
import { PUBLIC_PROD_URL } from "../../core/env";
import {
  addressToFhir,
  contactPointFromFhir,
  contactPointToFhir,
  genderToFhir,
  idFromFhir,
  idToFhir,
  nameFromFhir,
  nameToFhir,
} from "./core-fhir-mapper";
import { practitionerFromFhir } from "./practitioner-fhir-mapper";
import { Language } from "../../core/core-model";

export function patientToFhir(
  model: Patient,
  practitioners?: Map<string, Practitioner>
): fhirR4.Patient {
  const ctp = model.careTeam?.participants.find((ctp) => {
    return ctp.role === CareTeamParticipantType.PCP;
  });
  const generalPractitioner = [];
  if (ctp && ctp.practitioner && ctp.practitioner._id) {
    practitioners?.set(ctp.practitioner._id, ctp.practitioner);
    generalPractitioner.push({
      reference: "Practitioner/" + ctp.practitioner._id,
    });
  }
  const extension: fhirR4.Extension[] = [];
  addBookingConstraintsAsExtensions(model, extension);
  return {
    resourceType: "Patient",
    id: model._id,
    name: model.name.map(nameToFhir),
    identifier: model.ids?.map(idToFhir),
    telecom: model.telecom.map(contactPointToFhir),
    address: model.address?.map(addressToFhir),
    birthDate: model.birthDate,
    gender: genderToFhir(model.gender),
    maritalStatus: model.maritalStatus,
    generalPractitioner,
    communication: model.languages?.map((language) => {
      return {
        language: { coding: [{ code: language.code }] },
        preferred: language.preferred,
      };
    }),
    extension,
  };
}

function addBookingConstraintsAsExtensions(
  model: Patient,
  extension: fhirR4.Extension[]
) {
  if (model.bookingConstraints) {
    extension.push(
      ...[
        {
          url: "https://ocean.cognisantmd.com/svc/fhir/v1/StructureDefinition/oab-allowed",
          valueString: model.bookingConstraints?.allowed ? "true" : "false",
        },
        {
          url: "https://ocean.cognisantmd.com/svc/fhir/v1/StructureDefinition/oab-min-days-before-rebooking",
          valueString: model.bookingConstraints?.minDaysBeforeRebooking,
        },
        {
          url: "https://ocean.cognisantmd.com/svc/fhir/v1/StructureDefinition/oab-min-appointment-duration",
          valueString: model.bookingConstraints?.minAppointmentDuration,
        },
      ]
    );
  }
}

export function patientFromFhir(
  fhir: fhirR4.Patient,
  practitioners?: Map<string, fhirR4.Practitioner>
): Patient {
  const patient: Patient = {
    _id:
      fhir.identifier?.find(
        (id) =>
          (id.type?.coding?.length ? id.type.coding[0].code : undefined) ===
            "MR" && id.assigner?.reference === PUBLIC_PROD_URL
      )?.value ??
      fhir.id ??
      "",
    ids: fhir.identifier?.map(idFromFhir),
    name: fhir.name?.map(nameFromFhir) ?? [],
    siteIds: [],
    telecom: fhir.telecom?.map(contactPointFromFhir) ?? [],
    address: fhir.address,
    birthDate: fhir.birthDate,
    gender: fhir.gender
      ? {
          identity: {
            value: fhir.gender,
          },
        }
      : undefined,
    maritalStatus: fhir.maritalStatus,
    careTeam: mapGeneralPractitionerToCareTeam(),
    languages:
      (fhir.communication
        ?.map((c): Language | null => {
          const code = c.language?.coding?.pop()?.code;
          if (!code) {
            return null;
          }
          return {
            code,
            preferred: c.preferred,
          };
        })
        .filter(Boolean) as Language[]) ?? [],
  };
  return patient;

  function mapGeneralPractitionerToCareTeam(): CareTeam | undefined {
    return {
      participants:
        fhir.generalPractitioner
          ?.map(
            (
              practitionerRef: Reference<Practitioner>
            ): CareTeamParticipant | null => {
              const practitioner = practitioners?.get(
                practitionerRef?.identifier?.value ?? ""
              );
              if (!practitioner) {
                return null;
              }
              return {
                role: CareTeamParticipantType.PCP.toString(),
                practitioner: practitionerFromFhir(practitioner),
              };
            }
          )
          .filter((ctp): ctp is CareTeamParticipant => !!ctp) ?? [],
    };
  }
}
