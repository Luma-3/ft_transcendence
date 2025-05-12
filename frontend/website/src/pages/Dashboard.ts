import { navbar } from "../components/ui/navbar";
import { footer } from "../components/ui/footer";
import { User } from "../api/interfaces/User";
import { primaryButton } from "../components/ui/buttons/primaryButton";
import { secondaryButton } from "../components/ui/buttons/secondaryButton";

function listFriends(user: User) {
	return `
	<div class="flex flex-col w-full h-full p-4 space-y-4 bg-zinc-150 rounded-lg">
	
	<ul class="flex flex-col lg:flex-row text-sm w-full space-y-4 space-x-4">
	
	<li class="flex flex-row font-title justify-between items-center w-full h-full   p-4 space-x-4 bg-zinc-200 rounded-lg">
	Jean-Michel
	${primaryButton({id: 'inviteFriend', weight: "1/3", text: "Invite", translate: "invite", type: "button"})}
	</li>
	
	<li class="flex flex-row font-title justify-between items-center w-full h-full p-4 space-x-4 bg-zinc-200 rounded-lg">
	Jacqueline
	${primaryButton({id: 'inviteFriend', weight: "1/3", text: "Invite", translate: "invite", type: "button"})}
	</li>

	<li class="flex flex-row font-title justify-between items-center w-full h-full p-4 space-x-4 bg-zinc-200 rounded-lg">
	Richard
	${primaryButton({id: 'inviteFriend', weight: "1/3", text: "Invite", translate: "invite", type: "button"})}
	</li>

	<li class="flex flex-row font-title justify-between items-center w-full h-full p-4 space-x-4 bg-zinc-200 rounded-lg">
	Francis(fran fran sans le milieu)
	${primaryButton({id: 'inviteFriend', weight: "1/3", text: "Invite", translate: "invite", type: "button"})}
	</li>
	
	</ul>
	</div>`
}

function gameUserStat(user: User) {
	return `<div class="flex flex-col w-full h-full p-4 space-y-4  rounded-lg">
	<div class="flex flex-col font-title justify-between items-center w-full h-full p-4 space-x-4 bg-primary dark:bg-dprimary rounded-lg">
	Your game stats	
	</div>
	<ul class="flex flex-col lg:flex-row text-sm w-full space-y-4 space-x-4">
		<li class-"flex flex-row font-title justify-between items-center w-full h-full p-4 space-x-4 bg-zinc-200 rounded-lg">
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
			<div class"flex max-w-[1000px]">
			
			<div class="relative flex flex-col min-w-[400px] md:min-h-[400px] md:min-w-[800px] mx-4 p-4 space-y-4
			bg-zinc-50 rounded-lg justify-center items-center">
			<img src="/images/dashboard.png" alt="Bienvenue" class="w-40 mb-8 drop-shadow-lg" />
			<label for="gameName" class="text-2xl font-title text-zinc-600 mb-4" translate="game-name">Game name</label>
			<input type="text" id="gameName" class="w-1/2 p-2 border-2 border-zinc-300 rounded-lg" placeholder="Game name" />
			${listFriends(user)}
			${primaryButton({id: 'toggleGame', weight: "1/2", text: "Play", translate: "play", type: "button"})}
			
			<div class="flex flex-row justify-center items-center w-full h-full p-4 space-x-4 rounded-lg">
			
			<div class="flex p-1 justify-center items-center mt-4 mb-4 mx-4 bg-primary dark:bg-dprimary rounded-lg">
			${secondaryButton({id: 'showGameStat', weight: "full", text: "Game stats", translate: "create-game", type: "button"})}
			</div>

			<div class="flex p-1 justify-center items-center mt-4 mb-4 mx-4 bg-primary dark:bg-dprimary rounded-lg">
			${secondaryButton({id: 'showTruc', weight: "full", text: "Voir un truc", translate: "create-game", type: "button"})}
			</div>

			
			
			</div>
			</div>

			<div id="gameStat" class="absolute left-0 mt-4 opacity-0 flex min-h-[400px] min-w-[400px] mx-4 p-4 space-y-4
			bg-zinc-50 rounded-lg justify-center items-center transition-transform duration-500 ease-in-out -translate-x-full">
			${gameUserStat(user)}
			</div>

			<div id="truc" class="absolute left-0 mt-4 opacity-0 flex min-h-[400px] min-w-[400px] mx-4 p-4 space-y-4
			bg-zinc-50 rounded-lg justify-center items-center transition-transform duration-500 ease-in-out -translate-x-full">
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