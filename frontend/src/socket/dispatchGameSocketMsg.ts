import { renderGame } from "../controllers/renderPage";
import { drawGame } from "../events/game/gameDraw";
import { IGameData, IRoomData } from "../interfaces/IGame";
import { DisplayGameWinLose } from "../events/game/gameWin";
import { showGame } from "../events/game/gameShow";

// import { FRAME } from "../game/gameDraw";
// import { alertGameReady } from "../components/ui/alert/alertGameReady";

import { socket } from "../socket/Socket";
import { Paddle } from "../events/game/Paddle";

export type GameSnapshot = {
  serverTime: number;
  GameData: IGameData;
}

export let clockoffset = 0;
export let gameSnapshots: GameSnapshot[] = [];

function changeStatusPlayer(roomData: IRoomData) {
  for (const player of roomData.players) {
    if (player) {
      const ready = player.ready ? "ready" : "not-ready";
      if (ready === "ready") {
        const playerElement = document.getElementById(player.gameName);
        playerElement?.classList.add("animate-bounce");
      }
    }
  }
}

function launchGame(roomId: string) {
  console.log("Launching game for room:", roomId);
  //TODO: Animate 3,2,1....Go
  socket?.send(JSON.stringify({
    action: "game",
    payload: {
      type: 'startGame',
      data: {
        roomId: roomId,
      }
    }
  }));
}

export async function dispatchGameSocketMsg(payload: any) {
  console.log("dispatchGameSocketMsg", payload);
  switch (payload.action) {
    case 'roomReady':
      renderGame(payload.data);
      break;

    case 'playerReady':
      changeStatusPlayer(payload.data);
      break;

    case 'Starting':
      showGame();
      // launchGame(payload.data.roomId); // TODO : Stocker roomId en dehors
      break;

    case 'score':
      drawGame(payload.gameData, 'goal');
      break;

    case 'snapshot':
      drawGame(payload.data);
      break;
    case 'win':
      DisplayGameWinLose(true);
      break;
    case 'lose':
      DisplayGameWinLose(false);
      break;
    default:
      break;
  }
}
