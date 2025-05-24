import { updateGame } from './gameUpdate';

let gameLoop: number;

export function startGameLoop() {
	gameLoop = setInterval(() => {
		updateGame();
	}
	, 1000 / 60);
}

export function stopGameLoop() {
	if (gameLoop) {
		clearInterval(gameLoop);
		gameLoop = 0;
	}
}

export function isGameLoopRunning() {
	return gameLoop !== 0;
}