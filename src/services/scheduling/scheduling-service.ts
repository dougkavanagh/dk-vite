import { id } from "~/services/core/core-model";
import {
  checkIfPermitted,
  checkIfSite,
  SessionContext,
} from "~/services/session/session-service";
import { Schedule, ScheduleModel } from "./schedule-model";
import { Slot, SlotModel } from "./slot-model";
import { SlotSuggestion, SlotSuggestionModel } from "./slot-suggestion-model";
import {
  AppointmentReason,
  AppointmentReasonModel,
} from "./appointment-reason-model";
import {
  AppointmentType,
  AppointmentTypeModel,
} from "./appointment-type-model";
export type { Schedule, Slot };

export async function createAppointmentType(
  context: SessionContext,
  model: Omit<AppointmentType, "_id">
): Promise<AppointmentType> {
  return await AppointmentTypeModel.create({
    _id: id(),
    ...model,
    siteId: checkIfSite(context),
  });
}
export async function saveAppointmentType(
  context: SessionContext,
  model: AppointmentType
) {
  checkIfSite(context);
  return await AppointmentTypeModel.updateOne(
    { _id: model._id, siteId: checkIfSite(context) },
    model
  );
}

export async function findAppointmentTypesBySite(
  context: SessionContext,
  siteId: string
): Promise<AppointmentType[]> {
  return checkIfPermitted(
    context,
    await AppointmentTypeModel.find({ siteId: siteId })
  );
}

export async function findSlotSuggestionsBySite(
  context: SessionContext,
  siteId: string
): Promise<SlotSuggestion[]> {
  return checkIfPermitted(
    context,
    await SlotSuggestionModel.find({ siteId: siteId })
  );
}

export async function findAppointmentReasonsBySite(
  context: SessionContext,
  siteId: string
): Promise<AppointmentReason[]> {
  return checkIfPermitted(
    context,
    await AppointmentReasonModel.find({ siteId: siteId })
  );
}

export const SchedulingService = {
  init: async function (): Promise<void> {
    await ScheduleModel.syncIndexes();
  },
  createAppointmentType,
  saveAppointmentType,
  findAppointmentTypesBySite,
  findSlotSuggestionsBySite,
  findAppointmentReasonsBySite,
};
