import { headerPage } from "../components/ui/headerPage";
import { registerForm } from "../components/ui/form/registerForm"

function renderRegisterPage() {
	return `
	<div class='flex flex-col text-responsive-size justify-center mt-40'>
		${headerPage("register", "public")}
		${registerForm()}
	</div>`;
}

export default function registerPage() {
	return renderRegisterPage()
}