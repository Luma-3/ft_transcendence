import { saveLanguage } from "../i18n/Translate"
import { backButton } from "../components/ui/backButton"
import { loginForm } from "../components/ui/loginForm"
import { registerLink } from "../components/ui/registerLink"
import { primaryButton } from "../components/ui/primaryButton"

function title() {
	return `
	<div class="flex text-6xl p-7 font-title items-center justify-center
	text-tertiary dark:text-tertiary
	motion-reduce:animate-pulse"
	translate="login">
		Login
	</div>`;
}

export function renderLoginPage() {
	return `
	<div class='flex flex-col justify-center h-screen space-y-4
	text-tertiary dark:text-dtertiary'>
		${backButton()}	
		${title()}
		${loginForm()}
		<div class="flex flex-col font-title items-center justify-center space-y-4
		 text-tertiary dark:text-dtertiary">
		<span> or </span>
		${primaryButton({id: 'google', text: 'Google', weight: '1/2', translate: 'google_login'})}
		${registerLink()}
		</div>
	</div>`;
}

export function loginPage() {
	saveLanguage();
	return renderLoginPage();
}