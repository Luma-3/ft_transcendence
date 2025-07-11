import { showGame } from "../events/game/utils/gameFadeOut";
import { bouncePlayer } from "../events/game/utils/bouncePlayer";
import { GameManager } from "../events/game/GameManager";
import { IGameObject } from "../events/game/Game";

export type GameSnapshot = {
  serverTime: number;
  GameData: IGameObject[];
}

// export let clockoffset = 0;
export let gameSnapshots: GameSnapshot[] = [];

const socketHandler: {[key: string]: (data: any) => Promise<void>} = {
  roomReady: GameManager.init,
  playerReady: bouncePlayer,
  starting: showGame,
  snapshot: GameManager.addSnapshot,
  score: GameManager.addScore,
  end: GameManager.endGame,
}


export async function dispatchGameSocketMsg(payload: any) {
  const handler = socketHandler[payload.action];

  if (handler) {
    await handler(payload.data);
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
