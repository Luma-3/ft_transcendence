import { Knex } from 'knex'

export interface IUser {
  id: string;
  username: string;
  email?: string;
  password?: string;
  created_at: string;
}

export const USER_PUBLIC_COLUMNS: (keyof IUser)[] = ['id', 'username', 'created_at'];
export const USER_PRIVATE_COLUMNS: (keyof IUser)[] = ['id', 'username', 'email', 'created_at'];

export class UserModel {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex
  }

  async findAll(columns = USER_PUBLIC_COLUMNS) {
    return await this.knex<IUser>('users')
      .select(columns);
  }

  async findByID(id: string, columns = USER_PUBLIC_COLUMNS): Promise<IUser | undefined> {
    return await this.knex<IUser>('users')
      .select(columns)
      .where('id', id)
      .first();
  }

  async findByUsername(username: string, columns = USER_PUBLIC_COLUMNS) {
    return await this.knex<IUser>('users')
      .select(columns)
      .where('username', username)
      .first();
  }

  async findByEmail(email: string, columns = USER_PRIVATE_COLUMNS) {
    return await this.knex<IUser>('users')
      .select(columns)
      .where('email', email)
      .first();
  }

  async create(
    trx: Knex.Transaction,
    id: string,
    data: Pick<IUser, 'username' | 'email' | 'password'>,
    columns = USER_PRIVATE_COLUMNS
  ) {
    return await trx<IUser>('users').insert({
      id: id,
      username: data.username,
      email: data.email,
      password: data.password,
      created_at: this.knex.fn.now()
    }, columns);
  }

  async delete(id: string) {
    return await this.knex<IUser>('users')
      .where('id', id)
      .del();
  }

  async update(
    id: string,
    data: Partial<Omit<IUser, 'id' | 'created_at'>>,
    columns = USER_PRIVATE_COLUMNS
  ) {
    return await this.knex<IUser>('users')
      .where('id', id)
      .update(data, columns);
  }
}
