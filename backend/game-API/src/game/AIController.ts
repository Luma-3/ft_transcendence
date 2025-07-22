import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Vector2 } from "../core/physics/Vector.js";

export class AIController {
    private paddle: Paddle;
    private ball: Ball;
    private fieldWidth: number;
    private fieldHeight: number;
    private dt: number;
    private paddleid: string;

    constructor(paddle: Paddle, ball: Ball, fieldHeight = 600, fieldWidth = 800, dt = 1 / 60) {
        this.paddle = paddle;
        this.ball = ball;
        this.fieldHeight = fieldHeight;
        this.fieldWidth = fieldWidth;
        this.dt = dt;
        this.paddleid = paddle.Paddleid;
    }

    update() {
        if (!this.ball.enabled || this.ball.Ballvelocity.magnitude() === 0)
            return;

        const lookaheadTime = 0.5;
        const projectedPos = this.ball.position.add(this.ball.Ballvelocity.scale(lookaheadTime));

        if (projectedPos.x < 0) {
            projectedPos.x = 0;
        }

        if (projectedPos.x > this.fieldWidth) {
            projectedPos.x = this.fieldWidth;
        }

        const predictedState = {
            position: projectedPos,
            velocity: this.ball.Ballvelocity.clone(),
            radius: this.ball.radius,
        };

        const { impactY, goingToIA } = this.predictBallImpact(
            predictedState,
            this.paddle.position.x
        );

        const move = this.computePaddleMovement(impactY, goingToIA);
        SceneContext.get().inputManager.set(this.paddleid, new Vector2(0, move));
    }

    computePaddleMovement(predictedY: number, goingToIA: boolean): number {
        const currentY = this.paddle.position.y;
        const paddleHalf = this.paddle.scale.y / 2;

        if (!goingToIA) {
            const rand = Math.random();
            if (rand < 0.33) return 1;
            if (rand < 0.66) return -1;
            return 0;
        }
        if (predictedY > currentY + paddleHalf)
            return -1;
        else if (predictedY < currentY - paddleHalf)
            return 1;
        else
            return 0;
    }

    predictBallImpact(
        ball: { position: Vector2; velocity: Vector2; radius: number },
        paddleX: number
    ): { impactY: number; goingToIA: boolean } {
        let position = ball.position.clone();
        let velocity = ball.velocity.clone();
        const goingToIA = velocity.x < 0;

        while (
            (velocity.x > 0 && position.x < paddleX) ||
            (velocity.x < 0 && position.x > paddleX)
        ) {
            position = position.add(velocity.scale(this.dt));

            if (position.y - ball.radius < 0 || position.y + ball.radius > this.fieldHeight) {
                velocity.y = -velocity.y;
                position.y = Math.max(ball.radius, Math.min(position.y, this.fieldHeight - ball.radius));
            }
        }

        return {
            impactY: position.y,
            goingToIA: goingToIA
        };
    }
}
