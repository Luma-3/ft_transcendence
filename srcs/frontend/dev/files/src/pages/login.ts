export function renderLoginPage() {
	return `<div class='flex flex-col items-center justify-center h-screen space-y-4 text-white'>
	<div class="text-6xl" translate="login">Login</div>
	<form id="loginForm" class="flex flex-col items-center space-y-4 w-1/4">
        <input id="loginUsername" class="p-2 border border-gray-400 rounded w-full ring-orange-400 focus:ring-2 focus:outline-none"
         placeholder="Username" translate="username" required />
        <input type=password id="loginPassword" class="p-2 border border-gray-400 rounded w-full ring-orange-400 focus:ring-2 focus:outline-none" placeholder="Password" translate="password" required />
        <button id="loginFormButton" type="submit" class="p-2 bg-black text-white rounded w-full hover:cursor-pointer hover:ring-2 ring-orange-400" translate="login">Login</button>
    </form>
	<div class="flex flex row">
	<div class=" text-center p-2" translate="no_account">Don't have an account? </div>
	<div id="loadRegister" class="cursor-pointer  p-2 bold underline" translate="register" >Register</div>
	</div>
	<button id="loadHome" translate="back-link" class="p-2 bg-red-500 text-white rounded w-1/4">Back</button>
	</div>
	`
}

// <button id="google_login">
// </button>
// <button id="google_login" class="flex flex-row bg-white text-black rounded-full w-1/4 items-center justify-center hover:cursor-pointer hover:ring-2 ring-red-400">
// <img src="/logo_google.png" class="w-10 h-8" alt="Google logo" />
// <span class="p-2" translate="google_login">Continue with Google</span>
// </button>