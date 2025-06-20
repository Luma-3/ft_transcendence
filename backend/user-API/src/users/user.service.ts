import { ConflictError, NotFoundError, UnauthorizedError, RetryWithError } from "@transcenduck/error";
import { v4 as uuidV4 } from "uuid";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";

import { UserCreateBodyType, UserBaseType, UserCreateBodyInternalType } from "./user.schema.js";
import { PreferencesBaseType } from "../preferences/preferences.schema.js";
import { knexInstance, Knex } from "../utils/knex.js";
import { USER_PRIVATE_COLUMNS, USER_PUBLIC_COLUMNS, userModelInstance } from "./user.model.js"
import { preferencesModelInstance } from "../preferences/preferences.model.js";
import { redisPub } from "../utils/redis.js";
import {SendMailOptions} from 'nodemailer';
import { transporter } from "../utils/mail.js";
import { randomUUID } from "node:crypto";

import fs from 'fs';

async function verifyConflict(username: string, email: string) {
  const [existingUsername, existingEmail] = await Promise.all([
    userModelInstance.findByUsername(username, undefined),
    userModelInstance.findByEmail(email, undefined)
  ]);
  if (existingUsername) throw new ConflictError("Username already Exist");
  if (existingEmail) throw new ConflictError("Email already in use");
}

async function loadLang(language: string){
  const trad = JSON.parse(fs.readFileSync(`./src/utils/languages/${language}.json`, 'utf8'));
	return trad;
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

      // Backdor for development purposes
      // if (process.env.node_env !== 'development') {
      UserService.sendVerificationEmail(user_obj.email, randomUUID(), data.preferences?.lang || 'en');
      // }
      return { ...user, preferences }
    });
  }

  static async confirmIdentity(token: string) {
    // Backdor for development purposes
    // if (process.env.node_env === 'development') {
    //   return;
    // }
    const email = await redisPub.get("users.check." + token);
    if (!email) throw new NotFoundError("Token not found or expired");
    await userModelInstance.updateByEmail(email, { validated: true }, USER_PRIVATE_COLUMNS);
    await redisPub.del("users.check." + token);
  }
  
  static async sendVerificationEmail(email: string, data: string, language: string) {
	const trad = await loadLang(language);
	const mailOptions: SendMailOptions = {
		from: 'Transcenduck <transcenduck@gmail.com>',
		to: email,
		subject: `${trad['subject_valid_email']}`,
		html: `
			<p>${trad['greeting']},</p>
			<p>${trad['verificationIntro']} <strong>${trad['verificationLink']}</strong> :</p>
			<a href=${process.env.URL}/users/register/${data}>cliques ici</a>
			<p>${trad['linkValidity']}</p>
			<p>${trad['ignoreWarning']}</p>
			<p>${trad['signature']}</p>
		`
	}
	await transporter.sendMail(mailOptions);
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

    const existingEmail = await userModelInstance.findByEmail(email, true);
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

    const existingUsername = await userModelInstance.findByUsername(username, );
    if (existingUsername) throw new ConflictError("Username already in use");

    const [updatedUser] = await userModelInstance.update(id, { username: username }, USER_PRIVATE_COLUMNS);
    return updatedUser;
  }

  static async verifyCredentials(username: string, password: string): Promise<UserBaseType> {
    const user = await userModelInstance.findByUsername(username, undefined, ['password', 'validated', ...USER_PRIVATE_COLUMNS]);
    if (!user) throw new UnauthorizedError("Invalid credentials");
    if(user.validated == false)
      throw new RetryWithError("User not validated, please check your email");
    const isValid = await comparePassword(password, user.password!);
    if (!isValid) throw new UnauthorizedError("Invalid credentials");

    return user;
  }
}


