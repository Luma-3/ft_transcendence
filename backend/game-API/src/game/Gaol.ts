import { GameObject } from "../core/GameObject";
import { Vector2 } from "../core/physics/Vector";

export class Gaol extends GameObject {
  public position: Vector2 = new Vector2(0, 0);
  public scale: Vector2 = new Vector2(100, 200); // Width and height of the goal

  constructor(pos: Vector2) {
    super();
    this.position = pos;
  }



  collider() {
    return {
      position: this.position,
      scale: this.scale
    };
  }

  snapshot() {
    return {
      type: 'gaol',
      id: 'gaol',
      position: this.position,
      scale: this.scale
    };
  }
}
