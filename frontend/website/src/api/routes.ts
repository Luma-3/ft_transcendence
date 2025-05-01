const API_URL = "https://localhost:3000";

const SERVICES_URL = {
	USER: `${API_URL}/api/user`
}

export const API_ROUTES = {
	USERS: {
		REGISTER: `${SERVICES_URL.USER}/register`,
		LOGIN: `${SERVICES_URL.USER}/login`,
		LOGOUT: `${SERVICES_URL.USER}/logout`,
		INFOS: `${SERVICES_URL.USER}/me`,
		UPDATE_PREF: `${SERVICES_URL.USER}/preferences`,  //Theme et les langues
		UPDATE_PASSWD: `${SERVICES_URL.USER}/changePassword`,
		UPDATE_PICTURE: `${SERVICES_URL.USER}/changePP`
	}
};

