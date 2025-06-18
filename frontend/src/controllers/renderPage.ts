import home from '../pages/Home'
import login from '../pages/Login'
import register from '../pages/Register'
import dashboard from '../pages/Dashboard'
import settings from '../pages/Settings'
import profile from '../pages/Profile/Profile'
import errorPage from '../pages/5xx'
import notFoundPage from '../pages/4xx'
import game from '../pages/Game'
import welcomeYouPage from '../pages/WelcomeYou';
import documentation from '../pages/Documentation'

import { addToHistory } from '../main'
import { setupColorTheme } from '../components/utils/setColorTheme'
import { translatePage } from '../i18n/Translate'
import { fadeIn, fadeOut } from '../components/utils/fade'
import { removeLoadingScreen } from '../components/utils/removeLoadingScreen'
import { handleWelcomeYouPage } from '../pages/WelcomeYou';

import { UserInfo } from '../interfaces/User'
import { getUserInfo } from '../api/getterUser(s)'

import { socket } from '../controllers/Socket'

import { fetchToken } from '../api/fetchToken'
import { socketConnection } from '../controllers/Socket'
import { RoomData } from '../interfaces/GameData'

/**
 * Associe les pages publics aux fonctions de rendu
 */
const rendererPublicPage: { [key: string]: () => string | Promise<string> } = {
  'home': home,
  'login': login,
  'register': register,
  'documentation': documentation,
};

/**
 * Render des pages public (user non connecte ou pas encore de compte)
 */
export async function renderPublicPage(page: string, updateHistory: boolean = true) {

  const main_container = document.querySelector<HTMLDivElement>('#app')!
  const lang = sessionStorage.getItem('lang') || 'en';

  setupColorTheme('dark');

	fadeOut();
	setTimeout(async () => {

		const rendererFunction = rendererPublicPage[page];
		if (!rendererFunction) {
			return renderErrorPage('404', '404', 'not-found');
		}
		
		const page_content = await Promise.resolve(rendererFunction());
		main_container.innerHTML = page_content;

    translatePage(lang);
    if (updateHistory) {
      addToHistory(page, updateHistory);
    }

    removeLoadingScreen();

		fadeIn();
	}
		, 250);
}

/**
 * Associe les pages privees aux fonctions de rendu
 */
const rendererPrivatePage: { [key: string]: (user: UserInfo) => string | Promise<string> } = {
	'WelcomeYou': welcomeYouPage,
	'dashboard': dashboard,
	'settings': settings,
	'profile': profile,
	'documentation': documentation,
}

/**
 * Render des pages prive (user connectee) mais surtout verification si l'utilisation
 * a bien une session active avant de render une page privee
 */
export async function renderPrivatePage(page: string, updateHistory: boolean = true) {

  if (!socket) {
    socketConnection();
  }

  let lang = 'en';
  let theme = 'dark';
  let response;
  let token;
  [token , response] = await Promise.all ([
    fetchToken(),
    getUserInfo()
  ])
  if (token.status === "error" || response.status === "error") {
    return renderErrorPage('400', '401', 'unauthorized');
  }
  lang = response.data!.preferences!.lang;
  theme = response.data!.preferences!.theme;

  
	fadeOut();
  
  setTimeout(async () => {
    
    const main_container = document.querySelector<HTMLDivElement>('#app')!
    const rendererFunction = rendererPrivatePage[page];
    if (!rendererFunction) {
      return renderErrorPage('404', '404', 'not-found');
    }
    const page_content = await Promise.resolve(rendererFunction(response.data!));

    main_container.innerHTML = page_content;
    setupColorTheme(theme);

    translatePage(lang);
    if (updateHistory) {
      addToHistory(page, updateHistory);
    }

    removeLoadingScreen();

		fadeIn();

    if (page === 'WelcomeYou') {
      handleWelcomeYouPage();
    }
  }, 250);
}

export async function renderGame(roomData: RoomData) {

  
  let lang = 'en';
  let theme = 'dark';
  let response;
  
  try {
    [ , response] = await Promise.all ([
      fetchToken(),
      getUserInfo()
    ])
    lang = response.data!.preferences!.lang;
    theme = response.data!.preferences!.theme;
    
  } catch (error){
    return renderErrorPage('400', '401', 'unauthorized');
  }
	fadeOut();
  
  setTimeout(async () => {
    const main_container = document.querySelector<HTMLDivElement>('#app')!
    const newContainer = await game(roomData.roomId, response.data!);
    if (!newContainer) {
      return;
    }

    main_container.innerHTML = newContainer;
    setupColorTheme(theme);

    translatePage(lang);

    removeLoadingScreen();

		fadeIn();
  }, 250);
}

import { renderOtherProfile } from '../pages/OtherProfile'
import { redocInit } from '../components/utils/redocInit'

export async function renderOtherProfilePage(target: HTMLElement) {


  let lang = 'en';
  let theme = 'dark';
  let response;
  try {
    [ , response] = await Promise.all ([
      fetchToken(),
      getUserInfo()
    ])
    lang = response.data!.preferences!.lang;
    theme = response.data!.preferences!.theme;
  
  } catch (error){
    return renderErrorPage('400', '401', 'unauthorized');
  }

	fadeOut();

  setTimeout(async () => {
    const main_container = document.querySelector<HTMLDivElement>('#app')!
    const newContainer = await renderOtherProfile(target);
    if (!newContainer) {
      return;
    }

    main_container.innerHTML = newContainer;
    setupColorTheme(theme);

    translatePage(lang);

    removeLoadingScreen();

		fadeIn();
	}
		, 250);
}

/**
 * Render des pages d'erreur
 */
const rendererErrorPage: { [key: string]: (code: string, message: string) => string } = {
  '404': notFoundPage,
  '400': errorPage,
  '500': errorPage,
}

export async function renderErrorPage(codePage: string, code: string, message: string) {

  const main_container = document.querySelector<HTMLDivElement>('#app')!

  const user = await getUserInfo();
  const lang = user.data === undefined ? 'en' : user.data!.preferences!.lang;
  const theme = user.data === undefined ? 'dark' : user.data!.preferences!.theme;

	setupColorTheme(theme);
	fadeOut();

  setTimeout(async () => {
    const rendererFunction = rendererErrorPage[codePage] || notFoundPage;
    const page_content = rendererFunction(code, message);

    main_container.innerHTML = page_content;
    translatePage(lang);

    addToHistory(code, false);

    removeLoadingScreen();

		fadeIn();
	}
		, 250);
}

const logoDoc: { [key: string]: string } = {'user': '/images/duckHandsUp.png',
	 'upload': '/images/duckUpload.png',
	 'people': '/images/duckSocial.png',
	 'game': '/images/dashboard.png',
   'auth': '/images/duckAPI.png',
};

export async function renderDocPages(page: string, index_logo: string) {
	
	const redoc_container = document.getElementById('redoc-container') as HTMLDivElement;
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
	renderPrivatePage(page, false);
}
