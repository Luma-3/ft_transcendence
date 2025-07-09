export interface IRoomInfos {
  id: string,
  game_type: string,
  players: IPlayer[],
  status: string,
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface IGameObject {
  type: string;
}


export interface FrontGameInfo {
  typeGame: string;
  gameId: string;
}

export interface initInfo {
  id: string;
  roomId: string;
}

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

export interface IServerGameData {
  action: string;
  data: IRoomData;
}

