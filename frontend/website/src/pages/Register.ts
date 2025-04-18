import { backButton } from "../components/ui/backButton"
import { registerForm } from "../components/ui/registerForm"

function title() {
	return `
	<div class="flex text-6xl p-7 font-title items-center justify-center
	text-tertiary dark:text-tertiary
	motion-reduce:animate-pulse"
	translate="register">
		Register
	</div>`;
}

function renderRegisterPage() {
	return `
		<div class='flex flex-col justify-center h-screen space-y-4
		text-tertiary dark:text-dtertiary'>
			${backButton()}	
			${title()}
			${registerForm()}
		</div>`;
}

export function registerPage() {

	return renderRegisterPage()

}