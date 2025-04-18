import { navbar } from "../components/ui/navbar";
import { userMenu } from "../components/ui/userMenu";
import { fetchApi } from "../api/fetch";
import { API_ROUTES } from "../api/routes";
import { User } from "../api/interfaces/User";
import { footer } from "../components/ui/footer";

async function renderDashboard() {
	
	const userinfoResponse = await fetchApi<User>(API_ROUTES.USERS.INFOS,
		{method: "GET", credentials: "include"});
		
	
	const userinfo = { username: userinfoResponse.data?.username }
	return `
	${navbar(userinfo)}
	${userMenu(userinfoResponse.data?.username)}
	${footer()}
	`

}

export async function dashboardPage() {

	let container = renderDashboard();
	return container;
}