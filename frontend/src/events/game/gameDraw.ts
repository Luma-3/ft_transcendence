import { updatePointerCoordinates } from "./utils/trailBall";
import { IBall, IPaddle, IGameObject } from "../../interfaces/IGame";
import { Vector2 } from "./utils/Vector";
// import { drawExplosion } from "./gameBallAnimation";
// import { socket } from "../socket/Socket";
// import { gameFrontInfo } from "./gameCreation";
// import { clockoffset, GameSnapshot, gameSnapshots } from "../../socket/dispatchGameSocketMsg";

// const duckImage = new Image();
// duckImage.src = "/images/pp.jpg";

// export const FRAME = 30;
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

// export function drawGame(gameData: IGameObject[]) {
//
//   const game = document.getElementById("gamePong") as HTMLCanvasElement;
//   if (!game) return;
//   const ctx = game.getContext("2d");
//   if (!ctx) return;
//
//   ctx.clearRect(0, 0, game.width, game.height);
//
//   ctx.fillStyle = "rgba(178, 157, 210, 0.4)";
//   ctx.fillRect(0, 0, game.width, game.height);
//
//
//   gameData.forEach((gameObject) => {
//     switch (gameObject.type) {
//       case 'ball': ;
//         drawBall(ctx, (<IBall>gameObject).position, (<IBall>gameObject).radius);
//         break;
//       case 'paddle':
//         ctx.fillStyle = "white";
//         const paddle = <IPaddle>gameObject;
//
//         break;
//       default:
//         console.warn("Unknown game object type:", gameObject.type);
//     }
//   });
//
//   ctx.save();
// }


// function drawBall(ctx: CanvasRenderingContext2D, pos: Vector2, radius: number) {
//   ctx.beginPath();
//   ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
//   ctx.fillStyle = "yellow";
//   ctx.fill();
//   ctx.closePath();
//   updatePointerCoordinates(pos.x, pos.y);
// }


// function drawRoundedRect(ctx: CanvasRenderingContext2D, pos: Vector2, scale: Vector2, radius: number) {
//   ctx.beginPath();
//   ctx.moveTo(pos.x + radius, pos.y);
//   ctx.lineTo(pos.x + scale.x - radius, pos.y);
//   ctx.quadraticCurveTo(pos.x + scale.x, pos.y, pos.x + scale.x, pos.y + radius);
//   ctx.lineTo(pos.x + scale.x, pos.y + scale.y - radius);
//   ctx.quadraticCurveTo(pos.x + scale.x, pos.y + scale.y, pos.x + scale.x - radius, pos.y + scale.y);
//   ctx.lineTo(pos.x + radius, pos.y + scale.y);
//   ctx.quadraticCurveTo(pos.x, pos.y + scale.y, pos.x, pos.y + scale.y - radius);
//   ctx.lineTo(pos.x, pos.y + radius);
//   ctx.quadraticCurveTo(pos.x, pos.y, pos.x + radius, pos.y);
//   ctx.closePath();
//   ctx.fill();
// }


export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  width: number;
  height: number;
  private lastTime: number = performance.now();

  private players: Map<string, Paddle> = new Map();
  private ball: Ball;

  constructor(canvasId: string, paddles: IPaddle[]) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }
    this.ctx = ctx;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.ball = new Ball();
    console.log("Paddles:", paddles);
    paddles.forEach((paddle) => {
      console.log("Creating paddle with ID:", paddle.id);
      const player = new Paddle(paddle.id);
      this.players.set(paddle.id, player);
    });
    this.loop()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    width: number,
    dash: number[] = []
  ) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.setLineDash(dash);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawBackground() {
    this.ctx.fillStyle = "rgba(178, 157, 210, 0.4)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawLine(this.width / 2, 0, this.width / 2, this.height, 'white', 5, [10, 15]);
    this.drawLine(50, 0, 50, this.height, 'white', 1);
    this.drawLine(750, 0, 750, this.height, 'white', 1);
  }

  draw() {
    this.clear();
    this.drawBackground();

    this.ball.draw(this.ctx);
    this.players.forEach((player) => {
      player.draw(this.ctx);
    });
  }

  update(objects: IGameObject[]) {

    objects.forEach((object) => {
      switch (object.type) {
        case 'ball':
          this.ball.update(object as IBall);
          break;
        case 'paddle':
          this.players.get((object as IPaddle).id)?.update(object as IPaddle);
          break;
        default:
          console.warn("Unknown game object type:", object.type);
      }
    });
  }

  loop() {
    const currentTime = performance.now();
    let deltaTime = (currentTime - this.lastTime) / 1000;
    deltaTime = deltaTime // TODO : a utiliser
    this.lastTime = currentTime;
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }

}


class Ball {
  position: Vector2;
  radius: number;

  constructor() {
    this.position = Vector2.zero();
    this.radius = 10; // Default radius, can be updated later
  }

  update(object: IBall) {
    this.position = Vector2.fromObj(object.position);
    this.radius = object.radius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }
}


class Paddle {
  id: string;
  position: Vector2 = Vector2.zero();
  scale: Vector2 = Vector2.zero();
  radius: number = 10;

  constructor(id: string) {
    this.id = id;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    const pos: Vector2 = new Vector2(
      this.position.x - this.scale.x / 2,
      this.position.y - this.scale.y / 2
    );
    ctx.beginPath();
    ctx.roundRect(pos.x, pos.y, this.scale.x, this.scale.y, this.radius);
    ctx.fill();
  }

  update(object: IPaddle) {
    this.position = Vector2.fromObj(object.position);
    this.scale = Vector2.fromObj(object.scale);
    this.radius = object.position.x / 2;
  }
}
