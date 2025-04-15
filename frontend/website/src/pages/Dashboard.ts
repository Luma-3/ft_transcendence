import { navbar } from "../components/ui/navbar";
import { userMenu } from "../components/ui/userMenu";
import { fetchApi } from "../api/fetch";
import { API_ROUTES } from "../api/routes";
import { User } from "../api/interfaces/User";

async function renderDashboard() {
	
	const userinfoResponse = await fetchApi<User>(API_ROUTES.USERS.INFOS,
		{method: "GET", credentials: "include"});
		
	console.log(userinfoResponse);
	
	
	const userinfo = { username: userinfoResponse.data?.username }
	return `
	${navbar(userinfo)}
	${userMenu(userinfoResponse.data?.username)}
	`

}

export async function dashboardPage() {

	const container = renderDashboard();
	return container;
}