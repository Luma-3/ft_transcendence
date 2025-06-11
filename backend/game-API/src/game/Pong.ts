import { redisPub } from '../utils/redis.js';

import { Ball } from './Ball.js'
import { Paddle } from './Paddle.js'

export class Pong {
  sizeX: number;
  sizeY: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  paddle1: Paddle;
  paddle2: Paddle;
  ball: Ball;
  gameIsStart: boolean;
  WIN_SCORE: number;
  isAgainstBot: boolean;
  interval: NodeJS.Timeout | undefined;
  centerX: number;
  centerY: number;

  constructor(player1_uid: string, player2_uid?: string, sizeX: number = 800, sizeY: number = 600) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.centerX = sizeX / 2;
    this.centerY = sizeY / 2;

    this.top    = 0;
    this.bottom = this.sizeY;
    this.left   = 0;
    this.right  = this.sizeX;

    this.paddle1 = new Paddle(player1_uid, this.left + 10, this.centerY);
    this.paddle2 = new Paddle(player2_uid, this.right - 10, this.centerY);

    this.ball = new Ball(this.centerX, this.centerY, 1, 1);

    this.gameIsStart = false;
    this.WIN_SCORE = 11;

    this.isAgainstBot = false; // This can be used to determine if the game is against a bot or not

    this.interval = undefined; // Initialize interval to undefined
  }

  start() {
    const rand = Math.floor(Math.random() * 4) + 1;
    this.ball.set_vectors_ball(rand);
    this.gameIsStart = true;
    this.interval = setInterval(this.update, 1000 / 30, this);
  }

  stop() {
    this.gameIsStart = false;
    clearInterval(this.interval);
    this.interval = undefined;
  }

  check_win() {
    if (this.paddle1.score >= this.WIN_SCORE || this.paddle2.score >= this.WIN_SCORE) {
      const winner =
        this.paddle1.score >= this.WIN_SCORE
          ? this.paddle1.uid
          : this.paddle2.uid;
      const loser =
        this.paddle1.score < this.WIN_SCORE
          ? this.paddle1.uid
          : this.paddle2.uid;
        
      winner !== "0" ? console.log(`${winner} wins the game!`) : console.log(`bot wins the game!`);
      console.log(`${loser} loses the game!`);

      redisPub.publish('ws.game.out', JSON
        .stringify({
          clientId: winner,
          payload: {
            action: 'win',
          }
        })
      );

      redisPub.publish('ws.game.out', JSON
        .stringify({
          clientId: loser,
          payload: {
            action: 'lose',
          }
        })
      );

      this.stop();
    }
  }

  update(game: Pong) {
    game.ball.move_ball(game.top, game.bottom, game.paddle1, game.paddle2, this.sizeX);
    if (game.isAgainstBot) {
      game.paddle2.y = game.ball.y;
    }

    if (game.ball.x <= game.left) {
      game.paddle2.add_score();
      game.check_win();
      game.ball.reset_ball(this.centerX, this.centerY);
    } else if (game.ball.x >= game.right) {
      game.paddle1.add_score();
      game.check_win();
      game.ball.reset_ball(this.centerX, this.centerY);
    }

    redisPub.publish('ws.game.out', JSON
      .stringify({
        clientId: game.paddle1.uid,
        payload: {
          action: 'update',
          gameData: game.toJSON(),
        }
      })
    );

    if (game.paddle2.uid !== "0") { // If the second paddle is not a bot
      redisPub.publish('ws.game.out', JSON
        .stringify({
          clientId: game.paddle2.uid,
          payload: {
            action: 'update',
            gameData: game.toJSON(),
          }
        })
      );
    }
  }

  movePaddle(uid: string, direction: string) {
    let paddle;
    
    if ( uid !== "" && uid === this.paddle1.uid ) {
      paddle = this.paddle1;
    } else if ( !this.isAgainstBot ) {
      paddle = this.paddle2;
    }
    if (!paddle) {
      console.error('Paddle not found for uid:', uid);
      return;
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
