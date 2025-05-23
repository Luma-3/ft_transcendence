import { alert } from "../../components/ui/alert/alert";
import { renderGame } from "../../components/renderPage";

/**
 * Recuperation des infos necessaires pour le lancement de la partie avant de lancer le jeu
 */
export default function startGame() {
	
	const gameType = document.querySelector('input[name="game-type"]:checked') as HTMLInputElement;
	if (!gameType) {
		alert("Error while getting game type (local-online)", "error");
		return;
	}
	const player1 = (document.getElementById('player1-name') as HTMLInputElement).value;
	let player2;
	
	if (gameType.value === "online") {
		player2 = (document.getElementById('searchFriend') as HTMLInputElement).value;
	} 
	else {
		player2 = (document.getElementById('player2-name') as HTMLInputElement).value;
	}
	
	if (player1 === "" || player2 === "") {
		alert("Please enter a name for both players", "error");
		return;
	}

	const gameData = {
		player1: player1,
		player2: player2,
		gameType: gameType.value,
	}
	return renderGame(gameData);
}