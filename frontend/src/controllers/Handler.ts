import { registerUser } from '../pages/Register'
import { loginUser } from '../pages/Login'
import { logOutUser } from '../events/user/userLogout'
import { deleteUser } from '../events/user/userDelete'
import { changeLanguage, changeLanguageSettings, saveDefaultLanguage } from './Translate'
import { handleSearchUserGame } from '../events/social/onlineUserSearch'

import { renderPublicPage, renderPrivatePage, renderDocPages } from '../controllers/renderPage'
import { renderBackPage } from '../controllers/renderPage'

import { changeLightMode } from '../components/utils/togglers/toggleLight'
import { toggleUserMenu } from '../components/utils/togglers/toggleUserMenu'
import { toggleGameSettings } from '../components/utils/togglers/toggleGameSettings'
import { hideToggleElements } from '../components/utils/hideToggleElements'

import { changeUserNameEmail } from '../pages/Profile/Profile'
import { changeUserPassword } from '../pages/Profile/Profile'
import { showEditorPicture } from '../components/utils/imageEditor'
import { saveNewPicture } from '../components/utils/imageEditor'
import { cancelEditor } from '../components/utils/imageEditor'

import { initGame } from '../events/game/gameInit'
import { renderOtherProfilePage } from '../controllers/renderPage'
import { friendRequest } from '../events/social/acceptInvitation'
import { blockUser } from '../events/social/blockUser'
import { cancelFriendInvitation } from '../events/social/cancelInvitation'
import { refuseFriendInvitation } from '../events/social/refusedInvitation'
import { unfriendUser } from '../events/social/removeFriend'
import { disable2FA, enable2FA, submit2FACode, submit2FACodeLogin } from '../2FA'
import { showNotificationDiv } from '../components/ui/alert/notificationsAlert'
import { sendEmail } from '../components/utils/sendEmail'
import { initializeVerifyEmailTimers } from '../events/email/verifyEmailTimers'


import { FetchInterface } from '../api/FetchInterface'

