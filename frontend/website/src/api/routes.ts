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
	}
};

