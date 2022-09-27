import { connect, Mongoose } from "mongoose";
import { MONGODB_URI, prod } from "../core/env";

let cachedConnection: Mongoose | null = null;

export async function dbConnect(): Promise<Mongoose> {
  if (cachedConnection) {
    return Promise.resolve(cachedConnection);
  }
  if (!MONGODB_URI) {
    throw new Error("Mongo URI not set");
  }
  cachedConnection = await connect(MONGODB_URI, {
    autoIndex: !prod,
  });
  return cachedConnection;
}

export const DbClient = {
  dbConnect,
};
export default DbClient;
