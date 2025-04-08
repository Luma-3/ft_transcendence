import { navbar } from "../components/ui/navbar";
import { userMenu } from "../components/ui/userMenu";

function renderDashboard() {
	return `
	${navbar()}
	${userMenu()}
	`

}

export function dashboardPage() {
	const container = renderDashboard();
	return container;
}