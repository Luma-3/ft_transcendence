import { navbar } from "../components/ui/navbar";
import { fetchApi } from "../api/fetch";
import { API_ROUTES } from "../api/routes";
import { User } from "../api/interfaces/User";
import { footer } from "../components/ui/footer";
import { alert } from "../components/ui/alert";

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
	alert(userinfoResponse.message, "error");
	return;
}

export async function dashboardPage() {

	const container = renderDashboard();
	return container;
}