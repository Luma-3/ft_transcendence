import { navbar } from "../components/ui/navbar";
import { userMenu } from "../components/ui/userMenu";
import { fetchApi } from "../components/api/api";
import { API_ROUTES } from "../components/api/routes";
import { User } from "../events/userSession/userRegister";

async function renderDashboard() {
	
	const userinfoResponse = await fetchApi<User>(API_ROUTES.USERS.DECODE,
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