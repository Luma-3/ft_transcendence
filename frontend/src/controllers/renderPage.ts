/**
 * ! PAGES
 */

import home from '../pages/Home'
import login from '../pages/Login'
import register from '../pages/Register'
import dashboard from '../pages/Dashboard/Dashboard'
import settings from '../pages/Settings'
import profile from '../pages/Profile/Profile'
import friends from '../pages/Friends/Friends'
import documentation from '../pages/Documentation'
import { verifyEmailPrivate } from '../pages/VerifyEmail'
import RGPD from '../pages/RGPD'
import twoFaPage, { init2FAPage } from '../pages/2FA'

/**
 * ! UTILS
 */
import { addToHistory } from '../main'
import { setupColorTheme } from '../components/utils/setColorTheme'
import { translatePage } from './Translate'
import { fadeIn, fadeOut } from '../components/utils/fade'
import { removeLoadingScreen } from '../components/utils/removeLoadingScreen'

/**
 * ! API
 */
import { IUserInfo } from '../interfaces/IUser'


/**
 * Associe les pages publics aux fonctions de rendu
*/
const rendererPublicPage: { [key: string]: () => string | Promise<string> } = {
	'home': home,
	'login': login,
	'register': register,
	'documentation': documentation,
	'rgpd': RGPD,
	'verifyEmail': verifyEmailPublic,
};

/**
 * Render des pages public (user non connecte ou pas encore de compte)
 */
export async function renderPublicPage(page: string, updateHistory: boolean = true) {

	const main_container = document.querySelector<HTMLDivElement>('#app')!
	const lang = localStorage.getItem('lang') || 'en';

	setupColorTheme('dark');

	fadeOut();
	setTimeout(async () => {

		const rendererFunction = rendererPublicPage[page];
		if (!rendererFunction) {
			return window.location.href = '/login';
		}

		const page_content = await Promise.resolve(rendererFunction());
		main_container.innerHTML = page_content;
		translatePage(lang);
		if (updateHistory) {
			addToHistory(page, updateHistory);
		}

		window.scrollTo(0, 0);
		removeLoadingScreen();

		fadeIn();

		// document.querySelector("footer")?.classList.add("hidden");
	}
		, 200);
}

/**
 * Associe les pages privees aux fonctions de rendu
 */
const rendererPrivatePage: { [key: string]: (user: IUserInfo) => string | Promise<string> } = {
	'dashboard': dashboard,
	'settings': settings,
	'profile': profile,
	'friends': friends,
	'documentation': documentation,
	'rgpd': RGPD,
	'verifyEmail': verifyEmailPrivate,
}

/**
 * Render des pages prive (user connectee) mais surtout verification si l'utilisation
 * a bien une session active avant de render une page privee
 */
export async function renderPrivatePage(page: string, updateHistory: boolean = true) {

	const user = await FetchInterface.getUserInfo();
	if (user === undefined) {
		return;
	}

	if (!socket) {
		await socketConnection();
	}

	fadeOut();
	setTimeout(async () => {

		const main_container = document.querySelector<HTMLDivElement>('#app')!
		const rendererFunction = rendererPrivatePage[page];
		if (!rendererFunction) {
			return renderErrorPage('404')
		}

		const page_content = await Promise.resolve(rendererFunction(user));

		main_container.innerHTML = page_content;
		setupColorTheme(user.preferences.theme);

		translatePage(user.preferences.lang);
		addToHistory(page, updateHistory);

		window.scrollTo(0, 0);
		removeLoadingScreen();

		fadeIn();
		document.querySelector("footer")?.classList.remove("hidden");


	}, 200);
}

import { renderOtherProfile } from '../pages/OtherProfile'
import { redocInit } from '../components/utils/redocInit'
import { dispatchError } from './DispatchError'
import { socket, socketConnection } from '../socket/Socket'
import { FetchInterface } from '../api/FetchInterface'
import verifyEmailPublic from '../pages/VerifyEmail'

export async function renderOtherProfilePage(target: HTMLElement) {

	const user = await FetchInterface.getUserInfo();
	if (user === undefined) {
		return;
	}

	fadeOut();

	setTimeout(async () => {

		const main_container = document.querySelector<HTMLDivElement>('#app')!

		const newContainer = await renderOtherProfile(target, user);
		if (!newContainer) {
			return;
		}

		main_container.innerHTML = newContainer;
		setupColorTheme(user.preferences.theme);

		translatePage(user.preferences.lang);

		removeLoadingScreen();

		fadeIn();
	}
		, 200);
}

/**
 * Render des pages d'erreur
 */
export async function renderErrorPage(code: string, messageServer?: string) {

	const main_container = document.querySelector<HTMLDivElement>('#app')!

	let lang = 'en';
	let theme = 'dark';

	const userPreferences = await FetchInterface.getUserPrefs();
	if (userPreferences !== undefined) {
		lang = userPreferences.lang;
		theme = userPreferences.theme;
	}

	setupColorTheme(theme);
	fadeOut();

	setTimeout(async () => {
		const page_content = dispatchError(code, messageServer || '');

		main_container.innerHTML = page_content;
		translatePage(lang);

		addToHistory(code, false);

		removeLoadingScreen();

		fadeIn();
	}
		, 200);
}

const logoDoc: { [key: string]: string } = {
	'user': '/images/duckHandsUp.png',
	'upload': '/images/duckUpload.png',
	'game': '/images/logoGameApi.png',
	'auth': '/images/duckPolice.png',
};

export async function renderDocPages(page: string, index_logo: string) {

	const redoc_container = document.getElementById('redoc-container') as HTMLDivElement;
	if (!redoc_container) {
		return;
	}
	redoc_container.classList.remove('hidden');
	redoc_container.innerHTML = '';
	fetch(`${page}`)
		.then(res => res.json())
		.then(spec => {
			spec.info['x-logo'] = {
				url: logoDoc[index_logo],
				backgroundColor: '#FFFFFF',
				altText: 'Logo de l\'API',
			};
			redocInit(spec, redoc_container);
		});
}


export async function render2FaPages(action: string) {

	let user = undefined;
	if (action !== 'login') {
		user = await FetchInterface.getUserInfo();
		if (user === undefined) {
			return;
		}
	}

	fadeOut();

	setTimeout(async () => {

		const main_container = document.querySelector<HTMLDivElement>('#app')!

		const newContainer = await twoFaPage(action);
		if (!newContainer) {
			return;
		}

		main_container.innerHTML = newContainer;

		init2FAPage();
		setupColorTheme((user === undefined) ? 'dark' : user.preferences.theme);
		translatePage((user === undefined) ? 'en' : user.preferences.lang);

		window.scrollTo(0, 0);
		removeLoadingScreen();

		fadeIn();
	}
		, 200);
}