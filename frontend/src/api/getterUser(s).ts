import { fetchApi } from './fetch';
import { User, UserData, UserInfo, UserPreferences, UserResponse } from '../interfaces/User';
import { UserInPeople } from '../interfaces/PeopleInterface';
import { IApiResponse } from '../interfaces/IApiResponse';
import { API_PEOPLE, API_USER } from './routes';


export async function getUserInfo(): Promise<UserResponse> {
	let userData: UserResponse = {
		status: '',
		message: '',
		data: {
			id: 0,
			username: '',
			created_at: ''
		},
		preferences: {
			theme: 'dark',
			lang: 'en',
			avatar: 'default.jpg'
		}
	};

	const response = await fetchApi<UserInfo>(API_USER.BASIC.INFOS, {
		method: "GET",
	});
	userData.status = response.status;
	userData.message = response.message;
	userData.data = response.data!;
	if (userData.status === 'error') {
		return userData;
	}
	console.log("User data fetched:", userData.data);
	const responsePref = await fetchApi<UserPreferences>(API_USER.BASIC.PREFERENCES, {
		method: "GET",
	});
	userData.preferences = responsePref.data!;
	return userData;
}

export async function getOtherUserInfo(id: string): Promise<IApiResponse<User>> {
	const response = await fetchApi<User>(API_USER.BASIC.BASIC + `/${id}`);
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