import { alertPublic } from "../components/ui/alert/alertPublic";
import { handleGameSocketMessage } from "./DispatchMsgSocket";
import { renderPublicPage } from "./renderPage";

export let socket: WebSocket | null = null;
const MAX_RECONNECT_TENTATIVE = 5;
let reconnectTentative = 0;

export function socketConnection() {
	socket = new WebSocket('/api/ws');

	socket.addEventListener("open", () => {
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

		alertPublic("WebSocket connection error. Trying to reconnect...", "error");

		if (reconnectTentative < MAX_RECONNECT_TENTATIVE) {
			reconnectTentative++;
			socketConnection();
		} else {
			alertPublic("Failed to reconnect after multiple attempts. You will be redirected to the home page.", "error");
			reconnectTentative = 0;
			socket = null;
			renderPublicPage("home");
			//TODO: Delete les cookies
		}
	});

	socket.addEventListener('close', (event) => {
		if (event.wasClean) {
			console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
		} else {
			alertPublic(`WebSocket connection closed unexpectedly with code ${event.code}. Message: ${event.reason}. You will be redirected to the main page.`, "error");
			setTimeout(() => { renderPublicPage("home") }, 2000);
		}
	});

}
