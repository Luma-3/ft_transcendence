import { gameFrontInfo } from "./gameCreation"
import { socket } from "../controllers/Socket";

let actionUserUp = false, actionUserDown = false, actionUser2Up = false, actionUser2Down = false;

export async function getEventAndSendGameData(playerId: string) {

  const movement = {
    up: actionUserUp,
    down: actionUserDown,
  }

  const otherMovement = {
    up: actionUser2Up,
    down: actionUser2Down
  }
  socket.send(JSON.stringify({
    service: "game",
    scope: "player",
    target: playerId,
    payload: {
      type: 'move',
      data: {
        movement: movement,
        otherMovement: (gameFrontInfo.gameType === "local") ? otherMovement : undefined,
      }
    },
  }));
}

export function onKeyDown(event: KeyboardEvent, playerId: string) {
  actionUserUp = (event.key === "w")
  actionUserDown = (event.key === "s")

  if (gameFrontInfo.gameType !== "local") {
    actionUserUp = (event.key === "ArrowUp");
    actionUserDown = (event.key === "ArrowDown");
  } else {
    actionUser2Up = (event.key === "ArrowUp");
    actionUser2Down = (event.key === "ArrowDown");
  }
  getEventAndSendGameData(playerId);
}

export function onKeyUp(event: KeyboardEvent, playerId: string) {
  actionUserUp = !(event.key === "w");
  actionUserDown = !(event.key === "s");

  if (gameFrontInfo.gameType !== "local") {
    actionUserUp = !(event.key === "ArrowUp");
    actionUserDown = !(event.key === "ArrowDown");
  } else {
    actionUser2Up = !(event.key === "ArrowUp");
    actionUser2Down = !(event.key === "ArrowDown");
  }
  getEventAndSendGameData(playerId);
}
