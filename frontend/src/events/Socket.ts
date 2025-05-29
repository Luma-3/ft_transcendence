import { renderGame } from "../components/renderPage";
import { alertPublic } from "../components/ui/alert/alertPublic";
import { drawGame } from "../game/gameDraw";
import { gameInfo } from "../game/gameCreation";
import { DisplayGameWinLose } from "../game/gameWin";

export let socket: WebSocket | null = null;


export function socketConnection() {
	socket = new WebSocket('/api/ws');

	socket.addEventListener("open", () => {
		console.log("WebSocket connection established.");
	});
	
	socket.addEventListener("message", (e) => {
		const message = JSON.parse(e.data).payload;
		console.log("Received message from WebSocket:", message);
		if (message.action === 'gameReady') {
			renderGame(gameInfo)
		} else if (message.action === 'update') {
			drawGame(message.gameData);
		} else if (message.action === 'win') {
			DisplayGameWinLose(true)
		} else if (message.action === 'lose') {
			DisplayGameWinLose(false)
		}
	});

	socket.addEventListener('error', () => {
		alertPublic("WebSocket connection error. You will be redirected to the home page.", "error");
		setTimeout(() => { window.location.href = "/"; }, 2000);
	});

	socket.addEventListener('close', (event) => {
		if (event.wasClean) {

			console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
		
		} else {
			alertPublic("WebSocket connection closed unexpectedly. You will be redirected to the home page.", "error");
			setTimeout(() => { window.location.href = "/"; }, 2000);
		}
	});

}
