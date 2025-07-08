import { GameObject } from "../core/GameObject.js";
import { Ball } from "./Ball.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Paddle } from "./Paddle.js";
import { Vector2 } from "../core/physics/Vector.js";
import { IOInterface } from "../utils/IOInterface.js";

export class Pong extends GameObject {
  private ball: Ball;
  private paddleLeft: Paddle;
  private paddleRight: Paddle;

  private readonly size: Vector2 = new Vector2(800, 600);

  private readonly maxWin: number = 5;

  constructor() {
    super();
    this.ball = GameObject.instantiate(Ball, this.size);

    const playersId = [...SceneContext.get().players.keys()];

    this.paddleLeft = GameObject.instantiate(Paddle, playersId[0], new Vector2(0 + 50, this.size.y / 2));
    this.paddleLeft.enabled = false;
    this.paddleRight = GameObject.instantiate(Paddle, playersId[1], new Vector2(this.size.x - 50, this.size.y / 2));
    this.paddleRight.enabled = false;
    this.start();
  }

  start() {
    setTimeout(() => {
      this.ball.resetBall(this.size);
      this.ball.enabled = true;
      this.paddleLeft.enabled = true;
      this.paddleRight.enabled = true;
    }, 2000);
  }

  update() {
    this.checkBallGaol();
  }

  checkWin(id: string) {
    const players = SceneContext.get().players;
    const player = players.get(id);
    return (player.score >= this.maxWin);
  }

  stopGame() {
    SceneContext.get().loopManager.stop();
    const payload = {
      action: 'end',
      data: {
        roomId: SceneContext.get().id,
        player: Array.from(SceneContext.get().players.values()).map(player => player.toJSON())
      }
    }
    IOInterface.broadcast(
      JSON.stringify(payload),
      [...SceneContext.get().players.keys()]
    );
  }

  checkBallGaol() {
    if (!this.ball) return;
    const goal = this.ball.checkGoal(this.size.x);
    if (!goal) return; // No goal detected
    this.ball.enabled = false;

    let winner: string;
    if (goal === 'left') {
      winner = this.paddleRight.id;
    }
    else if (goal === 'right') {
      winner = this.paddleLeft.id;
    }

    SceneContext.get().players.get(winner).score++;

    const payload = {
      action: 'score',
      data: {
        roomId: SceneContext.get().id,
        ball: this.ball.snapshot(),
        player: Array.from(SceneContext.get().players.values()).map(player => player.toJSON())
      }
    }
    IOInterface.broadcast(
      JSON.stringify(payload),
      [...SceneContext.get().players.keys()]
    );

    if (this.checkWin(winner) === true) {
      this.stopGame();
      return;
    }

    this.ball.resetBall(this.size, this.paddleLeft.id === winner ? this.paddleRight : this.paddleLeft);
    this.ball.enabled = true;
  }

  snapshot() {
    return {
      type: 'pong',
      size: this.size,
    };
  }

}

export const game = () => {
  GameObject.instantiate(Pong);
  SceneContext.get().inputManager.start();
  SceneContext.get().loopManager.start();
}
