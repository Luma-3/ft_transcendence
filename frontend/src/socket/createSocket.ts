import { alertPublic } from "../components/ui/alert/alertPublic";
import { handleGameSocketMessage } from "../game/gameSocket";
import { drawGame } from "../game/gameDraw";
import { renderErrorPage } from "../components/renderPage";

export let socket: WebSocket | null = null;

export function createSocketConnection() {
	socket = new WebSocket('/api/ws');

	socket.addEventListener("open", () => {
		console.log("WebSocket connection established successfully.");
	});
	
	socket.addEventListener("message", (e) => {
		const message = JSON.parse(e.data).payload;

		if (message.action === 'move') {
			drawGame(message.gameData);
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
