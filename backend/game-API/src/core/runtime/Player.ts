import { GameType } from '../../room/room.schema.js';

export interface IGameInfos {
  name: string,
  type_game: GameType,
  privateRoom?: boolean,
}

export class Player {
  public id: string;
  public avatar: string = '';
  public player_name: string;
  public ready: boolean;
  public score: number = 0;
  public win: boolean = false;
  public side: 'left' | 'right' = 'left';
  // TODO : mettre le check de score ici ! 

  constructor(userId: string, playerName: string) {
    this.id = userId;
    this.ready = false;
    this.player_name = playerName;
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
      score: this.score,
      side: this.side,
    };
  }
}
