import { fhirR4, IfhirR4 } from "@smile-cdr/fhirts";
import { Address as FhirAddress } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/address";
import { Appointment } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/appointment";
import { ServiceRequest as FhirServiceRequest } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/serviceRequest";
import { isDeepStrictEqual } from "util";
import { Address } from "~/services/core/core-model";
import { info, logger } from "~/services/core/logger";
import {
  Patient,
  PatientChart,
  PatientChartI,
  PatientService,
} from "~/services/patient/patient-service";
import { Practitioner } from "~/services/practitioner/practitioner-model";
import { SessionContext } from "~/services/session/session-model";
import { CareTeamParticipantType } from "../patient/patient-model";
import { PtResourceService } from "../patient/pt-resource-service";
import {
  newServiceRequest,
  RequestStatus,
  RequestIntent,
  RequestPriority,
  ServiceRequest,
} from "../patient/resource/service-request-model";

type ServiceRequestDto = {
  patientChart: PatientChartI;
  serviceRequest: FhirServiceRequest;
  practitioners: Map<string, Practitioner>;
  appointments: Appointment[];
};

export function handleMessage(
  context: SessionContext,
  message: IfhirR4.IBundle
): void {
  const dto: ServiceRequestDto = readMessage(message);
  processMessage(context, dto);
  info(`Received service request ${dto.serviceRequest.id}`);
}
function readMessage(message: IfhirR4.IBundle) {
  const dto: ServiceRequestDto = {
    patientChart: PatientChart({ patient: PatientService.newPatient() }),
    serviceRequest: new FhirServiceRequest(),
    practitioners: new Map<string, Practitioner>(),
    appointments: [],
  };
  type MessageHandler = (resource: unknown, dto: ServiceRequestDto) => void;
  const resourceHandlers = new Map<string, MessageHandler>();
  resourceHandlers.set("MessageHeader", readMessageHeader as MessageHandler);
  resourceHandlers.set("ServiceRequest", readServiceRequest as MessageHandler);
  resourceHandlers.set("Patient", readPatient as MessageHandler);
  resourceHandlers.set(
    "PractitionerRole",
    readPractitionerRole as MessageHandler
  );
  resourceHandlers.set("Practitioner", readPractitioner as MessageHandler);
  resourceHandlers.set("Location", readLocation as MessageHandler);
  resourceHandlers.set(
    "DocumentReference",
    readDocumentReference as MessageHandler
  );
  resourceHandlers.set(
    "QuestionnaireResponse",
    readQuestionnaireResponse as MessageHandler
  );
  resourceHandlers.set("Appointment", readAppointment as MessageHandler);
  message.entry?.forEach((entry) => {
    resourceHandlers.get(entry.resource?.resourceType ?? "")?.(
      entry.resource,
      dto
    );
  });
  return dto;
}

function readMessageHeader(
  resource: fhirR4.MessageHeader,
  dto: ServiceRequestDto
): void {
  // empty
}

function readServiceRequest(
  resource: fhirR4.ServiceRequest,
  dto: ServiceRequestDto
): void {
  dto.serviceRequest = resource;
}
function readPatient(fhir: fhirR4.Patient, dto: ServiceRequestDto): void {
  const patient = dto.patientChart.patient;
  if (fhir.address) {
    patient.address = fhir.address.map<Address>(function (
      address: FhirAddress
    ): Address {
      return {
        line: address.line ?? [],
        city: address.city ?? "",
        province: address.state ?? "",
        country: address.country ?? "",
        postalCode: address.postalCode ?? "",
      };
    });
  }
  patient.birthDate = fhir.birthDate;
  if (fhir.gender) {
    patient.gender = {
      identity: {
        value: fhir.gender,
      },
      ...patient.gender,
    };
  }
  patient.name =
    (fhir.name ?? [])
      .filter((n) => {
        return n.given && n.given.length > 0 && n.given[0] && n.family;
      })
      .map((n) => {
        return {
          use: n.use,
          given: n.given ?? [],
          family: n.family ?? "",
          prefix: n.prefix?.join(" ") ?? undefined,
          suffix: n.suffix?.join(" ") ?? undefined,
          period: n.period,
        };
      }) ?? [];
  patient.birthDate = fhir.birthDate;
  patient.deceased = {
    deceasedBoolean: fhir.deceasedBoolean ?? false,
    deceasedDateTime: fhir.deceasedDateTime
      ? new Date(fhir.deceasedDateTime)
      : undefined,
  };
  if (fhir.maritalStatus) {
    // patient.maritalStatus = {
    //   value: resource.maritalStatus?.coding?.pop()?.code,
    //   text: resource.maritalStatus?.text ?? "",
    // };
  }
  if (fhir.generalPractitioner) {
    const reference = fhir.generalPractitioner.pop()?.reference;
    const practitioner = dto.practitioners.get(reference ?? "");
    patient.careTeam?.participants.push({
      role: CareTeamParticipantType.PCP,
      practitioner,
    });
  }
  if (fhir.communication && fhir.communication.length > 0) {
    fhir.communication.forEach((c) => {
      //TODO check language code
      const code = c.language?.coding?.pop()?.code;
      if (code) {
        if (!patient.languages) {
          patient.languages = [];
        }
        patient.languages.push({
          code: code,
          preferred: c.preferred,
        });
      }
    });
  }
}

