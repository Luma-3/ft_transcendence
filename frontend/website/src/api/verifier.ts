import { fetchApiWithNoBody } from "./fetch";
import { API_SESSION } from "./routes";

export async function verifySession() {

	let response = await fetchApiWithNoBody(API_SESSION.VERIFY_ACCESS, {
		method: 'GET',
	});
	console.log(response);
	if (response.status ===  'success') {
		return { status: 'success', data: null };
	}

	response = await fetchApiWithNoBody(API_SESSION.VERIFY_REFRESH, {
		method: 'GET',
	});
	console.log(response);
	if (response.status ===  'success') {
		
		response = await fetchApiWithNoBody(API_SESSION.REFRESH, {
			method: 'GET',
		})
		console.log("refresh response: ", response);
		if (response.status ===  'success') {
			return { status: 'success', data: null };
		}
	}
	return { status: "error", data: null };

}