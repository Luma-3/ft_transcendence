import { ConflictError, NotFoundError, UnauthorizedError } from "@transcenduck/error";
import { v4 as uuidV4 } from "uuid";
import { redisPub } from "../config/redis.js";

export class UserService {
  constructor({ models, utils }) {
    this.UserModel = models.UserModel;
    this.PreferencesModel = models.PreferencesModel;
    this.bcrypt = utils.bcrypt;
    this.knex = utils.knex;
  }

  async createUser(username, password, email, lang = 'en') {
    const [existingUsername, existingEmail] = await Promise.all([
      this.UserModel.findByUsername(username),
      this.UserModel.findByEmail(email)
    ]);
    if (existingUsername) throw new ConflictError("Username already Exist");
    if (existingEmail) throw new ConflictError("Email already in use");

    const hash_pass = await this.bcrypt.hash(password);
    const user_obj = {
      username: username,
      password: hash_pass,
      email: email,
    }

    const user_preferences = {
      lang: lang,
      theme: 'dark',
      avatar: `default.png`,
      banner: `default.png`
    }

    return await this.knex.transaction(async (trx) => {
      const userID = uuidV4();
      const [user] = await this.UserModel.create(trx, userID, user_obj);

      const [preferences] = await this.PreferencesModel.create(trx, userID, user_preferences);
      redisPub.publish('api.people.in', JSON.stringify({
        userId: userID,
        action: 'create',
        payload: {
          username: username
        }
      })).catch(err => {
        console.error(`Error creating user ${userID}:`, err);
      });
      return {
        ...user,
        preferences: preferences
      }
    });
  }

  async deleteUser(id) {
    await this.UserModel.delete(id);
    return id;
  }

  async getUserByID(id, schema) {
    const [user, preferences] = await Promise.all([
      this.UserModel.findByID(id, schema.user),
      this.PreferencesModel.findByUserID(id, schema.preferences)
    ]);

    if (!user) {
      throw new NotFoundError("User");
    }

    return {
      ...user,
      preferences: preferences
    }
  }

  async updateUserPassword(id, oldPassword, newPassword, schema) {
    const user = await this.UserModel.findByID(id, ['password']);
    if (!user) throw new NotFoundError("User");
    const isValid = await this.bcrypt.compare(oldPassword, user.password);
    if (!isValid) throw new UnauthorizedError("Invalid password");

    const hash_pass = await this.bcrypt.hash(newPassword);
    const [[updatedUser], updatedPreferences] = await Promise.all([
      this.UserModel.update(id, { password: hash_pass }, schema.user),
      this.PreferencesModel.findByUserID(id, schema.preferences)
    ]);

    return {
      ...updatedUser,
      preferences: updatedPreferences
    }
  }

  async updateUserEmail(id, email, schema) {
    const user = await this.UserModel.findByID(id);
    if (!user) throw new NotFoundError("User");
    const existingEmail = await this.UserModel.findByEmail(email);
    if (existingEmail) throw new ConflictError("Email already in use");

    const [[updatedUser], preferences] = await Promise.all([
      this.UserModel.update(id, { email: email }, schema.user),
      this.PreferencesModel.findByUserID(id, schema.preferences)
    ]);

    return {
      ...updatedUser,
      preferences: preferences
    }
  }

  async updateUserUsername(id, username, schema) {
    const user = await this.UserModel.findByID(id);
    if (!user) throw new NotFoundError("User");

    const existingUsername = await this.UserModel.findByUsername(username);
    if (existingUsername) throw new ConflictError("Username already in use");

    const [[updatedUser], preferences] = await Promise.all([
      this.UserModel.update(id, { username: username }, schema.user),
      this.PreferencesModel.findByUserID(id, schema.preferences)
    ]);
    redisPub.publish('api.people.in', JSON.stringify({
        userId: id,
        action: 'update',
        payload: {
          username: username
        }
    })).catch(err => {
      console.error(`Error updating user ${id}:`, err);
    });
    return {
      ...updatedUser,
      preferences: preferences
    }
  }
}
