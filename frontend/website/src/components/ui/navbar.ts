import { User } from "../../api/interfaces/User";
import { renderUserMenu } from "./userMenu";

function navbarLogo() {
	return `<div class="flex justify-start items-center">
				<a href="/dashboard" class="mr-2 text-xl flex items-center font-title text-primary dark:text-dprimary">Transcenduck</a>
			</div>`
}

export function userMenu(user: User) {
	return `
	<div id="user-menu" class="hidden transition-all duration-500 transform translate-y-10 opacity-0 pointer-events-none absolute right-0 z-50 my-2 mx-4 w-56 text-tertiary bg-secondary rounded dark:text-dtertiary dark:bg-dprimary">
	${renderUserMenu(user)}
	</div>`
}

export function navbar(user: User) {
	return `
	<nav class="flex flex-row items-center w-full flex-wrap justify-between p-2">
			${navbarLogo()}
			<div id="user-menu-button" class="flex justify-end items-center cursor-pointer">
				<span class="font-title hidden sm:block pointer-events-none mr-2 items-center
				 text-tertiary dark:text-dtertiary">
				${user.username}
				</span>
				<img class="w-8 h-8 rounded-full pointer-events-none" src=${user.pp_url} alt="User profile picture">
			</div>
	</nav>
	${userMenu(user)}`;
}