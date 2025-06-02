import { InternalServerError } from '@transcenduck/error';
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


export async function updateAvatarPreferences(req, rep) {
  const userID = req.headers['x-user-id'];

  const oldPreferences = await this.PreferencesService.getPreferences(userID, {
    preferences: this.extractDbKeys(preferencesSchema.preferencesAvatarPrivate)
  });
  const file = await req.file({
    limits: {
      fileSize: 1024 * 1024 * 4, // 5MB
      files: 1
    }
  });
  let info;
  const formData = new FormData();
  formData.append('avatar', new Blob([await file.toBuffer()], {type: file.mimetype}), file.filename);
  const fetchUrl = await fetch('http://' + process.env.UPLOAD_IP + '/avatar', {
      method: 'POST',
      headers: {},
      body: formData
    });
  try {
    info = await fetchUrl.json();
  }
  catch (err) {
    throw new InternalServerError(err.message, 'Error while uploading avatar');
  }
  if (!fetchUrl.ok) {
    return rep.code(fetchUrl.status).send(info);
  }

  await fetch('http://' + process.env.UPLOAD_IP + '/avatar/' + oldPreferences.avatar, {
    method: 'DELETE'
  });
  const [preferences] = await this.PreferencesService.updatePreferences(userID, { avatar: info.data.Url }, {
    preferences: this.extractDbKeys(preferencesSchema.preferencesPrivate)
  });
  return rep.code(200).send({ message: 'Ok', data: preferences });
}

export async function updateBannerPreferences(req, rep) {
  const userID = req.headers['x-user-id'];

  const oldPreferences = await this.PreferencesService.getPreferences(userID, {
    preferences: this.extractDbKeys(preferencesSchema.preferencesBannerPrivate)
  });
  const file = await req.file({
    limits: {
      fileSize: 20 * 1024 * 1024, // 20Mio for banner
      files: 1
    }
  });
  let info;
  const formData = new FormData();
  formData.append('banner', new Blob([await file.toBuffer()], {type: file.mimetype}), file.filename);
  const fetchUrl = await fetch('http://' + process.env.UPLOAD_IP + '/banner', {
      method: 'POST',
      headers: {},
      body: formData
    });
  try {
    info = await fetchUrl.json();
  }
  catch (err) {
    throw new InternalServerError(err.message, 'Error while uploading banner');
  }
  if (!fetchUrl.ok) {
    return rep.code(fetchUrl.status).send(info);
  }

  await fetch('http://' + process.env.UPLOAD_IP + '/banner/' + oldPreferences.banner, {
    method: 'DELETE'
  });
  const [preferences] = await this.PreferencesService.updatePreferences(userID, { banner: info.data.Url }, {
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
