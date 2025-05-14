import { NotFoundError } from "@transcenduck/error";

export class PreferencesService {
  constructor({ models }) {
    this.PreferencesModel = models.PreferencesModel;
  }

  async getPreferences(userID, schema) {
    const preferences = await this.PreferencesModel.findByUserID(userID, schema.preferences);
    if (!preferences) throw new NotFoundError('Preferences');
    return preferences;
  }

  async updatePreferences(userID, data, schema) {
    return await this.PreferencesModel.update(userID, data, schema.preferences);
  }
}
