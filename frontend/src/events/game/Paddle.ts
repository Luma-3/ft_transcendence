// import { Vector2 } from "./Vector";

export class Paddle {
  public lastTick: number = Date.now();
  public accumulator: number = 0;
  public isRunning: boolean = false;
  public tickInterval: number = 1000 / 60;

  public id: string;


  constructor(id: string) {
    console.log(`Creating Paddle with id: ${id}`);
    this.id = id;
  }

  public start() {
    console.log(`Paddle ${this.id} loop started`);
    this.lastTick = Date.now();
    this.accumulator = 0;
    this.isRunning = true;
    this.loopTick();
  }

  public stop() {
    console.log(`Paddle ${this.id} loop stopped`);
    this.lastTick = Date.now();
    this.accumulator = 0;
    this.isRunning = false;
  }

  private loopTick() {
    if (!this.isRunning) return;

    const now = Date.now();
    const delta = now - this.lastTick;
    this.lastTick = now;

    this.accumulator += delta;
    while (this.accumulator >= this.tickInterval) {
      this.update();
      this.accumulator -= this.tickInterval;
    }

    queueMicrotask(() => this.loopTick());
    // setImmediate(() => this.loopTick());
  }

  update() {
    console.log(`Paddle ${this.id} update at ${Date.now()}`);
  }
}
