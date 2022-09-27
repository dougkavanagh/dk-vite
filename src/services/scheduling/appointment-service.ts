import {
  checkIfPermitted,
  checkIfSite,
  SessionContext,
} from "~/services/session/session-service";
import { ForeignKey, Id, id } from "../core/core-model";
import { Patient } from "../patient/patient-model";
import { Appointment, AppointmentModel } from "./appointment-model";
export type { Appointment };

export async function findById(
  context: SessionContext,
  _id: string
): Promise<Appointment | null> {
  return checkIfPermitted(
    context,
    await AppointmentModel.findById({
      _id,
    })
  );
}
export async function findByScheduleAndDate({
  context,
  scheduleId,
  start,
  end,
}: {
  context: SessionContext;
  scheduleId: string;
  start: Date;
  end: Date;
}): Promise<Appointment[]> {
  return checkIfPermitted(
    context,
    await AppointmentModel.find({
      scheduleId,
      start: { $gte: start, $lt: end },
    })
  );
}

export async function findByPatientId({
  context,
  patientId,
}: {
  context: SessionContext;
  patientId: ForeignKey<Patient>;
}) {
  return checkIfPermitted(
    context,
    await AppointmentModel.find({
      patientIds: patientId,
    })
  );
}

async function createAppointment(
  context: SessionContext,
  model: Omit<Appointment, "_id" | "siteId">
): Promise<Appointment> {
  return await AppointmentModel.create({
    ...model,
    _id: id(),
    siteId: [checkIfSite(context)],
  });
}

async function updateAppointment(context: SessionContext, model: Appointment) {
  return await AppointmentModel.updateOne(
    { _id: model._id, siteIds: checkIfSite(context) },
    model
  );
}

async function removeAppointment(context: SessionContext, _id: Id) {
  return await AppointmentModel.findOneAndRemove({
    _id,
    siteIds: checkIfSite(context),
  });
}

export const AppointmentService = {
  init: async function (): Promise<void> {
    await AppointmentModel.syncIndexes();
  },
  findById,
  findByScheduleAndDate,
  findByPatientId,
  createAppointment,
  updateAppointment,
  removeAppointment,
};
