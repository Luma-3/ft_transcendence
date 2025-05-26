import { renderErrorPage, renderPrivatePage } from '../../components/renderPage'

import { alertPublic } from '../../components/ui/alert/alertPublic';

import { fetchWithNoToken } from '../../api/fetch';
import { User } from '../../api/interfaces/User';
import { API_SESSION } from '../../api/routes';
import { createSocketConnection } from '../../socket/createSocket';

export async function loginUser() {

	/**
	 * Validation du formulaire de connexion
	 * Verification si le formulaire est pas corrompu
	 */
	const form = document.forms.namedItem("LoginForm") as HTMLFormElement | null;
	if (!form) { return; }

	const formData = new FormData(form);
	const userdata = Object.fromEntries(formData) as Record<string, string>;

	if (userdata.username === "" || userdata.password === "") {
		return;
	}

	/**
	 * Creation de session
	 */
	const response = await fetchWithNoToken<User>(API_SESSION.CREATE,
			{method: "POST", body: JSON.stringify(userdata)})
	
	if (response.status === "error") {
		alertPublic("username-or-password-incorrect", "error");
		return;
	}
	
	/**
	 * Creation du socket qui sera bien utile pour le pong
	 * le chat et toutes communications bidirectionnelles
	 * entre le client et le serveur qui ont besoin d'etre en temps reel
	 */
	createSocketConnection();
	
	/**
	 * Page de ReWelcome (car l'utilisateur a deja un compte)
	 */
	renderPrivatePage('reWelcomeYou');
}