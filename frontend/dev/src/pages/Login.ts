import { saveLanguage } from "../i18n/Translate"
import { form } from "../components/ui/form"
import { loadGoodLanguageGoogleScript, googleButton } from "../components/Google"
import { backButton } from "../components/ui/backButton"
import { loginForm } from "../components/ui/loginForm"
import { registerLink } from "../components/ui/registerLink"


function title() {
	return `
	<div class="text-6xl p-7 font-title motion-reduce:animate-pulse" translate="login">Login</div>
	`;
}

function renderLoginPage() {
	return `
	<div class='flex flex-col items-center justify-center h-screen space-y-4 text-tertiary backdrop-filter backdrop-blur-xs'>
	${title()}
	${loginForm()}
	${googleButton()}
	${registerLink()}
	${backButton()}
	</div>
	`;
}

export function loginPage() {
	saveLanguage();
	loadGoodLanguageGoogleScript();
	return renderLoginPage();
}