import { gameType } from '../../room/room.schema.js';

export interface IGameInfos {
  name: string,
  type_game: gameType,
}

export interface IPlayer {
  user_id: string,
  player_name: string,
  ready: boolean
}
