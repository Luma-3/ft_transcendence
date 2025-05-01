import home from '../pages/Home'
import login from '../pages/Login'
import register from '../pages/Register'
import dashboard from '../pages/Dashboard'
import settings from '../pages/Settings'
import profile from '../pages/Profile'
import { hackPage } from '../pages/Hack'

import { setupColorTheme } from '../components/utils/setColorTheme'
import { addToHistory } from '../main'
import { translatePage } from '../i18n/Translate'
// import { setupGoogleButton } from './Google'
import { fadeIn, fadeOut } from '../components/utils/fade'


// * Associe chaque page à sa fonction de rendu
const rendererPage: {[key: string]: () => string | Promise<string>} = {
	'home': home,
	'login': login,
	'register': register,
	'dashboard': dashboard,
	'settings': settings,
	'profile': profile,
	'hacked': hackPage,
};

export async function renderPage(page: string, updateHistory: boolean = true) {

	const main_container = document.querySelector<HTMLDivElement>('#app')!
	setupColorTheme();
	
	fadeOut(main_container);

	setTimeout(async () => {
		const rendererFunction = rendererPage[page] || home;
		const page_content = await Promise.resolve(rendererFunction());

		main_container.innerHTML = page_content;

		if (updateHistory) {
			addToHistory(page, updateHistory);
		}
		
		translatePage(localStorage.getItem('lang') || sessionStorage.getItem('lang') || 'en');
		const loading = document.querySelector<HTMLDivElement>('#loading')!;
		if (loading) {
			loading.classList.add('hidden');
		}
		fadeIn(main_container);
	}
	, 310);
}