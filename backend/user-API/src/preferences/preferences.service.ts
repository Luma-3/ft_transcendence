import { NotFoundError } from "@transcenduck/error";

import { preferencesModel } from "../models/models.js"
import { PreferencesBaseType } from "./preferences.schema.js";

export class PreferencesService {
  static async getPreferences(
    userID: string,
    columns: string[]
  ): Promise<PreferencesBaseType> {
    const preferences = await preferencesModel.findByUserID(userID, columns);
    if (!preferences) throw new NotFoundError('Preferences');
    return preferences;
  }

  static async updatePreferences(
    userID: string,
    data: Partial<Omit<PreferencesBaseType, 'user_id'>>,
    columns: string[]
  ): Promise<PreferencesBaseType> {
    const [updatePreferences] = await preferencesModel.update(userID, data, columns);
    return updatePreferences;
  }
}
