import { gameType } from '../../room/room.schema.js';

export interface IGameInfos {
  name: string,
  type_game: gameType,
}

export class Player {
  public user_id: string;
  public player_name: string;
  public ready: boolean;

  constructor(user_id: string, player_name: string) {
    this.user_id = user_id;
    this.player_name = player_name;
    this.ready = false;
  }

  setReady(ready: boolean) {
    this.ready = ready;
  }

  toJSON() {
    return {
      user_id: this.user_id,
      player_name: this.player_name,
      ready: this.ready
    };
  }
}
