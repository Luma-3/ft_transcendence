import { NotFoundError } from "@transcenduck/error";

import { preferencesModel } from "../models/models.js"
import { PreferencesBaseType } from "./preferences.schema.js";
import { redisPub } from "../utils/redis.js";

export class PreferencesService {
  static async getPreferences(
    userID: string,
    columns: string[]
  ): Promise<PreferencesBaseType> {
    const data = await redisPub.getEx(`preferences:data:${userID}`, { type: 'EX', value: 3600 });
    if (data) {
      return JSON.parse(data) as PreferencesBaseType;
    }
    const preferences = await preferencesModel.findByUserID(userID, columns);
    if (!preferences) throw new NotFoundError('Preferences');
    await redisPub.setEx(`preferences:data:${userID}`, 3600, JSON.stringify(preferences));
    return preferences;
  }

  static async updatePreferences(
    userID: string,
    data: Partial<Omit<PreferencesBaseType, 'user_id'>>,
    columns: string[]
  ): Promise<PreferencesBaseType> {
    const [updatePreferences] = await preferencesModel.update(userID, data, columns);
    redisPub.setEx(`preferences:data:${userID}`, 3600, JSON.stringify(updatePreferences));
    redisPub.DEL(`users:data:${userID}:hydrate`).catch(console.error);
    return updatePreferences;
  }
}
