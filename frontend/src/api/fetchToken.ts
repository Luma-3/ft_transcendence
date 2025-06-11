import { fetchApiWithNoBody } from "./fetch";
import { API_SESSION } from "./routes";

export async function verifySession() {

	let response = await fetchApiWithNoBody(API_SESSION.VERIFY_ACCESS, {
		method: 'GET',
	});
	if (response.status ===  'success') {
		return { status: 'success', data: null };
	}

	response = await fetchApiWithNoBody(API_SESSION.CREATE, {
		method: 'PUT',
	});
	if (response.status ===  'success') {
		return { status: 'success', data: null };
	}
	return { status: "error", data: null };
}

export async function fetchToken() {
		
	const verifyToken = await verifySession();
	if (verifyToken.status === "error") {
		return {status: "error", message: "Session expired" };
	}
	return {status: "success", message: "Token valid" };
}