/** Si l'utilisateur click sur l'element id = key on appelle la fonction associée */
const clickEvent: { [key: string]: (event: MouseEvent) => void } = {

	// ═══════════════════════════════════════════════════════════════
	// 🌐 PAGES PUBLIQUES
	// ═══════════════════════════════════════════════════════════════
	'loadhome': () => renderPublicPage('home'),
	'loadlogin': () => renderPublicPage('login'),
	'loadregister': () => renderPublicPage('register'),
	'loaddocumentation': () => renderPublicPage('documentation'),

	// ═══════════════════════════════════════════════════════════════
	// 🔐 AUTHENTIFICATION
	// ═══════════════════════════════════════════════════════════════
	'loginForm': () => loginUser(),
	'google': () => {
		window.location.href = 'https://localhost:5173/api/auth/oauth2/google'
	},
	'logout': () => logOutUser(),

	// ═══════════════════════════════════════════════════════════════
	// 🏠 PAGES PRIVÉES
	// ═══════════════════════════════════════════════════════════════
	'loaddashboard': () => renderPrivatePage('dashboard'),
	'loadprofile': () => renderPrivatePage('profile'),
	'loadsettings': () => renderPrivatePage('settings'),
	'loadfriends': () => renderPrivatePage('friends'),

	// ═══════════════════════════════════════════════════════════════
	// 👤 GESTION UTILISATEUR
	// ═══════════════════════════════════════════════════════════════
	'change-password': () => changeUserPassword(),
	'deleteAccount': async () => await FetchInterface.deleteUser(),
	'user-menu-button': () => toggleUserMenu(),

	// ═══════════════════════════════════════════════════════════════
	// 👥 GESTION SOCIALE
	// ═══════════════════════════════════════════════════════════════
	'add-friend': (event) => friendRequest(event.target as HTMLElement, "send"),
	'accept-friend': (event) => friendRequest(event.target as HTMLElement, "accept"),
	'unfriend-user': (event) => unfriendUser(event.target as HTMLElement),
	'cancel-invitation': (event) => cancelFriendInvitation(event.target as HTMLElement),
	'refuse-invitation': (event) => refuseFriendInvitation(event.target as HTMLElement),

	// ═══════════════════════════════════════════════════════════════
	// 🚫 BLOCAGE UTILISATEURS
	// ═══════════════════════════════════════════════════════════════
	'block-user': (event) => blockUser(event.target as HTMLElement, false),
	'unblock-user': (event) => blockUser(event.target as HTMLElement, true),

	// ═══════════════════════════════════════════════════════════════
	// 🖼️ ÉDITEUR D'IMAGES
	// ═══════════════════════════════════════════════════════════════
	'file-upload': () => showEditorPicture(),
	'banner-upload': () => showEditorPicture("BANNER"),
	'save-image': () => saveNewPicture(),
	'cancel-image': () => cancelEditor(),

	// ═══════════════════════════════════════════════════════════════
	// ⚙️ PARAMÈTRES & PRÉFÉRENCES
	// ═══════════════════════════════════════════════════════════════
	'saveLang': () => saveDefaultLanguage(),
	'enable2fa': () => enable2FA(),
	'disable2fa': () => disable2FA(),

	// ═══════════════════════════════════════════════════════════════
	// 🎮 JEUX
	// ═══════════════════════════════════════════════════════════════
	'initGame': () => initGame(),

	// ═══════════════════════════════════════════════════════════════
	// 🔔 NOTIFICATIONS
	// ═══════════════════════════════════════════════════════════════
	'notifications': () => showNotificationDiv(),

	// ═══════════════════════════════════════════════════════════════
	// 📧 EMAIL
	// ═══════════════════════════════════════════════════════════════
	'send-email': () => sendEmail(),
	'initVerifyEmailTimers': () => initializeVerifyEmailTimers(),

	// ═══════════════════════════════════════════════════════════════
	// 📚 DOCUMENTATION
	// ═══════════════════════════════════════════════════════════════
	'showUserDoc': () => renderDocPages('/api/user/doc/json', "user"),
	'showUploadDoc': () => renderDocPages('/api/uploads/doc/json', "upload"),
	'showGameDoc': () => renderDocPages('/api/game/doc/json', "game"),
	'showAuthDoc': () => renderDocPages('/api/auth/doc/json', "auth"),

	// ═══════════════════════════════════════════════════════════════
	// 🔄 NAVIGATION
	// ═══════════════════════════════════════════════════════════════
	'loadBackPage': () => renderBackPage(),

};

/** Si l'utilisateur change la valeur de l'element id = key on appelle la fonction associée */
const changeEvent: { [key: string]: () => void } = {
	'language': () => changeLanguage(""),
	'switch-component': changeLightMode,

};

/** Si l'utilisateur soumet le formulaire id = key on appelle la fonction associée */
const submitEvent: { [key: string]: () => void } = {
	'loginForm': loginUser,
	'registerForm': registerUser,
	'2faCodeForm': submit2FACode,
	'2faCodeLoginForm': submit2FACodeLogin,
	'updateInfosUserForm': changeUserNameEmail
};

/**
 * Gestion des appels lors de gestion dynamique de fonction avec des listes
 * ou plusieurs elements dynamiques
 */
const inputChangetEvent: { [key: string]: (inputValue: DOMStringMap) => void } = {
	'lang-selector': (inputValue) => changeLanguageSettings(inputValue),
	'game-type': (inputValue) => toggleGameSettings(inputValue),
	'local': (inputValue) => toggleGameSettings(inputValue),
}

const inputEvent: { [key: string]: (value: string) => void } = {
	'search-user': (value) => handleSearchUserGame(value),
}

const clickSpecial: { [key: string]: (event: MouseEvent) => void } = {
	'otherProfile': (event) => renderOtherProfilePage(event.target as HTMLElement),
};

/**
 * Gestionnaire principale des evenements de la page
 */
export function addAllEventListenOnPage(container: HTMLDivElement) {

	container.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;

		hideToggleElements(target);
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
		if (target.name in inputChangetEvent) {
			if (target.dataset) {
				inputChangetEvent[target.name](target.dataset);
			}
		}
	});

	container.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		const name = target.getAttribute("name");
		if (!name) return;
		if (name in clickSpecial) {
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
