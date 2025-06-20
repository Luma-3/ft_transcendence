import { navbar } from "../../components/ui/navbar";
import { UserInfo } from "../../interfaces/User";
import { renderChat } from "./Chat";
import { primaryButton } from "../../components/ui/buttons/primaryButton";
import { secondaryButton } from "../../components/ui/buttons/secondaryButton";
import { gameTypes } from "./gameTypeButton";
import { gameUserStat } from "./userStatDiv";
import { API_CDN } from "../../api/routes";

async function renderDashboard(user: UserInfo) {

	return `
		${navbar(user)}
		<div class="flex flex-col h-full w-full lg:flex-row space-y-4 justify-center items-center pt-10 mb-70">

			<div class="flex flex-col lg:flex-row max-w-[1200px]">

				<div class="relative flex flex-col min-w-[350px] md:min-h-[350px] md:min-w-[700px] mx-4 p-4 space-y-4 dark:bg-[#121212] bg-zinc-100 rounded-lg justify-center items-center
					drop-shadow-2xl">

					<div class="relative w-full">
						<img src="${API_CDN.BANNER}/${user.preferences?.banner ?? 'default.webp'}" alt="Banner" 
						class="flex w-[1000px] h-[300px] object-cover rounded-lg shadow-lg group-hover:blur-sm" />
						
						<div id="dashboardScreen" class="absolute w-full flex inset-0 items-center justify-center">
							<img src="/images/dashboard.png" alt="Bienvenue" class="rounded-2xl w-50 mb-8" />
						</div>
						<div class="absolute w-full h-[70px] flex bottom-0 bg-primary dark:bg-dprimary rounded-sm drop-shadow-2xl" >
						<div class="flex flex-row justify-end items-center w-full h-full  space-x-4 rounded-lg">
				
						<div class="flex p-1 justify-center items-center mt-4 mb-4 mx-4 bg-primary dark:bg-dprimary rounded-lg">
						${secondaryButton({id: 'showGameStat', weight: "full", text: "Game stats", translate: "create-game", type: "button"})}
						</div>

						<div class="flex p-1 justify-center items-center mt-4 mb-4 mx-4 bg-primary dark:bg-dprimary rounded-lg">
						${secondaryButton({id: 'showTruc', weight: "full", text: "Show/Hide Chat", translate: "create-game", type: "button"})}
						</div>
						</div>
						</div>
					
					</div>
					
					<label for="player1-name" class="text-xl font-title dark:text-dtertiary mb-4" translate="">Choose your name for the next game</label>
					<input type="text" id="player1-name" class="w-1/2 p-2 font-title  dark:text-dtertiary border-2 border-zinc-300 rounded-lg" translate="username" placeholder="username" value=${user.username} />

					${gameTypes()}

					<div class="flex w-full justify-center items-center mb-10">
					${primaryButton({id: 'createGame', weight: "1/2", text: "Play", translate: "play", type: "button"})}
					</div>
			</div>
			
			<div id="truc" class="flex left-0 mt-4 opacity-100 min-h-[400px] min-w-[400px] mx-4 space-y-4
			border-4 border-secondary dark:border-dsecondary
			bg-zinc-50 rounded-lg justify-center items-center x-translate-full transition-transform duration-500 ease-in-out">
			
				${renderChat(user)}
			
			</div>
		</div>

		<div id="gameStat" class="relative lg:absolute left-0 mt-4 flex opacity-0 h-[200px] min-h-[400px] min-w-[400px] mx-4 p-4 space-y-4 overflow-auto
		bg-primary dark:bg-tertiary rounded-lg justify-center items-center transition-transform duration-500 ease-in-out">
			
			<div id="showGameStat" class="absolute top-0 right-0 mr-2 mt-2 hover:cursor-pointer">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6 pointer-events-none">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</div>

			${gameUserStat()}
		
		</div>
	</div>
	</div>
	`
}

export default async function dashboardPage(user: UserInfo) {

	const container = renderDashboard(user);
	return container as Promise<string>;
}