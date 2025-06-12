import { fetchApi } from './fetch';
import { UserInfo } from '../interfaces/User';
import { UserInPeople } from '../interfaces/PeopleInterface';
import { IApiResponse } from '../interfaces/IApiResponse';
import { API_PEOPLE, API_USER } from './routes';

/**
 * Getter for the current user's information.
 * @returns {Promise<IApiResponse<UserInfo>>} A promise that resolves to the user's information.
 */
export async function getUserInfo(): Promise<IApiResponse<UserInfo>> {

	return await fetchApi<UserInfo>(API_USER.BASIC.INFOS + "?includePreferences=true", {
		method: "GET",
	});
}

export async function getOtherUserInfo(id: string): Promise<IApiResponse<UserInfo>> {
	const response = await fetchApi<UserInfo>(API_USER.BASIC.BASIC + `/${id}`);
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