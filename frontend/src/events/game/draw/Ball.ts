import { Vector2 } from "../utils/Vector";
import { alpha, lerp, lerpVector2 } from "./lerping";

export interface IBall {
  type: string;
  position: Vector2;
  velocity: Vector2;
  radius: number;
}

export class Ball {
  position: Vector2;
  radius: number;

  snapshots: { time: number, object: IBall }[] = [];

  constructor() {
    this.position = Vector2.zero();
    this.radius = 10; // Default radius, can be updated later
  }

  addSnapshot(object: IBall, now: number) {
    this.snapshots.push({ time: now, object });

    if (this.snapshots.length > 10) this.snapshots.shift();
  }

  interpolate(renderTime: number) {
    if (this.snapshots.length < 2) return;

    let snapshotsA, snapshotsB;
    for (let i = 0; i < this.snapshots.length - 1; i++) {
      const current = this.snapshots[i];
      const next = this.snapshots[i + 1];

      if (current.time <= renderTime && renderTime <= next.time) {
        snapshotsA = current;
        snapshotsB = next;
        break;
      }
    }


    if (!snapshotsA || !snapshotsB) return;

    const t = alpha(snapshotsA.time, snapshotsB.time, renderTime);

    this.position = lerpVector2(snapshotsA.object.position, snapshotsB.object.position, t);
    // this.radius = lerp(snapshotsA.object.radius, snapshotsB.object.radius, t);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }
}
