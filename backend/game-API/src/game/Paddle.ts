export class Paddle {
	uid: string;
	score: number;
	width: number;
	height: number;
	x: number;
	y: number;
	speed: number;
	halfHeight: number;

  constructor({ uid = "0", x = 0, y = 0 } = {}) {
	this.uid = uid;

	this.score = 0;
	this.width = 10;
	this.height = 100;
	this.x = x;
	this.y = y;
	this.speed = 0;
	this.halfHeight = this.height / 2;
  }

  move_paddle(top: number, bottom: number) {
	this.y += this.speed;

	if (this.y + this.halfHeight < top) {
	  this.y = top + this.halfHeight;
	} else if (this.y - this.halfHeight > bottom) {
	  this.y = bottom - this.halfHeight;
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
	  y: this.y,
	};
  }
}