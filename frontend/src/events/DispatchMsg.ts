import { renderGame } from "../components/renderPage";
import { drawGame } from "../game/gameDraw";
import { gameInfo } from "../game/gameCreation";
import { DisplayGameWinLose } from "../game/gameWin";

import { alertGameReady } from "../components/ui/alert/alertGameReady";

function changeStatusPlayer(playerId: string, status: string) {
	const playerElement = document.getElementById(playerId);

	playerElement?.classList.add("animate-bounce");
}

export async function handleGameSocketMessage(message: any) {
	
	console.log("Handling game socket message:", message);
	switch (message.action) {
		case 'playerReady':
			changeStatusPlayer(message.playerId, message.status);
			break;
		case 'gameReady':
			setTimeout(() => {
				alertGameReady();
			}
			, 500);
			
			setTimeout(() => {
				renderGame(gameInfo)
			}
			, 3500);
			break;
		case 'update':
			drawGame(message.gameData);
			break;
		case 'win':
			DisplayGameWinLose(true);
			break;
		case 'lose':
			DisplayGameWinLose(false);
			break;
		default:
			break;
	}
}
