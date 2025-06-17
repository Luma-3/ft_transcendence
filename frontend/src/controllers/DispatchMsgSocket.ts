import { renderGame } from "./renderPage";
import { animate, drawGame, setGameData } from "../game/gameDraw";
import { GameData, RoomData } from "../interfaces/GameData";
import { DisplayGameWinLose } from "../game/gameWin";
import { showGame } from "../game/gameShow";

import { alertGameReady } from "../components/ui/alert/alertGameReady";
import { socket } from "./Socket";

export type GameSnapshot = {
	serverTime: number;
	GameData: GameData;
}

export let clockoffset = 0;
export let gameSnapshots: GameSnapshot[] = [];

function changeStatusPlayer(roomData: RoomData) {
	for (const player of roomData.players) {
		const ready = player.ready ? "ready" : "not-ready";
		if (ready === "ready") {
			const playerElement = document.getElementById(player.gameName);
			playerElement?.classList.add("animate-bounce");
		}
	}
}

function launchGame(roomId: string) {
	console.log("Launching game for room:", roomId);
	//TODO: Animate 3,2,1....Go
	socket?.send(JSON.stringify({
		type: "game",
		payload: {
			type: 'startGame',
			data: {
				roomId: roomId,
			}
		}
	}));
	animate();
}

export async function handleGameSocketMessage(data: any ) {
	switch (data.action) {
		case 'pong':
			const t1 = performance.now();
			const rtt = t1 - data.data.clientTime;
			const oneWay = rtt / 2;
			clockoffset = data.data.serverTime + oneWay - t1;
			break;

		case 'roomReady':
			setTimeout(() => {
				alertGameReady();}
			, 500);
			setTimeout(() => {
				renderGame(data.data);
			}
			, 3500);
			break;
		
		case 'playerReady':
			changeStatusPlayer(data.data);
			break;

		case 'readyToStart':
			showGame();
			drawGame(data.data.gameData);
			setTimeout(() => {
				launchGame(data.data.roomId);
			}, 3000);
			break;
		
		case 'goal':
			console.log("position ball:", data.gameData.ball.x, data.gameData.ball.y);
			drawGame(data.gameData, 'goal');
			break;
		
		case 'update':
			gameSnapshots.push({
				serverTime: data.serverTime,
				GameData: data.gameData
			});
			if (gameSnapshots.length > 10) {
				gameSnapshots.shift();
			}
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
