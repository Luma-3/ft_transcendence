import { navbar } from "../components/ui/navbar";
import { footer } from "../components/ui/footer";
import { User } from "../api/interfaces/User";

async function renderDashboard(user:User) {

		return `
			${navbar(user)}
			${footer()}
		`
}

export default async function dashboardPage(user: User) {

	const container = renderDashboard(user);
	return container as Promise<string>;
}