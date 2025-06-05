import { gameFrontInfo } from "./gameCreation"
import { socket } from "../controllers/Socket";

let actionUserUp = false, actionUserDown = false, actionUser2Up = false, actionUser2Down = false;

export async function getEventAndSendGameData() {

	const gameData = {
		action: "game-updated",
		playerAction: (actionUserUp) ? "up" : (actionUserDown) ? "down" : 'Stop',
		player2Action: (actionUser2Up) ? "up" : (actionUser2Down) ? "down" : 'Stop',
	}
	if (!socket) {
		return console.error("Connection with the server lost.");
	}
	socket.send(JSON.stringify({
		type: "game",
		payload: {
			type: 'move',
			data: {
				roomId: gameFrontInfo.gameId,
				direction: gameData.playerAction,
				direction2: gameFrontInfo.typeGame === "localpvp" ? gameData.player2Action : "",
			}
		},
	}));
}

export function onKeyDown(event: KeyboardEvent) {
	if (event.key === "w") actionUserUp = true;
	if (event.key === "s") actionUserDown = true;
	if (gameFrontInfo.typeGame !== "localpvp") {
		if (event.key === "ArrowUp") actionUserUp = true;
		if (event.key === "ArrowDown") actionUserDown = true;
	} else {
		if (event.key === "ArrowUp") actionUser2Up = true;
		if (event.key === "ArrowDown") actionUser2Down = true;
	}
	getEventAndSendGameData();
}

export function onKeyUp(event: KeyboardEvent) {
	if (event.key === "w") actionUserUp = false;
	if (event.key === "s") actionUserDown = false;
	if (gameFrontInfo.typeGame !== "localpvp") {
		if (event.key === "ArrowUp") actionUserUp = false;
		if (event.key === "ArrowDown") actionUserDown = false;
	} else {
		if (event.key === "ArrowUp") actionUser2Up = false;
		if (event.key === "ArrowDown") actionUser2Down = false;
	}
	getEventAndSendGameData();
}