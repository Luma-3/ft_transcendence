import { SceneContext } from './runtime/SceneContext.js';
import { Circle, Rectangle } from './physics/Shapes.js';
import { Vector2 } from './physics/Vector.js';


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
  public snapshotEnabled: boolean = true;

  collider(): Circle | Rectangle { return null; }

  update(): void { };
  onInstantiate(): void { }
  snapshot(): any { return {}; }
  onCollision(other: GameObject, closestPoint: Vector2): void { other; closestPoint; }

  // abstract destroy(): void;
};
