import * as preferencesSchema from '../schema/preferences.schema.js'

export async function getPreferences(req, rep) {
  const userID = req.headers['x-user-id'];

  const preferences = await this.UserService.getUserPreferences(userID, {
    preferences: this.extractDbKeys(preferencesSchema.preferencesPrivate)
  });

  return rep.code(200).send({ message: 'Ok', data: preferences });
}

export async function updatePreferences(req, rep) {
  const userID = req.headers['x-user-id'];
  const { preferences } = req.body;

  const updatedPreferences = await this.UserService.updateUserPreferences(userID, preferences, {
    preferences: this.extractDbKeys(preferencesSchema.preferencesPrivate)
  });

  return rep.code(200).send({ message: 'Ok', data: updatedPreferences });
}
