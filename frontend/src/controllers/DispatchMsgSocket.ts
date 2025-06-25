import { renderGame } from "./renderPage";
import { animate, drawGame, setGameData } from "../game/gameDraw";
import { GameData, RoomData } from "../interfaces/GameData";
import { DisplayGameWinLose } from "../game/gameWin";
import { showGame } from "../game/gameShow";

import { FRAME } from "../game/gameDraw";

import { alertGameReady } from "../components/ui/alert/alertGameReady";
import { socket } from "./Socket";

export type GameSnapshot = {
  serverTime: number;
  GameData: GameData;
}

export let clockoffset = 0;
export let gameSnapshots: GameSnapshot[] = [];

function changeStatusPlayer(roomData: RoomData) {
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
    type: "game",
    payload: {
      type: 'startGame',
      data: {
        roomId: roomId,
      }
    }
  }));
}

export async function handleGameSocketMessage(payload: any) {

  switch (payload.action) {
    case 'roomReady':
      console.log("RenderGame")
      renderGame(payload.data);
      break;

    case 'playerReady':
      changeStatusPlayer(payload.data);
      break;

    case 'Starting':
      console.log("Show game")
      showGame();
      console.log("Draw Game");
      drawGame(payload.data.gameData);
      setTimeout(() => {
        launchGame(payload.data.roomId);
      }, 3000);
      break;

    case 'goal':
      drawGame(payload.gameData, 'goal');
      break;

    case 'snapshot':
      drawGame(payload.gameData);
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
