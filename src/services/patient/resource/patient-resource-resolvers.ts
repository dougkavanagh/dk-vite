import { Context } from "~/services/gql/context";
import {
  MutationSaveDocumentReferenceArgs,
  Resolvers,
  SaveResult,
} from "~/services/gql/gql-types";
import { PtResourceService } from "../pt-resource-service";
import { newDocumentReference } from "./document-reference-model";

export const resolvers: Resolvers = {
  //Query: {},
  Mutation: {
    saveDocumentReference: async (
      parent,
      args: MutationSaveDocumentReferenceArgs,
      context: Context
    ): Promise<SaveResult> => {
      PtResourceService.insert(
        context,
        newDocumentReference({
          ...args.resource,
          siteIds: [context.ensureSiteId()],
        })
      );
      return {};
    },
  },
};
