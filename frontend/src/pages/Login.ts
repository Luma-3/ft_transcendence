import { messageWithLink } from "../components/ui/messageWithLink";
import { headerPage } from "../components/ui/headerPage";
import { Form } from "../classes/Form";
import { InputField } from "../classes/Input";
import { Button } from "../classes/Button";
import { renderPrivatePage } from "../controllers/renderPage";
import { socketConnection } from "../socket/Socket";
import { FetchInterface } from "../api/FetchInterface";

let formInstance: Form | null;

export function renderLoginPage() {

	const inputs = [
		new InputField(
			"username",
			"text",
			"username",
			"username",
			true,
			"username"),
		
		new InputField(
			"password",
			"password",
			"Password",
			"current-password",
			true,
			"password")
	]
	const buttons = [
		new Button(
			"loginForm",
			"full",
			"Login",
			"login",
			"primary",
			"submit",
		),
		new Button(
		"google",
		"full",
		"google-login",
		"google-login",
		"secondary",
		"button",
		)

	]
	formInstance = new Form("LoginForm", inputs, buttons)
return `
<div class="flex flex-col font-title text-responsive-size dark:text-dtertiary justify-center items-center mt-40">

	${headerPage("login", "public")}
	${formInstance.toHtml()}

	${messageWithLink("no-account", "register", "loadregister")}

</div>`;
}

export default function loginPage() {
  return renderLoginPage();
}

export async function loginUser() {

	/**
	 * Validation du formulaire de connexion
	 * Verification si le formulaire est pas corrompu
	 */
	const values = formInstance?.getValues("LoginForm");
	
	if (!values) { return; }
	
	if (values.username === "" || values.password === "") {
		return;
	}

	formInstance = null;
	
	const user = {
		username: values.username,
		password: values.password
	}
	/**
	 * Creation de session
	 */
	const success = await FetchInterface.createSession(user);
	if (success) {
		/**
		 * Creation du socket qui sera bien utile pour le pong
		 * le chat et toutes communications bidirectionnelles
		 * entre le client et le serveur qui ont besoin d'etre en temps reel
		 */
		socketConnection();
		
		renderPrivatePage('dashboard');
	}
	
}
