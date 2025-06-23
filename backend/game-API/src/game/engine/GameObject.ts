import { SceneContext } from '../room/SceneContext.js';
import { Circle, Rectangle } from './Shapes.js';


export abstract class GameObject {

  public static instantiate<T extends GameObject>(
    Ctor: new (...args: any[]) => T,
    ...args: any[]
  ): T {
    const newObject = new Ctor(...args);
    console.log(`Instantiating game object of type: ${Ctor.name}`);
    const loopManager = SceneContext.get().loopManager;
    loopManager.addGameObject(newObject);
    loopManager.addNetworkObject(newObject);
    newObject.onInstantiate();
    return newObject;
  }

  public enabled: boolean = true; // Indicates if the object is enabled or not

  abstract collider(): Circle | Rectangle

  abstract update(): void;
  abstract onInstantiate(): void;
  abstract snapshot(): any;
  abstract onCollision(other: GameObject): void;

  // abstract destroy(): void;
};
