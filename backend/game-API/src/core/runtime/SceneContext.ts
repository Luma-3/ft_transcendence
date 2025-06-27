import { InputManager } from "../../game/InputManager.js";
import { gameType } from "../../room/player.schema.js";
import { LoopManager } from "../loop/LoopManager.js";
import { Player } from "./Interface.js";
import { AsyncLocalStorage } from "async_hooks";

export class SceneContext {
  private static storage = new AsyncLocalStorage<SceneContext>();

  public readonly loopManager: LoopManager;
  public readonly players: Player[] = [];
  public inputManager: InputManager = null;
  public id: string = null;
  public gameType: gameType;

  constructor(
    id: string,
    gameType: gameType,
    players: Player[],
    loopManager: LoopManager,
    inputManager: InputManager
  ) {
    this.loopManager = loopManager;
    this.players = players;
    this.id = id;
    this.gameType = gameType;
    this.inputManager = inputManager;
  }

  static run<T>(ctx: SceneContext, fn: () => T): T {
    return this.storage.run(ctx, fn);
  }

  static get(): SceneContext {
    const ctx = this.storage.getStore();
    if (!ctx) throw new Error("SceneContext not initialized. Use SceneContext.run() to create a context.");
    return ctx
  }
}
