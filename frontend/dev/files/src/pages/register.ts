import { loadGoodLanguageGoogleScript } from "../components/google/google_init"

function renderRegister() {
	return `
	<div class='flex flex-col items-center justify-center h-screen space-y-4 text-white'>
	<div class="text-6xl p-7" translate="register">Register</div>
	<form id="registerForm" method=post class="flex flex-col items-center space-y-4 w-1/2">
        <input name="username" class="p-2 border border-gray-400 rounded w-full ring-orange-400 focus:ring-2 focus:outline-none"
         placeholder="username" translate="username" required />
        <input type=password name="password" class="p-2 border border-gray-400 rounded w-full ring-orange-400 focus:ring-2 focus:outline-none" placeholder="Password" translate="password" required />
		<input type=password name="passwordVerif" class="p-2 border border-gray-400 rounded w-full ring-orange-400 focus:ring-2 focus:outline-none" placeholder="Verify Password" translate="verif_password" required />
        <button id="registerFormButton" type="submit" class="p-2 bg-black text-white rounded w-full hover:cursor-pointer hover:ring-2 ring-orange-400" translate="register">Register</button>
    </form>
	<button id="google_login" class="items-center justify-center hover:cursor-pointer hover:ring-2 ring-red-400">
	</button>
    <button id="loadHome" translate="back-link" class="p-2 bg-red-500 text-white rounded w-1/2">Back</button>
    </div>
	</div>
	`
}

export function registerPage() {

	loadGoodLanguageGoogleScript()
	return renderRegister()

}