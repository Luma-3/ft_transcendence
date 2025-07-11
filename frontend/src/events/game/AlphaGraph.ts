import { IGameObject } from "../../interfaces/IGame";
import { Ball, IBall } from "./draw/Ball";
import { Paddle, IPaddle } from "./draw/Paddle";
import { alpha } from "./draw/lerping";


export class AlphaGraph {
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



