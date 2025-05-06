import { v4 as uuidv4 } from 'uuid'

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
  }

  async findByUsername(username, schema = Base_Schema) {
    return this.knex('users')
      .select(schema)
      .where('username', username)
      .first();
  }

  async create(user, schema = Base_Schema) {
    user.id = uuidv4();
    user.created_at = this.knex.fn.now();

    return this.knex('users').insert(user, schema);
  }

  async update(ID, update, schema = Base_Schema) {
    return this.knex('users')
      .select(schema)
      .where('id', ID)
      .update(update)
  }
}
