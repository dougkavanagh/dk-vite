import { fhirR4 } from "@smile-cdr/fhirts";
import { Patient } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/patient";
import {
  Address,
  CommonGender,
  ContactPoint,
  Identifier,
  Name,
} from "~/services/core/core-model";
import { GenderInfo, Gender } from "../../core/core-model";

export function nameFromFhir(name: fhirR4.HumanName): Name {
  return {
    ...name,
    given: name?.given ?? [],
    family: name?.family ?? "",
    prefix: name?.prefix?.join(" ") ?? undefined,
    suffix: name?.suffix?.join(" ") ?? undefined,
  };
}
export function nameToFhir(name: Name): fhirR4.HumanName {
  return {
    ...name,
    use: (name.use as fhirR4.HumanName.UseEnum) ?? "usual",
    given: name.given ?? [],
    family: name.family ?? "",
    prefix: name.prefix ? [name.prefix] : [],
    suffix: name.suffix ? [name.suffix] : [],
    period: name.period ?? undefined,
  };
}
export function idFromFhir(id: fhirR4.Identifier): Identifier {
  return {
    type: {
      value: id.type?.coding?.shift()?.code ?? "",
      system: id.system ?? "",
    },
    value: id.value,
    extension: id.extension,
    period: id.period,
    assigner: id.assigner,
  };
}
export function idToFhir(id: Identifier): fhirR4.Identifier {
  return {
    type: id.type
      ? {
          coding: [id.type],
        }
      : undefined,
    value: id.value,
    extension: id.extension,
    period: id.period,
    assigner: id.assigner,
  };
}

export function contactPointToFhir(model: ContactPoint): fhirR4.ContactPoint {
  return {
    ...model,
    use: model.use as fhirR4.ContactPoint.UseEnum,
    system: model.system as fhirR4.ContactPoint.SystemEnum,
  };
}

export function contactPointFromFhir(fhir: fhirR4.ContactPoint): ContactPoint {
  return {
    ...fhir,
    value: fhir.value ?? "",
  };
}

export function addressToFhir(model: Address): fhirR4.Address {
  return {
    ...model,
    type: model.type as fhirR4.Address.TypeEnum,
    use: model.use as fhirR4.Address.UseEnum,
  };
}

export function genderToFhir(gender?: GenderInfo): Patient.GenderEnum {
  switch (gender?.identity?.value) {
    case CommonGender.male.toString():
      return "male";
    case CommonGender.female.toString():
      return "female";
    case CommonGender.other.toString():
      return "other";
    case CommonGender.unknown.toString():
    default:
      return "unknown";
  }
}
export function genderFromFhir(gender?: Patient.GenderEnum): Gender {
  const fhirContext = "fhir";
  switch (gender) {
    case CommonGender.male.toString():
      return { value: CommonGender.male.toString(), context: fhirContext };
    case CommonGender.female.toString():
      return { value: CommonGender.female.toString(), context: fhirContext };
    case CommonGender.other.toString():
      return { value: CommonGender.other.toString(), context: fhirContext };
    case CommonGender.unknown.toString():
    default:
      return { value: CommonGender.unknown.toString(), context: fhirContext };
  }
}
export function genderInfoFromFhir(
  gender?: Patient.GenderEnum
): GenderInfo | undefined {
  return {
    identity: genderFromFhir(gender),
  };
}
