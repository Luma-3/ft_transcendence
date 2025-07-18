import { GameType } from '../../room/room.schema.js';

export interface IGameInfos {
  name: string,
  type_game: GameType,
  privateRoom?: boolean,
  localPlayerName?: string,
}

export class Player {
  public id: string;
  public avatar: string = '';
  public player_name: string;
  public ready: boolean;
  public score: number = 0;
  public win: boolean | undefined = undefined;
  public side: 'left' | 'right' = 'left';

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

  reset() {
    this.ready = false;
    this.score = 0;
    this.win = undefined;
    this.side = 'left';
  }

  toJSON() {
    return {
      id: this.id,
      player_name: this.player_name,
      win: this.win,
      avatar: this.avatar,
      ready: this.ready,
      score: this.score,
      side: this.side,
    };
  }
}
