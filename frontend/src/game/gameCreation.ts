import { alert } from "../components/ui/alert/alert";
import { alertTemporary } from "../components/ui/alert/alertTemporary";

import { fetchToken } from "../api/fetchToken";
import { getUserInfo } from "../api/getterUser(s)";
import { fetchApi } from "../api/fetch";
import { API_GAME } from "../api/routes";
import { socket } from "../controllers/Socket";

export let gameFrontInfo: { gameId: string, gameType: string };

type GameFormInfo = {
	gameId: string;
	gameName: string;
	typeGame: string;
	gameNameOpponent?: string;
}

// function initGame(gameFormInfo: GameFormInfo) {
// 	const t0 = performance.now();
// 	socket!.send(JSON.stringify({
// 		type: "game",
// 		payload: {
// 			type: 'init',
// 			data: {
// 				playerId: gameFormInfo.playerId,
// 				roomId: gameFormInfo.gameId,
// 				clientTime: t0
// 			}
// 		}
// 	}))
// }

/**
 * Envoie des donnees de la partie au serveur
 * et stockage de l'ID de la partie dans l'interface GameInfo
 * @param gameInfo - Donnees de la partie a envoyer
 * @param user - Les donnees de l'utilisateur present sur le client
 */
async function sendDataToServer(gameFormInfo: GameFormInfo, userTheme: string) {

	const response = await fetchApi<{ id: string }>(API_GAME.CREATE, {
		method: 'POST',
		body: JSON.stringify({
			player_name: gameFormInfo.gameName,
			game_name: "Ok Coral !",
			game_type: gameFormInfo.typeGame,
		}),
	});
	// player2: gameFormInfo.gameNameOpponent,
	if (!response || response.status === "error" || !response.data) {
		return alertTemporary("error", "game-creation-failed", userTheme, true);
	}

	gameFormInfo.gameId = response.data.id;
	gameFormInfo.typeGame = gameFormInfo.typeGame;

	/**
	 * Petit alert de success qui s'affiche a gauche sur l'ecran
	 */
	alertTemporary("success", "game-created-successfully", userTheme, true);
}


/**
 * Recuperation des infos necessaires dans le dashboard
 * pour le lancement de la partie
 */
export async function createGame() {

	/**
	 * Verification de la connexion WebSocket
	 */
	if (socket?.readyState !== WebSocket.OPEN) {
		alert("Connection to the server lost. Automatically reconnecting...", "error");
		return window.location.reload();
	}

	/**
	 * Verification de la session utilisateur
	 */
	const token = await fetchToken();
	if (token && token.status === "error") {
		window.location.href = "/login";
		return;
	}

	/**
	 * Recuperation et verification de la selection du type de jeu et des donnees utiles au jeu
	 */
	const gameType = document.querySelector('input[name="game-type"]:checked') as HTMLInputElement;
	if (!gameType) {
		return alert("Error while getting game type (local-online)", "error");
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
		case "localpve":
			//TODO: tableau de nom de bot a choisir aleatoirement
			player2 = "MichMich the crazy duck";
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
		typeGame : gameType.id,
		gameNameOpponent: (player2) ? player2 : "",
	}

	const response = await getUserInfo();
	await sendDataToServer(gameFormInfo, response.data!.preferences.theme);
	// initGame(gameFormInfo);
	
	gameFrontInfo = {
		gameId: gameFormInfo.gameId,
		gameType: gameFormInfo.typeGame
	}
}