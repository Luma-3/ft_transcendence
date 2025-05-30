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

export interface GameId {
  id: string;
}

export interface FrontGameInfo {
  playerId: string;
  gameName: string;
  typeGame: string;
  gameId?: string;
  gameNameOpponent?: string;
}

export interface initInfo {
  id: string;
  roomId: string;
}

export interface RoomData {
  roomId: string;
  gameData?: GameData;
  typeGame: string;
  players: player[];
}

export interface player {
  playerId: string;
  gameName: string;
  ready: boolean;
}

export interface ServerGameData {
  action: string;
  data: RoomData;
}

