import { User, UserModel, ExternalIds } from "./user-model";
import { ErrorMessage, id, Result } from "~/services/core/core-model";
import { SessionUser } from "~/services/session/session-model";
import bcrypt from "bcrypt";
import validator from "validator";

export type { User, SessionUser };

export async function findByEmail(email: string) {
  return await UserModel.findOne({ email });
}

export async function findAllForAdmin(): Promise<User[]> {
  return await UserModel.find({});
}

export async function findByUserId(userId: string) {
  return UserModel.findOne({ userId });
}

export async function findByExternalId(id: ExternalIds): Promise<User | null> {
  return await UserModel.findOne({ ids: id }).exec();
}

export async function create(user: Omit<User, "_id">): Promise<User> {
  return UserModel.create({
    ...user,
    _id: id(),
  });
}

export async function createUserDynamically(
  displayName: string,
  email: string,
  ids: ExternalIds
): Promise<Result<User>> {
  const existingUserWithEmail = await findByEmail(email);
  if (existingUserWithEmail) {
    return {
      error: { message: "A user with this email already exists" },
    };
  }
  const user: User = {
    _id: id(),
    siteIds: [],
    email,
    ids: ids,
    profile: {
      displayName: displayName,
    },
    roles: {
      admin: false,
    },
  };
  return { value: await create(user) };
}

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(
  candidatePassword: string,
  existingPasswordHash: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, existingPasswordHash);
}

export function toSessionUser(user: User, siteId?: string): SessionUser {
  return {
    userId: user._id,
    email: user.email,
    profile: {
      displayName: user.profile.displayName,
    },
    roles: user.roles,
    siteId:
      siteId ?? user.defaultSiteId ?? user.siteIds.length > 0
        ? user.siteIds[0]
        : "",
    accessibleSiteIds: user.siteIds,
  };
}

export async function checkLogin(
  email: string,
  password: string
): Promise<User | null> {
  const user = await findByEmail(email);
  if (!user) {
    return null;
  }
  const passwordMatches: boolean =
    !!user.passwordHash && (await comparePassword(password, user.passwordHash));
  if (!passwordMatches) {
    return null;
  }
  return user;
}

export function validatePassword(password: string): ErrorMessage | null {
  return validator.isStrongPassword(password)
    ? null
    : { message: "Password is not strong enough" };
}

export function validateEmail(email: string): ErrorMessage | null {
  return validator.isEmail(email) ? null : { message: "Email is invalid" };
}

export async function signup(userInput: {
  email: string;
  password: string;
}): Promise<Result<User>> {
  const error =
    validateEmail(userInput.email) ?? validatePassword(userInput.password);
  if (error) {
    return { error };
  }
  const user: User = {
    _id: id(),
    email: userInput.email,
    passwordHash: await hashPassword(userInput.password),
    ids: {},
    profile: {
      displayName: userInput.email,
    },
    roles: {
      admin: false,
    },
    siteIds: [],
  };
  const existingUser: User | null = await findByEmail(user.email);
  if (existingUser) {
    return {
      error: {
        message:
          "This user already exists. Please use a different email or reset your password.",
      },
    };
  }
  await create(user);
  return {
    value: user,
  };
}

export async function sendResetPasswordEmail(
  email: string
): Promise<Result<string>> {
  const user = await findByEmail(email);
  if (!user) {
    return { error: { message: "This user does not exist." } };
  }
  const expiryDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
  const token = id();
  UserModel.findOneAndUpdate(
    { email: email },
    { $set: { passwordResetToken: token, passwordResetExpires: expiryDate } }
  );
  return {
    value: token,
  };
}

export async function resetPassword(args: {
  email: string;
  token: string;
  newPassword: string;
  twoFactorToken: string | null;
}): Promise<Error | undefined> {
  const user = await findByEmail(args.email);
  if (!user) {
    return new Error("This user does not exist.");
  }
  const validToken = user.passwordResetToken === args.token;
  if (!validToken) {
    return new Error("Invalid token.");
  }
  if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
    return new Error("Token expired.");
  }
  //TODO check two factor token
  await saveNewPasswordAfterValidation(args.email, args.newPassword);
}

export async function changePassword(args: {
  sessionUser: SessionUser | null;
  userId: string;
  oldPassword: string;
  newPassword: string;
  twoFactorToken?: string | null;
}): Promise<ErrorMessage | undefined> {
  if (
    !args.sessionUser?.roles.admin &&
    args.sessionUser?.userId !== args.userId
  ) {
    return new ErrorMessage(
      "For non-adminstrators, the user must match the current user to change the password."
    );
  }

  const user: User | null = await findByUserId(args.userId);
  if (!user) {
    return new Error("This user does not exist");
  }
  const passwordMatches: boolean =
    !!user.passwordHash &&
    (await comparePassword(args.oldPassword, user.passwordHash));
  if (!passwordMatches) {
    return new Error("The old password is incorrect");
  }
  //TODO check two factor token
  return await saveNewPasswordAfterValidation(args.userId, args.newPassword);
}

async function saveNewPasswordAfterValidation(
  userId: string,
  newPassword: string
): Promise<Error | undefined> {
  const passwordHash = await hashPassword(newPassword);
  const user = await UserModel.findByIdAndUpdate(userId, {
    passwordHash: passwordHash,
  });
  if (!user) {
    return new Error("Could not update password; no user found");
  }
}
export async function setAdmin(
  userId: string,
  admin: boolean
): Promise<User | null> {
  return UserModel.findByIdAndUpdate(userId, {
    $set: { "roles.admin": admin },
  });
}
export async function setUserIds(
  email: string,
  ids: ExternalIds
): Promise<User | null> {
  return UserModel.findOneAndUpdate({ email }, { $set: { ids: ids } });
}

async function setSiteAccess(
  userId: string,
  siteId: string,
  access: boolean,
  defaultSite?: boolean
): Promise<boolean> {
  const user = await UserModel.findById(userId);
  if (!user) {
    return false;
  }
  const siteIds = user.siteIds.splice(user.siteIds.indexOf(siteId), 1);
  if (access) {
    siteIds.push(siteId);
  }
  UserModel.findByIdAndUpdate(userId, {
    siteIds,
    defaultSiteId: defaultSite ? siteId : user.defaultSiteId,
  });
  return true;
}

export const UserService = {
  init: async function (): Promise<void> {
    await UserModel.syncIndexes();
  },
  setSiteAccess,
  setUserIds,
  setAdmin,
  saveNewPasswordAfterValidation,
  changePassword,
  resetPassword,
  sendResetPasswordEmail,
  signup,
  checkLogin,
  toSessionUser,
  comparePassword,
  hashPassword,
  createUserDynamically,
  create,
  findByExternalId,
  findByUserId,
  findAllForAdmin,
  findByEmail,
};
