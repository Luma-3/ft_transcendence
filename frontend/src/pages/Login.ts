import { messageWithLink } from "../components/ui/messageWithLink";
import { headerPage } from "../components/ui/headerPage";
import { Form } from "../classes/Form";
import { InputField } from "../classes/Input";
import { Button } from "../classes/Button";

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
	const loginForm = new Form("LoginForm", inputs, buttons)
return `
<div class="flex flex-col font-title text-responsive-size dark:text-dtertiary justify-center items-center mt-40">

	${headerPage("login", "public")}
	${loginForm.toHtml()}

	${messageWithLink("no-account", "register", "loadregister")}

</div>`;
}

export default function loginPage() {
  return renderLoginPage();
}
