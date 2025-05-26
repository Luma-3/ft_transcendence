let actionUser1Up = false, actionUser1Down = false, actionUser2Up = false, actionUser2Down = false;

export async function getEventAndSendGameData() {

	const gameData = {
		action: "game-updated",
		player1Action: (actionUser1Up) ? "Up" : (actionUser1Down) ? "Down" : '',
		player2Action: (actionUser2Up) ? "Up" : (actionUser2Down) ? "Down" : '',
	}
	
	socket.send(JSON.stringify({
		type: "game",
		gameData,
	}));
}

export function onKeyDown(event: KeyboardEvent) {
	if (event.key === "w") actionUser1Up = true;
	if (event.key === "s") actionUser1Down = true;
	if (event.key === "ArrowUp") actionUser2Up = true;
	if (event.key === "ArrowDown") actionUser2Down = true;
}

export function onKeyUp(event: KeyboardEvent) {
	if (event.key === "w") actionUser1Up = false;
	if (event.key === "s") actionUser1Down = false;
	if (event.key === "ArrowUp") actionUser2Up = false;
	if (event.key === "ArrowDown") actionUser2Down = false;
}
