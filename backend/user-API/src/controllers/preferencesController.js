import * as preferencesSchema from '../schema/preferences.schema.js'

export async function getMePreferences(req, rep) {
  const userID = req.headers['x-user-id'];

  const preferences = await this.PreferencesService.getPreferences(userID, {
    preferences: this.extractDbKeys(preferencesSchema.preferencesPrivate)
  });

  return rep.code(200).send({ message: 'Ok', data: preferences });
}

export async function updatePreferences(req, rep) {
  const userID = req.headers['x-user-id'];
  const { theme, lang, avatar } = req.body;

  const [preferences] = await this.PreferencesService.updatePreferences(userID, { theme, lang, avatar }, {
    preferences: this.extractDbKeys(preferencesSchema.preferencesPrivate)
  });


  return rep.code(200).send({ message: 'Ok', data: preferences });
}

export async function getUserPreferences(req, rep) {
  const { userID } = req.params;


  const preferences = await this.PreferencesService.getPreferences(userID, {
    preferences: this.extractDbKeys(preferencesSchema.preferencesPublic)
  });

  return rep.code(200).send({ message: 'Ok', data: preferences });
}
