import { changeLanguage, saveDefaultLanguage } from '../i18n/Translate'
import { renderPage } from '../renderers/renderPage'
import { verifPasswordAndRegisterUser } from './userSession/userRegister'
import { loginUser } from './userSession/userLogin'
import { changeLightMode } from '../components/utils/toggleLight'
import { toggleUserMenu } from '../components/utils/toggleUserMenu'
import { hideToggleElements } from '../components/utils/hideToggleElements'
import { logOutUser } from './userSession/userLogout'
import { changeUserInfo } from '../pages/Profile'
import { changeUserPassword } from '../events/userSession/userChange'

const clickEvent: {[key: string]: () => void } = {
	'loadBackPage': () => window.history.back(),
	'loadLoginPage': () => renderPage('login'),
	'loadRegisterPage': () => renderPage('register'),
	'loadSettingsPage': () => renderPage('settings'),
	'loginForm': () => loginUser(),
	'changeUserInfo': () => changeUserInfo(),
	'user-menu-button': () => toggleUserMenu(),
	'logout': () =>  logOutUser(),
	'google': () => {
		window.location.href = 'http://localhost:3000/api/user/login/google'
	},
	'change-password': () => changeUserPassword(),
	'saveLang': saveDefaultLanguage,
};

const changeEvent: {[key: string]: () => void } = {
	'language': () => changeLanguage(undefined),
	'switch-component': changeLightMode,
};

const submitEvent: {[key: string]: () => void } = {
	'loginForm': loginUser,
	'registerUser': verifPasswordAndRegisterUser,
};


export function addAllEventListenOnPage(container : HTMLDivElement) {

	container.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		
		hideToggleElements(target);
		if (target.id in clickEvent) {
			clickEvent[target.id]();
		}
		
	});
	
	container.addEventListener('change', (event) => {
		const target = event.target as HTMLElement;
		
		if (target.id in changeEvent) {
			changeEvent[target.id]();
		}
	});

	container.addEventListener('submit', (event) => {
		event.preventDefault();
		const target = event.target as HTMLElement;

		if (target.id in submitEvent) {
			submitEvent[target.id]();
		}
	});

}
