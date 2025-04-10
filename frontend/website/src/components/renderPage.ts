import { homePage } from '../pages/Home'
import { loginPage } from '../pages/Login'
import { registerPage } from '../pages/Register'
import { dashboardPage } from '../pages/Dashboard'
import { settingsPage } from '../pages/Settings'
import { hackPage } from '../pages/Hack'

import { setupColorTheme } from './utils/setColorTheme'
import { addToHistory } from '../main'
import { translatePage } from '../i18n/Translate'
// import { setupGoogleButton } from './Google'
import { fadeIn, fadeOut } from './utils/fade'


// * Associe chaque page à sa fonction de rendu
const rendererPage: {[key: string]: () => string} = {
	'home': homePage,
	'login': loginPage,
	'register': registerPage,
	'dashboard': dashboardPage,
	'settings': settingsPage,
	'hacked': hackPage,
};

export function renderPage(page: string, updateHistory: boolean = true) {
	
	const main_container = document.querySelector<HTMLDivElement>('#app')!
	setupColorTheme();
	
	fadeOut(main_container);

	setTimeout(() => {
		const rendererFunction = rendererPage[page] || homePage;
		const page_content = rendererFunction();

		main_container.innerHTML = page_content;

		// if (page === 'login' || page === 'register') {
		// 	setupGoogleButton();
		// }
		if (updateHistory) {
			addToHistory(page, updateHistory);
		}
		
		translatePage(sessionStorage.getItem('lang') || 'en');
		fadeIn(main_container);
	}
	, 200);
}