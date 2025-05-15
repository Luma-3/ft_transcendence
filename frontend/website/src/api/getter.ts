import { fetchApi } from './fetch';
import { User } from './interfaces/User';
import { IApiResponce } from './interfaces/IApiResponse';
import { API_USER } from './routes';


export async function getUserInfo(): Promise<IApiResponce<User>> {
	const response = await fetchApi<User>(API_USER.BASIC.INFOS, {
		method: "GET",
	});
	console.log("GetUserInfo response: ", response);
	return response;
}