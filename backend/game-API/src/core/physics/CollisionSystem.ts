import { Vector2 } from './Vector.js';
import { GameObject } from '../GameObject';
import { Circle, Rectangle } from './Shapes.js';


export class CollisionSystem {
  private constructor() { }

  public static iterateCollisions(objects: GameObject[]): void {
    if (objects.length < 2) return; // No collisions possible with less than 2 objects
    for (let i = 0; i < objects.length; i++) {
      const objA = objects[i];
      const colliderA = objA.collider();

      for (let j = i + 1; j < objects.length; j++) {
        const objB = objects[j];
        const colliderB = objB.collider();

        if (!colliderA || !colliderB) continue; // Skip if either object has no collider
        if (this.checkCollision(colliderA, colliderB)) {
          objA.onCollision(objB);
          objB.onCollision(objA);
        }
      }
    }
  }

  public static isCircle(collider: any): collider is Circle {
    return "radius" in collider && "position" in collider;
  }

  public static isRectangle(collider: any): collider is Rectangle {
    return "scale" in collider && "position" in collider;
  }

  public static checkCollision(colliderA: Circle | Rectangle, colliderB: Circle | Rectangle): boolean {
    if (this.isCircle(colliderA) && this.isRectangle(colliderB)) {
      return this.circleIntersectRect(colliderA, colliderB);
    } else if (this.isRectangle(colliderA) && this.isCircle(colliderB)) {
      return this.circleIntersectRect(colliderB, colliderA);
    }
    return false;
  }

  public static circleIntersectRect(circle: Circle, rect: Rectangle): boolean {
    const closest = new Vector2(
      Math.max(rect.position.x - rect.scale.x / 2, Math.min(circle.position.x, rect.position.x + rect.scale.x / 2)),
      Math.max(rect.position.y - rect.scale.y / 2, Math.min(circle.position.y, rect.position.y + rect.scale.y / 2))
    );

    const distance = new Vector2(
      circle.position.x - closest.x,
      circle.position.y - closest.y
    );

    return distance.dot(distance) < (circle.radius * circle.radius);
  }
}
