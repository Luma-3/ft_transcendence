import { Game } from "../events/game/gameDraw";
import { IGameObject } from "../interfaces/IGame";
import { DisplayGameWinLose } from "../events/game/gameEnd";
import { showGame } from "../events/game/utils/gameFadeOut";


import { drawExplosion } from "../events/game/utils/gameBallExplosion";
import { changeScore } from "../events/game/gameInput";
import { startShapeSparkle } from "../events/game/utils/trailBall";
import { bouncePlayer } from "../events/game/utils/bouncePlayer";
import { createGame } from "../events/game/gameCreation";
import { FetchInterface } from "../api/FetchInterface";

export type GameSnapshot = {
  serverTime: number;
  GameData: IGameObject[];
}

// export let clockoffset = 0;
export let gameSnapshots: GameSnapshot[] = [];

let game: Game;


const socketHandler: Record<string, (data: any) => void> = {
  roomReady: createGame,
  playerReady: bouncePlayer,
  starting: /*TODO ,*/ showGame,
  snapshot: handleSnapshot,
  score: handleScore,
  end: habdleEnd,
}

export async function dispatchGameSocketMsg(payload: any) {
  const handler = socketHandler[payload.action];

  if (handler) {
    handler(payload.data);
    return;
  }

  console.warn(`No handler for action: ${payload.action}`);
}

// export async function dispatchGameSocketMsg(payload: any) {
//   switch (payload.action) {
//
//     case 'roomReady':
//       createGame(payload.data);
//       break;
//
//     case 'playerReady':
//       bouncePlayer(payload.data);
//       break;
//
//     case 'starting':
//       showGame();
//       const canvas = document.getElementById("gamePong") as HTMLCanvasElement;
//       const ctx = canvas.getContext("2d");
//       startShapeSparkle(ctx!, canvas);
//       const userid = await FetchInterface.getUserInfo().then(user => user!.id);
//       game = new Game("gamePong", payload.data.players, userid);
//
//       break;
//     case 'score':
//       drawExplosion(payload.data.ball.position.x, payload.data.ball.position.y);
//       changeScore(payload.data.player);
//       break;
//
//     case 'snapshot':
//       // console.log("dispatchGameSocketMsg snapshot", payload);
//       game.addSnapshot(payload.data, payload.time)
//       break;
//
//     case 'end':
//       DisplayGameWinLose(payload.data.player);
//       break;
//
//     default:
//       break;
//   }
// }
