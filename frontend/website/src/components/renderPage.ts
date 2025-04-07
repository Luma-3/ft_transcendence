import { homePage } from '../pages/Home'
import { loginPage } from '../pages/Login'
import { registerPage } from '../pages/Register'
import { hackPage } from '../pages/Hack'
import { addToHistory } from '../main'
import { translatePage } from '../i18n/Translate'
import { setupGoogleButton } from './Google'
import { fadeIn, fadeOut } from './utils/fade'
import { dashboardPage } from '../pages/Dashboard'


// * Associe chaque page à sa fonction de rendu
const rendererPage: {[key: string]: () => string} = {
	'home': homePage,
	'login': loginPage,
	'register': registerPage,
	'dashboard': dashboardPage,
	'hacked': hackPage,
};

export function renderPage(page: string, updateHistory: boolean = true) {
	
	const main_container = document.querySelector<HTMLDivElement>('#app')!
	
	fadeOut(main_container);
	
	setTimeout(() => {
		const rendererFunction = rendererPage[page] || homePage;
		const page_content = rendererFunction();

		main_container.innerHTML = page_content;

		if (page === 'login' || page === 'register') {
			setupGoogleButton();
		}
		if (updateHistory) {
			addToHistory(page, updateHistory);
		}
		
		translatePage(localStorage.getItem('lang') || 'en');
		fadeIn(main_container);
	}
	, 200);
}