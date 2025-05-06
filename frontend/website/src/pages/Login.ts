import { loginForm } from "../components/ui/form/loginForm"
import { messageWithLink } from "../components/ui/messageWithLink"
import { primaryButton } from "../components/ui/buttons/primaryButton"
import { headerPage } from "../components/ui/headerPage"


export function renderLoginPage() {
	return `
	<div class="flex flex-col font-title dark:text-dtertiary justify-center h-screen text-center">
		${headerPage("login", "public")}
		${loginForm()}
		or
		<div class="flex flex-row items-center justify-center mt-4">
		${primaryButton({id: 'google', text: 'Google', weight: '1/2', translate: 'google_login'})}
		</div>
		${messageWithLink("no_account", "register", "loadregister")}
	</div>`;
}

export default function loginPage() {
	return renderLoginPage();
}