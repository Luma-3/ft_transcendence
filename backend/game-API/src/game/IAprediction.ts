import { Vector2 } from "../core/physics/Vector.js";


// Cet algo a pour but de predire la position d'impact de la balle, en simulant frame par frame sa position et en tenant compte des rebonds
// sur les murs
type BallSnapshot = {
    position: Vector2;
    velocity: Vector2;
    radius: number;
};

export function predictBallImpact(
    ball: BallSnapshot,
    paddleX: number,
    fieldHeight: number,
    dt: number
): { impactY: number; framesToImpact: number } {
    let position = ball.position.clone();
    let velocity = ball.velocity.clone();
    let frames = 0;

    while (
        (velocity.x > 0 && position.x < paddleX) ||
        (velocity.x < 0 && position.x > paddleX)
    ) {
        position = position.add(velocity.scale(dt));
        if (position.y - ball.radius < 0 || position.y + ball.radius > fieldHeight)
        {
            velocity = new Vector2(velocity.x, -velocity.y);
            // on recadre la balle pour eviter qu'elle ne colle au mur
            position.y = Math.max(ball.radius, Math.min(position.y, fieldHeight))
        }
        frames++;
    }
    return {
        impactY: position.y,
        framesToImpact: frames
    };
}
