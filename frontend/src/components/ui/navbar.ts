import { IUserInfo } from "../../interfaces/IUser";
import { renderUserMenu } from "./userMenu";

function navbarLogo() {
	return `<div id="loaddashboard" class="flex font-title navbar-responsive-size justify-start items-center hover:cursor-pointer">
				<h1 class="text-tertiary dark:text-dtertiary pointer-events-none">Transcenduck</h1>
			</div>`
}

export function userMenu(user: IUserInfo) {
	return `
	<div id="user-menu" class="hidden transition-all 
	duration-500 transform translate-y-10 opacity-0 
	pointer-events-none absolute right-0 z-50 my-2 mx-4 w-56 md:w-70 lg:w-80
	 text-tertiary rounded dark:text-dtertiary
	 bg-gradient-to-r dark:from-dprimary dark:to-gray-800 dark:to-grey-700 from-primary/80 to-primary">
			${renderUserMenu(user)}
	</div>`
}

export function navbar(user: IUserInfo) {
	return `
	<nav class="flex flex-row navbar-responsive-size items-center w-full mt-2 flex-wrap justify-between p-2">
			${navbarLogo()}
			<button id="user-menu-button" class="flex justify-end items-center cursor-pointer">
				<span class="font-title hidden sm:block pointer-events-none mr-2 items-center
				 text-tertiary dark:text-dtertiary">
				${user.username}
				</span>
				<img class="w-12 h-12 rounded-full pointer-events-none" src=${user.preferences.avatar} alt="User profile picture">
			</button>
	</nav>
	${userMenu(user)}`;	
}