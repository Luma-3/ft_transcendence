import { renderGame } from "../components/renderPage";
import { getEventAndSendGameData } from "./gameUpdate";

import { alert } from "../components/ui/alert/alert";
import { fetchToken } from "../api/fetchToken";
import { drawGame } from "./gameDraw";
import { GameData } from "../api/interfaces/GameData";

function connectGameSocket(gameData: GameData) {

	const socket = new WebSocket('ws://localhost:5173/api/ws');

	socket.addEventListener("open", () => {

		socket.send(JSON.stringify({
			type: "game",
			payload: gameData,
		}));
	});

	socket.addEventListener("message", (e) => {
		//TODO: Comprend tout les types de messages pour pouvoir les renvoyer
		drawGame(JSON.parse(e.data));
	});

	socket.addEventListener('error', (event) => {
		alert("WebSocket error: " + event, "error");
	});

	socket.addEventListener('close', (event) => {
		if (event.wasClean) {
			console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
		} else {
			console.error(`WebSocket connection closed unexpectedly, code=${event.code}`);
	}});

	return socket;
}

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
		
	const gameData = {
		player1: player1,
		player2: player2,
		gameType: gameType.id,
	}

	// TODO: Voir si on a besoin de stocker le socket
	const socket = connectGameSocket(gameData);
	
	// return renderGame(gameData);
}




