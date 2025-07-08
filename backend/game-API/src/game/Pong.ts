import { GameObject } from "../core/GameObject.js";
import { Ball } from "./Ball.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Paddle } from "./Paddle.js";
import { Vector2 } from "../core/physics/Vector.js";
import { IOInterface } from "../utils/IOInterface.js";

export class Pong extends GameObject {
  private ball: Ball;
  private paddleLeft: Paddle
  private paddleRight: Paddle

  constructor() {
    super();
    this.ball = GameObject.instantiate(Ball);

    const playersId = [...SceneContext.get().players.keys()];

    this.paddleLeft = GameObject.instantiate(Paddle, playersId[0], new Vector2(50, 250));
    this.paddleRight = GameObject.instantiate(Paddle, playersId[1], new Vector2(750, 250));
  }

  update() {
    this.checkBallGaol();
  }

  checkWin(id: string) {
    const players = SceneContext.get().players;
    const player = players.get(id);
    return (player.score >= 5);
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
    const goal = this.ball.checkGoal();
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

    this.ball.resetBall(goal === 'left' ? this.paddleLeft : this.paddleRight);
    this.ball.enabled = true;
  }

}

export const game = () => {
  // const ball = GameObject.instantiate(Ball);

  // const paddle1 = GameObject.instantiate(Paddle, SceneContext.get().players[1].id, new Vector2(50, 250)); // Left paddle
  // let paddle2: Paddle;
  // if (SceneContext.get().gameType === "local" || SceneContext.get().gameType === "ai") {
  //   paddle2 = GameObject.instantiate(Paddle, 'other', new Vector2(750, 250)); // Right paddle for local game
  // }
  // else {
  //   paddle2 = GameObject.instantiate(Paddle, SceneContext.get().players[0].id, new Vector2(750, 250)); // Right paddle for online game
  // }
  const pong = GameObject.instantiate(Pong); // Instantiate the Pong game object
  pong.snapshotEnabled = false; // Disable snapshot for the Pong game object

  SceneContext.get().inputManager.start(); // Start the input manager
  SceneContext.get().loopManager.start(); // Start the game loop
}
