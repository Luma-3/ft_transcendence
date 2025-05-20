import fs from 'fs';

class Ball {
  constructor(x, y, vx = 0, vy = 0, size = 1) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
  }

  toJSON() {
    return { x: this.x, y: this.y, vx: this.vx, vy: this.vy, size: this.size };
  }
}

class Player {
  constructor(name, width, height, x, y, score = 0) {
    this.name = name;
    this.score = score;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = 0;
  }

  toJSON() {
    return {
      name: this.name,
      score: this.score,
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      speed: this.speed
    };
  }
}

export class Pong {
  constructor(player1, player2, width, height) {
    this.sizeX = width;
    this.sizeY = height;

    const centerX = 0;
    const centerY = 0;

    this.player1 = new Player(player1, 10, 100, -width / 2 + 10, centerY);
    this.player2 = new Player(player2, 10, 100, width / 2 - 10, centerY);
    this.ball = new Ball(centerX, centerY, 1, 1);

    this.gameOver = false;
    this.WIN_SCORE = 11;
  }

  check_collision_player(player) {
    return (
      this.ball.x >= player.x &&
      this.ball.x <= player.x + player.width &&
      this.ball.y >= player.y - player.height / 2 &&
      this.ball.y <= player.y + player.height / 2
    );
  }

  mouv_ball() {
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    const top = this.sizeY / 2;
    const bottom = -this.sizeY / 2;

    if (this.ball.y >= top || this.ball.y <= bottom) {
      this.ball.vy *= -1;
    }

    if (this.check_collision_player(this.player1) ||
      this.check_collision_player(this.player2)) {
      this.ball.vx *= -1;
    }
  }

  reset_ball() {
    this.ball.x = 0;
    this.ball.y = 0;
  }

  mouv_player(player) {
    player.y += player.speed;

    const halfHeight = player.height / 2;
    const topLimit = this.sizeY / 2;
    const bottomLimit = -this.sizeY / 2;

    if (player.y + halfHeight > topLimit) {
      player.y = topLimit - halfHeight;
    }
    if (player.y - halfHeight < bottomLimit) {
      player.y = bottomLimit + halfHeight;
    }
  }

  start() {
    const rand = Math.floor(Math.random() * 4) + 1;
    if (rand === 1) this.ball.vy *= -1;
    else if (rand === 2) this.ball.vx *= -1;
    else if (rand === 3) {
      this.ball.vx *= -1;
      this.ball.vy *= -1;
    }
    const WIN_SCORE = 11;
  }

  step() {
    this.mouv_ball();

    const left = -this.sizeX / 2;
    const right = this.sizeX / 2;

    if (this.ball.x <= left) {
      this.player2.score++;
      this.ball.x = 0;
    }

    if (this.ball.x >= right) {
      this.player1.score++;
      this.ball.x = 0;
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
      sizeX: this.sizeX,
      sizeY: this.sizeY
    };
  }
}
