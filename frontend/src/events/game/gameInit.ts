import { alert } from "../../components/ui/alert/alert";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";

import { getUserPreferences } from "../../api/getterUser(s)";
import { fetchApiWithNoError } from "../../api/fetch";
import { API_GAME } from "../../api/routes";

export let gameFrontInfo: { gameId: string, gameType: string };

type GameFormInfo = {
	gameId: string;
	gameName: string;
	typeGame: string;
	gameNameOpponent?: string;
}

async function sendDataToServer(gameFormInfo: GameFormInfo, userTheme: string) {

	const response = await fetchApiWithNoError<{ id: string }>(API_GAME.CREATE, {
		method: 'POST',
		body: JSON.stringify({
			player_name: gameFormInfo.gameName,
			game_name: "Ok Coral !",
			game_type: gameFormInfo.typeGame,
		}),
	});
	if (!response || response.status === "error" || !response.data) {
		return alertTemporary("error", "game-creation-failed", userTheme, true);
	}

	gameFrontInfo.gameId = response.data.id;
	gameFrontInfo.gameType = gameFormInfo.typeGame;

	/**
	 * Petit alert de success qui s'affiche a droite sur l'ecran
	 */
	return alertTemporary("success", "game-created-successfully", userTheme, true);
}


/**
 * Recuperation des infos necessaires dans le dashboard
 * pour le lancement de la partie
 */
export async function initGame() {

	/**
	 * Recuperation et verification de la selection du type de jeu et des donnees utiles au jeu
	 */
	const gameType = document.querySelector('input[name="game-type"]:checked') as HTMLInputElement;
	if (!gameType) {
		return alert("no-gametype-selected", "error");
	}

	const player1 = (document.getElementById('player1-name') as HTMLInputElement).value;
	if (!player1) {
		return alert("enter-both-players-names", "error");
	}

	let player2;

	switch (gameType.id) {

		case "localpvp":
			player2 = (document.getElementById('player2-name') as HTMLInputElement).value;
			if (!player2) {
				return alert("enter-name-player2", "error");
			}
			break;
		default:
			break;
	}


	/**
	 * Creation d'un objet contenant les donnees de la partie
	 * pour pouvoir stocker facilement toutes les donnees utiles au front
	 * et l'envoi de la requete pour creer la partie
	 */
	const gameFormInfo = {
		gameId: "",
		gameName: player1,
		typeGame: gameType.id,
		gameNameOpponent: (player2) ? player2 : "",
	}

	const userPref = await getUserPreferences()
	await sendDataToServer(gameFormInfo, userPref.data?.theme || 'dark');
}