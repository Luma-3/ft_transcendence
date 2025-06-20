
export interface UserInfo {
	id: string;
	username: string;
	created_at?: string;
	email?: string;
	preferences?: UserPreferences;
}

export interface UserPreferences {
	theme: string;
	lang: string;
	avatar: string;
	banner?: string;
}

export interface OtherUser {
	username: string;
	user_id: string;
	blocked: boolean;
}