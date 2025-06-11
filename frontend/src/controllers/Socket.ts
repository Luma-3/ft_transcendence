import { alertPublic } from "../components/ui/alert/alertPublic";
import { handleGameSocketMessage } from "./DispatchMsgSocket";

export let socket: WebSocket | null = null;


export function socketConnection() {
	socket = new WebSocket('/api/ws');

	socket.addEventListener("open", () => {
		console.log("WebSocket connection established.");
	});
	
	socket.addEventListener("message", (e) => {
		
		const data = JSON.parse(e.data).payload;
		
		const type = JSON.parse(e.data).type;
		console.log("Dataaaaaaaaaaaaaaaaaa", data);
		switch (type) {
			case 'game':
				handleGameSocketMessage(data);
				break;
			default:
				console.warn("Unknown message type received from WebSocket:", e.data.type);
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
