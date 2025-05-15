import { fetchApi } from "../../api/fetch";
import { API_USER } from "../../api/routes";
import { alert } from "../../components/ui/alert/alert";	

export async function changeLightMode() {
	
	const switchComponent = document.getElementById('switch-component') as HTMLInputElement;
	if (switchComponent) {
		document.documentElement.classList.toggle('dark');
		const choice_theme = switchComponent.checked ? 'light' : 'dark';
		console.log("Theme changed to: ", choice_theme);
		const response = await fetchApi(API_USER.UPDATE.PREF, {
			method: 'PATCH',
			body: JSON.stringify({
				theme: choice_theme,
			}),
		});
		if (response.status === "success") {
			console.log("Theme updated successfully");
		} else {
			console.error("Failed to update theme");
			alert(response.message, "error");
		}
	}
}