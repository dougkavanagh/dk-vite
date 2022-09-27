import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createContext } from "../services/session/session-service";

const mongoServer = new MongoMemoryServer();
let connected = false;
export async function connect() {
  if (connected) {
    return;
  }
  const mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), {});
  connected = true;
}

export async function disconnect() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}

export const TEST_SITE = "123";
export function createTestContext() {
  return createContext({ siteId: TEST_SITE });
}
