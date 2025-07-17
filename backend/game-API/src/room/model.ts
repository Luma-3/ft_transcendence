import { knexInstance } from '../utils/knex.js';

export class RoomModel {

  async findByID(player_id: string) {
    return await knexInstance('matches')
      .where(function() {
        this.where('player_1', player_id).orWhere('player_2', player_id)
      })
      .orderBy('created_at', 'desc')

  }
  async addMatch(data: any) {
    return await knexInstance('matches')
      .insert(data)
  }
}


export const RoomModelInstance = new RoomModel();
