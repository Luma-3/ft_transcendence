import { Vector2 } from "../utils/Vector";
import { lerpVector2 } from "./lerping";

export interface IBall {
  type: string;
  position: Vector2;
  velocity: Vector2;
  radius: number;
}

export class Ball {
  position: Vector2;
  radius: number;

  constructor() {
    this.position = Vector2.zero();
    this.radius = 10; // Default radius, can be updated later
  }


  interpolate(snapshotsA: IBall, snapshotsB: IBall, alpha: number) {
    this.position = lerpVector2(snapshotsA.position, snapshotsB.position, alpha);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }
}




