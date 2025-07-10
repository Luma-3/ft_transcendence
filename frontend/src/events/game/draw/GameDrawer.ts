import { Paddle } from "./Paddle";
import { Ball, IBall } from "./Ball";
import { LineBuilder } from "./LineBuilder";


export class GameDrawer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  width: number;
  height: number;

  private startTime: number | null = null;
  private paddles: Map<string, Paddle> = new Map();
  private revertDrawing: boolean = false;
  private ball: Ball;

  snapshots: ISnapshot[] = [];

  alphaGraph: AlphaGraph = new AlphaGraph("alphaGraph");

  constructor(canvasId: string, players: IPlayer[], userId: string) {

    // TODO : Demander a antho comment il gere les Erreurs 
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) { throw new Error(`Canvas with id ${canvasId} not found`); }
    const ctx = this.canvas.getContext("2d");
    if (!ctx) { throw new Error("Failed to get canvas context"); }
    this.ctx = ctx;

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.revertDrawing = players.find(player => player.id === userId)!.side === 'right';

    // Object initialization
    this.ball = new Ball();
    players.forEach((paddle) => {
      this.paddles.set(paddle.id, new Paddle(paddle.id));
    });

    this.loop()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground() {
    this.ctx.fillStyle = "rgba(178, 157, 210, 0.4)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    new LineBuilder(this.ctx).from(this.width / 2, 0).to(this.width / 2, this.height).setColor('white').setWidth(5).setDash([10, 15]).draw();
    new LineBuilder(this.ctx).from(50, 0).to(50, this.height).setColor('white').setWidth(1).draw();
    new LineBuilder(this.ctx).from(750, 0).to(750, this.height).setColor('white').setWidth(1).draw();
  }

  draw() {
    this.clear();
    this.drawBackground();

    console.log("Revert Drawring: ", this.revertDrawing);
    this.ball.draw(this.ctx, this.revertDrawing, this.width);
    this.paddles.forEach((player) => {
      player.draw(this.ctx, this.revertDrawing, this.width);
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
          this.paddles.get((snapshotsA.object[i] as IPaddle).id)?.interpolate(snapshotsA.object[i] as IPaddle, snapshotsB.object[i] as IPaddle, t);
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
    this.interpolate(performance.now() - this.startTime! - 65);
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }
}
