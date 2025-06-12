import { Knex } from 'knex';

import { PreferencesBaseType } from '../schema/preferences.schema.js';

export const PREFERENCES_PUBLIC_COLUMNS: (keyof PreferencesBaseType)[] = ['user_id', 'theme', 'lang', 'avatar', 'banner'];
export const PREFERENCES_PRIVATE_COLUMNS: (keyof PreferencesBaseType)[] = ['user_id', 'theme', 'lang', 'avatar', 'banner'];

export class PreferencesModel {
  constructor(private knex: Knex) { }

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
    return await this.knex('preferences')
      .select(columns)
      .where('user_id', userID)
      .first();
  }

  async update(
    userID: string,
    data: Partial<Omit<PreferencesBaseType, 'user_id'>>,
    columns = PREFERENCES_PRIVATE_COLUMNS) {
    return await this.knex('preferences')
      .where('user_id', userID)
      .update(data, columns);
  }
}
