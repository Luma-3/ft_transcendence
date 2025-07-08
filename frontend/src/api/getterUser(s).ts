import { fetchApi, fetchApiWithNoError } from './fetch';
import { IOtherUser, IUserPreferences, UserSearchResult } from '../interfaces/IUser';
import { IApiResponse } from '../interfaces/IApi';
import { API_USER } from './routes';

// /**
//  * Getter for the current user's information.
//  * @returns {Promise<IApiResponse<IUserInfo>>} A promise that resolves to the user's information.
//  */
// export async function getUserInfo(): Promise<IApiResponse<IUserInfo>> {


// 	const token = await fetchToken();
// 	if (token.status === "error") {
// 		return { status: "error", message: token.message!, details: token.details };
// 	}

// 	return await fetchApiWithNoError<IUserInfo>(API_USER.BASIC.INFOS + "?includePreferences=true", {
// 		method: "GET",
// 	});
// }

// export async function getBlockedUsers(): Promise<IApiResponse<IOtherUser[]>> {
// 	const response = await fetchApi<IOtherUser[]>(API_USER.SOCIAL.BLOCKED + "?hydrate=true");
// 	return response;
// }

// export async function getOtherUserInfo(id: string): Promise<IApiResponse<IUserInfo>> {
// 	const response = await fetchApi<IUserInfo>(API_USER.BASIC.BASIC + `/${id}?includePreferences=true`);
// 	return response;
// }

// export async function getAllUsers(blocked: ("you" | "another" | "all" | "none") = "none", friends: boolean = false, pending: boolean = false, page: number = 1, limit: number = 10, hydrate: boolean = true) {
// 	const response = await fetchApi<UserSearchResult>(API_USER.BASIC.BASIC + `?blocked=${blocked}&friends=${friends}&pending=${pending}&limit=${limit}&page=${page}&hydrate=${hydrate}`);
// 	return response;
// }

// export async function getUsersList(value: string) {
// 	const response = await fetchApi<OtherUser[]>(API_PEOPLE.SEARCH + "?search=" + value);
// 	return response.data!;
// }

// export async function getFriends() {
// 	const response = await fetchApi<IOtherUser[]>(API_USER.SOCIAL.FRIENDS);
// 	return response;
// }

// export async function getNotifications(params: "sender" | "receiver" = "sender") {
// 	const response = await fetchApi<IOtherUser[]>(API_USER.SOCIAL.NOTIFICATIONS + `?action=${params}`);
// 	return response;
// }

export async function getSearchUsers(q: string, page: number = 1, limit: number = 10, hydrate: boolean = true): Promise<IApiResponse<UserSearchResult>> {
	const response = await fetchApi<UserSearchResult>(API_USER.SEARCH + `?q=${q}&page=${page}&limit=${limit}&hydrate=${hydrate}`);
	return response;
}

// export async function getUserPreferences(): Promise<IApiResponse<IUserPreferences>> {
// 	const response = await fetchApiWithNoError<IUserPreferences>(API_USER.BASIC.ONLY_PREFERENCES, {
// 		method: "GET",
// 	});
// 	return response;
// }