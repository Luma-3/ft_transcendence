import { Vector2 } from "../utils/Vector";
import { lerpVector2, alpha } from "./lerping";

export interface IPaddle {
  type: string;
  id: string;
  position: Vector2;
  scale: Vector2;
}

export class Paddle {
  id: string;
  position: Vector2 = Vector2.zero();
  scale: Vector2 = new Vector2(10, 100); // Default paddle size
  radius: number = 10;

  snapshots: { time: number; object: IPaddle }[] = [];

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

  addSnapshot(object: IPaddle, now: number) {
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
  }
}
