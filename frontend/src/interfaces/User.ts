export interface UserResponse {
	status: string;
	message: string;
	data: UserInfo;
	preferences: UserPreferences;
}

export interface UserInfo {
	id: number;
	username: string;
	created_at: string;
	email: string;
}

export interface User {
	data: UserInfo;
	preferences: UserPreferences;
}

export interface UserPreferences {
	theme: string;
	lang: string;
	avatar: string;
	banner?: string;
}


export interface UserData {
	id: number;
	username: string;
	created_at: string;
}

export interface UserPreferences {
	theme: string;
	lang: string;
	avatar: string;
}

// export interface User {
// 	id: number;
// 	username: string;
// 	created_at: string;
// 	email: string; 
// 	preferences: {
// 		theme: string;
// 		lang: string;
// 		avatar: string;
// 		banner: string;
// 	}
// }