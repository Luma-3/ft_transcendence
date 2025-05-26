import { drawGame } from "./gameDraw";
import { DisplayGameWin } from "./gameWin";


export function launchGame(gameContainer: HTMLDivElement, gameLoop: number) {

	const startInfos = document.getElementById("startGameInfos") as HTMLDivElement;

	startInfos.classList.remove("opacity-100");
	startInfos.classList.add("opacity-0");
	
	setTimeout(() => {
		startInfos.classList.add("hidden");
		gameContainer.classList.remove("opacity-0");
		gameContainer.classList.add("opacity-100");
		drawGame({player1: { y: 0, score: 0 },
				player2: { y: 0, score: 0 },
				ball: { x: 0, y: 0 }});
		// startGameLoop();
		// DisplayGameWin("Player 1 wins!");
	}, 500);
	
}