import { User } from "../api/interfaces/User";

// export function setupGame(socket: WebSocket, user: User, gameData: any) {
// 	socket.send(JSON.stringify({
// 		type: "init",
// 		user1: user.username,
// 		user2: gameData.player2,
// 		gameType: gameData.gameType,
// 	}));
// }
import { updateGame } from "./gameUpdate";
import { drawGame } from "./gameDraw";
import { startGameLoop } from "./gameLoop";


export function launchGame(gameContainer: HTMLDivElement, gameLoop: number) {
	const startInfos = document.getElementById("startGameInfos") as HTMLDivElement;

	startInfos.classList.remove("opacity-100");
	startInfos.classList.add("opacity-0");
	
	setTimeout(() => {
		startInfos.classList.add("hidden");
		gameContainer.classList.remove("opacity-0");
		gameContainer.classList.add("opacity-100");
	}, 500);
	
	drawGame({player1: { y: 0, score: 0 },
			player2: { y: 0, score: 0 },
			ball: { x: 0, y: 0 }});

	startGameLoop();
}