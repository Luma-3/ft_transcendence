import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Vector2 } from "../core/physics/Vector.js";
import { target } from "./AIAlgo.js";


type BallSnapshot = {
    position: Vector2;
    velocity: Vector2;
    radius: number;
};
// ---------- L’IA Controller ----------
export class AIController {
    private paddle: Paddle;
    private ball: Ball;
    private fieldHeight: number;
    private dt: number;
    private paddleid: string;

    constructor(paddle: Paddle, ball: Ball, fieldHeight = 600, dt = 1 / 60) {
        this.paddle = paddle;
        this.ball = ball;
        this.fieldHeight = fieldHeight;
        this.dt = dt;
        this.paddleid = paddle.Paddleid;
    }
    update() {
        // 1. Alog de prediction a P{IMPER Prédiction de la trajectoire TIME ET ZONE 
        const { impactY, framesToImpact } = predictBallImpact(
            {
                position: this.ball.position.clone(),
                velocity: this.ball.Ballvelocity.clone(),
                radius: this.ball.radius
            },
            this.paddle.position.x, // X du paddle IA
            this.fieldHeight,
            this.dt,
        );
        console.log('ImpactY:', impactY);

        // TODO
        // 2. Prise de décision (haut/bas/neutre)
        const decision = this.computePaddleMovement(impactY, framesToImpact).move;
        console.log('Decision IA', decision);

        // 3. Injection de l’input IA
        SceneContext.get().inputManager.set(this.paddleid, new Vector2(0, decision));
    }

    computePaddleMovement(
    predictedY: number, framesToImpact: number
): { move: number } {
    const currentY = this.paddle.position.y;
    const paddleSpeed = 530
    const tickDuration = this.dt;
    const zoneCount = 7;
    const fieldHeight = 600;
    const zoneHeight = fieldHeight / zoneCount;

    // Cas où la balle repart -> replacer paddle au centre
    if (predictedY === 0) {
        return target(3, currentY, fieldHeight, zoneCount, paddleSpeed * tickDuration / 2);
    }

    // Détermine la zone cible selon l'impact prédit
    const zoneIndex = Math.floor(predictedY / zoneHeight);

    // Centre de la zone cible
    const zoneCenter = (zoneIndex + 0.5) * zoneHeight;

    // Distance à parcourir
    const distanceToTarget = Math.abs(currentY - zoneCenter);

    // Temps pour atteindre la cible (à vitesse max du paddle)
    const timeToReach = distanceToTarget / paddleSpeed;
    const timeToImpact = framesToImpact * tickDuration;

    // Si je dois déjà partir pour arriver à temps, je bouge
    if (timeToReach >= timeToImpact) {
        return target(zoneIndex, currentY, fieldHeight, zoneCount, paddleSpeed * tickDuration / 2);
    }

    // Sinon, ne bouge pas
    return { move: 0 };                                      // Rester
    }
}

/**
 * Simule la trajectoire de la balle frame par frame jusqu’au X d’un paddle.
 * Retourne la position Y de l’impact et le nombre de frames.
 */
export function predictBallImpact(
    ball: BallSnapshot,
    paddleX: number,
    fieldHeight: number,
    dt: number
): { impactY: number; framesToImpact: number } {
    let position = ball.position.clone();
    let velocity = ball.velocity.clone();
    let frames = 0;

    // Tant que la balle va dans l'autre sens on se replacera au milieu donc on ne calcul pas un impact.
    if (velocity.x > 0)
        return {
            impactY: 300,
            framesToImpact: 0
        };

    // On avance la balle tant qu’elle n’a pas traversé le X du paddle
    while (
        (velocity.x > 0 && position.x < paddleX) ||
        (velocity.x < 0 && position.x > paddleX)
    ) {
        position = position.add(velocity.scale(dt));
        // Rebond sur les murs haut/bas
        if (position.y - ball.radius < 0 || position.y + ball.radius > fieldHeight) {
            velocity = new Vector2(velocity.x, -velocity.y);
            position.y = Math.max(ball.radius, Math.min(position.y, fieldHeight));
        }
        frames++;
    }
    return {
        impactY: position.y,
        framesToImpact: frames
    };
}



/* Je base la vitesse max en 1seconde sur : 


    acceleration = 4

    velocityModifer = 400

    frictionFroce = 3
*/