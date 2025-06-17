import { clearInterval, setInterval } from 'node:timers';
import { redisPub } from '../utils/redis.js';

import { Ball } from './Ball.js'
import { Paddle } from './Paddle.js'

export const FRAMERATE: number = 1000 / 30;

/**
 * Pong : Représente une partie de Pong entre deux joueurs.
 * 
 * Gère les paddles, la balle, le score, et les interactions du jeu.
 * Permet de démarrer, arrêter et mettre à jour le jeu en cours.
 * 
 * @remarks
 * - Supporte les parties contre un bot.
 * - Gère les mouvements des paddles et la logique de collision avec la balle.
 * - Publie les mises à jour du jeu via Redis pour les clients connectés.
 */
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
  interval: NodeJS.Timeout | number | undefined;
  centerX: number;
  centerY: number;
  status: "stop" | "playing" | "pause" | "goal" = "stop";

  TPS: number;
  time: number;

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

    this.isAgainstBot = false; 

    this.interval = undefined;

    this.TPS = 0;
    this.time = 0;
  }

  /**
   * Démarre la partie Pong en initialisant la balle et en lançant l'intervalle de mise à jour.
   * La balle est positionnée avec des vecteurs aléatoires pour commencer le jeu.
   */
  start() {
    const rand = Math.floor(Math.random() * 4) + 1;
    this.ball.set_vectors_ball(rand);
    this.gameIsStart = true;
    this.interval = setInterval(() => this.update(), FRAMERATE);
  }

  /**
   * Arrête la partie Pong en mettant à jour l'état du jeu et en nettoyant l'intervalle.
   * Publie les résultats de la partie si un joueur a gagné.
   */
  stop() {
    this.gameIsStart = false;
    clearInterval(this.interval);
    this.interval = undefined;
  }

  pause() {
    this.status = "pause";
    clearInterval(this.interval);
    this.interval = undefined;
  }

  resume() {
    if (!this.interval) {
      this.status = "playing";
      this.interval = setInterval(() => this.update(), FRAMERATE);
    }
  }

  broadcast(action: string, payload: any) {
    const now = Date.now();
    redisPub.publish('ws.game.out', JSON
      .stringify({
        clientId: this.paddle1.uid,
        payload: {
          action: action,
          gameData: payload,
          serverTime: now
        }
      })
    );

    if (this.paddle2.uid !== "0") {
      redisPub.publish('ws.game.out', JSON
        .stringify({
          clientId: this.paddle2.uid,
          payload: {
            action: action,
            gameData: payload,
            serverTime: now
          }
        })
      );
    }
  }

  /**
   * Vérifie si un joueur a atteint le score de victoire.
   * Si oui, publie les résultats du jeu et arrête la partie.
   */
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

  /**
   * Met à jour l'état du jeu en déplaçant la balle et les paddles.
   * Gère les collisions, les scores et publie les mises à jour via Redis.
   * 
   * @param game - Instance de la partie Pong en cours.
   */
  async update() {

    this.ball.move_ball(this.top, this.bottom, this.paddle1, this.paddle2, this.sizeX);
    if (this.isAgainstBot) {
      this.paddle2.y = this.ball.y;
    }

    if (this.ball.x <= this.left) {
      this.paddle2.add_score();
      this.pause();
      this.status = "goal";
    } else if (this.ball.x >= this.right) {
      this.paddle1.add_score();
      this.pause();
      this.status = "goal";
    }

    if (this.status === "goal") {
      this.check_win();
      this.broadcast('goal', this.toJSON());
      this.ball.reset_ball(this.centerX, this.centerY);
      return;
    }

    if (performance.now() - this.time < 1000) {
      this.TPS++;
    } else {
      console.log("TPS:", this.TPS);
      this.TPS = 0;
      this.time = performance.now();
    }

    this.broadcast('update', this.toJSON());
  }

  /**
   * Déplace le paddle du joueur en fonction de la direction spécifiée.
   * 
   * @param uid - Identifiant unique du joueur.
   * @param direction - Direction du mouvement ('up', 'down' ou 'stop' pour arrêter).
   */
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
        paddle.speed = -142;
        break;
      case 'down':
        paddle.speed = 142;
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
