import { FetchInterface } from "../../../api/FetchInterface";

/**
 * Recuperation du theme selectionne et update des preferences du user
 */
export async function changeLightMode() {
	
	const switchComponent = document.getElementById('switch-component') as HTMLInputElement;
	if (switchComponent) {
		
		document.documentElement.classList.toggle('dark');
		const choice_theme = switchComponent.checked ? 'light' : 'dark';

		await FetchInterface.updatePreferences("theme", choice_theme);
	}
}