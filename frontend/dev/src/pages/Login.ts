import { saveLanguage } from "../i18n/translate"
import { renderForm } from "../components/ui/form"
import { loadGoodLanguageGoogleScript, renderButtonGoogle } from "../components/Google"
import { BackButton } from "../components/ui/back-button"


function renderTitle() {
	return `
	<div class="text-6xl p-7 font-title" translate="login">Login</div>
	`;
}

function renderLoginForm() {
	return `
	${renderForm({
		id: "LoginForm",
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
		],
		button: {
			id: "loginForm",
			text: "Login",
			translate: "login",
			type: "submit",
		},
	})}
	`;
}

function renderRegisterButton() {
	return `
	<div class="flex flex row">
	<div class="font-text text-grey p-2" translate="no_account">Don't have an account? </div>
	<div id="loadRegister" class="font-title text-secondary cursor-pointer p-2 hover:text-tertiary" translate="register" >Register</div>
	</div>
	`;
}

function renderLoginPage() {
	return `
	<div class='flex flex-col items-center justify-center h-screen space-y-4 text-white backdrop-filter backdrop-blur-xs'>
	${renderTitle()}
	${renderLoginForm()}
	${renderButtonGoogle()}
	${renderRegisterButton()}
	${BackButton()}
	</div>
	`;
}

export function loginPage() {
	saveLanguage();
	loadGoodLanguageGoogleScript();
	return renderLoginPage();
}