import { renderGame } from "../controllers/renderPage";
import { drawGame } from "../events/game/gameDraw";
import { IGameObject, IRoomData } from "../interfaces/IGame";
import { DisplayGameWinLose } from "../events/game/gameWin";
import { showGame } from "../events/game/gameShow";

// import { FRAME } from "../game/gameDraw";
// import { alertGameReady } from "../components/ui/alert/alertGameReady";

import { socket } from "../socket/Socket";
import { alertGameReady } from "../components/ui/alert/alertGameReady";

export type GameSnapshot = {
	serverTime: number;
	GameData: IGameObject[];
}

export let clockoffset = 0;
export let gameSnapshots: GameSnapshot[] = [];

function changeStatusPlayer(roomData: IRoomData) {
	for (const player of roomData.players) {
		if (player) {
			const ready = player.ready ? "ready" : "not-ready";
			if (ready === "ready") {
				const playerElement = document.getElementById(player.player_name);
				playerElement?.classList.add("animate-bounce");
			}
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
}

export async function dispatchGameSocketMsg(payload: any) {

	switch (payload.action) {
		case 'roomReady':
			await alertGameReady();
			setTimeout(() => {
				renderGame(payload.data);
			}, 3000);
			break;

		case 'playerReady':
			changeStatusPlayer(payload.data);
			break;

		case 'Starting':
			showGame();
			drawGame(payload.data, 'start');
			setTimeout(() => {
				launchGame(payload.data.roomId); //Stocker roomId en dehors
			}, 3000);
			break;

		case 'goal':
			drawGame(payload.data, 'goal');
			break;

		case 'snapshot':
			drawGame(payload.data, 'snapshot');
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
