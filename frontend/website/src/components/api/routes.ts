const API_URL = "http://127.0.0.1:3000";

//{GATEWAY}/{SERVICE}/{ROUTE}
export const SERVICES_URL = {
	USER: `${API_URL}/user`
}
export const API_ROUTES = {
	USERS: {
		REGISTER: `${SERVICES_URL.USER}/register`,
		LOGIN: `${SERVICES_URL.USER}/login`,
		DECODE: `${SERVICES_URL.USER}/me/`,
	}
};

