import { fetchApi } from "../api/fetch";
import { fetchToken } from "../api/fetchToken";
import { getUserInfo } from "../api/getter";
import { API_GAME } from "../api/routes";
import { alert } from "../components/ui/alert/alert";
import { renderGame } from "../components/renderPage";

async function createGameServer(gameData: any) {
	
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		window.location.href = "/login";
		return;
	}
	
	const response = await fetchApi(API_GAME.LOCAL_CREATE, {
		method: 'POST',
		body: JSON.stringify({
			player1: gameData.player1,
			player2: gameData.player2,
			gameType: gameData.gameType,
		})
	});
	if (response && response.status === "error") {
		alert(response.message, "error");
		return;
	}
	return renderGame(gameData);
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
	return createGameServer(gameData);
}




