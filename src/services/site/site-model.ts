import { Schema, model } from "mongoose";
import { SiteBound, Location, LocationSchema } from "../core/core-model";
export interface Site extends SiteBound {
  siteId: string;
  location: Location;
}

const schema = new Schema<Site>({
  siteId: { type: String, required: true },
  location: LocationSchema
});
schema.index({ siteId: 1 }, { unique: true });
export const SiteModel = model<Site>("Site", schema);
