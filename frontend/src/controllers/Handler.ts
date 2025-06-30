import { registerUser } from '../events/user/userRegister'
import { loginUser } from '../events/user/userLogin'
import { logOutUser } from '../events/user/userLogout'
import { deleteUser } from '../events/user/userDelete'
import { changeLanguage, changeLanguageSettings, saveDefaultLanguage } from './Translate'
import { handleSearchUserGame } from '../events/social/onlineUserSearch'

import { renderPublicPage, renderPrivatePage, renderDocPages } from '../controllers/renderPage'
import { renderBackPage } from '../controllers/renderPage'

import { changeLightMode } from '../components/utils/toggleLight'
import { toggleUserMenu } from '../components/utils/toggleUserMenu'
import { toggleGameStat } from '../components/utils/toggleGameStat'
import { toggleChat } from '../components/utils/toggleChat'
import { toggleGameSettings } from '../components/utils/toggleGameSettings'
import { hideToggleElements } from '../components/utils/hideToggleElements'

import { changeUserNameEmail } from '../events/user/userChange'
import { changeUserPassword } from '../events/user/userChange'
import { showEditorPicture } from '../components/utils/imageEditor'
import { saveNewPicture } from '../components/utils/imageEditor'
import { cancelEditor } from '../components/utils/imageEditor'

import { createGame } from '../events/game/gameCreation'
import { addNewMessage } from '../chat/newMessage'
import { renderOtherProfilePage } from '../controllers/renderPage'
import { friendRequest } from '../events/social/acceptInvitation'
import { blockUser } from '../events/social/blockUser'
import { cancelFriendInvitation } from '../events/social/cancelInvitation'
import { refuseFriendInvitation } from '../events/social/refusedInvitation'
import { unfriendUser } from '../events/social/removeFriend'
import { disable2FA, enable2FA, submit2FACode } from '../2FA'
import { showNotificationDiv } from '../events/notifications/notificationsDiv'

/** Si l'utilisateur click sur l'element id = key on appelle la fonction associée */
const clickEvent: { [key: string]: (event: MouseEvent) => void } = {

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
  'loaddocumentation': () => renderPublicPage('documentation'),
  'user-menu-button': () => toggleUserMenu(),

  // * -------------- Profile Page  -------------- */
  'loadprofile': () => renderPrivatePage('profile'),
  'changeUserInfo': () => changeUserNameEmail(),
  'change-password': () => changeUserPassword(),
  
  'add-friend': () => friendRequest(event?.target as HTMLElement, "send"),
  'accept-friend': () => friendRequest(event?.target as HTMLElement, "accept"),
  
  'unfriend-user': () => unfriendUser(event?.target as HTMLElement),
  
  'unblock-user': () => blockUser(event?.target as HTMLElement, true),
  'block-user': () => blockUser(event?.target as HTMLElement, false),
  
  'cancel-invitation': () => cancelFriendInvitation(event?.target as HTMLElement),
  'refuse-invitation': () => refuseFriendInvitation(event?.target as HTMLElement),

  // * ---- Image Editor  ---- */
  'cancel-image': () => cancelEditor(),
  'save-image': () => saveNewPicture(),
  'file-upload': () => showEditorPicture(),
  'banner-upload': () => showEditorPicture("BANNER"),

  // * -------------- Settings Page  -------------- */
  'loadsettings': () => renderPrivatePage('settings'),
  'saveLang': () => saveDefaultLanguage(),
  'deleteAccount': () => deleteUser(),
  'logout': () => logOutUser(),

  // * -------------- Friends Page   -------------- */
  'loadfriends': () => renderPrivatePage('friends'),


  'notifications': () => showNotificationDiv(),

  // * -------------- Settings  -------------- */
  'enable2fa': () => enable2FA(),
  'disable2fa': () => disable2FA(),

  // * -------------- Chat  -------------- */
  'send-chat': () => addNewMessage(),

  // * -------------- Common Components  -------------- */

  'loadBackPage': () => renderBackPage(),
  'showGameStat': () => toggleGameStat(),
  'showChat': () => toggleChat(),
  'createGame': () => createGame(),

  // * -------------- Documentation  -------------- */
  'showUserDoc': () => renderDocPages('/api/user/doc/json', "user"),
  'showUploadDoc': () => renderDocPages('/api/uploads/doc/json', "upload"),
  'showGameDoc': () => renderDocPages('/api/game/doc/json', "game"),
  'showAuthDoc': () => renderDocPages('/api/auth/doc/json', "auth"),

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
  '2faCodeForm': submit2FACode
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
