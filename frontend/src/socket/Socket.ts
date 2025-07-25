import { dispatchGameSocketMsg } from "../socket/dispatchGameSocketMsg";
import { dispatchUserSocketMsg } from "./dispatchUserSocketMsg";

export let socket: WebSocket;

export async function socketConnection() {
	socket = new WebSocket('/api/ws');

	socket.addEventListener("open", () => {
		// console.log("WebSocket connection established.");
	});

	socket.addEventListener("message", (e) => {
		const data = JSON.parse(e.data);

		const from = JSON.parse(e.data).from;
		switch (from) {
			case 'game':
				dispatchGameSocketMsg(data.payload);
				break;
			case 'user': {
				dispatchUserSocketMsg(data.payload);
				break;
			}
			default:
				break;
		}
	});

	socket.addEventListener('error', async () => {
		socket.close();
	});

	socket.addEventListener('close', async (event) => {
		if (event.code === 1006 || event.code === 1000)
			await socketConnection();
	});
}

export function sendInSocket(service: string, scope: string, target: string, action: string, data: any) {
	socket.send(JSON.stringify({
		service: service,
		scope: scope,
		target: target,
		payload: {
			action: action,
			data: data
		},
	}));
}
