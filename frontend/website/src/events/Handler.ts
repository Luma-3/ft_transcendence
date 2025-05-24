import { registerUser } from './user/userRegister'
import { loginUser } from './user/userLogin'
import { logOutUser } from './user/userLogout'
import { deleteUser } from '../events/user/userDelete'
import { changeLanguage, changeLanguageSettings, saveDefaultLanguage } from '../i18n/Translate'

import { renderPublicPage, renderPrivatePage } from '../components/renderPage'
import { renderBackPage } from '../components/renderPage'

import { changeLightMode } from '../components/utils/toggleLight'
import { toggleUserMenu } from '../components/utils/toggleUserMenu'
import { toggleGameStat } from '../components/utils/toggleGameStat'
import { toggleTruc } from '../components/utils/toggleTruc'
import { toggleGameSettings } from '../components/utils/toggleGameSettings'
import { hideToggleElements } from '../components/utils/hideToggleElements'

import { changeUserNameEmail } from './user/userChange'
import { changeUserPassword } from './user/userChange'
import { showEditorPicture } from '../components/utils/imageEditor'
import { saveNewPicture } from '../components/utils/imageEditor'
import { cancelEditor } from '../components/utils/imageEditor'

import { initGameData } from '../game/gameInit'

/** Si l'utilisateur click sur l'element id = key on appelle la fonction associée */
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
		'file-upload': () => showEditorPicture(),
	
	// * -------------- Settings Page  -------------- */
	'loadsettings': () => renderPrivatePage('settings'),
	'saveLang': () => saveDefaultLanguage(),
	'deleteAccount': () => deleteUser(),
	'logout': () =>  logOutUser(),

	// * -------------- Common Components  -------------- */

	'loadBackPage': () => renderBackPage(),
	'showGameStat': () => toggleGameStat(),
	'showTruc': () => toggleTruc(),
	'launchGame': () => initGameData(),

};

/** Si l'utilisateur change la valeur de l'element id = key on appelle la fonction associée */
const changeEvent: {[key: string]: () => void } = {
	'language': () => changeLanguage(""),
	'switch-component': changeLightMode,
};

/** Si l'utilisateur soumet le formulaire id = key on appelle la fonction associée */
const submitEvent: {[key: string]: () => void } = {
	'loginForm': loginUser,
	'registerForm': registerUser,
};

/**
 * Gestion des appels lors de gestion dynamique de fonction avec des listes
 * ou plusieurs elements dynamiques
 */
const inputEvent: {[key: string]: (inputValue: DOMStringMap) => void } = {
	'lang-selector': (inputValue) => changeLanguageSettings(inputValue),
	'game-type': (inputValue) => toggleGameSettings(inputValue),
	'local': (inputValue) => toggleGameSettings(inputValue),
}

/**
 * Gestionnaire principale des evenements de la page
 */
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
	/** 
	 * ! Gestion des input pour les elements qui ont un id variable (list, checkbox ...etc)
	 * 
	 */
	container.addEventListener('change', (event) => {
		const target = event.target as HTMLInputElement;
		if (target.name in inputEvent){
			
			if (target.dataset) {
				inputEvent[target.name](target.dataset);
			}
		}
	});

}
