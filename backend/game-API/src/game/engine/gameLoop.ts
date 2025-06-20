import { GameObject } from "./GameObject";


export class LoopManager {
  private ObjectsInstance: GameObject[] = [];

  private lastTick = Date.now();
  private accumulator = 0;
  private isRunning = false;

  public readonly tickRate: number = 0;
  public readonly tickInterval: number = 1000 / this.tickRate;
  public readonly deltaTime: number = this.tickRate / 1000; // Delta time in seconds

  constructor(tickRate: number) {
    this.tickRate = tickRate;
    this.tickInterval = 1000 / this.tickRate;
    this.deltaTime = this.tickRate / 1000; // Delta time in seconds
    console.log(`LoopManager initialized with tick rate: ${this.tickRate} ticks/sec`);
  }

  public start() {
    console.log("Starting game loop...");
    this.lastTick = Date.now();
    this.accumulator = 0;
    this.isRunning = true;
    this.loopTick();
  }

  public stop() {
    console.log("Stopping game loop...");
    this.lastTick = Date.now();
    this.accumulator = 0;
    this.isRunning = false;
  }

  private loopTick() {
    if (!this.isRunning) return;

    const now = Date.now();
    const delta = now - this.lastTick;
    this.lastTick = now;

    // Here while loop is used to ensure if an tick is longer than the TICK_INTERVAL, we still ensure the number of ticks is consistent
    // (Je suis pas sur de la formulation)
    this.accumulator += delta;
    while (this.accumulator >= this.tickInterval) {
      console.log("Game tick at", new Date().toISOString());
      this.callUpdate();
      this.accumulator -= this.tickInterval;
    }

    setImmediate(this.loopTick);
  }

  private callUpdate() {
    this.ObjectsInstance.forEach(object => {
      if (object.enabled === false) return; // Skip if the object is disabled
      object.update()
    });
  }

  public addObject(object: GameObject) {
    if (this.ObjectsInstance.includes(object)) {
      console.warn("Object already exists in the game loop.");
      return;
    }
    this.ObjectsInstance.push(object);
  }

  public removeObject(object: GameObject) {
    const index = this.ObjectsInstance.indexOf(object);
    if (index !== -1) {
      this.ObjectsInstance.splice(index, 1);
    } else {
      console.warn("Object not found in the game loop.");
    }
  }
}


