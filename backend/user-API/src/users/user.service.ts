import { ConflictError, NotFoundError, UnauthorizedError, EmailConfirmError } from "@transcenduck/error";
import { v4 as uuidV4 } from "uuid";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";

import { UserCreateBodyType, UserBaseType, UserCreateBodyInternalType, User2faStatusType, UserRedisType } from "./user.schema.js";
import { PreferencesBaseType } from "../preferences/preferences.schema.js";
import { knexInstance, Knex } from "../utils/knex.js";
import { USER_PRIVATE_COLUMNS, USER_PUBLIC_COLUMNS, userModelInstance } from "./user.model.js"
import { PREFERENCES_PRIVATE_COLUMNS, preferencesModelInstance } from "../preferences/preferences.model.js";

import fetch from "node-fetch";
import https from "https"
import { redisCache } from "../utils/redis.js";
const httpsAgent = new https.Agent({ rejectUnauthorized: false })

async function verifyConflict(username: string, email: string) {
  const [existingUsername, existingEmail] = await Promise.all([
    userModelInstance.findByUsername(username, undefined),
    userModelInstance.findByEmail(email, undefined)
  ]);
  if (existingUsername) throw new ConflictError("Username already Exist");
  if (existingEmail) throw new ConflictError("Email already in use");
}
export class UserService {
  static async createUser(data: UserCreateBodyType) {

    await verifyConflict(data.username, data.email);
    console.table(data);

    const hash_pass = await hashPassword(data.password);
    const user_obj = {
      username: data.username,
      password: hash_pass,
      email: data.email,
      validated: process.env.NODE_ENV === 'development' ? true : false
    }

    const user_preferences = {
      lang: data.preferences?.lang ?? 'en',
      avatar: process.env.REDIRECT_URI +`/api/uploads/avatar/default.png`,
      banner: process.env.REDIRECT_URI +`/api/uploads/banner/default.png`,
      theme: data.preferences?.theme ?? 'dark',
    }

    const user = JSON.stringify({
      user_obj,
      user_preferences
    });

    const userID = uuidV4();

    // Backdor for development purposes
    // if (process.env.NODE_ENV !== 'development') {

      redisCache.setEx(`users:pendingUser:${userID}`, 660, user);
      redisCache.setEx(`users:pendingUser:${user_obj.username}`, 660, userID);

      await fetch(`https://${process.env.AUTH_IP}/internal/email-verification`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({ email: user_obj.email, lang: user_preferences.lang, token: userID }),
        agent: httpsAgent
      }).catch(console.error)
      
      return;
    // }

