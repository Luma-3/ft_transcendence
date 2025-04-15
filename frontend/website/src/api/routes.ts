const API_URL = "http://127.0.0.1:3000";

const SERVICES_URL = {
	USER: `${API_URL}/api/user`
}

export const API_ROUTES = {
	USERS: {
		REGISTER: `${SERVICES_URL.USER}/register`,
		LOGIN: `${SERVICES_URL.USER}/login`,
		INFOS: `${SERVICES_URL.USER}/me`,
	}
};

