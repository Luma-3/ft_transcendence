import { updatePointerCoordinates } from "./utils/trailBall";
import { IGameObject } from "../../interfaces/IGame";
import { Ball, IBall } from "./draw/Ball";
import { Paddle, IPaddle } from "./draw/Paddle";
import { alpha } from "./draw/lerping";


interface ISnapshot {
  time: number;
  object: IGameObject[];
}

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  width: number;
  height: number;

  private startTime: number | null = null;
  private players: Map<string, Paddle> = new Map();
  private ball: Ball;

  snapshots: ISnapshot[] = [];

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

  interpolate(renderTime: number) {
    if (this.snapshots.length < 2) return;

    let snapshotsA, snapshotsB;
    for (let i = 0; i < this.snapshots.length - 1; i++) {
      if (this.snapshots[i].time <= renderTime && this.snapshots[i + 1].time > renderTime) {
        snapshotsA = this.snapshots[i];
        snapshotsB = this.snapshots[i + 1];
        break;
      }
    }

    if (!snapshotsA || !snapshotsB) {
      console.warn("No suitable snapshots found for interpolation");
      return;
    }

    const t = alpha(snapshotsA.time, snapshotsB.time, renderTime);

  }

  addSnapshot(objects: IGameObject[], timerServer: number) {
    if (!this.startTime) {
      this.startTime = performance.now() - timerServer;
    }

    this.snapshots.push({ time: timerServer, object: objects });

    if (this.snapshots.length > 10) {
      this.snapshots.shift();
    }

    // objects.forEach((object) => {
    //   switch (object.type) {
    //     case 'ball':
    //       this.ball.addSnapshot(object as IBall, timerServer);
    //       break;
    //     case 'paddle':
    //       this.players.get((object as IPaddle).id)?.addSnapshot(object as IPaddle, timerServer);
    //       break;
    //     case 'pong':
    //       break;
    //     default:
    //       console.warn("Unknown game object type:", object.type);
    //   }
    // });
  }

  loop() {
    this.interpolate(performance.now() - this.startTime! - 200);
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }
}




