import { renderGame } from "../components/renderPage";
import { alert } from "../components/ui/alert/alert";

import { fetchToken } from "../api/fetchToken";
import { fetchApi } from "../api/fetch";
import { API_USER, API_GAME } from "../api/routes";
import { User } from "../api/interfaces/User";

import { socket } from "../events/Socket";
import { alertTemporary } from "../components/ui/alert/alertTemporary";

import { GameId, GameInfo } from "../api/interfaces/GameData";

export let gameInfo: GameInfo;


function resizeCanvas() {
	console.log("Resizing canvas...");
	const canvas = document.getElementById('gamePong') as HTMLCanvasElement;
	const gameRatio = 16 / 9; // Ratio de l'aspect du jeu
	const windowRatio = window.innerWidth / window.innerHeight;
	const containerHeight = window.innerHeight - 200; // Ajuster la hauteur du conteneur
	const containerWidth = window.innerWidth - 200; // Ajuster la largeur du conteneur

	let newWidth: number;
	let newHeight: number;
	 
	if (windowRatio > gameRatio) {
    // Fenêtre plus large → on ajuste à la hauteur
    newHeight = containerHeight;
    newWidth = newHeight * gameRatio;
  } else {
    // Fenêtre plus haute → on ajuste à la largeur
    newWidth = containerWidth;
    newHeight = newWidth / gameRatio;
  }
	canvas.style.width = (newWidth > 800) ? `800px` : `${newWidth}px`;
	canvas.style.height = (newHeight > 600) ? `400px` : `${newHeight}px`;
}


/**
 * Envoie des donnees de la partie au serveur
 * et stockage de l'ID de la partie
 * @param gameData - Donnees de la partie a envoyer
 * @param user - Les donnees de l'utilisateur present sur le client
 */
async function createGameAndFetchData(gameInfo: GameInfo, user: User) {

	const response = await fetchApi<GameId>(API_GAME.CREATE, {
		method: 'POST',
		body: JSON.stringify({
			uid: gameInfo.uid,
			gameName: gameInfo.gameName,
			typeGame: gameInfo.typeGame,
		}),
	});

	if (!response || response.status === "error" || !response.data) {
		alertTemporary("error", "Error while creating game. Please try again later.", user.preferences.theme);
		return;
	}
	gameInfo.gameId = response.data.id;

	alertTemporary("success", "Game created successfully. Waiting for players to join...", user.preferences.theme);

	// renderGame(gameInfo);
}


/**
 * Recuperation des infos necessaires dans le dashboard
 * pour le lancement de la partie
 */
export async function initGameData() {

	/**
	 * Verification de la connexion WebSocket
	 */
	if (socket?.readyState !== WebSocket.OPEN) {
		alert("WebSocket connection is not open. Please try again later.", "error");
		return;
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

		case "online":
			player2 = (document.getElementById('searchFriend') as HTMLInputElement).value;
			if (!player2) {
				return alert("Please invite a friend to play with you", "error");
			}
			break;

		case "local-pvp":
			player2 = (document.getElementById('player2-name') as HTMLInputElement).value;
			if (!player2) {
				return alert("enter-name-player2", "error");
			}
			break;

		default:
			break;
	}

	/**
	 * Creation de l'instance de jeu
	 */
	const user = await fetchApi<User>(API_USER.BASIC.INFOS, {
		method: 'GET'
	});
	if (!user || user.status === "error" || !user.data) {
		return alert("Error while fetching user data", "error");
	}

	/**
	 * Creation d'un objet contenant les donnees de la partie
	 * et l'envoi de la requete pour creer la partie
	 */
	const gameInfo = {
		uid: user.data.id!.toString(),
		gameName: player1,
		typeGame : gameType.id,
	}

	window.addEventListener('resize', resizeCanvas)
	
	createGameAndFetchData(gameInfo, user.data);
}






