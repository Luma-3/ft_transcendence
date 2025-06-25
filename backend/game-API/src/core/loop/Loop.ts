import { ALoop } from "./ALoop.js";
import { SceneContext } from "../runtime/SceneContext.js";
import { CollisionSystem } from "../physics/CollisionSystem.js";
import { IOInterface } from "../../utils/IOInterface.js";

export class NetworkLoop extends ALoop {

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
    const player = SceneContext.get().players;
    IOInterface.broadcast(JSON.stringify(payload), player.map(p => p.user_id));
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
