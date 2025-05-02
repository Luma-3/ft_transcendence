import { fetchApi } from "../../api/fetch";
import { API_ROUTES } from "../../api/routes";

export async function changeLightMode() {
	const switchComponent = document.getElementById('switch-component') as HTMLInputElement;
	if (switchComponent) {
		document.documentElement.classList.toggle('dark');
		console.log("light mode");
		console.log(switchComponent.checked? 'dark' : 'light');
		const choice_theme = switchComponent.checked ? 'dark' : 'light';
		const response = await fetchApi(API_ROUTES.USERS.UPDATE_PREF, {
			method: 'PATCH',
			body: JSON.stringify({
				theme: choice_theme,
			}),
		});
		if (response.status === "success") {
			console.log("Theme updated successfully");
		} else {
			console.error("Failed to update theme");
		}
	}
}