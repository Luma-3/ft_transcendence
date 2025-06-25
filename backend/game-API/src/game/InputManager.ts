import { GameObject } from "../core/GameObject";
import { SceneContext } from "../core/runtime/SceneContext";
import { IOInterface } from "../utils/IOInterface";

export class InputManager extends GameObject {

  public constructor() {
    super();
  }

  public static getInstance(): InputManager {
    const ctx = SceneContext.get();
    if (!ctx.inputManager) {
      ctx.inputManager = GameObject.instantiate(InputManager);
    }
    return ctx.inputManager;
  }

  public onInstantiate(): void {
    const id = SceneContext.get().id;
    IOInterface.subscribe(`ws:game:room:${id}`, this.handleInput);
  }

  public update(): void {

  }

  public handleInput(message: string): void {
    const data = JSON.parse(message);
    if (data.type !== 'input') return;
    const ctx = SceneContext.get();


  }
}


