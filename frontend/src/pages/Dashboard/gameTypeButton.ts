import { searchBarGame } from "../../components/ui/searchBar"

export function onlineSettings() {
	//TODO: Traduction
  return `
<div id="online-settings" class="hidden flex-col w-full h-full p-4 space-y-4 mb-10 bg-zinc-150 rounded-lg opacity-0 transition-opacity duration-200 ease-in-out">
<div class="flex flex-col font-title justify-center items-center w-full">
	<div class="flex flex-col w-full h-full p-2 space-y-2 text-secondary dark:text-dsecondary rounded-lg">
		
		Or click directly on play for a random opponent
	
	</div> 
</div>

	${searchBarGame()}

</div>`
}

export function localPVPSettings() {
  return `
<div id="local-PVP-settings" class="hidden flex-col w-full h-full p-4 space-y-4 mb-10 bg-zinc-150 rounded-lg opacity-0 transition-opacity duration-200 ease-in-out">
<div class="flex flex-col font-title justify-center items-center w-full">
	<div class="flex flex-col w-full h-full p-2 space-y-2 text-secondary dark:text-dsecondary rounded-lg" translate="player2-name">

			Player 2 Name
		</div> 
		
		<div class="flex flex-col w-full justify-center items-center px-10 mt-4">

			<input type="text" id="player2-name" class="w-full font-title p-2 border-2 border-zinc-300 rounded-lg dark:text-dtertiary" translate="enter-username" placeholder="enter-username"/>

		</div>
	</div>
</div>`
}

export function gameTypes() {
  return `<div class="flex flex-row w-full h-full p-4 space-x-4 rounded-lg">
				<button class="flex w-full h-full" onclick="document.getElementById('local')?.click()">
					<input type="radio" id="local" name="game-type" data-gameType="local" class="hidden peer" />
					<label for="localpvp" class="flex w-full justify-center items-center p-2 text-sm font-title
					text-zinc-600 bg-zinc-200 dark:bg-dtertiary rounded-lg cursor-pointer
					 peer-checked:bg-primary peer-checked:text-white dark:peer-checked:bg-dprimary dark:peer-checked:text-white"
						translate="localpvp">

					Local 2 Joueurs

					</label>
				</button>

				<button class="flex w-full h-full" onclick="document.getElementById('ai')?.click()">
					<input type="radio" id="ai" name="game-type" data-gameType="ai" class="hidden peer" />
					<label for="localpve" class="flex w-full justify-center items-center p-2 text-sm font-title
					text-zinc-600 bg-zinc-200 dark:bg-dtertiary rounded-lg cursor-pointer
					 peer-checked:bg-primary peer-checked:text-white dark:peer-checked:bg-dprimary dark:peer-checked:text-white"
						translate="localpve">

					Local 1 Joueur

					</label>
				</button>
				
				<button class="flex w-full h-full" onclick="document.getElementById('online')?.click()">
					<input type="radio" id="online" name="game-type" data-gameType="online" class="hidden peer" />
					<label for="online" class="flex w-full justify-center items-center p-2 text-sm font-title
					text-zinc-600 bg-zinc-200 dark:bg-dtertiary rounded-lg cursor-pointer
					 peer-checked:bg-primary peer-checked:text-white dark:peer-checked:bg-dprimary dark:peer-checked:text-white"
					translate="online">

					Online

					</label>
				</button>
				
				<button class="flex w-full h-full" onclick="document.getElementById('tournament')?.click()">
				<input type="radio" id="tournament" name="game-type" data-gameType="tournament" class="hidden peer" />
				<label for="tournament" class="flex w-full justify-center items-center p-2 text-sm font-title
				text-zinc-600 bg-zinc-200 dark:bg-dtertiary rounded-lg cursor-pointer
					peer-checked:bg-primary peer-checked:text-white dark:peer-checked:bg-dprimary dark:peer-checked:text-white"
				translate="tournament">

				Tournament

				</label>
			</button>
			</div>
			${onlineSettings()}
			${localPVPSettings()}`

}
