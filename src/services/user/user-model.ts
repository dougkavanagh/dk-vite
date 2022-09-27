import { Schema, model } from "mongoose";
import { SiteAssociated } from "../core/core-model";
export interface User extends SiteAssociated {
  _id: string;
  email: string;
  passwordHash?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  twoFaSecret?: string;
  ids: ExternalIds;
  defaultSiteId?: string;
  profile: {
    displayName: string;
  };
  roles: {
    admin: boolean;
  };
}
export type ExternalIds = {
  github?: string;
  apple?: string;
  google?: string;
  smartIds?: string[];
};

const schema = new Schema<User>({
  _id: { type: String, required: true },
  siteIds: { type: [String], required: true },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    minlength: 5,
  },
  passwordHash: { type: String, required: false },
  passwordResetToken: { type: String, required: false },
  passwordResetExpires: { type: Date, required: false },
  twoFaSecret: { type: String, required: false },
  ids: {
    github: { type: String, required: false },
    apple: { type: String, required: false },
    google: { type: String, required: false },
    smartIds: { type: String, required: false },
  },
  defaultSiteId: { type: String, required: false },
  profile: {
    displayName: { type: String, required: true },
  },
  roles: {
    admin: { type: Boolean, required: true },
  },
});
schema.index({ email: 1 }, { unique: true });
schema.index({ ids: 1 });
export const UserModel = model<User>("User", schema);
