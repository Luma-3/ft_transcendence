

export class Vector2 {
  constructor(public x: number, public y: number) { }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  sub(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  mult(other: Vector2): Vector2 {
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  scale(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  normalize(): Vector2 {
    let mag = this.magnitude();
    return mag === 0 ? new Vector2(0, 0) : this.scale(1 / mag);
  }

  lerp(other: Vector2, t: number): Vector2 {
    return new Vector2(
      this.x * (1 - t) + other.x * t,
      this.y * (1 - t) + other.y * t
    )
  }
  
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static fromObj(obj: { x: number, y: number }): Vector2 {
    return new Vector2(obj.x, obj.y);
  }

}
