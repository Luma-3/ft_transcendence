export interface IRoomInfos {
  room_id: string,
  game_type: string,
  players: IPlayer[],
}

// START - Jb - Part

export interface Vector2 {
  x: number;
  y: number;
}

export interface Ball {
  position: Vector2;
  velocity: Vector2;
  radius: number;
}

export interface Paddle {
  id: string;
  position: Vector2;
  scale: Vector2;
}

export interface IGameData {
  paddles: Paddle[]
  ball: Ball;
}

// END - Jb - Part

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

