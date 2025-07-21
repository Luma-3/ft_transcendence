import { alert } from "../../components/ui/alert/alert";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";

import { FetchInterface, IGameFormInfo } from "../../api/FetchInterface";
import { invitePlayerToPlay } from "../../controllers/searchHandler";
import { socket, socketConnection } from "../../socket/Socket";
import { updateNavbar } from "../../components/ui/navbar";
import { randomRoomNameGenerator } from "../../components/utils/randomRoomNameGenerator";

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
  sessionStorage.setItem("gameType", gameType.id);

  const player2 = (gameType.id === "local") ? getPlayer2Name() : "";
  if (player2 === undefined) {
    return;
  }

  const gameFormInfo = {
    playerName: player2 ?? "",
    roomName: randomRoomNameGenerator(),
    gameType: gameType.id,
  }
  if (gameType.id === "online" || gameType.id === "tournament") {
    updateNavbar();
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

  if (!success) {
    alertTemporary("error", "cannot-create-game-wait-and-retry", userPref.theme, true, true);
    return;
  }
  document.getElementById("create-game")?.classList.add("disabled"); 
  alertTemporary("success", "game-created-successfully", userPref.theme, true, true);
}