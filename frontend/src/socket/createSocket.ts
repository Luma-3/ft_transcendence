import { alertPublic } from "../components/ui/alert/alertPublic";
import { handleGameSocketMessage } from "../game/gameSocket";

export let socket: WebSocket | null = null;

export function createSocketConnection() {
	socket = new WebSocket('127.0.0.1:5173/api/ws');
	
	socket.addEventListener("open", () => {
		console.log("WebSocket connection established successfully.");
	});
	socket.addEventListener("message", (e) => {
		const data = JSON.parse(e.data);
		switch (data.type) {
			case 'game':
				handleGameSocketMessage(data);
				break;
		}
	});
	socket.addEventListener('error', (event) => {
		alertPublic("WebSocket error: " + event, "error");
	});

	socket.addEventListener('close', (event) => {
		if (event.wasClean) {
			console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
		} else {
			console.error(`WebSocket connection closed unexpectedly, code=${event.code}`);
	}});
}
