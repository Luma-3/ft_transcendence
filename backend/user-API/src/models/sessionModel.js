export class SessionModel {
  constructor(knex) {
    this.knex = knex;
  }

  async create(userID, jti) {
    await this.knex('sessions')
      .insert({
        user_id: userID,
        jti: jti,
        created_at: this.knex.fn.now()
      })
  }

  async findByUserID(userID) {
    return await this.knex('sessions')
      .where('user_id', userID)
      .first();
  }

  async delete(userID) {
    return await this.knex('sessions')
      .where('user_id', userID)
      .del();
  }

  async update(userID, jti) {
    return await this.knex('sessions')
      .where('user_id', userID)
      .update({
        jti: jti,
        created_at: this.knex.fn.now()
      })
  }
}
