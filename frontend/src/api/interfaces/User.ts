export interface User {
	id: number;
	username: string;
	created_at: string;
	email: string;
	preferences: {
		theme: string;
		lang: string;
		avatar: string;
		banner: string;
	}
}