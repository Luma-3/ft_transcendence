import { NotFoundError } from "@transcenduck/error";

import { preferencesModel } from "../models/models"
import { IPreferences } from "../models/preferencesModel";

export class PreferencesService {
  static async getPreferences(
    userID: string,
    columns: (keyof IPreferences)[]
  ): Promise<IPreferences> {
    const preferences = await preferencesModel.findByUserID(userID, columns);
    if (!preferences) throw new NotFoundError('Preferences');
    return preferences;
  }

  static async updatePreferences(
    userID: string,
    data: Partial<Omit<IPreferences, 'user_id'>>,
    columns: (keyof IPreferences)[]
  ): Promise<IPreferences[]> {
    return await preferencesModel.update(userID, data, columns);
  }
}
