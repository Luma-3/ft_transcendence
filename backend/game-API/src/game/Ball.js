export class Ball {
  constructor(x = 0, y = 0, vector_x = 0, vector_y = 0, size = 20) {
	this.x = x;
	this.y = y;
	this.vector_x = vector_x;
	this.vector_y = vector_y;
	this.size = size;
	this.speed = 4;
  }

  check_collision_paddle(paddle, width) {
	if (paddle.x < width / 2) {
		return (
			this.x <= paddle.x + paddle.width &&
			this.x >= paddle.x &&
			this.y >= paddle.y - paddle.height / 2 &&
			this.y <= paddle.y + paddle.height / 2
		);
	} else {
		return (
			this.x >= paddle.x - paddle.width &&
			this.x <= paddle.x &&
			this.y >= paddle.y - paddle.height / 2 &&
			this.y <= paddle.y + paddle.height / 2
		);
	}
  }

  move_ball(top, bottom, paddle1, paddle2, width = 0) {
	this.x += this.vector_x * this.speed;
	this.y += this.vector_y * this.speed;

	if (this.y + this.size / 2 <= top || this.y - this.size / 2 >= bottom) {
		this.vector_y *= -1;
	}

	if (this.check_collision_paddle(paddle1, width) ||
	  this.check_collision_paddle(paddle2, width)) {
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

  reset_ball(centerX = 400, centerY = 300) {
	this.x = centerX;
	this.y = centerY;
  }

  toJSON() {
	return {
	  x: this.x,
	  y: this.y,
	};
  }
}
