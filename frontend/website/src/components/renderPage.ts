import home from '../pages/Home'
import login from '../pages/Login'
import register from '../pages/Register'
import dashboard from '../pages/Dashboard'
import settings from '../pages/Settings'
import profile from '../pages/Profile'
import errorPage from '../pages/5xx'
import notFoundPage from '../pages/4xx'
import game from '../pages/Game'
import welcomeYouPage, { reWelcomeYouPage } from '../pages/WelcomeYou';

import { addToHistory } from '../main'
import { setupColorTheme } from '../components/utils/setColorTheme'
import { translatePage } from '../i18n/Translate'
import { fadeIn, fadeOut } from '../components/utils/fade'
import  { removeLoadingScreen } from '../components/utils/removeLoadingScreen'
import { handleWelcomeYouPage } from '../pages/WelcomeYou';

import { User } from '../api/interfaces/User'
import { getUserInfo } from '../api/getter'


import { handleStartGame } from '../pages/Game'

/**
 * Associe les pages publics aux fonctions de rendu
 */
const rendererPublicPage: {[key: string]: () => string | Promise<string>} = {
	'home': home,
	'login': login,
	'register': register,
};

/**
 * Render des pages public (user non connecte ou pas encore de compte)
 */
export async function renderPublicPage(page: string, updateHistory: boolean = true) {

	const main_container = document.querySelector<HTMLDivElement>('#app')!
	const lang = sessionStorage.getItem('lang') || 'en';

	setupColorTheme('dark');
	
	fadeOut(main_container);
	setTimeout(async () => {

		const rendererFunction = rendererPublicPage[page] || notFoundPage;
		const page_content = await Promise.resolve(rendererFunction());

		main_container.innerHTML = page_content;
		
		translatePage(lang);
		if (updateHistory) {
			addToHistory(page, updateHistory);
		}
		
		removeLoadingScreen();
		
		fadeIn(main_container);
	}
	, 250);
}

/**
 * Associe les pages privees aux fonctions de rendu
 */
const rendererPrivatePage: {[key: string]: (user: User) => string | Promise<string>} = {
	'WelcomeYou': welcomeYouPage,
	'reWelcomeYou': reWelcomeYouPage,
	'dashboard': dashboard,
	'settings': settings,
	'profile': profile,
	'game': game,
}

/**
 * Render des pages prive (user connectee) mais surtout verification si l'utilisation
 * a bien une session active avant de render une page privee
 */
export async function renderPrivatePage(page: string, updateHistory: boolean = true) {

	const main_container = document.querySelector<HTMLDivElement>('#app')!
	
	const response = await getUserInfo();
	if (response.status === "error" || !response.data) {
		return renderErrorPage('400', '401', 'Unauthorized');
	}
	
	const lang = response.data.preferences.lang;
	const theme = response.data.preferences.theme;

	fadeOut(main_container);
	
	setTimeout(async () => {
		
		const rendererFunction = rendererPrivatePage[page] || notFoundPage;
		const page_content = await Promise.resolve(rendererFunction(response.data as User));
		
		main_container.innerHTML = page_content;
		setupColorTheme(theme);
		
		translatePage(lang);
		if (updateHistory) {
			addToHistory(page, updateHistory);
		}
		
		removeLoadingScreen();
		
		fadeIn(main_container);
		
		if (page === 'WelcomeYou' || page === 'reWelcomeYou') {
			handleWelcomeYouPage();
		}
		// if (page === 'game') {
		// 	handleStartGame(response.data);
		// }
	}
	, 250);
}

/**
 * Render des pages d'erreur
 */
const rendererErrorPage: {[key: string]: (code: string, message: string) => string} = {
	'404': notFoundPage,
	'400': errorPage,
	'500': errorPage,
}

export async function renderErrorPage(codePage: string, code: string, message: string) {
	
	const main_container = document.querySelector<HTMLDivElement>('#app')!
	
	const user = await getUserInfo();
	
	const lang = user.status === "error" ? 'en' : user.data?.preferences.lang || 'en';
	const theme = user.status === "error" ? 'dark' : user.data?.preferences.theme || 'dark';
	
	setupColorTheme(theme);
	fadeOut(main_container);

	setTimeout(async () => {
		const rendererFunction = rendererErrorPage[codePage] || notFoundPage;
		const page_content = rendererFunction(code, message);

		main_container.innerHTML = page_content;
		translatePage(lang);

		addToHistory(code, false);
		
		removeLoadingScreen();
		
		fadeIn(main_container);
	}
	, 250);
}

/**
 * S'occuper du renderer de la page de retour et verifie si on est deja sur le dashboard 
 * ( si l'utilisateur clique tres vite plusieurs fois sur le bouton de retour )
 * pour eviter de partir au dela du dashboard

 * @returns Renders the previous page in the history stack
 */
export function renderBackPage() {
	const page = window.history.state?.page || 'home';
	if (page === 'dashboard') {
		return;
	}
	renderPrivatePage('dashboard');
}