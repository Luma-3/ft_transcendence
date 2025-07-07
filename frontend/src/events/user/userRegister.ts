import { renderErrorPage, renderPublicPage } from '../../controllers/renderPage'

import { alertPublic } from '../../components/ui/alert/alertPublic';
import { verifRegexPassword } from '../../components/utils/regex';
import { loadTranslation } from '../../controllers/Translate';

import { API_USER, API_SESSION } from '../../api/routes';
import { fetchApiWithNoError as fetchApiWithNoCriticError } from '../../api/fetch';

import { socketConnection } from '../../socket/Socket';

export let userEmail: string;
export let userLang: string;

function error(message: string) {
	alertPublic(message, "error");
	return;
}

function verifValueForm(userData: Record<string, string>) {
	/**
	 * Verification si le formulaire est pas corrompu
	 */
	if (!userData.username || !userData.password || !userData.passwordVerif) {
		return renderErrorPage('401');
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
	 * Recuperation de la langue precedemment seleREGISTERctionne par l'utilisateur
	 * et suppression de la valeur dans le sessionStorage
	 */
	const lang = sessionStorage.getItem('lang') ?? 'en';
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

	/**
	 * Creation de l'objet userData qui sera envoye au serveur
	 * avec les donnees du formulaire et la langue
	 * et les preferences par defaut
	 */
	const userData = {
		username: formEntry.username,
		password: formEntry.password,
		passwordVerif: formEntry.passwordVerif,
		email: formEntry.email,
		preferences: {
			lang: lang,
		}
	}

	userEmail = formEntry.email;
	userLang = lang;

	/**
	 * Creation de l'utilisateur
	 */
	const response = await fetchApiWithNoCriticError(API_USER.BASIC.REGISTER, {
		method: 'POST',
		body: JSON.stringify(userData)
	});
	if (response.status !== "success") {
		const errorMessage = trad[response.message] || response.message;
		return error(errorMessage)
	}

	renderPublicPage('verifyEmail');
}