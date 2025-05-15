import { fetchApi } from '../../api/fetch';
import { API_SESSION } from '../../api/routes';


export async function createSession(username: string, password: string) {
	const response = await fetchApi(API_SESSION.CREATE, {
		method: 'POST',
		body: JSON.stringify({ username, password }),
	});
	return response;
}