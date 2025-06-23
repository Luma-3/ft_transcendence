
const TICK_RATE = 60; // 60 ticks per second
const TICK_INTERVAL = 1000 / TICK_RATE; // Interval in milliseconds
export const DELTA_TIME = TICK_RATE / 1000; // Delta time in milliseconds


interface Object {
  update(): void;
  snapshot(): any;
}

export class LoopManager {
  private ObjectsInstance: Object[] = [];

  private lastTick = Date.now();
  private accumulator = 0;
  private isRunning = false;

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
    while (this.accumulator >= TICK_INTERVAL) {
      console.log("Game tick at", new Date().toISOString());
      this.callUpdate();
      this.accumulator -= TICK_INTERVAL;
    }

    setImmediate(this.loopTick);
  }

  private callUpdate() {
    this.ObjectsInstance.forEach(object => object.update());
  }

  public addObject(object: Object) {
    if (this.ObjectsInstance.includes(object)) {
      console.warn("Object already exists in the game loop.");
      return;
    }
    this.ObjectsInstance.push(object);
  }

  public removeObject(object: Object) {
    const index = this.ObjectsInstance.indexOf(object);
    if (index !== -1) {
      this.ObjectsInstance.splice(index, 1);
    } else {
      console.warn("Object not found in the game loop.");
    }
  }
}


