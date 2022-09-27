import { Task, TaskModel } from "./task-model";

export type { Task };

export async function findByOwner(owner: string) {
  return await TaskModel.findOne({ owners: owner });
}

export async function create(task: Task): Promise<Task> {
  return TaskModel.create(task);
}

export async function update(task: Task): Promise<Task | null> {
  return TaskModel.findOneAndUpdate({ _id: task._id }, task);
}

export const TaskService = {
  init: async function (): Promise<void> {
    await TaskModel.syncIndexes();
  },
  findByOwner,
  create,
};
