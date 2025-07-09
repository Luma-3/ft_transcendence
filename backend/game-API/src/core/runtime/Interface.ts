import { gameType } from '../../room/room.schema.js';

export interface IGameInfos {
  name: string,
  type_game: gameType,
}

export class Player {
  public id: string;
  public avatar: string = '';
  public player_name: string;
  public ready: boolean;
  public score: number = 0;
  public win: boolean = false;
  // TODO : mettre le check de score ici ! 

  constructor(user_id: string, player_name: string) {
    this.id = user_id;
    this.player_name = player_name;
    this.ready = false;
  }

  public addScore() {
    this.score++;
  }

  setReady(ready: boolean) {
    this.ready = ready;
  }

  toJSON() {
    return {
      id: this.id,
      player_name: this.player_name,
      avatar: this.avatar,
      ready: this.ready,
      score: this.score
    };
  }
}
