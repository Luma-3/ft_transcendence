import home from '../pages/Home'
import login from '../pages/Login'
import register from '../pages/Register'
import dashboard from '../pages/Dashboard'
import settings from '../pages/Settings'
import profile from '../pages/Profile'
import errorPage from '../pages/5xx'
import notFoundPage from '../pages/4xx'
import welcomeYouPage, { reWelcomeYouPage } from '../pages/WelcomeYou';

import { addToHistory } from '../main'
import { setupColorTheme } from '../components/utils/setColorTheme'
import { translatePage } from '../i18n/Translate'
import { fadeIn, fadeOut } from '../components/utils/fade'
import { User } from '../api/interfaces/User'
import { getUserInfo } from '../api/getter'
import { handleWelcomeYouPage } from '../pages/WelcomeYou';


// * Associe chaque page à sa fonction de rendu
const rendererPublicPage: {[key: string]: () => string | Promise<string>} = {
	'home': home,
	'login': login,
	'register': register,
	'500': errorPage,
};

const rendererPrivatePage: {[key: string]: (user: User) => string | Promise<string>} = {
	'WelcomeYou': welcomeYouPage,
	'reWelcomeYou': reWelcomeYouPage,
	'dashboard': dashboard,
	'settings': settings,
	'profile': profile,
}

const rendererErrorPage: {[key: string]: (code: string, message: string) => string} = {
	'404': notFoundPage,
	'400': errorPage,
	'500': errorPage,
}

export async function renderPublicPage(page: string, updateHistory: boolean = true) {

	const main_container = document.querySelector<HTMLDivElement>('#app')!
	if (!main_container) {
		return notFoundPage();
	}
	const lang = sessionStorage.getItem('lang') || 'en';

	setupColorTheme('dark');
	fadeOut(main_container);

	setTimeout(async () => {

		const rendererFunction = rendererPublicPage[page] || notFoundPage;
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

export async function renderPrivatePage(page: string, updateHistory: boolean = true) {

	const main_container = document.querySelector<HTMLDivElement>('#app')!
	if (!main_container) {
		return renderErrorPage('404', '404', 'not_found');
	}
	const response = await getUserInfo();
	if (response.status === "error" || !response.data) {
		return renderErrorPage('404', '404', 'not_found');
	}
	const lang = response.data.preferences.lang;;
	const theme = response.data.preferences.theme;

	fadeOut(main_container);
	
	setTimeout(async () => {
		
		const rendererFunction = rendererPrivatePage[page];
		if (!rendererFunction) {
			return renderErrorPage('404', '404', 'not_found');
		}
		const page_content = await Promise.resolve(rendererFunction(response.data as User));
		
		main_container.innerHTML = page_content;
		
		if (updateHistory) {
			addToHistory(page, updateHistory);
		}
		translatePage(lang);
		setupColorTheme(theme);
		
		if (page === 'WelcomeYou' || page === 'reWelcomeYou') {
			handleWelcomeYouPage();
		}
		
		const loading = document.querySelector<HTMLDivElement>('#loading')!;
		if (loading) {
			loading.classList.add('hidden');
		}
		fadeIn(main_container);
	}
	, 250);
}


export async function renderErrorPage(codePage: string, code: string, message: string) {
	const main_container = document.querySelector<HTMLDivElement>('#app')!
	if (!main_container) {
		return notFoundPage();
	}
	const user = await getUserInfo();
	const lang = user.status === "error" ? 'en' : user.data?.preferences.lang || 'en';
	const theme = user.status === "error" ? 'dark' : user.data?.preferences.theme || 'dark';
	setupColorTheme(theme);
	fadeOut(main_container);

	setTimeout(async () => {
		const rendererFunction = rendererErrorPage[codePage] || notFoundPage;
		const page_content = rendererFunction(code, message);

		main_container.innerHTML = page_content;

		addToHistory(code, false);
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
	renderPrivatePage('dashboard');
}