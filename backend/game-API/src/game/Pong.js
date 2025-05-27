import { v4 as uuidv4 } from 'uuid';
import { redisPub } from '../config/redis.js';

class Ball {
  constructor(x = 0, y = 0, vector_x = 0, vector_y = 0, size = 1) {
    this.x = x;
    this.y = y;
    this.vector_x = vector_x;
    this.vector_y = vector_y;
    this.size = size;
    this.speed = 4;
  }

  check_collision_player(player) {
    return (
      this.x >= player.x &&
      this.x <= player.x + player.width &&
      this.y >= player.y - player.height / 2 &&
      this.y <= player.y + player.height / 2
    );
  }

  move_ball(top, bottom, player1, player2) {
    this.x += this.vector_x * this.speed;
    this.y += this.vector_y * this.speed;

    if (this.y >= top || this.y <= bottom) {
      this.vector_y *= -1;
    }

    if (this.check_collision_player(player1) ||
      this.check_collision_player(player2)) {
      this.vector_x *= -1;
    }
  }

  set_vectors_ball(rand) {
    switch (rand) {
      case 1:
        this.vector_y *= -1;
        break;
      case 2:
        this.vector_x *= -1;
        break;
      case 3:
        this.vector_x *= -1;
        this.vector_y *= -1;
        break;
      default:
        break;
    }
  }

  reset_ball() {
    this.x = 0;
    this.y = 0;
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      // size: this.size
    };
  }
}

class Player {
  constructor({ uid, x = 0, y = 0 } = {}) {
    this.uid = uid;

    this.score = 0;
    this.width = 10;
    this.height = 100;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.halfHeight = this.height / 2;
  }

  move_player(top, bottom) {
    this.y += this.speed;

    if (this.y + this.halfHeight > top) {
      this.y = top - this.halfHeight;
    } else if (this.y - this.halfHeight < bottom) {
      this.y = bottom + this.halfHeight;
    }
  }

  add_score() {
    this.score++;
  }

  toJSON() {
    return {
      score: this.score,
      // width: this.width,
      // height: this.height,
      // x: this.x,
      y: this.y,
    };
  }
}

export class Pong {
  constructor({ sizeX = 800, sizeY = 600, player1_uid, player2_uid } = {}) {
    this.id = uuidv4();

    this.sizeX = sizeX;
    this.sizeY = sizeY;

    const centerX = 0;
    const centerY = 0;

    this.top = this.sizeY / 2;
    this.bottom = -this.sizeY / 2;
    this.left = -this.sizeX / 2;
    this.right = this.sizeX / 2;

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
