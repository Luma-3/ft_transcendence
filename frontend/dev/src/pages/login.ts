import { saveLanguage } from "../i18n/translate"
import { renderButton } from "../components/buttons"
import { loadGoodLanguageGoogleScript } from "../components/google/google_init"

function renderBackLink() {
	return `
	${renderButton({
		id: "loadHome",
		weight: "1/2",
		text: "Back",
		color: "grey",
		textColor: "primary",
		translate: "back-link",
	})}
	`;
}

function renderTitle() {
	return `
	<div class="text-6xl p-7 font-title" translate="login">Login</div>
	`;
}

function renderLoginForm() {
	return `
	<form id="loginForm" class="flex flex-col items-center space-y-4 w-1/2">
        <input id="loginUsername" autocomplete="username" class="font-text p-2 border border-grey rounded w-full ring-primary focus:ring-1 focus:outline-none"
         placeholder="Username" translate="username" required />
		
        <input type=password id="loginPassword" autocomplete="current-password" class="font-text p-2 border border-grey rounded w-full ring-primary focus:ring-1 focus:outline-none" placeholder="Password" translate="password" required />
		${renderButton({
			id: "loginFrom",
			color: "primary",
			text: "Login",
			translate: "login",
			type: "submit",
		})}
		</form>
	`;
}

function renderRegisterButton() {
	return `
	<div class="flex flex row">
	<div class="font-text text-grey p-2" translate="no_account">Don't have an account? </div>
	<div id="loadRegister" class="font-title text-secondary cursor-pointer p-2 hover:text-primary-light" translate="register" >Register</div>
	</div>
	`;
}

function renderButtonGoogle() {
	return `
	<button id="google_login" class="items-center justify-center hover:cursor-pointer hover:ring-1 ring-secondary">
	</button>
	`;
}

function renderLoginPage() {
	return `
	<div class='flex flex-col items-center justify-center h-screen space-y-4 text-white backdrop-filter backdrop-blur-xs'>
	${renderTitle()}
	${renderLoginForm()}
	${renderButtonGoogle()}
	${renderRegisterButton()}
	${renderBackLink()}
	</div>
	`;
}

export function loginPage() {
	saveLanguage();
	loadGoodLanguageGoogleScript();
	return renderLoginPage();
}