import { FetchInterface } from "../../api/FetchInterface";
import { translatePage } from "../../controllers/Translate";
import { IUserInfo } from "../../interfaces/IUser";
import { userMenu } from "./userMenu";

export async function updateNavbar() {

	let status = false;
	const navbarDiv = document.getElementById("navbar");
	if (!navbarDiv) {
		return status;
	}

	const user = await FetchInterface.getUserInfo();
	if (user) {
		setTimeout(async () => {
			navbarDiv.innerHTML = await navbar(user);
			translatePage(user.preferences.lang);
		}, 50);
		status = true;
	}

	return status;
}

function navbarLogo() {
	return `<div id="loaddashboard" class="flex font-title navbar-responsive-size justify-start items-center hover:cursor-pointer ml-2">
			<h1 class="text-tertiary dark:text-dtertiary pointer-events-none">Transcenduck</h1>
		</div>`
}

export async function navbar(user: IUserInfo) {
	const gameInProgress = await FetchInterface.getWaitingGame(sessionStorage.getItem("gameType"))
	console.log("Game in progress:", gameInProgress);
	return `
 <nav id="navbar" class="flex flex-row navbar-responsive-size items-center w-full mt-2 flex-wrap justify-between p-2 relative">
				<div class="flex items-center">
						${navbarLogo()}
				</div>
				<div class="flex-1 flex justify-center">
						${gameInProgress ? `<div class="flex flex-col space-y-1 items-center">
								<div class="flex flex-row items-center justify-center text-responsive-size space-x-2 text-dsecondary">
										<div class="dot-anim" translate="searching-for-game"> Recherche d'une partie en cours...</div>
								</div>
								<button id="cancel-waiting-game" translate="cancel" class="w-full px-2 py-1 text-sm rounded bg-dprimary text-white shadow hover:bg-dsecondary transition-colors duration-200">
										Annuler
								</button>
						</div>` : ""}
				</div>
				 <div class="flex items-center relative min-w-[4rem]">
						<button id="user-menu-button" class="flex justify-end items-center cursor-pointer mr-2">
								<span class="font-title hidden sm:block pointer-events-none mr-2 items-center text-tertiary dark:text-dtertiary">
										${user.username}
								</span>
								<img class="w-12 h-12 rounded-full pointer-events-none" src=${user.preferences.avatar} alt="User profile picture">
						</button>
						${userMenu(user)}
				</div>
		</nav>
		<style>
		@keyframes blink-dots {
			0% { opacity: 1; }
				10% { opacity: 0.9; }
			20% { opacity: 0.8; }
				30% { opacity: 0.7; }
			40% { opacity: 0.6; }
			50% { opacity: 0.5; }
			60% { opacity: 0.6; }
				70% { opacity: 0.7; }
				80% { opacity: 0.8; }
				90% { opacity: 0.9; }
			100% { opacity: 1; }
		}
		.dot-anim {
			display: inline-block;
			animation: blink-dots 1.5s infinite steps(3);
		}
		</style>`;
}