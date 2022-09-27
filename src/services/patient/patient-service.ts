import { id, Identifier } from "~/services/core/core-model";
import {
  checkIfPermitted,
  checkIfSite,
  SessionContext,
} from "~/services/session/session-service";
import { PatientChart, PatientChartI } from "./patient-chart";
import { HN_CODE, newPatient, Patient, PatientModel } from "./patient-model";

async function create(
  context: SessionContext,
  patient: Omit<Patient, "_id">
): Promise<Patient> {
  return await PatientModel.create({
    _id: id(),
    ...patient,
    siteIds: [checkIfSite(context)],
  });
}
async function updateDemographics(context: SessionContext, patient: Patient) {
  return await PatientModel.updateOne(
    { _id: patient._id, siteIds: checkIfSite(context) },
    {
      telecom: patient.telecom,
      deceased: patient.deceased,
      maritalStatus: patient.maritalStatus,
      address: patient.address,
      languages: patient.languages,
    }
  );
}
async function findById(
  context: SessionContext,
  id: string
): Promise<Patient | null> {
  return checkIfPermitted(context, await PatientModel.findById(id));
}
async function findByHn(
  context: SessionContext,
  hn: string
): Promise<Patient | null> {
  return await findByIdTypeAndValue(context, HN_CODE, hn);
}
async function findByIdTypeAndValue(
  context: SessionContext,
  type?: string,
  value?: string
): Promise<Patient | null> {
  if (!type || !value) {
    return null;
  }
  const query = PatientModel.findOne({
    ids: {
      type: {
        value: type,
      },
      value: value,
    },
  });
  return checkIfPermitted(context, await query.exec());
}
async function findByIdValue(
  context: SessionContext,
  value?: string
): Promise<Patient | null> {
  if (!value) {
    return null;
  }
  const query = PatientModel.findOne({
    ids: {
      value: value,
    },
  });
  return checkIfPermitted(context, await query.exec());
}

async function findByIdentifier(
  context: SessionContext,
  id?: Identifier
): Promise<Patient | null> {
  return findByIdTypeAndValue(context, id?.type?.value, id?.value);
}

async function findByIdentifierValue(
  context: SessionContext,
  id?: string
): Promise<Patient | null> {
  return findByIdValue(context, id);
}

async function determineId(
  context: SessionContext,
  patient: Patient
): Promise<void> {
  if (!patient._id && patient.ids) {
    for (const id of patient.ids) {
      const dbPatient = await findByIdTypeAndValue(
        context,
        id.type?.value,
        id.value
      );
      if (dbPatient) {
        patient._id = dbPatient._id;
        break;
      }
    }
  }
}

export type { Patient, PatientChartI };
export { PatientModel, PatientChart, HN_CODE };

export const PatientService = {
  init: async function (): Promise<void> {
    await PatientModel.syncIndexes();
  },
  newPatient,
  create,
  updateDemographics,
  findById,
  findByHn,
  findByIdTypeAndValue,
  findByIdentifier,
  findByIdentifierValue,
  determineId,
};
