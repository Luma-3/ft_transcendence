import { GameObject } from "../core/GameObject.js";
import { Ball } from "./Ball.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Paddle } from "./Paddle.js";
import { Vector2 } from "../core/physics/Vector.js";
import { IOInterface } from "../utils/IOInterface.js";

export class Pong extends GameObject {
  private ball: Ball | null = null;
  private paddle1: Paddle | null = null;
  private paddle2: Paddle | null = null;

  constructor(ball: Ball, paddle1: Paddle, paddle2: Paddle) {
    super();
    this.ball = ball;
    this.paddle1 = paddle1;
    this.paddle2 = paddle2;
  }

  update() {
    this.checkBallGaol();
  }

  checkWin() {
    const players = SceneContext.get().players;
    for (const player of players) {
      if (player.score >= 11) {
        player.win = true;
        return (true);
      }
    }
    return false;
  }

  stopGame() {
    SceneContext.get().loopManager.stop();
    const payload = {
      action: 'end',
      data: {
        roomId: SceneContext.get().id,
        player: SceneContext.get().players.map(player => player.toJSON())
      }
    }
    IOInterface.broadcast(JSON.stringify(payload), SceneContext.get().players.map(player => player.user_id))
  }

  checkBallGaol() {
    if (!this.ball) return;
    const goal = this.ball.checkGoal();
    if (!goal) return; // No goal detected
    this.ball.enabled = false;
    if (goal === 'left') {
      SceneContext.get().players[1].addScore();
    } else if (goal === 'right') {
      SceneContext.get().players[0].addScore();
    }
    const payload = {
      action: 'score',
      data: {
        roomId: SceneContext.get().id,
        ball: this.ball.snapshot(),
        player: SceneContext.get().players.map(player => player.toJSON())
      }
    }
    IOInterface.broadcast(JSON.stringify(payload), SceneContext.get().players.map(player => player.user_id));
    if (this.checkWin() === true) {
      this.stopGame();
      return;
    }

    this.ball.resetBall(goal === 'left' ? this.paddle1 : this.paddle2);
    this.ball.enabled = true;
  }
}

export const game = () => {
  console.log("Game started");

  const ball = GameObject.instantiate(Ball);

  const paddle1 = GameObject.instantiate(Paddle, SceneContext.get().players[0].user_id, new Vector2(50, 250)); // Left paddle
  let paddle2: Paddle;
  if (SceneContext.get().gameType === "local" || SceneContext.get().gameType === "ai") {
    paddle2 = GameObject.instantiate(Paddle, 'other', new Vector2(750, 250)); // Right paddle for local game
  }
  else {
    paddle2 = GameObject.instantiate(Paddle, SceneContext.get().players[1].user_id, new Vector2(750, 250)); // Right paddle for online game
  }
  GameObject.instantiate(Pong, ball, paddle1, paddle2); // Instantiate the Pong game object

  SceneContext.get().inputManager.start(); // Start the input manager
  SceneContext.get().loopManager.start(); // Start the game loop
}
