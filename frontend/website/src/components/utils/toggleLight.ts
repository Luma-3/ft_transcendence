import { alert } from "../../components/ui/alert/alert";
import { loadTranslation } from "../../i18n/Translate";

import { fetchApi } from "../../api/fetch";
import { API_USER } from "../../api/routes";

/**
 * Recuperation du theme selectionne et update des preferences du user
 */
export async function changeLightMode() {
	
	const switchComponent = document.getElementById('switch-component') as HTMLInputElement;
	if (switchComponent) {
		
		document.documentElement.classList.toggle('dark');
		const choice_theme = switchComponent.checked ? 'light' : 'dark';
		const trad = await loadTranslation(choice_theme);

		const response = await fetchApi(API_USER.UPDATE.PREF, {
			method: 'PATCH',
			body: JSON.stringify({
				theme: choice_theme,
			}),
		});
		if (response.status === "error") {
			alert(trad["theme-cannot-be-updated"], "error");
		}
	}
}