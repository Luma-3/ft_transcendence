
/**
 * Gestion du changement de mot de passe avec un pop-up alert
 * appelle lors du click sur le bouton "Change password" sur la page profil
 */

import { API_USER } from "../../api/routes";
import { alertChangePassword } from "../../components/ui/alert/alertChangePassword";

export async function changeUserPassword() {

	await alertChangePassword();
	return ;
}

/**
 * Gestion du changement d'email et de nom d'utilisateur
 * avec un alert de confirmation ou d'erreur
 */
import { renderPrivatePage } from "../../components/renderPage";

import { alertTemporary } from "../../components/ui/alert/alertTemporary"
import { loadTranslation } from "../../i18n/Translate";
import { getUserInfo } from "../../api/getter";
import { patchUserInfo } from "../../api/updater";

export async function changeUserNameEmail() {
	
	/**
	 * Recuperation des infos du user et chargement des traductions
	 */
	const response = await getUserInfo();
	if (response.status === "error" || !response.data) {
		return alertTemporary("error", "Error while fetching user info", 'dark');
	}
	const user = response.data;
	const trad = await loadTranslation(response.data.preferences.lang);
	
	/**
	 * Recuperation des donnees du formulaire
	 */
	const form = document.getElementById("saveChangeBasicUserInfo") as HTMLFormElement;
	const formData = new FormData(form);
	const formEntry = Object.fromEntries(formData) as Record<string, string>;
	
	let dataEntry = {
		username: formEntry.username,
		email: formEntry.email,
	}

	/**
	 * Verifie si il n'y a pas de changement
	 */
	if (user.username === dataEntry.username && user.email === dataEntry.email) {
		return alertTemporary("info", trad["no-changes-detected"], user.preferences.theme);
	}

	/**
	 * Changement du username si il est different de l'ancien
	 */
	if (dataEntry.username !== user.username) {
		const updateResponse = await patchUserInfo(API_USER.UPDATE.USERNAME, dataEntry.username, "username");
		if (updateResponse.status === "error") {
			return alertTemporary("error", trad["username-already-in-use"], user.preferences.theme);
		}
	}

	/**
	 * Changement de l'email si il est different de l'ancien
	 */
	if (dataEntry.email !== user.email) {
		const updateResponse = await patchUserInfo(API_USER.UPDATE.EMAIL, dataEntry.email, "email");
		if (updateResponse.status === "error") {
			return alertTemporary("error", trad["email-already-in-use"], user.preferences.theme);
		}
	}

	/**
	 * Affichage d'une alerte pour valider les changements
	 * et rerender de la page pour mettre a jour tout les element qui affiche le nom d'utilisateur ou l'email
	 */
	alertTemporary("success", trad["user-info-updated"], user.preferences.theme);
	return renderPrivatePage('profile', false);
}