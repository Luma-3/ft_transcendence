import { redisPub } from '../config/redis.js';

import { Ball } from './Ball.js'
import { Paddle } from './Paddle.js'

export class Pong {
  constructor({ player1_uid, player2_uid, sizeX = 800, sizeY = 600 } = {}) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    const centerX = 0;
    const centerY = 0;

    this.top    = this.sizeY / 2;
    this.bottom = -this.sizeY / 2;
    this.right  = this.sizeX / 2;
    this.left   = -this.sizeX / 2;

    this.paddle1 = new Paddle({ uid: player1_uid, x: this.left + 10, y: centerY });
    this.paddle2 = new Paddle({ uid: player2_uid, x: this.right - 10, y: centerY });

    this.ball = new Ball(centerX, centerY, 1, 1);

    this.gameIsStart = false;
    this.WIN_SCORE = 11;

    this.interval = 0;
  }

  start() {
    const rand = Math.floor(Math.random() * 4) + 1;
    this.ball.set_vectors_ball(rand);
    this.gameIsStart = true;
    this.interval = setInterval(this.update.bind(this), 1000 / 30);
  }

  stop() {
    this.gameIsStart = false;
    clearInterval(this.interval);
    this.interval = 0;
  }

  check_win() {
    if (this.paddle1.score >= this.WIN_SCORE || this.paddle2.score >= this.WIN_SCORE) {
      const winner =
        this.paddle1.score >= this.WIN_SCORE
          ? this.paddle1.name
          : this.paddle2.name;
      console.log(`${winner} wins the game!`);
      this.stop();
    }
  }

  update() {
    this.ball.move_ball(this.top, this.bottom, this.paddle1, this.paddle2);
    this.paddle2.y = this.ball.y;

    if (this.ball.x <= this.left) {
      this.paddle2.add_score();
      this.check_win();
      this.ball.reset_ball();
    } else if (this.ball.x >= this.right) {
      this.paddle1.add_score();
      this.check_win();
      this.ball.reset_ball();
    }

    redisPub.publish('ws.game.out', JSON
      .stringify({
        clientId: this.paddle1.uid,
        payload: {
          action: 'update',
          gameData: this.toJSON(),
        }
      }));
  }

  movePaddle(uid, direction) {
    let paddle;
    
    if (uid === this.paddle1.uid) {
      paddle = this.paddle1;
    } else if (uid === this.paddle2.uid) {
      paddle = this.paddle2;
    }

    switch (direction) {
      case 'up':
        paddle.speed = -5;
        break;
      case 'down':
        paddle.speed = 5;
        break;
      default:
        paddle.speed = 0;
        break;
    }
    paddle.move_paddle(this.top, this.bottom);
  }

  toJSON() {
    return {
      paddle1: this.paddle1,
      paddle2: this.paddle2,
      ball: this.ball,
    };
  }
}
