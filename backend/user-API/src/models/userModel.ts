import { Knex } from 'knex';

import { UserBaseType } from '../schema/user.schema.js'

export const USER_PUBLIC_COLUMNS: (keyof UserBaseType)[] = ['id', 'username', 'created_at'];
export const USER_PRIVATE_COLUMNS: (keyof UserBaseType)[] = ['id', 'username', 'email', 'created_at'];

export class UserModel {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex
  }

  async findAll(columns = USER_PUBLIC_COLUMNS) {
    return await this.knex<UserBaseType>('users')
      .select(columns);
  }

  async findByID(id: string, columns = USER_PUBLIC_COLUMNS): Promise<UserBaseType | undefined> {
    return await this.knex<UserBaseType>('users')
      .select(columns)
      .where('id', id)
      .first();
  }

  async findByUsername(username: string, columns = USER_PUBLIC_COLUMNS) {
    return await this.knex<UserBaseType>('users')
      .select(columns)
      .where('username', username)
      .first();
  }

  async findByEmail(email: string, columns = USER_PRIVATE_COLUMNS) {
    return await this.knex<UserBaseType>('users')
      .select(columns)
      .where('email', email)
      .first();
  }

  async create(
    trx: Knex.Transaction,
    id: string,
    data: Pick<UserBaseType, 'username' | 'email' | 'password'>,
    columns = USER_PRIVATE_COLUMNS
  ) {
    return await trx<UserBaseType>('users').insert({
      id: id,
      username: data.username,
      email: data.email,
      password: data.password,
      created_at: this.knex.fn.now()
    }, columns);
  }

  async delete(id: string) {
    return await this.knex<UserBaseType>('users')
      .where('id', id)
      .del();
  }

  async update(
    id: string,
    data: Partial<Omit<UserBaseType, 'id' | 'created_at'>>,
    columns = USER_PRIVATE_COLUMNS
  ) {
    return await this.knex<UserBaseType>('users')
      .where('id', id)
      .update(data, columns);
  }
}
