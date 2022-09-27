import { allow, rule, shield } from "graphql-shield";
import { IRuleTypeMap } from "graphql-shield/dist/types";
// and, not, or, deny,
import { Context } from "./context";

export type { IRuleTypeMap };

export const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx: Context, info) => {
    return !!(ctx.user && ctx.user.siteId);
  }
);

export const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx: Context, info) => {
    return !!ctx.user?.roles?.admin;
  }
);

export const isSiteAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx: Context, info) => {
    return hasSiteAdminAccess(ctx.user?.siteId, ctx);
  }
);

function hasSiteAdminAccess(
  siteId: string | null | undefined,
  context: Context
): boolean {
  return !!(
    context.user?.roles?.admin ||
    (siteId && context.user?.accessibleSiteIds.includes(siteId))
  );
}

// Permissions

export const setupPermissions = (rules: IRuleTypeMap[]) => {
  const ruleTypeMap: IRuleTypeMap = {
    Query: {
      "*": isAuthenticated,
      findByPatientId: isAuthenticated,
      listCredentials: isSiteAdmin,
      getSchedules: isSiteAdmin,
    },
    Mutation: {
      "*": isAdmin,
      login: allow,
      logout: allow,
      resetPassword: allow,
      setSiteAccess: isSiteAdmin,
      viewCredential: isSiteAdmin,
      addCredentials: isSiteAdmin,
    },
    SiteCredentials: isSiteAdmin,
  };
  const mutation = {};
  for (const rule of rules) {
    Object.assign(ruleTypeMap.Query, rule.Query);
    Object.assign(ruleTypeMap.Mutation, rule.Mutation);
  }
  return shield(ruleTypeMap, {
    fallbackRule: allow,
    fallbackError: "Access to this request is unauthorized",
  });
};
