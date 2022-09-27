import { Context } from "~/services/gql/context";
import {
  MutationSavePatientArgs,
  PatientChart,
  QueryFindByPatientIdArgs,
  Resolvers,
  SaveResult,
} from "~/services/gql/gql-types";
import { PatientService } from "./patient-service";
import { PtResourceService } from "./pt-resource-service";

export const resolvers: Resolvers = {
  Query: {
    findByPatientId: async (
      _,
      args: QueryFindByPatientIdArgs,
      context: Context
    ): Promise<PatientChart> => {
      const patient = await PatientService.findById(context, args.ptId);
      if (!patient) {
        return {
          error: {
            code: "NOT_FOUND",
            message: "Patient not found",
          },
        };
      }
      return {
        patient,
        resources: await PtResourceService.findByPatientId(context, args.ptId),
      };
    },
  },
  Mutation: {
    savePatient: async (
      parent,
      args: MutationSavePatientArgs,
      context: Context
    ): Promise<SaveResult> => {
      const newPt = await PatientService.create(context, {
        siteIds: [context.ensureSiteId()],
        ...args.patient,
      });
      return {
        id: newPt._id,
      };
    },
  },
};
