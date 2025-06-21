export interface IRoomInfos {
  room_id: string,
  game_type: string,
  players: IPlayer[],
}

export interface IGameData {
  paddle1: {
    y: number;
    score: number;
  }
  paddle2: {
    y: number;
    score: number;
  }
  ball: {
    x: number;
    y: number;
  }
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
  gameData?: IGameData;
  typeGame: string;
  players: IPlayer[];
}

export interface IPlayer {
  playerId: string;
  gameName: string;
  ready: boolean;
}

export interface IServerGameData {
  action: string;
  data: IRoomData;
}

