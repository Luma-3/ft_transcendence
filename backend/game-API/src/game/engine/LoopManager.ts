import { GameObject } from "./GameObject";
import { CollisionSystem } from "./CollisionSystem.js";
import { SceneContext } from "../room/SceneContext.js";

export class LoopManager {
  private networkLoop: Loop;
  private gameLoop: Loop;

  public get deltaTime() {
    return this.gameLoop.deltaTime;
  }

  constructor() {
    this.networkLoop = new NetworkLoop(35);
    this.gameLoop = new GameLoop(60);
  }

  public start() {
    console.log("Starting LoopManager...");
    this.networkLoop.start();
    this.gameLoop.start();
  }

  public stop() {
    console.log("Stopping LoopManager...");
    this.networkLoop.stop();
    this.gameLoop.stop();
  }

  public addNetworkObject(obj: GameObject) {
    this.networkLoop.addObject(obj);
  }

  public addGameObject(obj: GameObject) {
    this.gameLoop.addObject(obj);
  }

  public removeNetworkObject(obj: GameObject) {
    this.networkLoop.removeObject(obj);
  }
  public removeGameObject(obj: GameObject) {
    this.gameLoop.removeObject(obj);
  }
}

abstract class Loop {
  protected objects: GameObject[] = [];

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
    console.log(`Loop initialized with tick rate: ${this.tickRate} ticks/sec`);
  }

  public start() {
    console.log("Starting loop...");
    this.lastTick = Date.now();
    this.accumulator = 0;
    this.isRunning = true;
    this.loopTick();
  }

  public stop() {
    console.log("Stopping loop...");
    this.lastTick = Date.now();
    this.accumulator = 0;
    this.isRunning = false;
  }

  public addObject(obj: GameObject) {
    if (this.objects.includes(obj)) {
      console.warn(`Object already exists in the loop. type: ${obj.constructor.name}`);
      return;
    }
    this.objects.push(obj);
    console.log(`Object added to loop: ${obj.constructor.name}`);
  }

  public removeObject(obj: GameObject) {
    const index = this.objects.indexOf(obj);
    if (index === -1) {
      console.warn(`Object not found in the loop. type: ${obj.constructor.name}`);
      return;
    }
    this.objects.splice(index, 1);
    console.log(`Object removed from loop: ${obj.constructor.name}`);
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

class NetworkLoop extends Loop {

  constructor(tickRate: number) {
    super(tickRate);
  }

  protected update(): void {
    const snapshot: Record<string, any> = {};
    this.objects.forEach((obj) => {
      if (!obj.enabled) return;
      const objSnapshot = obj.snapshot();
      if (objSnapshot && objSnapshot.id) {
        snapshot[objSnapshot.id] = objSnapshot;
      }
    });
    if (Object.keys(snapshot).length > 0) {
      this.sendBatch(snapshot);
    }
  }

  private sendBatch(snapshot: Record<string, any>) {
    const payload = {
      action: "snapshot",
      gameData: snapshot,
    }
    SceneContext.get().ioManager.broadcast(JSON.stringify(payload));
  }
}

class GameLoop extends Loop {

  constructor(tickRate: number) {
    super(tickRate);
  }

  protected update(): void {
    this.objects.forEach((obj) => {
      if (!obj.enabled) return;
      obj.update();
    });
    CollisionSystem.iterateCollisions(this.objects);
  }
}

