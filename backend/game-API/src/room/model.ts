// import type { Knex } from 'knex';
import { knexInstance } from '../utils/knex.js';

// import { UserBaseType, UserDBHydrateType } from './schema.js'

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

export class RoomModel {

    async findByID(player_id: string) {
    return await knexInstance ('matches')
    .where(function () {
    this.where('player_1', player_id).orWhere('player_2', player_id)
  })

}
    async addMatch(data : any) {
            return await knexInstance ('matches')
    .insert(data)
    }
}


export const RoomModelInstance = new RoomModel();
