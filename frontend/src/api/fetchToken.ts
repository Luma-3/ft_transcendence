import { fetchApiWithNoBody } from "./fetch";
import { API_SESSION } from "./routes";
import { socket } from "../socket/createSocket";
import { createSocketConnection } from "../socket/createSocket";

export async function verifySession() {

	let response = await fetchApiWithNoBody(API_SESSION.VERIFY_ACCESS, {
		method: 'GET',
	});
	if (response.status ===  'success') {
		return { status: 'success', data: null };
	}

	response = await fetchApiWithNoBody(API_SESSION.VERIFY_REFRESH, {
		method: 'GET',
	});
	if (response.status ===  'success') {
		response = await fetchApiWithNoBody(API_SESSION.REFRESH, {
			method: 'POST',
		})
		if (response.status ===  'success') {
			return { status: 'success', data: null };
		}
	}
	return { status: "error", data: null };

}

export async function fetchToken() {
	
	if (socket) {
		const verifyToken = await verifySession();
		if (verifyToken.status === "error") {
			return {status: "error", message: "Session expired" };
		}
		return {status: "success", message: "Token valid" };
	}
	console.log("No websocket found, creating a new one");
	createSocketConnection();
	return fetchToken();
}