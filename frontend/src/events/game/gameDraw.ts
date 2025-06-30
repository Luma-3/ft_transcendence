import { IBall, IPaddle, IGameObject, Vector2 } from "../../interfaces/IGame";
// import { drawExplosion } from "./gameBallAnimation";
// import { socket } from "../socket/Socket";
// import { gameFrontInfo } from "./gameCreation";
// import { clockoffset, GameSnapshot, gameSnapshots } from "../../socket/dispatchGameSocketMsg";

// const duckImage = new Image();
// duckImage.src = "/images/pp.jpg";

export const FRAME = 30;
// let interpolateDelay = 1000 / FRAME;

// function findSnapshots(targetTime: number): [GameSnapshot, GameSnapshot] | null {
//   for (let i = gameSnapshots.length - 2; i >= 0; i--) {
//     if (gameSnapshots[i].serverTime <= targetTime && gameSnapshots[i + 1].serverTime >= targetTime) {
//       return [gameSnapshots[i], gameSnapshots[i + 1]];
//     }
//   }
//   return null;
// }

// function interpolate(a: number, b: number, t: number): number {
//   return a * (1 - t) + b * t;
// }

// export function animate() {
//   const now = performance.now();
//   const syncTime = now + clockoffset - interpolateDelay;

//   const pair = findSnapshots(syncTime);
//   if (pair) {
//     const [prev, next] = pair;
//     const range = next.serverTime - prev.serverTime;
//     const t = range > 0 ? (syncTime - prev.serverTime) / range : 0;
//     const interpolateGameData: GameData = {
//       ball: {
//         x: interpolate(prev.GameData.ball.x, next.GameData.ball.x, t),
//         y: interpolate(prev.GameData.ball.y, next.GameData.ball.y, t),
//       },
//       paddle1: {
//         y: interpolate(prev.GameData.paddle1.y, next.GameData.paddle1.y, t),
//         score: next.GameData.paddle1.score,
//       },
//       paddle2: {
//         y: interpolate(prev.GameData.paddle2.y, next.GameData.paddle2.y, t),
//         score: next.GameData.paddle2.score,
//       }
//     };
//     drawGame(interpolateGameData);
//   }

//   requestAnimationFrame(animate);
// };

export function drawGame(gameData: IGameObject[], action: string = '') {

  const game = document.getElementById("gamePong") as HTMLCanvasElement;
  if (!game) {
    return;
  }
  const ctx = game.getContext("2d");
  if (!ctx) { return; }

  // if (action === 'goal') {
  // 	drawExplosion(ctx, gameData.ball.x, gameData.ball.y, {
  // 		count: 250,
  // 		colors: ['#744FAC', '#FF8904', '#F8E9E9', '#ffffff'],
  // 		maxSpeed: 6,
  // 		maxRadius: 5,
  // 		duration: 1000
  // 	});
  // 	setTimeout(() => {
  // 		socket?.send(JSON.stringify({
  // 			type: "game",
  // 			payload: {
  // 				type: 'resume',
  // 				data: {
  // 					roomId: gameFrontInfo.gameId,
  // 				}
  // 			}
  // 		}));
  // 		ctx.clearRect(0, 0, game.width, game.height);
  // 		ctx.restore();
  // 		const player1Score = document.getElementById("user1Score");
  // 		player1Score!.innerHTML = gameData.paddle1.score.toString();

  // 		const player2Score = document.getElementById("user2Score");
  // 		player2Score!.innerHTML = gameData.paddle2.score.toString();
  // 	}, 800);
  // 	return;
  // }

  ctx.clearRect(0, 0, game.width, game.height);

  gameData.forEach((gameObject) => {
    switch (gameObject.type) {
      case 'ball': ;
        drawBall(ctx, (<IBall>gameObject).position, (<IBall>gameObject).radius);
        break;
      case 'paddle':
        drawPaddle(ctx, (<IPaddle>gameObject).position, (<IPaddle>gameObject).scale, 'red'); // TODO : color
        break;
      default:
        console.warn("Unknown game object type:", gameObject.type);
    }
  });

  ctx.save();
}

function drawBall(ctx: CanvasRenderingContext2D, pos: Vector2, radius: number) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle(ctx: CanvasRenderingContext2D, pos: Vector2, scale: Vector2, color: string) {
  ctx.beginPath();
  ctx.rect(pos.x, pos.y, scale.x, scale.y);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
