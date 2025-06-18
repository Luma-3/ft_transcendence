
export interface UserInPeople { 
	id: string;
	username?: string;
	avatar?: string;
	banner?: string;
}

export interface UserSearchResult {
	page: number;
	limit: number;
	total: number;
	users: UserInPeople[];
}