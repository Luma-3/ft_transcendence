export interface GameData {
  player1: {
    y: number;
    score: number;
  }
  player2: {
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

export interface GameInfo {
  uid: string;
  gameName: string;
  typeGame: string;
  gameId?: string;
}

export interface RoomData {
  id: string;
  gameName: string;
  typeGame: string;
  opponents: Opponents;
}


export interface Opponents {
  all: player[];
}

interface player {
  id: string;
  gameName: string;
}