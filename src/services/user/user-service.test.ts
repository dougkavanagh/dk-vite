import { connect } from "~/test/db-mock";
import {
  UserService,
  create,
  findByUserId,
} from "~/services/user/user-service";
import { beforeAll, describe, it, expect } from "vitest";

beforeAll(async () => {
  await connect();
  UserService.init();
});

describe("insert", () => {
  it("creates a user", async () => {
    const mockUser = {
      _id: "",
      email: "test@test.com",
      profile: {
        displayName: "test",
      },
      ids: {},
      roles: { admin: false },
      siteIds: [],
    };
    mockUser._id = (await create(mockUser))._id;
    const insertedUser = await findByUserId(mockUser._id);
    expect(insertedUser?.profile.displayName).toEqual(
      mockUser.profile.displayName
    );
    expect(insertedUser?.email).toEqual(mockUser.email);
  });
});
