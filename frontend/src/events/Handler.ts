import { registerUser } from './user/userRegister'
import { loginUser } from './user/userLogin'
import { logOutUser } from './user/userLogout'
import { deleteUser } from '../events/user/userDelete'
import { changeLanguage, changeLanguageSettings, saveDefaultLanguage } from '../i18n/Translate'
import { handleSearchUserGame } from '../people/onlineUserSearch'

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

import { createGame } from '../game/gameCreation'
import { blockUser, sendInvitationToUser, sendRefuseInvitation } from './user/userFriend'
import { addNewMessage } from '../chat/newMessage'
import { renderOtherProfilePage } from '../components/renderPage'

/** Si l'utilisateur click sur l'element id = key on appelle la fonction associée */
const clickEvent: {[key: string]: (event: MouseEvent) => void } = {

	// * -------------- Public Page Load -------------- */
	'loadhome': () => renderPublicPage('home'),
	'loadlogin': () => renderPublicPage('login'),
	'loadregister': () => renderPublicPage('register'),
	'loginForm': () => loginUser(),
	'google': () => {
		window.location.href = 'http://localhost:3000/api/user/login/google'
	},

	// * -------------- Private Page Load -------------- */
	'loaddashboard': () => renderPrivatePage('dashboard'),
	'user-menu-button': () => toggleUserMenu(),

	// * -------------- Profile Page  -------------- */
	'loadprofile': () => renderPrivatePage('profile'),
	'changeUserInfo': () => changeUserNameEmail(),
	'change-password': () => changeUserPassword(),
	'add-friend': () => sendInvitationToUser(event?.target as HTMLElement),
	'block-user': () => blockUser(event?.target as HTMLElement),
	'refuse-invitation': () => sendRefuseInvitation(event?.target as HTMLElement),
	
		// * ---- Image Editor  ---- */
		'cancel-image': () => cancelEditor(),
		'save-image': () => saveNewPicture(),
		'file-upload': () => showEditorPicture(),
		'banner-upload': () => showEditorPicture("BANNER"),
	// * -------------- Settings Page  -------------- */
	'loadsettings': () => renderPrivatePage('settings'),
	'saveLang': () => saveDefaultLanguage(),
	'deleteAccount': () => deleteUser(),
	'logout': () =>  logOutUser(),

	// * -------------- Chat  -------------- */
	'send-chat': () => addNewMessage(),

	// * -------------- Common Components  -------------- */

	'loadBackPage': () => renderBackPage(),
	'showGameStat': () => toggleGameStat(),
	'showTruc': () => toggleTruc(),
	'createGame': () => createGame(),

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
const inputChangetEvent: {[key: string]: (inputValue: DOMStringMap) => void } = {
	'lang-selector': (inputValue) => changeLanguageSettings(inputValue),
	'game-type': (inputValue) => toggleGameSettings(inputValue),
	'local': (inputValue) => toggleGameSettings(inputValue),
}

const inputEvent: {[key: string]: (value: string) => void } = {
	'search-user': (value) => handleSearchUserGame(value),
}

const clickSpecial: {[key: string]: (event: MouseEvent) => void } = {
	'otherProfile': (event) => renderOtherProfilePage(event.target as HTMLElement),
};

/**
 * Gestionnaire principale des evenements de la page
 */
export function addAllEventListenOnPage(container : HTMLDivElement) {

	container.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		
		hideToggleElements(target);
		console.log("target", target.id);
		if (target.id in clickEvent) {
			clickEvent[target.id](event);
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
		if (target.name in inputChangetEvent){
			if (target.dataset) {
				inputChangetEvent[target.name](target.dataset);
			}
		}
	});

	container.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		const name = target.getAttribute("name");
		console.log("name", name);
		if (!name) return;
		if (name in clickSpecial){
			console.log("clickSpecial", name);
			if (target.dataset) {
				clickSpecial[name](event);
			}
		}
	});

	container.addEventListener('input', (event) => {
		const target = event.target as HTMLInputElement;
		if (target.id in inputEvent) {
			if (target.dataset) {
				inputEvent[target.id](target.value);
			}
		}
	});

}
