import { ConflictError, NotFoundError, UnauthorizedError } from "@transcenduck/error";
import { v4 as uuidV4 } from "uuid";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";

import { UserCreateBodyType, UserBaseType, UserCreateBodyInternalType } from "./user.schema.js";
import { PreferencesBaseType } from "../preferences/preferences.schema.js";
import { knexInstance, Knex } from "../utils/knex.js";
import { USER_PRIVATE_COLUMNS, USER_PUBLIC_COLUMNS, userModelInstance } from "./user.model.js"
import { preferencesModelInstance } from "../preferences/preferences.model.js";
import { redisPub } from "../utils/redis.js";


async function verifyConflict(username: string, email: string) {
  const [existingUsername, existingEmail] = await Promise.all([
    userModelInstance.findByUsername(username),
    userModelInstance.findByEmail(email)
  ]);
  if (existingUsername) throw new ConflictError("Username already Exist");
  if (existingEmail) throw new ConflictError("Email already in use");
}

export class UserService {
  static async createUser(data: UserCreateBodyType) {

    await verifyConflict(data.username, data.email);

    const hash_pass = await hashPassword(data.password);
    const user_obj = {
      username: data.username,
      password: hash_pass,
      email: data.email,
    }

    const user_preferences = {
      lang: data.preferences?.lang || 'en',
      avatar: `default.png`,
      banner: `default.png`,
      theme: data.preferences?.theme || 'dark',
    }
    return await knexInstance.transaction(async (trx: Knex.Transaction) => {
      const userID = uuidV4();
      const [user] = await userModelInstance.create(trx, userID, user_obj);

      const [preferences] = await preferencesModelInstance.create(trx, userID, user_preferences);

      redisPub.publish("api.social.in", JSON.stringify({
        userId: user.id,
        action: "create",
        payload: {
          username: user.username
        }
      })).catch(console.error);
      return { ...user, preferences }
    });
  }

  static async createUserInternal(data: UserCreateBodyInternalType) {
    await verifyConflict(data.username, data.email);

    const user_preferences = { // TODO: preferences rework for simplify system
      lang: data.lang || 'en',
      avatar: `default.png`,
      banner: `default.png`,
      theme: 'dark' as 'dark'
    }
    const user_obj = {
      username: data.username,
      email: data.email,
      googleId: data.googleId || null,
    }
    return await knexInstance.transaction(async (trx: Knex.Transaction) => {
      const userID = uuidV4();
      const [user] = await userModelInstance.create(trx, userID, user_obj);

      const [preferences] = await preferencesModelInstance.create(trx, userID, user_preferences);

      redisPub.publish("api.social.in", JSON.stringify({
        userId: user.id,
        action: "create",
        payload: {
          username: user.username
        }
      })).catch(console.error);
      return { ...user, preferences }
    });

  }

  static async getAllUsers(userId: string, blocked: ("you" | "another" | "all" | "none") = "all", friends: boolean = false, hydrate: boolean = true) {
    return await userModelInstance.findAll(userId, blocked, friends, hydrate, USER_PUBLIC_COLUMNS);
  }

  static async deleteUser(id: string) {
    await userModelInstance.delete(id);
    return id;
  }

  static async getUserByID(
    id: string,
    includePreferences: boolean = false,
    userColumns: string[],
    preferencesColumns: string[]
  ): Promise<UserBaseType & { preferences?: PreferencesBaseType }> {
    if (!includePreferences) {
      const user = await userModelInstance.findByID(id, userColumns);
      if (!user) throw new NotFoundError("User");
      return user;
    }

    const [user, preferences] = await Promise.all([
      userModelInstance.findByID(id, userColumns),
      preferencesModelInstance.findByUserID(id, preferencesColumns)
    ]);

    if (!user) throw new NotFoundError("User");
    if (!preferences) throw new NotFoundError("Preferences");

    return { ...user, preferences }
  }

  static async updateUserPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<UserBaseType> {
    {
      const user = await userModelInstance.findByID(id, ['password'])
      if (!user) throw new NotFoundError("User");

      const isValid = await comparePassword(oldPassword, user.password!);
      if (!isValid) throw new UnauthorizedError("Invalid old password");
    }

    const hash_pass = await hashPassword(newPassword);
    const [updatedUser] = await userModelInstance.update(id, { password: hash_pass }, USER_PRIVATE_COLUMNS);

    return updatedUser;
  }

  static async updateUserEmail(
    id: string,
    email: string
  ): Promise<UserBaseType> {
    const user = await userModelInstance.findByID(id);
    if (!user) throw new NotFoundError("User");

    const existingEmail = await userModelInstance.findByEmail(email);
    if (existingEmail) throw new ConflictError("Email already in use");

    const [updatedUser] = await userModelInstance.update(id, { email: email }, USER_PRIVATE_COLUMNS);

    return updatedUser;
  }

  static async updateUserUsername(
    id: string,
    username: string
  ): Promise<UserBaseType> {
    const user = await userModelInstance.findByID(id);
    if (!user) throw new NotFoundError("User");

    const existingUsername = await userModelInstance.findByUsername(username);
    if (existingUsername) throw new ConflictError("Username already in use");

    const [updatedUser] = await userModelInstance.update(id, { username: username }, USER_PRIVATE_COLUMNS);
    return updatedUser;
  }

  static async verifyCredentials(username: string, password: string): Promise<UserBaseType> {
    const user = await userModelInstance.findByUsername(username, ['password', ...USER_PRIVATE_COLUMNS]);
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const isValid = await comparePassword(password, user.password!);
    if (!isValid) throw new UnauthorizedError("Invalid credentials");

    return user;
  }
}


