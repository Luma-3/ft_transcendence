import { navbar } from "../components/ui/navbar";
import { footer } from "../components/ui/footer";
import { User } from "../api/interfaces/User";
import { primaryButton } from "../components/ui/buttons/primaryButton";
import { secondaryButton } from "../components/ui/buttons/secondaryButton";

function onlineSettings(user: User) {
	return `
	<div id="online-settings" class="flex hidden flex-col w-full h-full p-4 space-y-4 mb-10
	  bg-zinc-150 rounded-lg opacity-0 transition-opacity duration-500 ease-in-out">

	  <label for="search-friend" class="text-2xl font-title text-zinc-600 mb-4" translate="search-friend">Search friend</label>
	<input type="text" id="search-friend" class="w-full font-title p-2 border-2 border-zinc-300 rounded-lg" translate="enter-username" placeholder="enter-username"/>
	</div>`
}

function localPVPSettings(user: User) { 
	return `
	<div id="local-PVP-settings" class="flex hidden flex-col w-full h-full p-4 space-y-4 mb-10
	 bg-zinc-150 rounded-lg opacity-0 transition-opacity duration-500 ease-in-out">

	<label for="player2-name" class="text-2xl font-title text-zinc-600 mb-4" translate="player2">Player 2</label>
	<input type="text" id="player2-name" class="w-full font-title p-2 border-2 border-zinc-300 rounded-lg" translate="username" placeholder="username"/>
	</div>`
}

function gameTypeButton() {
	return `<div class="flex flex-row w-full h-full p-4 space-x-4 rounded-lg">
				<div class="flex w-full h-full">
					<input type="radio" id="local-pvp" name="game-type" data-gameType="local-PVP" class="hidden peer" />
					<label for="local-pvp" class="flex w-full justify-center items-center p-2 text-sm font-title
			 		text-zinc-600 bg-zinc-200 rounded-lg cursor-pointer
					 peer-checked:bg-primary peer-checanimateked:text-white dark:peer-checked:bg-dprimary dark:peer-checked:text-white"
					  translate="local-pvp">

					Local 2 Joueurs

					</label>
				</div>

				<div class="flex w-full h-full">
					<input type="radio" id="local-pve" name="game-type" data-gameType="local-PVE" class="hidden peer" checked />
					<label for="local-pve" class="flex w-full justify-center items-center p-2 text-sm font-title
			 		text-zinc-600 bg-zinc-200 rounded-lg cursor-pointer
					 peer-checked:bg-primary peer-checanimateked:text-white dark:peer-checked:bg-dprimary dark:peer-checked:text-white"
					  translate="local-pve">

					Local 1 Joueur

					</label>
				</div>
				
				<div class="flex w-full h-full">
					<input type="radio" id="online" name="game-type" data-gameType="online" class="hidden peer" />
					<label for="online" class="flex w-full justify-center items-center p-2 text-sm font-title
					text-zinc-600 bg-zinc-200 rounded-lg cursor-pointer
					 peer-checked:bg-primary peer-checked:text-white dark:peer-checked:bg-dprimary dark:peer-checked:text-white"
					translate="online">

					Online

					</label>
				</div>
			</div>`

}

function gameUserStat(user: User) {
	return `<div class="flex flex-col w-full h-full max-h-[600px] max-w-[400px] mx-4 overflow-auto
		p-4 space-y-4 rounded-lg
		transition-transform duration-500 ease-in-out">
		
		
		<div class="flex flex-col font-title justify-between items-center w-full h-full p-4 space-x-4 bg-primary dark:bg-dprimary rounded-lg">
		
		Your game stats
		
		</div>
		<ul class="flex flex-col lg:grid lg:grid-cols-1 gap-2 text-sm w-full space-y-4 space-x-4">
			<li class="flex font-title justify-between items-center w-full h-full p-4 space-x-4 bg-zinc-200 rounded-lg">
				Jean-Michmich - You
			</li>
			<li class="flex font-title justify-between items-center w-full h-full p-4 space-x-4 bg-zinc-200 rounded-lg">
				Jean-Michmich - You
			</li>
			<li class="flex col-span-1 font-title justify-between items-center w-full h-full p-4 space-x-4 bg-zinc-200 rounded-lg">
				Jean-Michmich - You
			</li>
		</ul>
	</div>
	`;
}

async function renderDashboard(user:User) {

	return `
		${navbar(user)}
		<div class="flex flex-col h-full w-full lg:flex-row space-y-4 justify-center items-center">

		<div class="flex max-w-[1000px]">
			<div class="relative flex flex-col min-w-[400px] md:min-h-[400px] md:min-w-[800px] mx-4 p-4 space-y-4
			bg-zinc-50 rounded-lg justify-center items-center">

				<img src="/images/dashboard.png" alt="Bienvenue" class="w-40 mb-8 drop-shadow-lg" />

				<label for="player1-name" class="text-2xl font-title text-zinc-600 mb-4" translate="player1">Player 1</label>
				<input type="text" id="player1-name" class="w-1/2 p-2 font-title border-2 border-zinc-300 rounded-lg" translate="username" placeholder="username" value=${user.username} />

				${gameTypeButton()}

				${onlineSettings(user)}
				${localPVPSettings(user)}

				
				${primaryButton({id: 'launchGame', weight: "1/2", text: "Play", translate: "play", type: "button"})}
			
				<div class="flex flex-row justify-center items-center w-full h-full p-4 space-x-4 rounded-lg">
			
					<div class="flex p-1 justify-center items-center mt-4 mb-4 mx-4 bg-primary dark:bg-dprimary rounded-lg">
					${secondaryButton({id: 'showGameStat', weight: "full", text: "Game stats", translate: "create-game", type: "button"})}
					</div>

					<div class="flex p-1 justify-center items-center mt-4 mb-4 mx-4 bg-primary dark:bg-dprimary rounded-lg">
					${secondaryButton({id: 'showTruc', weight: "full", text: "Voir un truc", translate: "create-game", type: "button"})}
					</div>
			
				</div>
			</div>
			<div id="truc" class="absolute left-0 mt-4 opacity-0 flex min-h-[400px] min-w-[400px] mx-4 p-4 space-y-4
			bg-zinc-50 rounded-lg justify-center items-center transition-transform duration-500 ease-in-out -translate-x-full">
			
				${gameUserStat(user)}
			
			</div>
		</div>

		<div id="gameStat" class="relative lg:absolute left-0 mt-4 flex opacity-0 min-h-[400px] min-w-[400px] mx-4 p-4 space-y-4 overflow-auto
		bg-primary dark:bg-tertiary rounded-lg justify-center items-center transition-transform duration-500 ease-in-out -translate-x-full">
			
			<div id="showGameStat" class="absolute top-0 right-0 mr-2 mt-2 hover:cursor-pointer">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6 pointer-events-none">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</div>

			${gameUserStat(user)}
		
		</div>

		
	</div>
	</div>
	${footer()}
	`
}

export default async function dashboardPage(user: User) {

	const container = renderDashboard(user);
	return container as Promise<string>;
}