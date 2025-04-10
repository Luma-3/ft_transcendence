// import { loadGoodLanguageGoogleScript } from "../components/Google"
// import { googleButton } from "../components/Google"
import { backButton } from "../components/ui/backButton"
import { registerForm } from "../components/ui/registerForm"

function title() {
	return `
	<div class="text-6xl p-7 font-title motion-reduce:animate-pulse" translate="register">Register</div>
	`
}


function renderRegisterPage() {
	return `
	<div class='flex flex-col items-center justify-center h-screen space-y-4 text-primary dark:text-dtertiary backdrop-filter backdrop-blur-xs'>
	${title()}
	${registerForm()}
	${backButton()}
	</div>
	`
}

export function registerPage() {

	// loadGoodLanguageGoogleScript()
	return renderRegisterPage()

}