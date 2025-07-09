import { IGameObject } from "../../interfaces/IGame";
import { Ball, IBall } from "./draw/Ball";
import { Paddle, IPaddle } from "./draw/Paddle";
import { alpha } from "./draw/lerping";


export interface ISnapshot {
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

  alphaGraph: AlphaGraph = new AlphaGraph("alphaGraph");

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

    this.alphaGraph.add(t);
    this.alphaGraph.draw();

    for (let i = 0; i < snapshotsA.object.length; i++) {
      switch (snapshotsA.object[i].type) {
        case "ball":
          this.ball.interpolate(snapshotsA.object[i] as IBall, snapshotsB.object[i] as IBall, t);
          break;
        case "paddle":
          this.players.get((snapshotsA.object[i] as IPaddle).id)?.interpolate(snapshotsA.object[i] as IPaddle, snapshotsB.object[i] as IPaddle, t);
          break;
        default:
          console.warn(`Unknown object type: ${snapshotsA.object[i].type}`);
          break;
      }
    }
  }

  addSnapshot(objects: IGameObject[], timerServer: number) {
    if (!this.startTime) {
      this.startTime = performance.now() - timerServer;
    }

    this.snapshots.push({ time: timerServer, object: objects });

    if (this.snapshots.length > 10) {
      this.snapshots.shift();
    }

  }

  loop() {
    this.interpolate(performance.now() - this.startTime! - 33.333);
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }
}

class AlphaGraph {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private values: number[] = [];
  private maxPoints = 100;
  private scale = 1;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
  }

  add(alpha: number) {
    this.values.push(alpha);
    if (this.values.length > this.maxPoints) {
      this.values.shift();
    }
  }

  draw() {
    const { ctx, canvas } = this;
    const height = canvas.height;
    const width = canvas.width;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, width, height);

    const referenceLines = [0.2, 0.5, 0.8];
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;

    for (const ref of referenceLines) {
      const y = height - ref * height * this.scale;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      ctx.fillStyle = "red";
      ctx.font = "10px monospace";
      ctx.fillText(ref.toFixed(1), 2, y - 2);
    }

    ctx.beginPath();
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 1;

    for (let i = 0; i < this.values.length; i++) {
      const x = i * (width / this.maxPoints);
      const alpha = this.values[i];
      const y = height - alpha * height * this.scale;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  }
}



