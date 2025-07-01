export interface IRoomInfos {
  room_id: string,
  game_type: string,
  players: IPlayer[],
  status: string,
}

// START - Jb - Part

export interface Vector2 {
  x: number;
  y: number;
}

export interface IGameObject {
  type: string;
}

export interface IBall {
  type: string;
  position: Vector2;
  velocity: Vector2;
  radius: number;
}

export interface IPaddle {
  type: string;
  id: string;
  position: Vector2;
  scale: Vector2;
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
  typeGame: string;
  players: IPlayer[];
}

export interface IPlayer {
  user_id: string;
  player_name: string;
  ready: boolean;
  score: number;
  win: boolean;
}

export interface IServerGameData {
  action: string;
  data: IRoomData;
}

