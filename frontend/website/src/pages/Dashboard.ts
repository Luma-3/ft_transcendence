import { navbar } from "../components/ui/navbar";
import { footer } from "../components/ui/footer";
import notfound from "./404";
import { getUserInfo } from "../api/getter";

async function renderDashboard() {
	
	const userinfoResponse = await getUserInfo();
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