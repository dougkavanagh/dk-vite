import {
  AuditEntry,
  AuditEntryInput,
  AuditEntryModel,
} from "./audit-entry-model";
import { id } from "./core-model";

function save(entry: AuditEntryInput): Promise<AuditEntry> {
  return AuditEntryModel.create({
    _id: id(),
    date: new Date(),
    ...entry,
  });
}

export const AuditService = {
  save,
};
