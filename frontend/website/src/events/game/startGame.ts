import { alert } from "../../components/ui/alert/alert";
import { fetchToken } from "../../api/fetchToken";
import { initGame } from "../../api/game";

/**
 * Recuperation des infos necessaires pour le lancement de la partie avant de lancer le jeu
 */
export default async function startGame() {

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
	let player2;

	if (gameType.id === "online") {
		player2 = (document.getElementById('searchFriend') as HTMLInputElement).value;
	}
	else if (gameType.id === "local-pvp") {
		player2 = (document.getElementById('player2-name') as HTMLInputElement).value;
		if (!player2) {
			alert("Please enter a name for player 2", "error");
			return;
		}
	}

	if (!player1) {
		alert("Please enter a name for both players", "error");
		return;
	}

	console.log(gameType.id);

	const gameData = {
		player1: player1,
		player2: player2,
		gameType: gameType.id,
	}
	return initGame(gameData);
}
