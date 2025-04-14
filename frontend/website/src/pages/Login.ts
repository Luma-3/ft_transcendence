import { saveLanguage } from "../i18n/Translate"
import { } from "../components/Google"
import { backButton } from "../components/ui/backButton"
import { loginForm } from "../components/ui/loginForm"
import { registerLink } from "../components/ui/registerLink"
import { primaryButton } from "../components/ui/primaryButton"


function title() {
	return `
	<div class="text-6xl p-7 font-title items-center justify-center motion-reduce:animate-pulse text-primary" translate="login">Login</div>
	`;
}

function renderLoginPage() {
	return `
	<div class='flex flex-col items-center justify-center h-screen space-y-4 text-primary dark:text-dtertiary backdrop-filter backdrop-blur-xs'>
	${title()}
	${loginForm()}
	${registerLink()}
	${primaryButton({id: 'google', text: 'Google', weight: '1/2', translate: 'google_login'})}
	${backButton()}
	<div class="flex flex-row items-center justify-center">
	<a href="/dashboard" class="p-3 font-title text-center text-secondary hover:cursor-pointer hover:ring-2 ring-secondary" translate="login_guest">Back Door (uniquement pour les duckDev)</a>
	</div>
	`;
}

export function loginPage() {
	saveLanguage();
	// loadGoodLanguageGoogleScript();
	return renderLoginPage();
}