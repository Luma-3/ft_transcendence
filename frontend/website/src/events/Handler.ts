import { changeLanguage, saveDefaultLanguage } from '../i18n/Translate'
import { renderPublicPage, renderPrivatePage } from '../components/renderPage'
import { registerUser } from './user/userRegister'
import { loginUser } from './user/userLogin'
import { changeLightMode } from '../components/utils/toggleLight'
import { toggleUserMenu } from '../components/utils/toggleUserMenu'
import { hideToggleElements } from '../components/utils/hideToggleElements'
import { logOutUser } from './user/userLogout'
import { changeUserNameEmail } from './user/userChange'
import { changeUserPassword } from './user/userChange'
import { changePictureElement } from '../components/utils/imageEditor'
import { saveNewPicture } from '../components/utils/imageEditor'
import { cancelEditor } from '../components/utils/imageEditor'
import { renderBackPage } from '../components/renderPage'
import { toggleGameStat } from '../components/utils/toggleGameStat'
import { toggleTruc } from '../components/utils/toggleTruc'
import { deleteUser } from '../events/user/userDelete'
const clickEvent: {[key: string]: () => void } = {

	// * -------------- Public Page Load -------------- */
	'loadhome': () => renderPublicPage('home'),
	'loadlogin': () => renderPublicPage('login'),
	'loadregister': () => renderPublicPage('register'),
	'loginForm': () => loginUser(),
	'google': () => {
		window.location.href = 'http://localhost:3000/api/user/login/google'
	},
	
	// * -------------- Profile Page  -------------- */
	'loadprofile': () => renderPrivatePage('profile'),
	'changeUserInfo': () => changeUserNameEmail(),
	'change-password': () => changeUserPassword(),
	'user-menu-button': () => toggleUserMenu(),
	
		// * ---- Image Editor  ---- */
		'cancel-image': () => cancelEditor(),
		'save-image': () => saveNewPicture(),
		'file-upload': () => changePictureElement(),
	
	// * -------------- Settings Page  -------------- */
	'loadsettings': () => renderPrivatePage('settings'),
	'saveLang': () => saveDefaultLanguage(),
	'deleteAccount': () => deleteUser(),
	'logout': () =>  logOutUser(),

	// * -------------- Common Components  -------------- */

	'loadBackPage': () => renderBackPage(),
	'showGameStat': () => toggleGameStat(),
	'showTruc': () => toggleTruc(),

};

const changeEvent: {[key: string]: () => void } = {
	'language': () => changeLanguage(undefined),
	'switch-component': changeLightMode,
};

const submitEvent: {[key: string]: () => void } = {
	'loginForm': loginUser,
	'registerForm': registerUser,
};

/**
 * Gestion des appels lors de gestion dynamique de fonction avec des listes
 * ou plusieurs elements dynamiques
 */
const inputEvent: {[key: string]: (inputValue: string) => void } = {
	'lang-selector': (inputValue: string) => changeLanguage(inputValue),
}

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
	container.addEventListener('change', (event) => {
		event.preventDefault();
		const target = event.target as HTMLInputElement;
		if (target.name in inputEvent){
			const inputValue = target.dataset.lang;
			if (inputValue) {
				console.log(inputValue);
				inputEvent[target.name](inputValue);
			}
		}
	});

}
