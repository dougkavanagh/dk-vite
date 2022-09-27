import { Schema, model } from "mongoose";
import { SiteAssociated, id } from "../core/core-model";
export interface Task extends SiteAssociated {
  _id: string;
  owners: string[];
}
export function newTask(): Task {
  return {
    _id: id(),
    siteIds: [],
    owners: [],
  };
}

const schema = new Schema<Task>({
  owners: { type: [String], required: true },
});
schema.index({ owners: 1 });
export const TaskModel = model<Task>("Task", schema);
