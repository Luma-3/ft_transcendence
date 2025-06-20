import { LoopManager } from "./gameLoop";
import { GameObject } from "./GameObject";

export class GameObjectFactory {
  private loopManager: LoopManager;

  constructor(ctx: LoopManager) {
    this.loopManager = ctx;
  }

  public create<T extends GameObject>(
    Ctor: new (...args: any[]) => T,
    ...args: any[]
  ): T {
    const newObject = new Ctor(this.loopManager, ...args);
    this.loopManager.addObject(newObject);
    newObject.onInstantiate();
    return newObject;
  }
}
