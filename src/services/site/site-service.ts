import { id } from "../core/core-model";
import { User } from "../user/user-model";
import { Site, SiteModel } from "./site-model";

export type { Site };

function newSiteId(): string {
  return id(8);
}

export async function findById(siteId: Site["siteId"]) {
  return await SiteModel.findOne({ siteId });
}

export async function create(site: Omit<Site, "siteId">): Promise<Site> {
  return SiteModel.create({
    siteId: newSiteId(),
    ...site,
  });
}

export async function createSiteForNewUser(user: User): Promise<Site> {
  const site = await create({
    location: {
      status: "active",
      name: `${user.profile.displayName ?? user.email}'s Site`,
    },
  });
  user.siteIds.push(site.siteId);
  user.defaultSiteId = site.siteId;
  return site;
}

export async function updateTitle(
  siteId: string,
  title: string
): Promise<Site | null> {
  return SiteModel.findOneAndUpdate({ siteId: siteId }, { title });
}

export const SiteService = {
  init: async function (): Promise<void> {
    await SiteModel.syncIndexes();
  },
  updateTitle,
  create,
  createSiteForNewUser,
  findById,
};
