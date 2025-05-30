import { socket } from "../events/Socket";
import { drawGame } from "./gameDraw";
import { gameInfo } from "./gameCreation";

export function showGame(gameContainer: HTMLDivElement) {

	const startInfos = document.getElementById("startGameInfos") as HTMLDivElement;
	const userGameProfile = document.getElementById("userGameProfile") as HTMLDivElement;
	const opponentGameProfile = document.getElementById("opponentGameProfile") as HTMLDivElement;

	document.getElementById("vsdiv")!.classList.add("opacity-0");
	document.getElementById("goToActionGame")!.classList.add("opacity-0");
	setTimeout(() => {
	userGameProfile.classList.add("-translate-x-full");
	opponentGameProfile.classList.add("translate-x-full");
	}, 200);
	setTimeout(() => {
		userGameProfile.classList.add("opacity-0");
		opponentGameProfile.classList.add("opacity-0");
		startInfos.classList.add("hidden");
		gameContainer.classList.remove("opacity-0");
		gameContainer.classList.add("opacity-100");
		drawGame({player1: { y: 0, score: 0 },
				player2: { y: 0, score: 0 },
				ball: { x: 0, y: 0 }});
			}, 1500);
	
	setTimeout(() => {
		startInfos.classList.remove("opacity-100");
		startInfos.classList.add("opacity-0");
	}
	, 1000);

	socket?.send(JSON.stringify({
		type: "game",
		payload: {
			type: 'startGame',
			data: {
				roomId: gameInfo.gameId,
			}
		},
	}))
			
}