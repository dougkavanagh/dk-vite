import { Schema, model } from "mongoose";

export interface AuditEntry {
  _id: string;
  date: Date;
  siteId: string;
  user: string;
  action: string;
  patientId?: string;
  properties: Map<string, string>;
}
export type AuditEntryInput = Omit<AuditEntry, "_id" | "date">;

const schema = new Schema<AuditEntry>({
  _id: { type: String, required: true },
  siteId: { type: String, required: true },
  user: { type: String, required: true },
  action: { type: String, required: true },
  date: { type: Date, required: true },
  patientId: { type: String },
  properties: { type: Map, required: true },
});
schema.index({ siteId: 1 }, { unique: true });
export const AuditEntryModel = model<AuditEntry>("AuditEntry", schema);
