import { Knex } from 'knex';

export interface IPreferences {
  user_id: string;
  theme: 'light' | 'dark';
  lang: string;
  avatar: string;
}

export const PREFERENCES_PUBLIC_COLUMNS: (keyof IPreferences)[] = ['user_id', 'theme', 'lang', 'avatar'];
export const PREFERENCES_PRIVATE_COLUMNS: (keyof IPreferences)[] = ['user_id', 'lang', 'avatar'];

export class PreferencesModel {
  constructor(private knex: Knex) { }

  async create(
    trx: Knex.Transaction,
    userID: string,
    data: Omit<IPreferences, 'user_id'>,
    columns = PREFERENCES_PRIVATE_COLUMNS) {
    return await trx('preferences')
      .insert({
        user_id: userID,
        theme: data.theme,
        lang: data.lang,
        avatar: data.avatar
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
    data: Partial<Omit<IPreferences, 'user_id'>>,
    columns = PREFERENCES_PRIVATE_COLUMNS) {
    return await this.knex('preferences')
      .where('user_id', userID)
      .update(data, columns);
  }
}
