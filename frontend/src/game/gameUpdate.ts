import { gameInfo } from "./gameInit";
import { socket } from "../events/Socket";

let actionUser1Up = false, actionUser1Down = false, actionUser2Up = false, actionUser2Down = false;

export async function getEventAndSendGameData() {

  const gameData = {
    action: "game-updated",
    playerAction: (actionUser1Up) ? "up" : (actionUser1Down) ? "down" : 'Stop',
    player2Action: (actionUser2Up) ? "up" : (actionUser2Down) ? "down" : '',
  }
  if (!socket) {
    console.error("WebSocket connection is not established.");
    return;
  }
  socket.send(JSON.stringify({
    type: "game",
    payload: {
      gameId: gameInfo.gameId,
      type: 'move',
      direction: gameData.playerAction,
    },
  }));
}

export function onKeyDown(event: KeyboardEvent) {
  if (event.key === "w") actionUser1Up = true;
  if (event.key === "s") actionUser1Down = true;
  if (event.key === "ArrowUp") actionUser2Up = true;
  if (event.key === "ArrowDown") actionUser2Down = true;
  getEventAndSendGameData();
}

export function onKeyUp(event: KeyboardEvent) {
  if (event.key === "w") actionUser1Up = false;
  if (event.key === "s") actionUser1Down = false;
  if (event.key === "ArrowUp") actionUser2Up = false;
  if (event.key === "ArrowDown") actionUser2Down = false;
  getEventAndSendGameData();
}