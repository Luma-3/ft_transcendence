import { GameObject } from "../GameObject.js";

export abstract class ALoop {
  protected objects: GameObject[] = [];

  public startTime: number;

  protected readonly tickRate: number;
  protected readonly tickInterval: number;
  public readonly deltaTime: number;

  private lastTick = Date.now();
  private accumulator = 0;
  private isRunning = false;


  constructor(tickRate: number) {
    this.tickRate = tickRate;
    this.tickInterval = 1000 / this.tickRate; // Convert ticks per second to milliseconds per tick
    this.deltaTime = this.tickInterval / 1000; // Convert milliseconds to second
  }

  public start() {
    this.lastTick = Date.now();
    this.accumulator = 0;
    this.isRunning = true;
    this.startTime = performance.now();
    this.loopTick();
  }

  public stop() {
    this.lastTick = Date.now();
    this.accumulator = 0;
    this.isRunning = false;
  }

  public addObject(obj: GameObject) {
    if (this.objects.includes(obj)) {
      return;
    }
    this.objects.push(obj);
  }

  public removeObject(obj: GameObject) {
    const index = this.objects.indexOf(obj);
    if (index === -1) {
      return;
    }
    this.objects.splice(index, 1);
  }

  public get objectsPublic() {
  return this.objects;
  }


  protected abstract update(): void;

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

    setImmediate(() => this.loopTick());
  }
}
