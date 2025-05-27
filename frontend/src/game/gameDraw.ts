import { GameData } from "../api/interfaces/GameData";

export function drawGame(gameData: any) {
  const game = document.getElementById("gamePong") as HTMLCanvasElement;
  if (!game) {
    return;
  }
  const ctx = game.getContext("2d");

  if (!ctx) { return; }
  ctx.clearRect(0, 0, game.width, game.height);
  ctx.save();
  ctx.translate(game.width / 2, game.height / 2);

  //Raquette user left
  ctx.beginPath();
  ctx.rect(-game.width / 2 + 10, gameData.player1.y - 50, 10, 100);
  ctx.fillStyle = "blue";
  ctx.fill();

  //Raquette user right
  ctx.restore();
  ctx.save();
  ctx.translate(game.width / 2, game.height / 2);
  ctx.beginPath();
  ctx.rect(game.width / 2 - 20, gameData.player2.y - 50, 10, 100);
  ctx.fillStyle = "red";
  ctx.fill();

  //BALL
  ctx.restore();
  ctx.save();
  ctx.translate(game.width / 2, game.height / 2);
  ctx.beginPath();
  ctx.rect(gameData.ball.x, gameData.ball.y, 20, 20);
  ctx.fill();
  ctx.restore();

  const player1Score = document.getElementById("user1Score");
  player1Score!.innerHTML = gameData.player1.score.toString();

  const player2Score = document.getElementById("user2Score");
  player2Score!.innerHTML = gameData.player2.score.toString();

}
