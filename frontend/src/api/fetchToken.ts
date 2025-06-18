import { fetchApiWithNoBody } from "./fetch";
import { API_SESSION } from "./routes";

export async function fetchToken() {

	
	const response = await fetchApiWithNoBody(API_SESSION.CREATE, { method: 'PUT' })
	if (response.status === "error") {
		return { status: "error", message: response.message, details: response.details };
	}
	return { status: "success", data: response };

}