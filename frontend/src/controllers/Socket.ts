import { alertWithTimer } from "../components/ui/alert/alertGameReady";
import { alertPublic } from "../components/ui/alert/alertPublic";
import { handleGameSocketMessage } from "./DispatchMsgSocket";
import { renderPublicPage } from "./renderPage";

export let socket: WebSocket | null = null;
const MAX_RECONNECT_TENTATIVE = 5;
let reconnectTentative = 0;

function tryReconnection() {

}



export async function socketConnection() {
	socket = new WebSocket('/api/ws');

	socket.addEventListener("open", () => {
		reconnectTentative = 0;
		console.log("WebSocket connection established.");
	});

	socket.addEventListener("message", (e) => {
		const data = JSON.parse(e.data).payload;

		const type = JSON.parse(e.data).type;
		switch (type) {
			case 'game':
				handleGameSocketMessage(data);
				break;
			default:
				break;
		}
	});

	socket.addEventListener('error', () => {

		alertPublic("WebSocket connection error. Trying to reconnect... Try " + reconnectTentative + " of " + MAX_RECONNECT_TENTATIVE, "error");

		if (reconnectTentative < MAX_RECONNECT_TENTATIVE) {
			reconnectTentative++;
			socket = null;
			socketConnection();
		} else {
			alertPublic("WebSocket connection failed. Please log in again.", "error");
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			reconnectTentative = 0;
			socket = null;
			setTimeout(() => { window.location.href = "/login"; }, 1000);
		}
	});

	socket.addEventListener('close', (event) => {
		if (event.wasClean) {
			console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
		} else {
			alertWithTimer("WebSocket connection closed unexpectedly", `code ${event.code}. Message: ${event.reason}`).then(e =>
				window.location.reload());
	}});

}