    // this part is called on developpement environnement only
    const transactionData = await knexInstance.transaction(async (trx: Knex.Transaction) => {
      const [user] = await userModelInstance.create(trx, userID, user_obj);

      const [preferences] = await preferencesModelInstance.create(trx, userID, user_preferences);

      return { ...user, preferences }
    });
    await userModelInstance.update(userID, { validated: true }, USER_PRIVATE_COLUMNS);
    return transactionData;
  }
  
  static async createUserO2Auth(data: { username: string, email: string, avatar?: string }) {

    await verifyConflict(data.username, data.email);

    const user_obj = {
      username: data.username,
      password: null,
      email: data.email,
      validated: true
    }

    const user_preferences: Omit<PreferencesBaseType, 'user_id'> = {
      lang: 'en',
      avatar: data.avatar ?? (process.env.REDIRECT_URI +`/api/uploads/avatar/default.png`),
      banner: process.env.REDIRECT_URI +`/api/uploads/banner/default.png`,
      theme: 'dark',
    }

    const transactionData = await knexInstance.transaction(async (trx: Knex.Transaction) => {
      const userID = uuidV4();
      const [user] = await userModelInstance.create(trx, userID, user_obj);

      const [preferences] = await preferencesModelInstance.create(trx, userID, user_preferences);

      return { ...user, preferences }
    });
    return transactionData;
  }

  static async get2faStatus(userId: string): Promise<User2faStatusType> {
    const user = await userModelInstance.findByID(userId, ['twofa']);
    if (!user) {
      throw new NotFoundError('User');
    }
    return { twofa: user.twofa };
  }

  static async activateUserAccount(email: string) {
    const user = await userModelInstance.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User');
    }
    await userModelInstance.update(user.id, { validated: true }, USER_PRIVATE_COLUMNS);
  }

  static async enable2FA(userId: string) {
    const user = await this.getUserByID(userId, true, USER_PRIVATE_COLUMNS, PREFERENCES_PRIVATE_COLUMNS);
    if (!user) {
      throw new NotFoundError('User');
    }

    await fetch(`https://${process.env.AUTH_IP}/internal/2fa/sendCode`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ email: user.email, lang: user.preferences?.lang }),
      agent: httpsAgent
    }).catch(console.error)

    redisCache.setEx("users:2fa:update:" + user.email , 600, userId);
  }

  static async disable2FA(userId: string) {
    const user = await this.getUserByID(userId, true, USER_PRIVATE_COLUMNS, PREFERENCES_PRIVATE_COLUMNS);
    if (!user) {
      throw new NotFoundError('User');
    }

    await fetch(`https://${process.env.AUTH_IP}/internal/2fa/sendCode`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ email: user.email, lang: user.preferences?.lang }),
      agent: httpsAgent
    }).catch(console.error)

    redisCache.setEx("users:2fa:update:" + user.email, 600, userId);
  }

  static async update2FA(userId: string) {
    const user = await userModelInstance.findByID(userId, USER_PRIVATE_COLUMNS);
    const twofa = user!.twofa;
    await userModelInstance.update(userId, { twofa: !twofa }, USER_PRIVATE_COLUMNS);
    if ((!twofa) === true) {
      return "2FA successfully enabled !";
    }
    return "2FA successfully disabled !"
  }

  static async createUserInternal(data: UserCreateBodyInternalType) {
    await verifyConflict(data.username, data.email);

    const user_preferences = { // TODO: preferences rework for simplify system
      lang: data.lang || 'en',

      avatar: process.env.REDIRECT_URI +`/api/uploads/avatar/default.png`,
      banner: process.env.REDIRECT_URI +`/api/uploads/banner/default.png`,
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

  static async getAllUsers(userId: string, blocked: ("you" | "another"| "all" | "none") = "all", friends: boolean = false, pending: boolean = false, page: number = 1, limit: number = 10, hydrate: boolean = true) {
    return await userModelInstance.findAll(userId, blocked, friends, pending, page, limit, hydrate, USER_PUBLIC_COLUMNS);
  }

  static async deleteUser(id: string) {
    await userModelInstance.delete(id);
    const multi = redisCache.multi();
    multi.del(`users:data:${id}`);
    multi.del(`users:data:${id}:hydrate`);
    multi.exec().catch(console.error);
  }

  static async createUserRedis(userId: string) {

    const user = await redisCache.get(`users:pendingUser:${userId}`);
    if (!user) {
      throw new NotFoundError('User');
    }

    const userData = JSON.parse(user) as UserRedisType;
    
    const multi = redisCache.multi();
    multi.del(`users:pendingUser:${userId}`);
    multi.del(`users:pendingUser:${userData.user_obj.username}`)
    multi.exec().catch(console.error);

    return await knexInstance.transaction(async (trx: Knex.Transaction) => {
      const userID = userId;
      const [user] = await userModelInstance.create(trx, userID, userData.user_obj);

      const [preferences] = await preferencesModelInstance.create(trx, userID, userData.user_preferences);

      return { ...user, preferences }
    });
  }

  static async getUserByID(
    id: string,
    includePreferences: boolean = false,
    userColumns: string[],
    preferencesColumns: string[]
  ): Promise<UserBaseType & { preferences?: PreferencesBaseType }> {
    if (!includePreferences) {
      const data = await redisCache.getEx(`users:data:${id}`, {type:'EX', value: 3600 });
      if (data) {
        return JSON.parse(data);
      }
      const user = await userModelInstance.findByID(id, userColumns);
      if (!user) throw new NotFoundError("User");
      await redisCache.setEx(`users:data:${id}`, 3600 , JSON.stringify(user));
      return user;
    }
    const data = await redisCache.getEx(`users:data:${id}:hydrate`, {type:'EX', value: 3600 });
    if (data) {
      return JSON.parse(data);
    }

    const [user, preferences] = await Promise.all([
      userModelInstance.findByID(id, userColumns),
      preferencesModelInstance.findByUserID(id, preferencesColumns)
    ]);

    if (!user) throw new NotFoundError("User");
    if (!preferences) throw new NotFoundError("Preferences");

    const userWithPreferences = { ...user, preferences };
    await redisCache.setEx(`users:data:${id}:hydrate`, 3600 , JSON.stringify(userWithPreferences));
    return userWithPreferences;
  }

  static async getUserByEmail(
    email: string,
    columns: string[] = USER_PUBLIC_COLUMNS
  ): Promise<UserBaseType | undefined> {
    return await userModelInstance.findByEmail(email, true, columns) as UserBaseType | undefined;
  }

  static async updateUserPassword(
    id: string,
    oldPassword: string | undefined,
    newPassword: string,
  ): Promise<UserBaseType> {
    {
      const user = await userModelInstance.findByID(id, ['password'])
      if (!user) throw new NotFoundError("User");
      if (user.password) {
        if (!oldPassword) throw new UnauthorizedError("Old password is required");
        const isValid = await comparePassword(oldPassword, user.password!);
        if (!isValid) throw new UnauthorizedError("Invalid old password");
      }
    }

    const hash_pass = await hashPassword(newPassword);
    const [updatedUser] = await userModelInstance.update(id, { password: hash_pass }, USER_PRIVATE_COLUMNS);

    redisCache.DEL(`users:credentials:${updatedUser.username}`).catch(console.error);
    return updatedUser;
  }

  static async updateUserEmail(
    id: string,
    email: string
  ) {
    const user = await this.getUserByID(id, true, USER_PRIVATE_COLUMNS, PREFERENCES_PRIVATE_COLUMNS);
    if (!user) throw new NotFoundError("User");

    const existingEmail = await userModelInstance.findByEmail(email, true);
    if (existingEmail) throw new ConflictError("Email already in use");

    const tokenMail = uuidV4();
    const data = JSON.stringify({ token: tokenMail, userID: id });

    redisCache.setEx(`users:pendingEmail:${tokenMail}`, 660, email);
    redisCache.setEx(`users:pendingEmail:${email}`, 660, data);
    redisCache.setEx(`users:pendingEmail:${id}`, 660, email);

    await fetch(`https://${process.env.AUTH_IP}/internal/email-verification`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ email: email, lang: user.preferences!.lang, token: tokenMail }),
      agent: httpsAgent
    }).catch(console.error);
  }

  static async updateUserEmailRedis ( userID: string ) {

    const email = await redisCache.get(`users:pendingEmail:${userID}`);
    if (!email) {
      throw new NotFoundError('Email not found or verification email expired');
    }

    const [updatedUser] = await userModelInstance.update(userID, { email: email }, USER_PRIVATE_COLUMNS);

    const multi = redisCache.multi();
    multi.DEL(`users:pendingEmail:${userID}`);
    multi.DEL(`users:pendingEmail:${email}`);
    multi.DEL(`users:data:${userID}:hydrate`);
    multi.DEL(`users:data:${userID}`);
    multi.exec().catch(console.error);
    
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

    const multi = redisCache.multi();
    multi.DEL(`users:data:${id}:hydrate`);
    multi.DEL(`users:data:${id}`);
    multi.exec().catch(console.error);
    return updatedUser;
  }

  static async verifyCredentials(username: string, password: string): Promise<UserBaseType> {
    const user = await userModelInstance.findByUsername(username, undefined, ['password', 'validated', ...USER_PRIVATE_COLUMNS]);
    if (!user) throw new UnauthorizedError("Invalid credentials");
    if(user.password === null) throw new UnauthorizedError("Only OAuth users can login with password");
    console.table({"passwordSSend": password, ...user} );
    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new UnauthorizedError("Invalid credentials");

    if(user.validated === false)
      throw new EmailConfirmError('Email not already confirmed');
    return user;
  }
}


