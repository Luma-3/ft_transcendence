import { GameObject } from "../core/GameObject.js";
import { Ball } from "./Ball.js";
import { SceneContext } from "../core/runtime/SceneContext.js";
import { Paddle } from "./Paddle.js";
import { Vector2 } from "../core/physics/Vector.js";
import { IOInterface } from "../utils/IOInterface.js";
import { AIController } from "./AIController.js"

import { roomManagerInstance } from "../core/runtime/RoomManager.js";

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

    if (SceneContext.get().gameType === "ai") {
      console.log('XXXXXXXXXX');
      const ctx = SceneContext.get();
      const aiController = new AIController(this.paddleLeft, this.ball);
      ctx.loopManager.addIAObject(aiController);
    }
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

    roomManagerInstance.deleteRoom(SceneContext.get().id);
  }

  checkBallGaol() {
    if (!this.ball) return;
    const goal = this.ball.checkGoal(this.size.x);
    if (!goal) return; // No goal detected
    this.ball.enabled = false;

    let winner: string;
    if (goal === 'left') {
      winner = this.paddleRight.Paddleid;
    }
    else if (goal === 'right') {
      winner = this.paddleLeft.Paddleid;
    }

    const WinnerPlayer = SceneContext.get().players.get(winner);
    if (!winner) {
      console.warn("Winner not found in players map");
      return;
    }
    WinnerPlayer.addScore();

    const payload = {
      action: 'score',
      data: {
        roomId: SceneContext.get().id,
        ball: this.ball.snapshot(),
        players: Array.from(SceneContext.get().players.values()).map(player => player.toJSON())
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

    this.ball.resetBall(this.size, this.paddleLeft.Paddleid === winner ? this.paddleRight : this.paddleLeft);
    setTimeout(() => {
      this.ball.enabled = true;
    }, 1000);
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


// J'ai rajoute l'intantiation de mon AIcontroller qui prend le paddle2 et la ball pour fonctionner. 
// ensuite j'ajoute ce controller Ia a la loop Ia qui est lance dans loopManager. 
