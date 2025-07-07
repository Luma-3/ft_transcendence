import { fetchApiWithNoError } from "./fetch";
import { API_SESSION } from "./routes";

export async function fetchToken() {

	let response;

	response = await fetchApiWithNoError(API_SESSION.VERIFY_ACCESS, { method: 'GET' });
	if (response.status === "success") {
		return { status: "success", data: response.data };
	}

	 response = await fetchApiWithNoError(API_SESSION.CREATE, { method: 'PUT',
		headers: {
			"Content-Type": "text/plain",
		}
	})
	if (response.status === "error") {
		return { status: "error", message: response.message, details: response.details };
	}
	return { status: "success", data: response };

}