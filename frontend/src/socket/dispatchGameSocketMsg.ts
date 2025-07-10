import { Game } from "../events/game/gameDraw";
import { IGameObject } from "../interfaces/IGame";
import { DisplayGameWinLose } from "../events/game/gameEnd";
import { showGame } from "../events/game/utils/gameFadeOut";


import { drawExplosion } from "../events/game/utils/gameBallExplosion";
import { changeScore } from "../events/game/gameInput";
import { startShapeSparkle } from "../events/game/utils/trailBall";
import { bouncePlayer } from "../events/game/utils/bouncePlayer";
import { createGame } from "../events/game/gameCreation";
import { getUserInfo } from "../api/getterUser(s)";

export type GameSnapshot = {
  serverTime: number;
  GameData: IGameObject[];
}

export let clockoffset = 0;
export let gameSnapshots: GameSnapshot[] = [];

let game: Game;

export async function dispatchGameSocketMsg(payload: any) {
  switch (payload.action) {

    case 'roomReady':
      createGame(payload.data);
      break;

    case 'playerReady':
      bouncePlayer(payload.data);
      break;

    case 'starting':
      showGame();
      const canvas = document.getElementById("gamePong") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      startShapeSparkle(ctx!, canvas);
      const userid = await getUserInfo().then(user => user.data!.id);
      game = new Game("gamePong", payload.data.players, userid);

      break;
    case 'score':
      drawExplosion(payload.data.ball.position.x, payload.data.ball.position.y);
      changeScore(payload.data.player);
      break;

    case 'snapshot':
      // console.log("dispatchGameSocketMsg snapshot", payload);
      game.addSnapshot(payload.data, payload.time)
      break;

    case 'end':
      DisplayGameWinLose(payload.data.player);
      break;

    default:
      break;
  }
}
