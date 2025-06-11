import { renderGame } from "./renderPage";
import { drawGame } from "../game/gameDraw";
import { RoomData } from "../interfaces/GameData";
import { DisplayGameWinLose } from "../game/gameWin";
import { showGame } from "../game/gameShow";

import { alertGameReady } from "../components/ui/alert/alertGameReady";
import { socket } from "./Socket";

function changeStatusPlayer(roomData: RoomData) {
	for (const player of roomData.players) {
		const ready = player.ready ? "ready" : "not-ready";
		if (ready === "ready") {
			console.log("Player is ready:", player.gameName);
			const playerElement = document.getElementById(player.gameName);
			playerElement?.classList.add("animate-bounce");
		}
	}
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

export async function handleGameSocketMessage(data: any ) {
	console.log("Received game data:", data);
	switch (data.action) {
		case 'roomReady':
			setTimeout(() => {
				alertGameReady();}
			, 500);
			setTimeout(() => {
				renderGame(data);
			}
			, 3500);
			break;
		
		case 'playerReady':
			changeStatusPlayer(data.gameData);
			break;

		case 'readyToStart':
			console.log("Game is ready to start");
			showGame();
			drawGame(data.gameData);
			setTimeout(() => {
				launchGame(data.gameData);
			}, 3000);
			break;
		
		case 'update':
			drawGame(data.gameData);
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
