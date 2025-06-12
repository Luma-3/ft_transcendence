const Base_Schema = ['lang', 'avatar', 'banner'];

export class PreferencesModel {
  constructor(knex) {
    this.knex = knex;
  }

  async create(trx, userID, data, schema = Base_Schema) {
    return await trx('preferences')
      .insert({
        user_id: userID,
        theme: data.theme,
        lang: data.lang,
        avatar: data.avatar,
        banner: data.banner
      }, schema);
  }

  async findByUserID(userID, schema = Base_Schema) {
    return await this.knex('preferences')
      .select(schema)
      .where('user_id', userID)
      .first()
  }

  async update(userID, data, schema = Base_Schema) {
    return await this.knex('preferences')
      .select(schema)
      .where('user_id', userID)
      .update(data, schema)
  }
}
