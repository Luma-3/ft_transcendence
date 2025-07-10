import { Vector2 } from "../utils/Vector2";

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

  draw(ctx: CanvasRenderingContext2D, revert: boolean, terrainWidth: number) {
    ctx.fillStyle = "white";
    const pos: Vector2 = new Vector2(
      revert ? terrainWidth - this.position.x - this.scale.x / 2 : this.position.x - this.scale.x / 2,
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

  interpolate(snapshotsA: IPaddle, snapshotsB: IPaddle, alpha: number) {
    this.position = Vector2.fromObj(snapshotsA.position).lerp(snapshotsB.position, alpha);
  }
}
