
export interface IUserInfo {
	id: string;
	username: string;
	created_at?: string;
	email: string;
	preferences: IUserPreferences;
}

export interface IUserPreferences {
	theme: string;
	lang: string;
	avatar: string;
	banner: string;
}

export interface IOtherUser { 
	id: string;
	username: string;
	online: boolean;
	avatar: string;
	banner: string;
}

export interface UserSearchResult {
	page: number;
	limit: number;
	total: number;
	users: IOtherUser[];
}