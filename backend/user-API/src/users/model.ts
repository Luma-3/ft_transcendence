import type { Knex } from 'knex';
import { knexInstance } from '../utils/knex.js';

import { UserBaseType, UserDBHydrateType } from './schema.js'

export const USER_PUBLIC_COLUMNS: string[] = [
  'users.id',
  'username',
  'created_at'
];
export const USER_PRIVATE_COLUMNS: string[] = [
  'users.id',
  'username',
  'email',
  'validated',
  'twofa',
  'created_at'
];

export class UserModel {

  async findAll(userId: string, blocked: ("you" | "another"| "all" | "none") = "none", friends: boolean = false, pending: boolean = false, page: number = 1, limit: number = 10, hydrate: boolean = true, columns = USER_PUBLIC_COLUMNS) {
    const query =  knexInstance<UserDBHydrateType>('users')
      .select(hydrate ? [...columns, 'preferences.avatar', 'preferences.banner'] : columns)
      .join('preferences', 'users.id', 'preferences.user_id')
      .where('users.id', "!=", userId);
    if (blocked === "another" || blocked === "all") {
      query.leftJoin('blocked as blocked_by', function() {
        this.on('users.id', '=', 'blocked_by.user_id').andOn('blocked_by.blocked_id', '=', knexInstance.raw('?', [userId]));
      }).whereNull('blocked_by.id');
    }
    if (blocked === "you" || blocked === "all") {
      query.leftJoin('blocked as blocked_to', function() {
        this.on('users.id', '=', 'blocked_to.blocked_id').andOn('blocked_to.user_id', '=', knexInstance.raw('?', [userId]));
      }).whereNull('blocked_to.id');
    }
    if (!friends) {
      // Amis
      query.leftJoin('friends', function() {
        this.on('users.id', '=', 'friends.friend_id').andOn('friends.user_id', '=', knexInstance.raw('?', [userId]));
      });
      query.whereNull('friends.id');
    }
    if(!pending) {
      query.leftJoin('pending as pending_by', function () {
        this.on('users.id', '=', 'pending_by.user_id').andOn('pending_by.pending_id', '=', knexInstance.raw('?', [userId]));
      });
      query.whereNull('pending_by.id');

      query.leftJoin('pending as pending_to', function () {
        this.on('users.id', '=', 'pending_to.pending_id').andOn('pending_to.user_id', '=', knexInstance.raw('?', [userId]));
      });
      query.whereNull('pending_to.id');
    }
    query
      .limit(limit)
      .offset((page - 1) * limit);
    return (await query) as UserDBHydrateType[];
  }


  async findByID(id: string, columns = USER_PUBLIC_COLUMNS): Promise<UserBaseType | undefined> {
    return await knexInstance<UserBaseType>('users')
      .select(columns)
      .where('id', id)
      .join('preferences', 'users.id', 'preferences.user_id')
      .first();
  }

  async findByUsername(username: string, validated?:boolean, columns = USER_PUBLIC_COLUMNS) {
    if (validated !== undefined) {
      return (await knexInstance<UserBaseType, UserBaseType>('users')
        .select(columns)
        .where('username', username)
        .andWhere('validated', validated)
        .first()) as UserBaseType | undefined;
    }
    return (await knexInstance<UserBaseType, UserBaseType>('users')
      .select(columns)
      .where('username', username)
      .first()) as UserBaseType | undefined;
  }

  async findByEmail(email: string, validated?:boolean, columns = USER_PRIVATE_COLUMNS): Promise<UserBaseType | undefined> {
  if (validated !== undefined) {
      return await knexInstance<UserBaseType>('users')
        .select(columns)
        .where('email', email)
        .andWhere('validated', validated)
        .join('preferences', 'users.id', 'preferences.user_id')
        .first();
    }
    return await knexInstance<UserBaseType>('users')
      .select(columns)
      .where('email', email)
      .join('preferences', 'users.id', 'preferences.user_id')
      .first();
  }

  async create(
    trx: Knex.Transaction,
    id: string,
    data: Partial<Pick<UserBaseType, 'username' | 'email' | 'password'| 'validated'>>,
    columns = USER_PRIVATE_COLUMNS
  ) {
    return await trx<UserBaseType>('users').insert({
      id: id,
      username: data.username,
      email: data.email,
      password: data.password,
      created_at: knexInstance.fn.now(),
      validated: data.validated ?? false
    }, columns);
  }

  async delete(id: string) {
    return await knexInstance<UserBaseType>('users')
      .where('id', id)
      .del();
  }

  async update(
    id: string,
    data: Partial<Omit<UserBaseType, 'id' | 'created_at'>>,
    columns = USER_PRIVATE_COLUMNS
  ) {
    return await knexInstance<UserBaseType>('users')
      .where('id', id)
      .update(data, columns);
  } 
  async updateByEmail(
    email: string,
    data: Partial<Omit<UserBaseType, 'id' | 'created_at'>>,
    columns = USER_PRIVATE_COLUMNS
  ) {
    return await knexInstance<UserBaseType>('users')
      .where('email', email)
      .update(data, columns);
  }
}

export const userModelInstance = new UserModel();
