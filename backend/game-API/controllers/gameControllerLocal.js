import { Pong } from '../game/Pong.js';

let game;

export async function initGame(req, rep) {
	const { player1Name, player2Name } = req.body;
	game = new Pong({ name: player1Name }, { name: player2Name });

	return rep.code(200).send({ message: 'Game created' });
}

export async function HandleInput(req, rep) {
	const { player1Action, player2Action } = req.body;

	if (game instanceof Pong) {
		if (player1Action === "Up") game.player1.speed = -5;
		else if (player1Action === "Down") game.player1.speed = 5;
		else if (player1Action === "") game.player1.speed = 0;
		
		if (player2Action === "Up") game.player2.speed = -5;
		else if (player2Action === "Down") game.player2.speed = 5;
		else if (player2Action === "") game.player2.speed = 0;
	}

	return rep.code(200);
}

export async function getState(req, rep) {
	if (game instanceof Pong) {
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
}