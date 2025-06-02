import { FastifyReply, FastifyRequest } from 'fastify';

import { PreferencesService } from '../services/preferencesService.js';
import { PREFERENCES_PRIVATE_COLUMNS, PREFERENCES_PUBLIC_COLUMNS } from '../models/preferencesModel.js';

import { PreferencesUpdateBodyType, PreferencesGetType } from '../schema/preferences.schema.js';

export async function getMePreferences(
  req: FastifyRequest<{ Headers: { 'x-user-id': string } }>, rep: FastifyReply
) {
  const userID = req.headers['x-user-id'];

  const preferences = await PreferencesService.getPreferences(userID, PREFERENCES_PRIVATE_COLUMNS);

  return rep.code(200).send({ message: 'Ok', data: preferences });
}

export async function updatePreferences(
  req: FastifyRequest<{ Headers: { 'x-user-id': string }, Body: PreferencesUpdateBodyType }>, rep: FastifyReply
) {
  const userID = req.headers['x-user-id'];

  const [preferences] = await PreferencesService.updatePreferences(userID, req.body, PREFERENCES_PRIVATE_COLUMNS);

  return rep.code(200).send({ message: 'Ok', data: preferences });
}

export async function getUserPreferences(
  req: FastifyRequest<{ Params: PreferencesGetType }>, rep: FastifyReply
) {
  const { userID } = req.params;

  const preferences = await PreferencesService.getPreferences(userID, PREFERENCES_PUBLIC_COLUMNS);

  return rep.code(200).send({ message: 'Ok', data: preferences });
}
