import { renderPrivatePage, renderErrorPage } from '../../components/renderPage'

import { alertPublic } from '../../components/ui/alert/alertPublic';
import { verifRegexPassword } from '../../components/utils/regex';
import { loadTranslation } from '../../i18n/Translate';

import { API_USER, API_SESSION } from '../../api/routes';
import { User } from '../../api/interfaces/User';
import { fetchWithNoToken } from '../../api/fetch'

import { createSocketConnection } from '../../socket/createSocket';

function error(message: string) {
	alertPublic(message, "error");
	return;
}

function verifValueForm(userData: Record<string, string>) {
	/**
	 * Verification si le formulaire est pas corrompu
	 */
	if (!userData.username || !userData.password || !userData.passwordVerif) {
		return renderErrorPage('400','400', "bad-request"), false;
	}
	/**
	 * Verification si les mots de passe sont identiques
	 */
	if (userData.password !== userData.passwordVerif) { 
		return error("passwords-dont-match"), false;
	}
	return true;
}

export async function registerUser() {
	
	const form = document.forms.namedItem("registerForm") as HTMLFormElement;
	
	if (!form) { return; }

	/**
	 * Recuperation de la langue precedemment selectionne par l'utilisateur
	 * et suppression de la valeur dans le sessionStorage
	 */
	const lang = sessionStorage.getItem('lang') || 'en';
	sessionStorage.removeItem('lang');

	
	const formData = new FormData(form);
	const formEntry = Object.fromEntries(formData) as Record<string, string>;
	
	/**
	 * Verification des valeurs du formulaire directement avec les entrees
	 */
	if (verifValueForm(formEntry) === false || verifRegexPassword(formEntry.password) === false) {
		return;
	}
	
	/**
	 * Chargement des traductions dans la langue selectionne
	 * Chargement des donnees utilisateur pour les fetchs
	 */
	const trad = await loadTranslation(lang);
	const userData = {
		username: formEntry.username,
		password: formEntry.password,
		passwordVerif: formEntry.passwordVerif,
		email: formEntry.email,
		preferences: {
			lang: lang,
		}
	}

	/**
	 * Creation de l'utilisateur
	 */
	const response = await fetchWithNoToken<User>(API_USER.BASIC.REGISTER, {
		method: 'POST',
		body: JSON.stringify(userData)
	});
	if (response.status !== "success") {
		const errorMessage = trad[response.message] || response.message;
		return error(errorMessage)
	}

	/**
	 * Creation de la session
	 */
	const sessionData = { username: userData.username, password:userData.password };
	const responseSession = await fetchWithNoToken(API_SESSION.CREATE, {
		method: "POST",
		body: JSON.stringify(sessionData)
	});
	if (responseSession.status !== "success") {
		const errorMessage = trad[responseSession.message] || responseSession.message;
		return error(errorMessage)
	}

	/**
	 * Creation du socket qui sera bien utile pour le pong
	 * le chat et toutes communications bidirectionnelles
	 * entre le client et le serveur qui ont besoin d'etre en temps reel
	 */
	createSocketConnection();
	
	/**
	 * Affichage de la page de welcome avant le dashboard(car nouvel utilisateur)
	 */
	renderPrivatePage('WelcomeYou');
}