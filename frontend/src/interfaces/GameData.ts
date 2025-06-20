export interface IRoomInfos {
  room_id: string,
  game_type: string,
  players: IPlayer[],
}

export interface GameData {
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

export interface RoomData {
  roomId: string;
  gameData?: GameData;
  typeGame: string;
  players: IPlayer[];
}

export interface IPlayer {
  playerId: string;
  gameName: string;
  ready: boolean;
}

export interface ServerGameData {
  action: string;
  data: RoomData;
}

