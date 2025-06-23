import { navbar } from "../../components/ui/navbar";
import { IUserInfo } from "../../interfaces/IUser";
import { renderChat } from "./Chat";
import { primaryButton } from "../../components/ui/buttons/primaryButton";
import { secondaryButton } from "../../components/ui/buttons/secondaryButton";
import { gameTypes } from "./gameTypeButton";
import { gameUserStat } from "./userStatDiv";
import { API_CDN } from "../../api/routes";

async function renderDashboard(user: IUserInfo) {
return `
${navbar(user)}
<div class="flex flex-col h-full w-full lg:flex-row space-y-4 justify-center items-center pt-10 mb-70">

	<div class="flex flex-col lg:flex-row max-w-[1200px]">

		<div id="mainPanel" class="relative flex flex-col min-w-[350px] md:min-h-[350px] md:min-w-[700px] mx-4 p-4 space-y-4 dark:bg-myblack bg-zinc-100 rounded-lg justify-center items-center drop-shadow-2xl transition-all ease-in-out duration-300">

			<div class="relative w-full">
				
				<img src="${API_CDN.BANNER}/${user.preferences?.banner ?? 'default.webp'}" alt="Banner" class="flex w-[1000px] h-[300px] object-cover rounded-lg shadow-lg group-hover:blur-sm" />
						
				<div id="dashboardScreen" class="absolute w-full flex inset-0 items-center justify-center">
				
					<img src="${API_CDN.AVATAR}/${user.preferences?.avatar ?? 'default.webp'}" alt="Bienvenue" class="rounded-full w-50 mb-18" />
				</div>
				<div class="absolute w-full h-[70px] flex bottom-0 bg-primary dark:bg-dprimary rounded-sm drop-shadow-2xl" >
					
					<div class="flex flex-row justify-end items-center w-full h-full  space-x-4 rounded-lg">
						
						<div class="flex p-1 justify-center items-center mt-4 mb-4 mx-4 bg-primary dark:bg-dprimary rounded-lg">
							
							${secondaryButton({id: 'showGameStat', weight: "full", text: "Game Stats", translate: "create-game", type: "button"})}
						
						</div>
							
						<div class="flex p-1 justify-center items-center mt-4 mb-4 mx-4 bg-primary dark:bg-dprimary rounded-lg">
							
							<button id="showChat" class="flex hover:cursor-pointer">
								<img src="/images/duckChat.png" class="h-15 w-15 pointer-events-none"/>
							</button>
						
						</div>
					</div>
				</div>
			</div>
					
			<label for="player1-name" class="text-xl font-title dark:text-dtertiary mb-4" translate="">Choose your name for the next game
			</label>
				
			<input type="text" id="player1-name" class="w-1/2 p-2 font-title  dark:text-dtertiary border-2 border-zinc-300 rounded-lg" translate="username" placeholder="username" value=${user.username} />

				${gameTypes()}

				<div class="flex w-full justify-center items-center mb-10">
				
					${primaryButton({id: 'createGame', weight: "1/2", text: "Play", translate: "play", type: "button"})}
				
				</div>
			
			</div> <!--! Fermeture main Panel
		
			<div id="chat" class="absolute mt-4 opacity-0 min-h-[400px] min-w-[400px] mx-4 space-y-4 border-4 border-secondary dark:border-dsecondary  dark:bg-myblack
		bg-zinc-50 rounded-lg justify-center items-center -translate-x-full transition-all duration-500 ease-in-out">
		
				${await renderChat(user)}
		
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

export default async function dashboardPage(user: IUserInfo) {

	const container = renderDashboard(user);
	return container as Promise<string>;
}