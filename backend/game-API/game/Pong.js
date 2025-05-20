
class Ball {
    constructor(x, y, vx = 0, vy = 0) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
    }
}

class Player {
    constructor(name, width, height, x, y, score = 0) {
        this.name = name
        this.score = score;
        this.x = x
        this.y = y
        this.speed = 0;
    }
}

export class Pong {
    constructor() {
        this.player1 = Player()
        this.player2 = Player()
        this.ball = Ball()
    }

    start() {}
}