import { renderGame } from "../components/renderPage";
import { drawGame } from "../game/gameDraw";
import { player, RoomData, ServerGameData } from "../api/interfaces/GameData";
import { DisplayGameWinLose } from "../game/gameWin";
import { showGame } from "../game/gameShow";

import { alertGameReady } from "../components/ui/alert/alertGameReady";
import { socket } from "./Socket";

function changeStatusPlayer(playerData: player) {
	const playerElement = document.getElementById(playerData.gameName);
	playerElement?.classList.add("animate-bounce");
}

function launchGame(roomData: RoomData) {
	
	//TODO: Animate 3,4,...1....Go
	socket?.send(JSON.stringify({
		type: "game",
		payload: {
			type: 'startGame',
			data: {
				roomId: roomData.roomId,
			}
		}
	}));
}

export async function handleGameSocketMessage(data: ServerGameData ) {
	
	switch (data.action) {
		case 'roomReady':
			setTimeout(() => {
				alertGameReady();}
			, 500);
			
			setTimeout(() => {
				renderGame(data.roomData);}
			, 3500);
			break;
		
		case 'playerJoin':
			changeStatusPlayer(data.roomData.self);
			break;

		case 'readyToStart':
			showGame();
			drawGame(data.roomData.gameData!);
			setTimeout(() => {
				launchGame(data.roomData);
			}, 3000);
			break;
		
		case 'update':
			drawGame(data.roomData.gameData!);
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
