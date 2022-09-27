import { id } from "~/services/core/core-model";
import {
  checkIfPermitted,
  checkIfSite,
  SessionContext,
} from "~/services/session/session-service";
import { Practitioner, PractitionerModel } from "./practitioner-model";
export type { Practitioner };

export async function create(
  context: SessionContext,
  model: Omit<Practitioner, "_id">
): Promise<Practitioner> {
  return await PractitionerModel.create({
    _id: id(),
    ...model,
    siteId: checkIfSite(context),
  });
}
export async function save(context: SessionContext, model: Practitioner) {
  checkIfSite(context);
  return await PractitionerModel.updateOne(
    { _id: model._id, siteId: checkIfSite(context) },
    model
  );
}
export async function findById(
  context: SessionContext,
  id: string
): Promise<Practitioner | null> {
  return checkIfPermitted(context, await PractitionerModel.findById(id));
}

export async function findBySite(
  context: SessionContext,
  siteId: string
): Promise<Practitioner[]> {
  return checkIfPermitted(
    context,
    await PractitionerModel.find({ siteId: siteId })
  );
}

export const PractitionerService = {
  init: async function (): Promise<void> {
    await PractitionerModel.syncIndexes();
  },
  create,
  save,
  findById,
  findBySite,
};
