import { saveLanguage } from "../i18n/Translate"
import { loginForm } from "../components/ui/loginForm"
import { messageWithLink } from "../components/ui/messageWithLink"
import { primaryButton } from "../components/ui/primaryButton"
import { headerPage } from "../components/ui/headerPage"


export function renderLoginPage() {
	return `
	<div class="flex flex-col justify-center h-screen text-center">
		${headerPage("login")}
		${loginForm()}
		or
		<div class="flex flex-row items-center justify-center mt-2">
		${primaryButton({id: 'google', text: 'Google', weight: '1/2', translate: 'google_login'})}
		</div>
		${messageWithLink("no_account", "register", "loadRegisterPage")}
	</div>`;
}

export function loginPage() {
	saveLanguage();
	return renderLoginPage();
}