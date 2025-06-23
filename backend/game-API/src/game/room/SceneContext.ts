import { IOManager } from "./IOManager.js";
import { LoopManager } from "./LoopManager.js";

export class SceneContext {
  private static current: SceneContext | null = null;

  public readonly loopManager: LoopManager;
  public readonly ioManager: IOManager;

  static get(): SceneContext {
    if (!this.current) {
      throw new Error("No room is currently set.");
    }
    return this.current;
  }

  static use<T>(ctx: SceneContext, fn: () => T): T {
    const previous = this.current;
    this.current = ctx;
    const result = fn();
    this.current = previous;
    return result;
  }

  constructor(loopManager: LoopManager, ioManager: IOManager) {
    this.loopManager = loopManager;
    this.ioManager = ioManager;
  }

}
