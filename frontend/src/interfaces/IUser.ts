
export interface IUserInfo {
	id: string;
	username: string;
	created_at?: string;
	email: string;
	online?: boolean;
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
	avatar: string;
	banner: string;
}

export interface UserSearchResult {
	page: number;
	limit: number;
	total: number;
	users: IOtherUser[];
}