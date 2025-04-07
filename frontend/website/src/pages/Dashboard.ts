import { navbar } from "../components/ui/navbar";

function renderDashboard() {
	return `
	${navbar()}`
}

export function dashboardPage() {
	const container = renderDashboard();
	return container;
}