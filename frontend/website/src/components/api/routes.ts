const API_URL = "http://127.0.0.1:8080";

//{GATEWAY}/{SERVICE}/{ROUTE}
export const SERVICES_URL = {
	USER: `/api/user`
}
export const API_ROUTES = {
	USERS: {
		REGISTER: `${SERVICES_URL.USER}/register`,
		LOGIN: `${SERVICES_URL.USER}/login`,
		DECODE: `${SERVICES_URL.USER}/info/`,
	}
};