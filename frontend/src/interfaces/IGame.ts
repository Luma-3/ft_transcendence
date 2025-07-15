
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

export interface IGameData {
  id: string;
  player_1: string;
  player_2: string;
  score_1: number;
  score_2: number;
  type: string;
  winner: {
    id: string;
    // avatar: string;
    // score: number;
    // win: boolean;
    // side: string;
    // ready: boolean;
    // player_name: string;
  },
}

//   id: 'ee6b0b09-2cf7-4c77-b229-b51814010c4e',
// game-API      |   player_1: null,
// game-API      |   player_2: 'a700e2d4-415f-4453-8954-afea75df4c76',
// game-API      |   winner: Player {
// game-API      |     avatar: 'https://localhost:5173/api/uploads/proxy?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocJO4FDO3HWbMqp-NH4WFVx5jXmv9mskdDwDRnm9g4c1vpCvla4',
// game-API      |     score: 5,
// game-API      |     win: false,
// game-API      |     side: 'right',
// game-API      |     id: 'a700e2d4-415f-4453-8954-afea75df4c76',
// game-API      |     ready: true,
// game-API      |     player_name: 'Anthony Gabriel'
// game-API      |   },
// game-API      |   score_1: 0,
// game-API      |   score_2: 5,
// game-API      |   type: 'local'
