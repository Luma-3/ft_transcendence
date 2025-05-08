const Base_Schema = ['id', 'username', 'created_at']

export class UserModel {
  constructor(knex) {
    this.knex = knex
  }

  async findAll(schema = Base_Schema) {
    return await this.knex('users')
      .select(schema)
  }

  async findByID(ID, schema = Base_Schema) {
    return await this.knex('users')
      .select(schema)
      .where('id', ID)
      .first();
  }

  async findByUsername(username, schema = Base_Schema) {
    return await this.knex('users')
      .select(schema)
      .where('username', username)
      .first();
  }

  async findByEmail(email, schema = Base_Schema) {
    return await this.knex('users')
      .select(schema)
      .where('email', email)
      .first()
  }

  async create(trx, ID, data, schema = Base_Schema) {
    return await trx('users')
      .insert({
        id: ID,
        username: data.username,
        email: data.email,
        password: data.password,
        created_at: this.knex.fn.now()
      }, schema);
  }

  async delete(ID) {
    return await this.knex('users')
      .where('id', ID)
      .del('id')
  }

  async update(ID, data, schema = Base_Schema) {
    return await this.knex('users')
      .select(schema)
      .where('id', ID)
      .update(data)
  }
}
