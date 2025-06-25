import { Vector2 } from './Vector.js';

export interface Circle {
  position: Vector2;
  radius: number;
}

export interface Rectangle {
  position: Vector2;
  scale: Vector2;
}
