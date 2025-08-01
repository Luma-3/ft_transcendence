import { sendInSocket } from "../../socket/Socket";
import { IPlayer } from "../../interfaces/IGame";

import { GameManager } from "./GameManager";

export function changeScore(players: IPlayer[]) {
  const player1Score = document.getElementById("playerLeftScore");
  player1Score!.innerHTML = players[0].score.toString();

  const player2Score = document.getElementById("playerRightScore");
  player2Score!.innerHTML = players[1].score.toString();
}

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

  sendInSocket("game", "player", playerId, "input", {
    movement: movement,
    otherMovement: (GameManager.getGame()!.gameType === "local") ? otherMovement : undefined,
  });
}

export function onKeyDown(event: KeyboardEvent, playerId: string) {
  if (event.repeat) return;
  switch (event.key) {
    case "w": actionUserUp = true; break;
    case "s": actionUserDown = true; break;
    case "S": actionUserUp = true; break;
    case "W": actionUserDown = true; break;
    case "ArrowUp": if (GameManager.getGame()!.gameType === "local") actionUser2Up = true; event.preventDefault(); break;
    case "ArrowDown": if (GameManager.getGame()!.gameType === "local") actionUser2Down = true; event.preventDefault(); break;
  }

  getEventAndSendGameData(playerId);
}

export function onKeyUp(event: KeyboardEvent, playerId: string) {
  if (event.repeat) return;
  switch (event.key) {
    case "w": actionUserUp = false; break;
    case "s": actionUserDown = false; break;
    case "S": actionUserUp = true; break;
    case "W": actionUserDown = true; break;
    case "ArrowUp": if (GameManager.getGame()!.gameType === "local") actionUser2Up = false; event.preventDefault(); break;
    case "ArrowDown": if (GameManager.getGame()!.gameType === "local") actionUser2Down = false; event.preventDefault(); break;
  }
  getEventAndSendGameData(playerId);
}
