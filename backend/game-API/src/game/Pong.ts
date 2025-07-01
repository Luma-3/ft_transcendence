import { GameObject } from "../core/GameObject.js";
import { Ball } from "./Ball.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Paddle } from "./Paddle.js";
import { Vector2 } from "../core/physics/Vector.js";
import { IOInterface } from "../utils/IOInterface.js";

export class Pong extends GameObject {
  private ball: Ball | null = null;


  constructor(ball: Ball) {
    super();
    this.ball = ball;
  }

  update() {
    this.checkBallGaol();
  }

  checkBallGaol() {
    if (!this.ball) return;
    const goal = this.ball.checkGoal();
    if (!goal) return; // No goal detected
    this.ball.enabled = false;
    console.log(`Goal detected: ${goal}`);
    if (goal === 'left') {
      SceneContext.get().players[0].addScore();
    } else if (goal === 'right') {
      SceneContext.get().players[1].addScore();
    }
    const payload = {
      action: 'score',
      data: {
        roomId: SceneContext.get().id,
        ballPosition: this.ball.position,
        playerScores: SceneContext.get().players.map(player => ({
          user_id: player.user_id,
          score: player.score
        }))
      }
    }
    IOInterface.broadcast(JSON.stringify(payload), SceneContext.get().players.map(player => player.user_id));
    this.ball.startPosition(new Vector2(400, 300));
    this.ball.enabled = true;
  }
}

export const game = () => {
  console.log("Game started");

  const ball = GameObject.instantiate(Ball);
  GameObject.instantiate(Pong, ball); // Instantiate the Pong game object
  GameObject.instantiate(Paddle, SceneContext.get().players[0].user_id, new Vector2(50, 250)); // Left paddle
  if (SceneContext.get().gameType === "local" || SceneContext.get().gameType === "ai") {
    GameObject.instantiate(Paddle, 'other', new Vector2(750, 250)); // Right paddle for local game
  }
  else {
    GameObject.instantiate(Paddle, SceneContext.get().players[1].user_id, new Vector2(750, 250)); // Right paddle for online game
  }
  SceneContext.get().inputManager.start(); // Start the input manager
  SceneContext.get().loopManager.start(); // Start the game loop
}
