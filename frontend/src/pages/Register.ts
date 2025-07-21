import { headerPage } from "../components/ui/headerPage";
import { Form } from "../classes/Form";
import { InputField } from "../classes/Input";
import { Button } from "../classes/Button";
import { verifRegexPassword } from "../components/utils/regex";
import { renderErrorPage, renderPublicPage } from "../controllers/renderPage";
import { FetchInterface } from "../api/FetchInterface";
import { alert } from "../components/ui/alert/alert";

let formInstance: Form | null;

function renderRegisterPage() {
	const inputs = [
		new InputField(
			"username",
			"text",
			"Username",
			"username",
			true,
			"username"),

		new InputField(
			"email",
			"email",
			"Email",
			"email",
			true,
			"email"),

		new InputField(
			"password",
			"password",
			"Password",
			"current-password",
			true,
			"password"),

		new InputField(
			"passwordVerif",
			"password",
			"Verify Password",
			"current-password",
			true,
			"verif-password"),
	]

	const button = [new Button(
		"registerForm",
		"full",
		"Register",
		"register",
		"primary",
		"submit")
	]

	formInstance = new Form("registerForm", inputs, button)


	return `
<div class="flex flex-col font-title text-responsive-size dark:text-dtertiary justify-center items-center mt-10 mb-10">

	${headerPage("register", "public")}

	${formInstance.toHtml()}

</div>`;
}

export default function registerPage() {
	return renderRegisterPage()
}

export let userRegisterInfo: { email: string, lang: string } | null = null;


export async function registerUser() {

	const values = formInstance?.getValues("registerForm");
	if (!values) { return }


	/**
	 * Verification des valeurs du formulaire directement avec les entrees
	 */
	if (verifValueForm(values) === false || verifRegexPassword(values.password) === false) {
		return;
	}

	/**
	 * Creation de l'objet userData qui sera envoye au serveur
	 * avec les donnees du formulaire et la langue
	 * et les preferences par defaut
	 */
	const userData = {
		username: values.username,
		password: values.password,
		passwordVerif: values.passwordVerif,
		email: values.email,
		preferences: {
			lang: localStorage.getItem('lang') ?? 'en'
		}
	}
	// sessionStorage.removeItem('lang');

	/**
	 * Creation de l'utilisateur
	 */
	const success = await FetchInterface.registerUser(userData);
	if (!success) {
		return;
	}
	userRegisterInfo = {
		email: userData.email,
		lang: userData.preferences.lang,
	};
	renderPublicPage('verifyEmail');
}

export function verifValueForm(userData: Record<string, string>) {
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
		alert("error", "passwords-dont-match");
		return false;
	}
	return true;
}