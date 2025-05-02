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
import { fadeIn, fadeOut } from '../components/utils/fade'
import { User } from '../api/interfaces/User'
import serverError from '../pages/500'


// * Associe chaque page à sa fonction de rendu
const rendererPage: {[key: string]: () => string | Promise<string>} = {
	'home': home,
	'login': login,
	'register': register,
	'dashboard': dashboard,
	'settings': settings,
	'profile': profile,
	'500': serverError,
	'hacked': hackPage,
};

export async function renderPage(page: string, updateHistory: boolean = true, user?: User) {

	const main_container = document.querySelector<HTMLDivElement>('#app')!
	let lang;
	let theme;
	
	if (user) {
		lang = user.lang;
		theme = user.theme;
	} else {
		lang = sessionStorage.getItem('lang') || 'en';
		theme = 'dark';
	}

	setupColorTheme(theme);
	fadeOut(main_container);

	setTimeout(async () => {

		const rendererFunction = rendererPage[page] || home;
		const page_content = await Promise.resolve(rendererFunction());

		main_container.innerHTML = page_content;

		if (updateHistory) {
			addToHistory(page, updateHistory);
		}
		
		translatePage(lang);
		
		const loading = document.querySelector<HTMLDivElement>('#loading')!;
		if (loading) {
			loading.classList.add('hidden');
		}
		fadeIn(main_container);
	}
	, 250);
}

export function renderBackPage() {
	const page = window.history.state?.page || 'home';
	if (page === 'dashboard') {
		return;
	}
	history.back();
}