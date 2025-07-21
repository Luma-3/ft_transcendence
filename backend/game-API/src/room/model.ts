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

  async getKDStats(userId: string) {
    return await knexInstance('kd_stats')
      .where('user_id', userId)
      .first();
  }

  async addKDStats(userId: string, wins: number, losses: number) {
    return await knexInstance('kd_stats')
      .insert({
        user_id: userId,
        wins: wins,
        losses: losses,
        total_games: wins + losses
      })
      .onConflict('user_id')
      .merge();
  }
}


export const RoomModelInstance = new RoomModel();