function readPractitionerRole(
  resource: fhirR4.PractitionerRole,
  dto: ServiceRequestDto
): void {
  // empty
}

function readPractitioner(
  resource: fhirR4.Practitioner,
  dto: ServiceRequestDto
): void {
  // dto.practitioners.set(resource.id ?? "", {
  //   id: resource.id ?? "",
  //   resource.
  // });
  // practitioner: {
  //   name: Name;
  //   gender?: GenderInfo | null;
  //   birthDate?: StringDate | null;
  //   professionalId?: string | null;
  //   billingId?: string | null;
  //   qualifications?: Qualification[] | null;
  //   roles: PractitionerRole[];
  // },
}

function readLocation(resource: Location, dto: ServiceRequestDto): void {
  // empty
}

function readDocumentReference(
  resource: fhirR4.DocumentReference,
  dto: ServiceRequestDto
): void {
  // empty
}

function readQuestionnaireResponse(
  resource: fhirR4.QuestionnaireResponse,
  dto: ServiceRequestDto
): void {
  // empty
}

function readAppointment(resource: Appointment, dto: ServiceRequestDto): void {
  // empty
}

async function processMessage(context: SessionContext, dto: ServiceRequestDto) {
  const inboundPatient = dto.patientChart.patient;
  let dbPatient: Patient | null = await lookupPatient(context, inboundPatient);
  if (!dbPatient) {
    dbPatient = await PatientService.create(context, inboundPatient);
    logger.info(`Patient created: ${inboundPatient._id}`);
  } else {
    logger.info(`Patient already exists`);
    PatientService.updateDemographics(context, {
      ...dbPatient,
      ...inboundPatient,
    });
  }
  if (dto.serviceRequest) {
    processServiceRequest(context, dto, dbPatient);
  }
}

async function processServiceRequest(
  context: SessionContext,
  dto: ServiceRequestDto,
  dbPatient: Patient
) {
  const error = validateServiceRequest(dto.serviceRequest);
  if (error) {
    logger.info(error);
    return;
  }
  const existingServiceRequest = dto.patientChart.resources?.find(
    (r) => r.sourceId === dto.serviceRequest.id && r.type === "ServiceRequest"
  );
  if (!existingServiceRequest) {
    saveNewServiceRequest({
      context,
      serviceRequest: dto.serviceRequest,
      dbPatient,
      patientChart: dto.patientChart,
    });
  } else {
    updateServiceRequest({
      context,
      existingServiceRequest: existingServiceRequest as ServiceRequest,
      serviceRequest: dto.serviceRequest,
      patientChart: dto.patientChart,
    });
  }
}

function validateServiceRequest(
  serviceRequest: fhirR4.ServiceRequest
): Error | undefined {
  if (!serviceRequest.status || !(serviceRequest.status in RequestStatus)) {
    return new Error("Invalid service request status");
  }
  if (!serviceRequest.intent || !(serviceRequest.intent in RequestIntent)) {
    return new Error("Invalid service request intent");
  }
  if (
    serviceRequest.priority &&
    !(serviceRequest.priority in RequestPriority)
  ) {
    return new Error("Invalid service request priority");
  }
}

async function saveNewServiceRequest({
  context,
  serviceRequest,
  dbPatient,
  patientChart,
}: {
  context: SessionContext;
  serviceRequest: FhirServiceRequest;
  dbPatient: Patient;
  patientChart: PatientChartI;
}) {
  const resource = newServiceRequest({
    ...serviceRequest,
    ptId: dbPatient._id,
    siteIds: dbPatient.siteIds,
    date: serviceRequest.authoredOn ?? new Date(),
    status: serviceRequest.status as RequestStatus,
    intent: serviceRequest.intent as RequestIntent,
    priority: serviceRequest.priority as RequestPriority,
  });
  PtResourceService.save(context, resource);
  patientChart.addNewResource(resource);
}

async function updateServiceRequest({
  context,
  existingServiceRequest,
  serviceRequest,
}: {
  context: SessionContext;
  existingServiceRequest: ServiceRequest;
  serviceRequest: FhirServiceRequest;
  patientChart: PatientChartI;
}) {
  const updatedServiceRequest: ServiceRequest = {
    ...existingServiceRequest,
    // only update a few select fields:
    status: serviceRequest.status as RequestStatus,
    priority: serviceRequest.priority as RequestPriority,
    orderDetail: serviceRequest.orderDetail,
  };
  if (!isDeepStrictEqual(updateServiceRequest, existingServiceRequest)) {
    PtResourceService.save(context, updatedServiceRequest);
  }
}

async function lookupPatient(context: SessionContext, inboundPatient: Patient) {
  let dbPatient: Patient | null = null;
  if (inboundPatient.ids) {
    for (const id of inboundPatient.ids) {
      if (id.type?.value && id.value) {
        dbPatient = await PatientService.findByIdTypeAndValue(
          context,
          id.type.value,
          id.value
        );
        if (dbPatient) {
          break;
        }
      }
    }
  }
  return dbPatient;
}
