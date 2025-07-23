import { NotFoundError } from "@transcenduck/error";

import { preferencesModelInstance } from "./model.js"
import { PreferencesBaseType } from "./schema.js";
import { redisPub } from "../utils/redis.js";
import { PREFERENCES_PRIVATE_COLUMNS } from "./model.js";

export class PreferencesService {
  static async getPreferences(
    userID: string,
    columns: string[]
  ): Promise<PreferencesBaseType> {
    const privateColumns = columns.length === PREFERENCES_PRIVATE_COLUMNS.length;
    const key = `preferences:data:${userID}` + (privateColumns ? ':private' : ':public');
    const data = await redisPub.getEx(key, { type: 'EX', value: 3600 });
    if (data) {
      return JSON.parse(data) as PreferencesBaseType;
    }
    const preferences = await preferencesModelInstance.findByUserID(userID, columns);
    if (!preferences) throw new NotFoundError('Preferences');
    await redisPub.setEx(key, 3600, JSON.stringify(preferences));
    return preferences;
  }

  static async updatePreferences(
    userID: string,
    data: Partial<Omit<PreferencesBaseType, 'user_id'>>,
    columns: string[]
  ): Promise<PreferencesBaseType> {
    const [updatePreferences] = await preferencesModelInstance.update(userID, data, columns);
    const multi = redisPub.multi();
    multi.del(`preferences:data:${userID}:public`);
    multi.del(`preferences:data:${userID}:private`);
    multi.del(`users:data:${userID}:hydrate:private`);
    multi.del(`users:data:${userID}:hydrate:public`);
    multi.exec().catch(console.log);
    return updatePreferences;
  }
}


