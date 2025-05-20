import Pong from '../game/Pong.js'

export async function getGame(req, rep) {
	console.log(req);
	const {user1, user2} = req.body;

	const game = new Pong(user1, user2, 800, 600);

	const wss = new WebSocketServer();
	pong.start();

	wss.on("connection", (ws) => {
		console.log("Client connecté");

		ws.on("message", (message) => {
			try {
				const data = JSON.parse(message);
			} catch (e) {
				console.error("Message invalide reçu :", message);
			}
		});

		const intervalId = setInterval(() => {
			pong.step();
			ws.send(JSON.stringify(pong));
			if (pong.gameOver) clearInterval(intervalId);
		}, 50);

		ws.on("close", () => {
			console.log("Client déconnecté");
			clearInterval(intervalId);
		});
	});

	return rep.code(200).send({message: 'Game Ready', data: {} });
}
