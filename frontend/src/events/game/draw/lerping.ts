import { Vector2 } from "../utils/Vector";

/**
 * Linear interpolation function.
  * Interpolates between two numbers `a` and `b` by a factor `t`.
  * @param a - The starting value.
  * @param b - The ending value.
  * @param t - The interpolation factor (0 <= t <= 1). or name alpha
  * @returns The interpolated value.
  */
export function lerp(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}

/**
 * Alpha interpolation function.
 * Calculates the interpolation factor based on two timestamps and the current time.
 * @param t1 - The first timestamp.
 * @param t2 - The second timestamp.
 * @param now - The current time.
 * @returns The interpolation factor (0 if t1 equals t2, otherwise a value between 0 and 1).
 */
export function alpha(t1: number, t2: number, now: number): number {
  return (t1 === t2) ? 0 : (now - t1) / (t2 - t1);
}

export function lerpVector2(a: Vector2, b: Vector2, t: number): Vector2 {
  return new Vector2(
    lerp(a.x, b.x, t),
    lerp(a.y, b.y, t)
  );
}
