import { socket } from './createSocket';


export function recreateSocket() {

	socket = new WebSocket('/api/ws');

	socket.addEventListener("open", () => {
		console.log("WebSocket connection re-established successfully.");
	});
	
}