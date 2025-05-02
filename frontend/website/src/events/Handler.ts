import { changeLanguage, saveDefaultLanguage } from '../i18n/Translate'
import { renderPage } from '../renderers/renderPage'
import { verifPasswordAndRegisterUser } from './userSession/userRegister'
import { loginUser } from './userSession/userLogin'
import { changeLightMode } from '../components/utils/toggleLight'
import { toggleUserMenu } from '../components/utils/toggleUserMenu'
import { hideToggleElements } from '../components/utils/hideToggleElements'
import { logOutUser } from './userSession/userLogout'
import { changeUser } from '../events/userSession/userChange'
import { changeUserPassword } from '../events/userSession/userChange'
import { changePictureElement } from '../components/utils/changePicture'
import { saveNewPicture } from '../components/utils/changePicture'
import { cancelEditor } from '../components/utils/changePicture'
import { renderBackPage } from '../renderers/renderPage'

const clickEvent: {[key: string]: () => void } = {
	'loadBackPage': () => renderBackPage(),
	'loadLoginPage': () => renderPage('login'),
	'loadRegisterPage': () => renderPage('register'),
	'loginForm': () => loginUser(),
	'google': () => {
		window.location.href = 'http://localhost:3000/api/user/login/google'
	},
	
	'user-menu-button': () => toggleUserMenu(),
	'logout': () =>  logOutUser(),
	'loadprofile': () => renderPage('profile'),
	'changeUserInfo': () => changeUser('email'),
	'change-password': () => changeUserPassword(),
	'cancel-image': () => cancelEditor(),
	'save-image': () => saveNewPicture(),
	'file-upload': () => changePictureElement(),

	'loadsettings': () => renderPage('settings'),
	'saveLang': saveDefaultLanguage,
};

const changeEvent: {[key: string]: () => void } = {
	'language': () => changeLanguage(undefined),
	'switch-component': changeLightMode,
};

const submitEvent: {[key: string]: () => void } = {
	'loginForm': loginUser,
	'registerForm': verifPasswordAndRegisterUser,
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
