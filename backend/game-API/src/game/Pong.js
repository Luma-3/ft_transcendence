import { v4 as uuidv4 } from 'uuid';
import { redisPub } from '../config/redis.js';

import { Ball } from './Ball.js'
import { Player } from './Player.js'

export class Pong {
  constructor({ player1_uid, player2_uid, sizeX = 800, sizeY = 600 } = {}) {
    this.id = uuidv4();

    this.sizeX = sizeX;
    this.sizeY = sizeY;

    const centerX = 0;
    const centerY = 0;

    this.top    = this.sizeY / 2;
    this.bottom = -this.sizeY / 2;
    this.right  = this.sizeX / 2;
    this.left   = -this.sizeX / 2;

    this.player1 = new Player({ uid: player1_uid, x: this.left + 10, y: centerY });

    this.player2 = new Player({ uid: player2_uid, x: this.right - 10, y: centerY });

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

  check_win() {
    if (this.player1.score >= this.WIN_SCORE || this.player2.score >= this.WIN_SCORE) {
      const winner =
        this.player1.score >= this.WIN_SCORE
          ? this.player1.name
          : this.player2.name;
      console.log(`${winner} wins the game!`);
      clearInterval(this.interval);
    }
  }

  update() {
    this.ball.move_ball(this.top, this.bottom, this.player1, this.player2);
    this.player2.y = this.ball.y;

    if (this.ball.x <= this.left) {
      this.player2.add_score();
      this.check_win();
      this.ball.reset_ball();
    } else if (this.ball.x >= this.right) {
      this.player1.add_score();
      this.check_win();
      this.ball.reset_ball();
    }

    redisPub.publish('ws.this.out', JSON
      .stringify({
        clientId: this.player1.uid,
        payload: {
          action: 'move',
          gameData: this.toJSON(),
        }
      }));
  }

  movePlayer(uid, direction) {
    let player;
    
    if (uid === this.player1.uid) {
      player = this.player1;
    } else if (uid === this.player2.uid) {
      player = this.player2;
    }

    switch (direction) {
      case 'up':
        player.speed = -5;
        break;
      case 'down':
        player.speed = 5;
        break;
      default:
        player.speed = 0;
        break;
    }
    player.move_player(this.top, this.bottom);
  }

  toJSON() {
    return {
      player1: this.player1,
      player2: this.player2,
      ball: this.ball,
    };
  }
}
