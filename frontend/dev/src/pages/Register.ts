import { loadGoodLanguageGoogleScript } from "../components/Google"
import { renderButtonGoogle } from "../components/Google"
import { BackButton } from "../components/ui/back-button"
import { renderForm } from "../components/ui/form"

function renderTitle() {
	return `
	<div class="text-6xl p-7 font-title" translate="register">Register</div>
	`
}

function renderRegisterForm() {
	return `
	${ renderForm({
		id: "registerForm",
		inputs: [
			{
				id: "username",
				type: "text",
				placeholder: "username",
				autocomplete: "username",
				required: true,
				translate: "username",
			},
			{
				id: "password",
				type: "password",
				placeholder: "Password",
				autocomplete: "current-password",
				required: true,
				translate: "password",
			},
			{
				id: "passwordVerif",
				type: "password",
				placeholder: "Verify Password",
				autocomplete: "current-password",
				required: true,
				translate: "verif_password",
			},
		],
		button: {
			id: "registerFormButton",
			text: "Register",
			translate: "register",
			type: "submit",
		},
		
	})}`;
}

function renderRegisterPage() {
	return `
	<div class='flex flex-col items-center justify-center h-screen space-y-4 text-tertiary backdrop-filter backdrop-blur-xs'>
	${renderTitle()}
	${renderRegisterForm()}
	${renderButtonGoogle()}
	${BackButton()}
	</div>
	`
}

export function registerPage() {

	loadGoodLanguageGoogleScript()
	return renderRegisterPage()

}