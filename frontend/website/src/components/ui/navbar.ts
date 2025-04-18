import { User } from "../../api/interfaces/User";
import { renderUserMenu } from "./userMenu";

function navbarLogo() {
	return `<div class="flex justify-start items-center">
				<a href="/dashboard" class="mr-2 flex items-center font-title text-primary dark:text-dprimary">Transcenduck</a>
			</div>`
}

export function userMenu(user: User) {
	return `
	<div id="user-menu" class="hidden absolute right-0 z-50 my-2 mx-4 w-56 text-primary bg-tertiary rounded dark:text-dtertiary dark:bg-dprimary">
	${renderUserMenu(user)}
	</div>`
}

export function navbar(User: User) {
	return `
	<nav class="flex items-center w-full justify-between flex-wrap p-2">
			${navbarLogo()}
			<div id="user-menu-button" class="flex justify-end items-center cursor-pointer">
				<span class="font-title pointer-events-none mr-2 flex items-center
				 text-tertiary dark:text-dtertiary overflow-hidden truncate">
				${User.username}
				</span>
				<img class="w-8 h-8 rounded-full pointer-events-none" src="/images/pp.jpg" alt="User profile picture">
			</div>
	</nav>
	${userMenu(User)}`;
}