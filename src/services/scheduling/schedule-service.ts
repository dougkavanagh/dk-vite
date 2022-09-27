import { id } from "~/services/core/core-model";
import {
  checkIfPermitted,
  checkIfSite,
  SessionContext,
} from "~/services/session/session-service";
import { Schedule, ScheduleModel } from "./schedule-model";
import { Slot, SlotModel } from "./slot-model";
import { PractitionerService } from "../practitioner/practitioner-service";
export type { Schedule, Slot };

export async function create(
  context: SessionContext,
  schedule: Omit<Schedule, "_id">
): Promise<Schedule> {
  return await ScheduleModel.create({
    _id: id(),
    ...schedule,
    siteId: checkIfSite(context),
  });
}
export async function save(context: SessionContext, schedule: Schedule) {
  checkIfSite(context);
  await ensureActorsExist(schedule, context);
  return await ScheduleModel.updateOne(
    { _id: schedule._id, siteId: checkIfSite(context) },
    schedule
  );
}
async function ensureActorsExist(schedule: Schedule, context: SessionContext) {
  await Promise.all(
    schedule.actor.map(async (actor) => {
      if (
        actor.reference &&
        !(await PractitionerService.findById(context, actor.reference))
      ) {
        throw new Error("Practitioner not found: " + actor.reference);
      }
    })
  );
}

export async function findById(
  context: SessionContext,
  id: string
): Promise<Schedule | null> {
  return checkIfPermitted(context, await ScheduleModel.findById(id));
}

export async function findByActor(
  context: SessionContext,
  actorRef: string
): Promise<Schedule[]> {
  return checkIfPermitted(
    context,
    await ScheduleModel.find({ "actor.reference": actorRef })
  );
}

export async function findByActors(
  context: SessionContext,
  actorRefs: string[]
): Promise<Schedule[]> {
  return checkIfPermitted(
    context,
    await ScheduleModel.find({ "actor.reference": { $in: actorRefs } })
  );
}

export async function findBySite(
  context: SessionContext,
  siteId: string
): Promise<Schedule[]> {
  return checkIfPermitted(
    context,
    await ScheduleModel.find({ siteId: siteId })
  );
}

export async function findSlots(
  context: SessionContext,
  scheduleId: string,
  startDate: Date,
  endDate: Date
): Promise<Slot[]> {
  return checkIfPermitted(
    context,
    await SlotModel.find({
      scheduleId: scheduleId,
      start: { $gte: startDate },
      end: { $lte: endDate },
    })
  );
}

export const ScheduleService = {
  init: async function (): Promise<void> {
    await ScheduleModel.syncIndexes();
  },
  create,
  save,
  findById,
  findByActor,
  findByActors,
  findBySite,
  findSlots,
};
