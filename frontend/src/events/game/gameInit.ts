import { alert } from "../../components/ui/alert/alert";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";

import { FetchInterface, IGameFormInfo } from "../../api/FetchInterface";
import { invitePlayerToPlay } from "../../controllers/searchHandler";
import { socket, socketConnection } from "../../socket/Socket";

function getPlayer2Name() {
  const inputValue = (document.getElementById("player2-name") as HTMLInputElement).value;
  if (!inputValue || inputValue.trim() === "") {
    alert("enter-name-player2", "error");
    return undefined;
  }
  return inputValue;
}

export async function initGame() {
  if (!socket) {
    socketConnection();
  }

  const gameType = document.querySelector('input[name="game-type"]:checked') as HTMLInputElement;
  if (!gameType) {
    return alert("no-gametype-selected", "error");
  }

  const player2 = (gameType.id === "local") ? getPlayer2Name() : "";
  if (player2 === undefined) {
    return;
  }

  const gameFormInfo = {
    playerName: player2 ?? "",
    roomName: "MMA in Pound !",
    gameType: gameType.id,
  }
  if(gameType.id === "online" && gameFormInfo.playerName === "") {
    invitePlayerToPlay(gameFormInfo);
    return;
  }
  await createRoomInServer(gameFormInfo);
}

export async function createRoomInServer(gameFormInfo: IGameFormInfo) {
   const userPref = await FetchInterface.getUserPrefs();
  if (!userPref) {
    return await alertTemporary("error", "Error while getting user theme", 'dark', false, true);
  }
  const success = await FetchInterface.createGameInServer(gameFormInfo);

  // TODO : Traduction
  if (!success) {
    // alertTemporary("error", "cannot-create-game-wait-and-retry", userPref.theme, true, true);
    return;
  }
  document.getElementById("create-game")?.classList.add("disabled");
  alertTemporary("success", "game-created-successfully", 'dark', true, true);
}