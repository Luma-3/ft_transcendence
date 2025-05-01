import { navbar } from "../components/ui/navbar";
import { fetchApi } from "../api/fetch";
import { API_ROUTES } from "../api/routes";
import { User } from "../api/interfaces/User";
import { footer } from "../components/ui/footer";
import notfound from "./404";

async function renderDashboard() {
	
	const userinfoResponse = await fetchApi<User>(API_ROUTES.USERS.INFOS,
		{method: "GET", credentials: "include"});
		
	if (userinfoResponse.status === "success" && userinfoResponse.data) {
		const userInfos = userinfoResponse.data;
		
		return `
			${navbar(userInfos)}
			${footer()}
		`
	}
	return notfound()
}

export default async function dashboardPage() {

	const container = renderDashboard();
	return container as Promise<string>;
}