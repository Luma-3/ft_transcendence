import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Vector2 } from "../core/physics/Vector.js";

type BallSnapshot = {
    position: Vector2;
    velocity: Vector2;
    radius: number;
};

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
        const { impactY, framesToImpact, goingToIA } = this.predictBallImpactWithDirection(
            {
                position: this.ball.position.clone(),
                velocity: this.ball.Ballvelocity.clone(),
                radius: this.ball.radius
            },
            this.paddle.position.x,
            this.fieldHeight,
            this.dt,
        );

        const decision = this.computePaddleMovement(impactY, framesToImpact, goingToIA).move;
        SceneContext.get().inputManager.set(this.paddleid, new Vector2(0, decision));
    }

    computePaddleMovement(
        predictedY: number,
        framesToImpact: number,
        goingToIA: boolean
    ): { move: number } {
        const currentY = this.paddle.position.y;
        const paddleHalfLength = this.paddle.scale.y / 2;

        void framesToImpact;

        if (!this.ball.enabled)
            return { move: 0 };
        // 1. Quand la balle part ou dépasse la moitié, on colle le paddle en haut ou en bas
        if (!goingToIA || this.ball.position.x > 800 / 2) {
            if (this.ball.position.y < this.fieldHeight / 2 && currentY > paddleHalfLength)
                return { move: 1 }; // Monter (Y diminue)
            else if (this.ball.position.y >= this.fieldHeight / 2 && currentY < this.fieldHeight - paddleHalfLength)
                return { move: -1 }; // Descendre (Y augmente)
            else
                return { move: 0 };
        }
        // 2. Si déjà bien placé, ne bouge pas
        if (
            currentY - paddleHalfLength <= predictedY &&
            currentY + paddleHalfLength >= predictedY
        ) {
            return { move: 0 };
        }

        // 3. Sinon, tente le tout pour le tout : va à fond vers l'impact
        if (predictedY > currentY)
            return { move: -1 }; // Descendre (Y augmente)
        else
            return { move: 1 }; // Monter (Y diminue)
    }
    /**
     * Simule la trajectoire de la balle frame par frame jusqu’au X d’un paddle.
     * Retourne la position Y de l’impact, le nombre de frames et la direction.
     */
    predictBallImpactWithDirection(
        ball: BallSnapshot,
        paddleX: number,
        fieldHeight: number,
        dt: number
    ): { impactY: number; framesToImpact: number; goingToIA: boolean } {
        let position = ball.position.clone();
        let velocity = ball.velocity.clone();
        let frames = 0;

        // Teste la direction initiale de la balle
        let goingToIA = (velocity.x < 0); // IA à gauche

        // On avance la balle tant qu’elle n’a pas traversé le X du paddle
        while (
            (velocity.x > 0 && position.x < paddleX) ||
            (velocity.x < 0 && position.x > paddleX)
        ) {
            position = position.add(velocity.scale(dt));
            if (position.y - ball.radius < 0 || position.y + ball.radius > fieldHeight) {
                velocity = new Vector2(velocity.x, -velocity.y);
                position.y = Math.max(ball.radius, Math.min(position.y, fieldHeight - ball.radius));
            }
            frames++;
        }
        return {
            impactY: position.y,
            framesToImpact: frames,
            goingToIA: goingToIA,
        };
    }
}

