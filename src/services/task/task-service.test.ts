import { connect } from "~/test/db-mock";
import { newTask } from "./task-model";
import { Task, TaskService } from "./task-service";
import { beforeAll, describe, it, expect } from "vitest";

beforeAll(async () => {
  await connect();
  TaskService.init();
});

// afterAll(async () => {
//   await disconnect();
// });

describe("insert", () => {
  it("creates a task", async () => {
    const mock: Task = newTask();
    await TaskService.create(mock);
    // const inserted = await findByI(mockUser.username);
    // expect(insertedUser?.profile.displayName).toEqual(
    //   mockUser.profile.displayName
    // );
    // expect(insertedUser?.email).toEqual(mockUser.email);
  });
});
