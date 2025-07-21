import { Vector2 } from "../utils/Vector2";

export interface IBall {
  type: string;
  position: Vector2;
  velocity: Vector2;
  radius: number;
}

export class Ball {
  velocity: Vector2 = Vector2.zero();
  position: Vector2;
  radius: number;

  constructor() {
    this.position = Vector2.zero();
    this.radius = 10;
  }

  interpolate(snapshotsA: IBall, snapshotsB: IBall, alpha: number) {
    this.position = Vector2.fromObj(snapshotsA.position).lerp(snapshotsB.position, alpha);
  }

  draw(ctx: CanvasRenderingContext2D, revert: boolean, terrainWidth: number) {
    ctx.beginPath();
    const x = revert ? terrainWidth - this.position.x : this.position.x;
    ctx.arc(x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }
}
