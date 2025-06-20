import { knexInstance, Knex } from "../utils/knex.js";

import { PreferencesBaseType } from './preferences.schema.js';

export const PREFERENCES_PUBLIC_COLUMNS: string[] = ['user_id', 'theme', 'lang', 'avatar', 'banner'];
export const PREFERENCES_PRIVATE_COLUMNS: string[] = ['user_id', 'theme', 'lang', 'avatar', 'banner'];

export class PreferencesModel {
  async create(
    trx: Knex.Transaction,
    userID: string,
    data: Omit<PreferencesBaseType, 'user_id'>,
    columns = PREFERENCES_PRIVATE_COLUMNS) {
    return await trx('preferences')
      .insert({
        user_id: userID,
        theme: data.theme,
        lang: data.lang,
        avatar: data.avatar,
        banner: data.banner
      }, columns);
  }

  async findByUserID(
    userID: string,
    columns = PREFERENCES_PUBLIC_COLUMNS) {
    return await knexInstance('preferences')
      .select(columns)
      .where('user_id', userID)
      .first();
  }

  async update(
    userID: string,
    data: Partial<Omit<PreferencesBaseType, 'user_id'>>,
    columns = PREFERENCES_PRIVATE_COLUMNS) {
    return await knexInstance('preferences')
      .where('user_id', userID)
      .update(data, columns);
  }
}

export const preferencesModelInstance = new PreferencesModel();
