export interface IRoomData {
  roomId: string;
  typeGame: string;
  players: IPlayer[];
}

export interface IPlayer {
  id: string;
  player_name: string;
  ready: boolean;
  avatar: string;
  score: number;
  win: boolean;
}

export interface ITournamentInfo {
  players: IPlayer[];
}

export interface IGameData {
  id: string;
  player_1: string;
  player_2: string;
  score_1: number;
  score_2: number;
  type: string;
  winner: {
    id: string;
  },
}