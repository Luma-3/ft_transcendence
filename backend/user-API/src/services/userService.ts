import { ConflictError, NotFoundError, UnauthorizedError } from "@transcenduck/error";
import { v4 as uuidV4 } from "uuid";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";

import { knexInstance, userModel, preferencesModel } from "../models/models.js";
import { UserCreateBodyType, UserBaseType } from "../schema/user.schema.js";
import { PreferencesBaseType } from "../schema/preferences.schema.js";
import { Knex } from "knex";
import { USER_PRIVATE_COLUMNS } from "../models/userModel.js"
import { redisPub } from "../utils/redis.js";


export class UserService {
  static async createUser(data: UserCreateBodyType) {
    const [existingUsername, existingEmail] = await Promise.all([
      userModel.findByUsername(data.username),
      userModel.findByEmail(data.email)
    ]);
    if (existingUsername) throw new ConflictError("Username already Exist");
    if (existingEmail) throw new ConflictError("Email already in use");

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
      const [user] = await userModel.create(trx, userID, user_obj);

      const [preferences] = await preferencesModel.create(trx, userID, user_preferences);
      
			redisPub.publish("api.social.in", JSON.stringify({userId: user.id, 
				action: "create",
				payload: {
				username: user.username
			}})).catch(console.error);
			return { ...user, preferences }
    });
  }

  static async deleteUser(id: string) {
    await userModel.delete(id);
    return id;
  }

  static async getUserByID(
    id: string,
    includePreferences: boolean = false,
    userColumns: (keyof UserBaseType)[],
    preferencesColumns: (keyof PreferencesBaseType)[]
  ): Promise<UserBaseType & { preferences?: PreferencesBaseType }> {
    if (!includePreferences) {
      const user = await userModel.findByID(id, userColumns);
      if (!user) throw new NotFoundError("User");
      return user;
    }

    const [user, preferences] = await Promise.all([
      userModel.findByID(id, userColumns),
      preferencesModel.findByUserID(id, preferencesColumns)
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
      const user = await userModel.findByID(id, ['password'])
      if (!user) throw new NotFoundError("User");

      const isValid = await comparePassword(oldPassword, user.password!);
      if (!isValid) throw new UnauthorizedError("Invalid old password");
    }

    const hash_pass = await hashPassword(newPassword);
    const [updatedUser] = await userModel.update(id, { password: hash_pass }, USER_PRIVATE_COLUMNS);

    return updatedUser;
  }

  static async updateUserEmail(
    id: string,
    email: string
  ): Promise<UserBaseType> {
    const user = await userModel.findByID(id);
    if (!user) throw new NotFoundError("User");

    const existingEmail = await userModel.findByEmail(email);
    if (existingEmail) throw new ConflictError("Email already in use");

    const [updatedUser] = await userModel.update(id, { email: email }, USER_PRIVATE_COLUMNS);

    return updatedUser;
  }

  static async updateUserUsername(
    id: string,
    username: string
  ): Promise<UserBaseType> {
    const user = await userModel.findByID(id);
    if (!user) throw new NotFoundError("User");

    const existingUsername = await userModel.findByUsername(username);
    if (existingUsername) throw new ConflictError("Username already in use");

    const [updatedUser] = await userModel.update(id, { username: username }, USER_PRIVATE_COLUMNS);
		redisPub.publish("api.social.in", JSON.stringify({userId: user.id, 
			action: "update",
			payload: {
			username: updatedUser.username
		}})).catch(console.error);
    return updatedUser;
  }

  static async verifyCredentials(username: string, password: string): Promise<UserBaseType> {
    const user = await userModel.findByUsername(username, ['password', ...USER_PRIVATE_COLUMNS]);
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const isValid = await comparePassword(password, user.password!);
    if (!isValid) throw new UnauthorizedError("Invalid credentials");

    return user;
  }
}


