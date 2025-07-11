import { ALoop } from "./ALoop.js";
import { SceneContext } from "../runtime/SceneContext.js";
import { CollisionSystem } from "../physics/CollisionSystem.js";
import { IOInterface } from "../../utils/IOInterface.js";

export class NetworkLoop extends ALoop {

  constructor(tickRate: number) {
    super(tickRate);
  }

  protected update(): void {
    const tab = [];
    this.objects.forEach((obj) => {
      if (!obj.snapshotEnabled) return;
      tab.push(obj.snapshot());
    });
    if (tab.length > 0) {
      this.sendBatch(tab);
    }
  }

  private sendBatch(snapshot: any[]): void {
    const payload = {
      action: "snapshot",
      data: {
        time: performance.now() - this.startTime,
        objects: snapshot,
      }
    }
    const player = SceneContext.get().players;
    IOInterface.broadcast(
      JSON.stringify(payload),
      [...player.keys()]
    );
  }
}

export class GameLoop extends ALoop {

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

// IALoop.ts
export class IALoop extends ALoop {
  constructor(tickRate: number) {
    super(tickRate); // Ex: 1 tick/seconde (tickRate=1)
  }

  protected update(): void {
    this.objects.forEach((obj) => {
      obj.update();
    });
  }
}

