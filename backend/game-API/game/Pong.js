
class Ball {
  constructor(x, y, vector_x = 0, vector_y = 0, size = 1) {
    this.x = x;
    this.y = y;
    this.vector_x = vector_x;
    this.vector_y = vector_y;
    this.size = size;
  }

  check_collision_player(player) {
    return (
      this.ball.x >= player.x &&
      this.ball.x <= player.x + player.width &&
      this.ball.y >= player.y - player.height / 2 &&
      this.ball.y <= player.y + player.height / 2
    );
  }

  move_ball(top, bottom, player1, player2) {
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    if (this.ball.y >= top || this.ball.y <= bottom) {
      this.ball.vy *= -1;
    }

    if (this.check_collision_player(player1) ||
      this.check_collision_player(player2)) {
      this.ball.vx *= -1;
    }
  }

  set_vectors_ball(rand) {
    switch (rand) {
        case 1:
            this.ball.vy *= -1;            
            break;
        case 2:
            this.ball.vx *= -1;
            break;
        case 3:
            this.ball.vx *= -1;
            this.ball.vy *= -1;
            break;  
        default:
            break;
    }
  }

  reset_ball() {
    this.ball.x = 0;
    this.ball.y = 0;
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
  constructor({ uid = null, name = null, width = 10, height = 100, x = 0, y = 0 } = {}) {
    if (uid !== null) this.uid = uid;
    if (name !== null) this.name = name;

    this.score = 0;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.halfHeight = this.height / 2;
  }

  move_player(top, bottom) {
    this.player.y += this.player.speed;

    if (this.player.y + this.halfHeight > top) {
      this.player.y = top - halfHeight;
    } else if (this.player.y - this.halfHeight < bottom) {
      this.player.y = bottom + halfHeight;
    }
  }

  toJSON() {
    return {
      // score: this.score,
      // width: this.width,
      // height: this.height,
      // x: this.x,
      y: this.y,
    };
  }
}

export class Pong {
  constructor({
    sizeX = 800,
    sizeY = 600,
    player1 = {},
    player2 = {}
  } = {}) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    const centerX = 0;
    const centerY = 0;

    this.top = this.sizeY / 2;
    this.bottom = -this.sizeY / 2;
    this.left = -this.sizeX / 2;
    this.right = this.sizeX / 2;

    this.player1 = new Player({
      uid: player1.uid ?? null,
      name: player1.name ?? null,
      width: player1.width ?? 10,
      height: player1.height ?? 100,
      x: this.left + 10,
      y: centerY
    });

    this.player2 = new Player({
      uid: player2.uid ?? null,
      name: player2.name ?? null,
      width: player2.width ?? 10,
      height: player2.height ?? 100,
      x: this.right - 10,
      y: centerY
    });

    this.ball = new Ball(centerX, centerY, 1, 1);

    this.gameOver = false;
    this.WIN_SCORE = 11;
  }

  start() {
    const rand = Math.floor(Math.random() * 4) + 1;
    this.ball.set_vectors_ball(rand);
  }

  step() {
    this.move_ball(this.top, this.bottom, this.player1, this.player2);

    if (this.ball.x <= this.left) {
      this.player2.score++;
      this.ball.reset_ball();
    } else if (this.ball.x >= this.right) {
      this.player1.score++;
      this.ball.reset_ball();
    }

    if (this.player1.score >= this.WIN_SCORE || this.player2.score >= this.WIN_SCORE) {
      const winner =
        this.player1.score >= this.WIN_SCORE
          ? this.player1.name
          : this.player2.name;
      console.log(`${winner} wins the game!`);
      this.gameOver = true;
    }

    const jsonData = JSON.stringify(this, null, 2);
    return jsonData
  }

  toJSON() {
    return {
      player1: this.player1,
      player2: this.player2,
      ball: this.ball,
    };
  }
}
