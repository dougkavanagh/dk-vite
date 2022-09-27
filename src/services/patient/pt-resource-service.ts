import { id } from "../core/core-model";
import { checkIfPermitted, SessionContext } from "../session/session-service";
import { PtResourceModel, PtResource } from "./pt-resource-model";

export type { PtResource };

async function insert<T extends PtResource>(
  context: SessionContext,
  ptResource: Omit<T, "_id">
): Promise<T> {
  checkIfPermitted(context, ptResource);
  return (await PtResourceModel.create({
    ...ptResource,
    _id: id(),
  })) as unknown as T;
}
async function save(context: SessionContext, ptResource: PtResource) {
  checkIfPermitted(context, ptResource);
  await PtResourceModel.findOneAndUpdate(
    {
      _id: ptResource._id,
    },
    ptResource,
    {
      upsert: true,
    }
  );
}

async function findById(
  context: SessionContext,
  id: string
): Promise<PtResource | null> {
  return checkIfPermitted(context, await PtResourceModel.findById(id));
}

export const PtResourceService = {
  init: async function (): Promise<void> {
    await PtResourceModel.syncIndexes();
  },
  insert,
  save,
  findById,
  findByPatientId: async function (
    context: SessionContext,
    patientId: string
  ): Promise<PtResource[]> {
    return checkIfPermitted(
      context,
      await PtResourceModel.find({
        ptId: patientId,
      })
    );
  },
};
