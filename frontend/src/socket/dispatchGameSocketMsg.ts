import { renderGame } from "../controllers/renderPage";
import { Game } from "../events/game/gameDraw";
import { IGameObject, IRoomData } from "../interfaces/IGame";
import { DisplayGameWinLose } from "../events/game/gameWin";
import { showGame } from "../events/game/gameShow";


import { drawExplosion } from "../events/game/gameBallAnimation";
import { changeScore } from "../events/game/gameUpdate";

export type GameSnapshot = {
  serverTime: number;
  GameData: IGameObject[];
}

export let clockoffset = 0;
export let gameSnapshots: GameSnapshot[] = [];

function changeStatusPlayer(roomData: IRoomData) {
  for (const player of roomData.players) {
    if (player) {
      const ready = player.ready ? "ready" : "not-ready";
      if (ready === "ready") {
        const playerElement = document.getElementById(player.player_name);
        playerElement?.classList.add("animate-bounce");
      }
    }
  }
}

// function launchGame(roomId: string) {
//   console.log("Launching game for room:", roomId);
//   //TODO: Animate 3,2,1....Go
//   socket?.send(JSON.stringify({
//     action: "game",
//     payload: {
//       type: 'startGame',
//       data: {
//         roomId: roomId,
//       }
//     }
//   }));
// }

let game: Game;

export async function dispatchGameSocketMsg(payload: any) {
  switch (payload.action) {
    case 'roomReady':
      renderGame(payload.data);
      break;
    case 'playerReady':
      changeStatusPlayer(payload.data);
      break;
    case 'starting':
      showGame();
      game = new Game("gamePong");
      break;
    case 'score':
      console.log("dispatchGameSocketMsg", payload);
      drawExplosion(payload.data.ball.position.x, payload.data.ball.position.y);
      changeScore(payload.data.player);
      break;
    case 'snapshot':
      game.draw(payload.data);
      break;
    case 'end':
      DisplayGameWinLose(payload.data.player);
      break;
    default:
      break;
  }
}
