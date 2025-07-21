import { showGame } from "../events/game/utils/gameFadeOut";
import { bouncePlayer } from "../events/game/utils/bouncePlayer";
import { GameManager } from "../events/game/GameManager";
import { IGameObject } from "../events/game/Game";
import { fetchApiWithNoError } from "../api/fetch";
import { API_GAME } from "../api/routes";
import { alert } from "../components/ui/alert/alert";

import { initTournament } from "../pages/Tournament";
import { alertNotificationsGames } from "../components/ui/alert/alertNotificationsGame";
import { cancelGameInvitation, refuseGameInvitation } from "../events/social/gameInvitation";

export type GameSnapshot = {
  serverTime: number;
  GameData: IGameObject[];
}

// export let clockoffset = 0;
export let gameSnapshots: GameSnapshot[] = [];

const socketHandler: { [key: string]: (data: any) => Promise<void> } = {
  pendingAdd: alertNotificationsGames,
  pendingRefuse: refuseGameInvitation,
  pendingRemoved: cancelGameInvitation,
  nextPool: initTournament,
  invitation: handleGameInvitation,
  roomReady: GameManager.init,
  playerReady: bouncePlayer,
  starting: showGame,
  snapshot: GameManager.addSnapshot,
  score: GameManager.addScore,
  end: GameManager.endGame,
  disconnected: handlePlayerDisconnection,
}

async function handlePlayerDisconnection() {
  await alert("error", "other-duck-disconnected", true);
  window.location.reload();
}


async function handleGameInvitation(data: any) {
  const response = await fetchApiWithNoError(API_GAME.CREATE + `/id/${data.roomId}`, {
    method: 'POST',
    body: JSON.stringify({
      roomName: 'online',
    })
  });
  if (response.status === "error") {
    await alert("error", "game-creation-failed", true);
    return;
  }
}

export async function dispatchGameSocketMsg(payload: any) {
  const handler = socketHandler[payload.action];

  if (handler) {
    await handler(payload.data);
    return;
  }

  // console.warn(`No handler for action: ${payload.action}`);
}
