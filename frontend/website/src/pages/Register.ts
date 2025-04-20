import { headerPage } from "../components/ui/headerPage";
import { registerForm } from "../components/ui/registerForm"

function renderRegisterPage() {
	return `
	<div class='flex flex-col justify-center h-screen'>
		${headerPage("register")}
		${registerForm()}
	</div>`;
}

export function registerPage() {
	return renderRegisterPage()
}