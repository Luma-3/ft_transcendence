import { headerPage } from "../components/ui/headerPage";
import { Form } from "../classes/Form";
import { InputField } from "../classes/Input";
import { Button } from "../classes/Button";

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
			"password"),
	]

	const button = [ new Button(
			"registerForm",
			"full",
			"Register",
			"register",
			"primary",
			"submit")
		]

const registerForm = new Form("registerForm", inputs, button)


return `
<div class="flex flex-col font-title text-responsive-size dark:text-dtertiary justify-center items-center mt-40">

	${headerPage("register", "public")}

	${registerForm.toHtml()}

</div>`;
}

export default function registerPage() {
	return renderRegisterPage()
}