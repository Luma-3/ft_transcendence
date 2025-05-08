import { ConflictError } from "@transcenduck/error";
import { v4 as uuidV4 } from "uuid";

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
      avatar: `https://${process.env.GATEWAY_IP}/uploads/profil_pic/default_pp.webp`,
      theme: 'dark'
    }

    return await this.knex.transaction(async (trx) => {
      const userID = uuidV4();
      const [user] = await this.UserModel.create(trx, userID, user_obj);

      const [preferences] = await this.PreferencesModel.create(trx, userID, user_preferences);
      return {
        ...user,
        preferences: preferences
      }
    });
  }

  async deleteUser(id) {
    return await this.UserModel.delete(id);
  }

  async getUserbyID(id, schema) {
    const [user, preferences] = await Promise.all([
      this.UserModel.findByID(id, schema.user),
      this.PreferencesModel.findByUserID(id, schema.preferences)
    ]);

    return {
      ...user,
      preferences: preferences
    }
  }
}
