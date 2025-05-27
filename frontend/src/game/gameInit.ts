import { renderGame } from "../components/renderPage";
import { getEventAndSendGameData } from "./gameUpdate";

import { alert } from "../components/ui/alert/alert";
import { fetchToken } from "../api/fetchToken";
import { fetchApi } from "../api/fetch";
import { drawGame } from "./gameDraw";
import { GameData, gameId } from "../api/interfaces/GameData";
import { API_USER, API_GAME } from "../api/routes";
import { User } from "../api/interfaces/User";

export let gameID: string;

// function connectGameSocket(gameData: GameData) {

//   const socket = new WebSocket('ws://localhost:5173/api/ws');

//   socket.addEventListener("open", () => {

//     socket.send(JSON.stringify({
//       type: "game",
//       payload: gameData,
//     }));
//   });

//   socket.addEventListener("message", (e) => {
//     //TODO: Comprend tout les types de messages pour pouvoir les renvoyer
//     drawGame(JSON.parse(e.data));
//   });

//   socket.addEventListener('error', (event) => {
//     alert("WebSocket error: " + event, "error");
//   });

//   socket.addEventListener('close', (event) => {
//     if (event.wasClean) {
//       console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
//     } else {
//       console.error(`WebSocket connection closed unexpectedly, code=${event.code}`);
//     }
//   });

//   return socket;
// }

/**
 * Recuperation des infos necessaires dans le dashboard
 * pour le lancement de la partie
 */
export async function initGameData() {

  const token = await fetchToken();
  if (token && token.status === "error") {
    window.location.href = "/login";
    return;
  }

  const gameType = document.querySelector('input[name="game-type"]:checked') as HTMLInputElement;
  if (!gameType) {
    alert("Error while getting game type (local-online)", "error");
    return;
  }

  const player1 = (document.getElementById('player1-name') as HTMLInputElement).value;
  if (!player1) {
    alert("Please enter a name for both players", "error");
    return;
  }

  let player2;

  switch (gameType.id) {

    case "online":
      player2 = (document.getElementById('searchFriend') as HTMLInputElement).value;
      if (!player2) {
        alert("Please invite a friend to play with you", "error");
        return;
      }
      break;

    case "local-pvp":
      player2 = (document.getElementById('player2-name') as HTMLInputElement).value;
      if (!player2) {
        alert("Please enter a name for player 2", "error");
        return;
      }
      break;

    default:
      break;
  }

  //TODO : Switch sur les gametype pour les renvoyer au bonne endroit
  const user = await fetchApi<User>(API_USER.BASIC.INFOS, {
    method: 'GET'
  });
  if (!user || user.status === "error" || !user.data) {
    alert("Error while fetching user data", "error");
    return;
  }

  //TODO: Penser a stocker les ussername de partie
  const gameData = {
    player1_uid: user.data.id!,
    player2_uid: 'c08d80a1-d355-4536-aea2-bc62ca252479',
  }
  const response = await fetchApi<gameId>(API_GAME.CREATE, {
    method: 'POST',
    body: JSON.stringify(gameData),
  });
  if (!response || response.status === "error" || !response.data) {
    alert("Error while creating game", "error");
    return;
  }
  console.log("Game created successfully:", response.data);
  gameID = response.data.id;
  renderGame();
}




