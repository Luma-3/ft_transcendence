const API_URL = "https://localhost:3000";

const SERVICES = {
	USER: `${API_URL}/api/user/users`,
	SESSION: `${API_URL}/api/user/session`,
}

export const API_USER = {

	BASIC: {
		REGISTER: `${SERVICES.USER}`,
		DELETE: `${SERVICES.USER}/me`,
		INFOS: `${SERVICES.USER}/me`,
		PREFERENCES: `${SERVICES.USER}/me/preferences`,
	},
	UPDATE: {
		PREF: `${SERVICES.USER}/me/preferences`,  //Theme et les langues
		PASSWORD: `${SERVICES.USER}/me/password`,
		EMAIL: `${SERVICES.USER}/me/email`,
		USERNAME: `${SERVICES.USER}/me/username`,
	}
}

export const API_SESSION = {

	CREATE: `${SERVICES.SESSION}`,
	DELETE: `${SERVICES.SESSION}`,
	REFRESH: `${SERVICES.SESSION}/refresh`,

}

