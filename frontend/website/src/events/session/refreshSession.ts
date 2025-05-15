import { fetchApi } from "../../api/fetch";
import { API_SESSION } from "../../api/routes";

export async function refreshSession() {
	const response = await fetchApi(API_SESSION.REFRESH, {
		method: 'POST',
	})
	return response;
}