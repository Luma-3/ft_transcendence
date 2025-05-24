import { GameData } from "../api/interfaces/GameData";
import { fetchApi } from "../api/fetch";
import { alert } from "../components/ui/alert/alert";
import { API_GAME } from "../api/routes";
import { drawGame } from "./gameDraw";
import { isGameLoopRunning, stopGameLoop, startGameLoop } from "./gameLoop";


let actionUser1Up = false, actionUser1Down = false, actionUser2Up = false, actionUser2Down = false;

export async function updateGame() {
	let response = null;

	response = await fetchApi<GameData>(API_GAME.LOCAL_SEND, {
		method: 'POST',
		body: JSON.stringify({
			player1: (actionUser1Up) ? "Up" : (actionUser1Down) ? "Down" : '', 
			player2: (actionUser2Up) ? "Up" : (actionUser2Down) ? "Down" : '',  
		})
	})
	if (response.status === "error") {
		alert("Error while sending player move" + response.message, "error");
		return;
	}

	response = await fetchApi<GameData>(API_GAME.LOCAL_GET_STATE, {
		method: 'GET',
	})
	if (!response || response.status === "error") {
		alert("Error while updating game", "error");
		return;
	}
	// if (response.message.includes("win") {
	// 	// displayWinnerMessage(response.message);
	// }

	drawGame(response.data!);
}

export function onKeyDown(event: KeyboardEvent, gameLoop: number) {
	if (event.key === "w") actionUser1Up = true;
	if (event.key === "s") actionUser1Down = true;
	if (event.key === "ArrowUp") actionUser2Up = true;
	if (event.key === "ArrowDown") actionUser2Down = true;
	if (event.key === "Escape") {
		if (isGameLoopRunning()) {
			stopGameLoop();
		} else {
			startGameLoop();
		}
	}
}

export function onKeyUp(event: KeyboardEvent, gameLoop: number) {
	if (event.key === "w") actionUser1Up = false;
	if (event.key === "s") actionUser1Down = false;
	if (event.key === "ArrowUp") actionUser2Up = false;
	if (event.key === "ArrowDown") actionUser2Down = false;
}
