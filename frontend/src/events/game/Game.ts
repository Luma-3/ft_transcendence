import { Paddle, IPaddle } from "./draw/Paddle";
import { Ball, IBall } from "./draw/Ball";
import { LineBuilder } from "./draw/LineBuilder";
import { sendInSocket } from "../../socket/Socket";
import { onKeyDown, onKeyUp } from "./gameInput";
import { AlphaGraph } from "./AlphaGraph";

export interface IGame {
  id: string;
  gameType: string;
  players: IPlayer[],
  status: string
}

export interface IGameObject {
  type: string;
}

export interface ISnapshot {
  time: number;
  objects: IGameObject[];
}

interface IPlayer {
  id: string;
  player_name: string;
  ready: boolean;
  avatar: string;
  side: "left" | "right";
  score: number;
  win: boolean;
}

export class Game {

  // -------- Canvas and Context --------//
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // -------- Game Properties --------//
  private width: number;
  private height: number;

  private revertDrawing: boolean = false;

  // -------- Game Objects --------//
  paddles: Map<string, Paddle> = new Map();
  private ball: Ball;


  // ------------- Game Interpolation ---------------//
  private startTime: number | null = null;
  private snapshots: ISnapshot[] = [];
  private alphaGraph: AlphaGraph = new AlphaGraph("alphaGraph");

  private id: string;
  public userId: string;
  public gameType: string;

  constructor(data: IGame, userId: string) {

    this.id = data.id;
    this.userId = userId;
    this.gameType = data.gameType;

    this.canvas = document.getElementById('game') as HTMLCanvasElement;
    if (!this.canvas) {
      sendInSocket("game", "room", this.id, "error", "Canvas not found")
      return;
    }

    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      sendInSocket("game", "room", this.id, "error", "Context not found")
      return;
    }

    this.ctx = ctx;

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.revertDrawing = data.players.find(player => player.id === userId)!.side === 'right';

    // Object initialization
    this.ball = new Ball();
    data.players.forEach((paddle) => {
      this.paddles.set(paddle.id, new Paddle(paddle.id));
    });

    this.addEventListener();
  }

  private addEventListener() {

    //TODO: Zoom To 100%
    // window.addEventListener('resize', resizeCanvas)

    onkeyup = (event) => {
      onKeyUp(event, this.userId);
    }

    onkeydown = (event) => {
      const divGame = document.getElementById("hiddenGame") as HTMLDivElement;

      if (divGame.classList.contains("opacity-0")) {
        console.log("Game is not visible, ignoring keydown event");
        sendInSocket("game", "room", this.id, "ready", {});
        return;
      }
      onKeyDown(event, this.userId);
    }
  }

  start() {
    this.loop()
  }

  addScore(data: any) {
    console.log("Adding score", data);
    const player1Div = document.getElementById(`${data.players[0].id}-score`) as HTMLDivElement;
    const player2Div = document.getElementById(`${data.players[1].id}-score`) as HTMLDivElement;

    player1Div.innerText = data.players[0].score.toString();
    player2Div.innerText = data.players[1].score.toString();
  }

  clear() { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }

  drawBackground() {
    this.ctx.fillStyle = "rgba(178, 157, 210, 0.4)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    new LineBuilder(this.ctx).from(this.width / 2, 0).to(this.width / 2, this.height).setColor('white').setWidth(5).setDash([10, 15]).draw();
    new LineBuilder(this.ctx).from(50, 0).to(50, this.height).setColor('white').setWidth(1).draw();
    new LineBuilder(this.ctx).from(750, 0).to(750, this.height).setColor('white').setWidth(1).draw();
  }

  end() {
    onkeyup = null;
    onkeydown = null;
  }

  draw() {
    this.clear();
    this.drawBackground();

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
      return false;
    }

    const t = snapshotsA.time === snapshotsB.time ? 0 : (renderTime - snapshotsA.time) / (snapshotsB.time - snapshotsA.time);


    this.alphaGraph.add(t);
    this.alphaGraph.draw();

    for (let i = 0; i < snapshotsA.objects.length; i++) {
      switch (snapshotsA.objects[i].type) {
        case "ball":
          this.ball.interpolate(snapshotsA.objects[i] as IBall, snapshotsB.objects[i] as IBall, t);
          break;
        case "paddle":
          this.paddles.get((snapshotsA.objects[i] as IPaddle).id)?.interpolate(snapshotsA.objects[i] as IPaddle, snapshotsB.objects[i] as IPaddle, t);
          break;
        default:
          console.warn(`Unknown object type: ${snapshotsA.objects[i].type}`);
          break;
      }
    }
    return true;
  }

  addSnapshot(data: ISnapshot) {
    if (!this.startTime) {
      this.startTime = performance.now() - data.time;
    }

    this.snapshots.push({ time: data.time, objects: data.objects });

    if (this.snapshots.length > 10) {
      this.snapshots.shift();
    }
  }


  loop() {
    this.lastTime = performance.now();
    this.interpolate(performance.now() - this.startTime! - 65)
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }
}
