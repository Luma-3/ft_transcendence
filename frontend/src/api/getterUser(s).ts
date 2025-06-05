import { fetchApi } from './fetch';
import { User } from '../interfaces/User';
import { UserInPeople } from '../interfaces/PeopleInterface';
import { IApiResponse } from '../interfaces/IApiResponse';
import { API_PEOPLE, API_USER } from './routes';


export async function getUserInfo(): Promise<IApiResponse<User>> {
	const response = await fetchApi<User>(API_USER.BASIC.INFOS, {
		method: "GET",
	});
	return response;
}

export async function getOtherUserInfo(id: string): Promise<IApiResponse<User>> {
	const response = await fetchApi<User>(API_USER.BASIC.BASIC + `/${id}`);
	console.log("getOtherUserInfo response", response);
	return response;
}

export async function getAllUsers(): Promise<IApiResponse<UserInPeople[]>> {
	const response = await fetchApi<UserInPeople[]>(API_PEOPLE.ALL);
	return response;
}

export async function getUsersList(value: string) {

	const response = await fetchApi<UserInPeople[]>(API_PEOPLE.SEARCH + "?search=" + value);
	return response.data!;
}

export async function getFriends() {
	const response = await fetchApi<{
		friends: UserInPeople[];
		blocked: UserInPeople[];
		pending: (UserInPeople&{status: string})[];
	}>(API_PEOPLE.SELF);
	return response;
}