import { Schema, model } from "mongoose";
export interface DbFile {
  _id: string;
  mimeType: string;
  fileName: string;
  usedFor: string;
  ownerId: string;
}
export const DbFileSchema = {
  _id: { type: String, required: true },
  mimeType: { type: String, required: false },
  fileName: { type: String, required: false },
  usedFor: { type: String, required: false },
};

const schema = new Schema<DbFile>(DbFileSchema);

export const FileModel = model<DbFile>("DbFile", schema);
