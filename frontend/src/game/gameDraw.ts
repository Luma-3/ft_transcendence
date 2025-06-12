import { GameData } from "../interfaces/GameData";
import { drawExplosion } from "./gameBallAnimation";

const duckImage = new Image();
duckImage.src = "/images/pp.jpg";



export function drawGame(gameData: GameData) {
	const game = document.getElementById("gamePong") as HTMLCanvasElement;
	if (!game) {
		return;
	}
	const ctx = game.getContext("2d");
	if (!ctx) { return; }


 if (gameData.ball.x <= -game.width / 2 || gameData.ball.x >= game.width / 2) {
		ctx.clearRect(0, 0, game.width, game.height);
		drawExplosion(ctx!, gameData.ball.x, gameData.ball.y, {
		count: 40,
		colors: ['#00ffcc', '#33ccff', '#ffffff'],
		maxSpeed: 5,
		maxRadius: 4,
		duration: 800,
	});
	return;
}


	ctx.clearRect(0, 0, game.width, game.height);
	ctx.save();
	// ctx.translate(game.width / 4, game.height / 4);

	ctx.beginPath();
	// ctx.drawImage(duckImage, 10, gameData.paddle1.y - 50, 10, 100);
	ctx.rect(10, gameData.paddle1.y - 50, 10, 100);
	ctx.fillStyle = "blue";
	ctx.fill();

	console.log('player1 paddle y :', gameData.paddle1.y);

	//Raquette user right
	ctx.restore();
	ctx.save();
	// ctx.translate(game.width / 4, game.height / 4);

	ctx.beginPath();
	ctx.rect(game.width - 10, gameData.paddle2.y - 50, 10, 100);
	ctx.fillStyle = "red";
	ctx.fill();

	console.log('player2 paddle y :', gameData.paddle2.y);

	//BALL
	ctx.restore();
	ctx.save();
	// ctx.translate(game.width / 4, game.height / 4);

	ctx.beginPath();
	ctx.rect(gameData.ball.x, gameData.ball.y, 20, 20);
	ctx.fill();

	ctx.restore();

	const player1Score = document.getElementById("user1Score");
	player1Score!.innerHTML = gameData.paddle1.score.toString();

	const player2Score = document.getElementById("user2Score");
	player2Score!.innerHTML = gameData.paddle2.score.toString();

}
