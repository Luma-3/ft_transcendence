import { saveLanguage } from "../i18n/Translate"
import { loginForm } from "../components/ui/loginForm"
import { messageWithLink } from "../components/ui/messageWithLink"
import { primaryButton } from "../components/ui/primaryButton"
import { headerPage } from "../components/ui/headerPage"


export function renderLoginPage() {
	return `
	<div class="flex flex-col font-title justify-center h-screen text-center">
		${headerPage("login")}
		${loginForm()}
		or
		<div class="flex flex-row items-center justify-center mt-4">
		${primaryButton({id: 'google', text: 'Google', weight: '1/2', translate: 'google_login'})}
		</div>
		${messageWithLink("no_account", "register", "loadRegisterPage")}
	</div>`;
}

export default function loginPage() {
	saveLanguage();
	return renderLoginPage();
}