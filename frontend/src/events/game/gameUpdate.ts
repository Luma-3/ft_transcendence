import { gameFrontInfo } from "./gameCreation"
import { socket } from "../../socket/Socket";

let actionUserUp = false, actionUserDown = false, actionUser2Up = false, actionUser2Down = false;

export function getEventAndSendGameData(playerId: string) {

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
      action: 'input',
      data: {
        movement: movement,
        otherMovement: (gameFrontInfo.gameType === "local") ? otherMovement : undefined,
      }
    },
  }));
}

export function onKeyDown(event: KeyboardEvent, playerId: string) {
  if (event.key !== "w" && event.key !== "s" && event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
  actionUserUp = (event.key === "w")
  actionUserDown = (event.key === "s")


  if (gameFrontInfo.gameType === "local") {
    actionUser2Up = (event.key === "ArrowUp");
    actionUser2Down = (event.key === "ArrowDown");
  }
  getEventAndSendGameData(playerId);
}

export function onKeyUp(event: KeyboardEvent, playerId: string) {
  if (event.key !== "w" && event.key !== "s" && event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
  actionUserUp = (event.key === "w" && !actionUserUp);
  actionUserDown = (event.key === "s" && !actionUserDown);


  if (gameFrontInfo.gameType === "local") {
    actionUser2Up = (event.key === "ArrowUp" && !actionUser2Up);
    actionUser2Down = (event.key === "ArrowDown" && !actionUser2Down);
  }
  getEventAndSendGameData(playerId);
}
