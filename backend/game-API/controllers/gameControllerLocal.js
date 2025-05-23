import { Pong } from '../game/Pong.js';

let game;

export async function initGame(req, rep) {
	const { player1, player2 } = req.body;
	game = new Pong({ name: player1 }, { name: player2 });

	return rep.code(200).send({ message: 'Game created' });
}

export async function HandleInput(req, rep) {
	const { player1, player2 } = req.body;

	if (game instanceof Pong) {
		if (player1 === "Up") game.player1.speed = -5;
		else if (player1 === "Down") game.player1.speed = 5;
		else if (player1 === "") game.player1.speed = 0;
		game.player1.move_player(game.top, game.bottom);
		
		if (player2 === "Up") game.player2.speed = -5;
		else if (player2 === "Down") game.player2.speed = 5;
		else if (player2 === "") game.player2.speed = 0;
		game.player2.move_player(game.top, game.bottom);
	
		if (game.gameOver) {
			if (game.player1.score === game.WIN_SCORE) {
				return rep.code(200).send({ message: `${game.player1.name} win game` });
			} else if (game.player2.score === game.WIN_SCORE) {
				return rep.code(200).send({ message: `${game.player2.name} win game` });
			}
		}
		return rep.code(200).send({
			message: "Update game",
			data: {
				player1: {
					y: game.player1.y
				},
				player2: {
					y: game.player2.y
				},
				ball: {
					x: game.ball.x,
					y: game.ball.y
				}
			}
		});
	};
	return rep.code(500);
}

export async function getState(req, rep) {
	if (game instanceof Pong) {
		game.step();
		if (game.gameOver) {
			if (game.player1.score === game.WIN_SCORE) {
				return rep.code(200).send({ message: `player1 win game` });
			} else if (game.player2.score === game.WIN_SCORE) {
				return rep.code(200).send({ message: `player2 win game` });
			}
		}
		return rep.code(200).send({
			message: "Update game",
			data: {
				player1: {
					y: game.player1.y,
					score: game.player1.score
				},
				player2: {
					y: game.player2.y,
					score: game.player2.score
				},
				ball: {
					x: game.ball.x,
					y: game.ball.y
				} 
			}
		});
	};
}