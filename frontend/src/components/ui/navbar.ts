import { IUserInfo } from "../../interfaces/IUser";
import { userMenu } from "./userMenu";

function navbarLogo() {
return `<div id="loaddashboard" class="flex font-title navbar-responsive-size justify-start items-center hover:cursor-pointer ml-2">
			<h1 class="text-tertiary dark:text-dtertiary pointer-events-none">Transcenduck</h1>
		</div>`
}

export function navbar(user: IUserInfo) {
	return `
	<nav class="flex flex-row navbar-responsive-size items-center w-full mt-2 flex-wrap justify-between p-2">
			${navbarLogo()}
			<button id="user-menu-button" class="flex justify-end items-center cursor-pointer mr-2">
				<span class="font-title hidden sm:block pointer-events-none mr-2 items-center
				 text-tertiary dark:text-dtertiary">
				${user.username}
				</span>
				<img class="w-12 h-12 rounded-full pointer-events-none" src=${user.preferences.avatar} alt="User profile picture">
			</button>
	</nav>
	${userMenu(user)}`;
}