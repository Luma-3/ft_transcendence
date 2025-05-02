import { fetchApi } from './fetch';
import { User } from './interfaces/User';
import { IApiResponce } from './interfaces/IApiResponse';
import { API_ROUTES } from './routes';


export async function getUserInfo(): Promise<IApiResponce<User>> {
	const response = await fetchApi<User>(API_ROUTES.USERS.INFOS, {
		method: "GET",
	});
	console.log("coucou")
	return response;
}