import { navbar } from "../../components/ui/navbar";
import { IUserInfo } from "../../interfaces/IUser";
import { gameTypes } from "./gameTypeButton";
import { Button } from "../../classes/Button";
import { generateLastGames } from "./gameData";
import { generateRankBadge } from "./rankBadges";

async function renderDashboard(user: IUserInfo) {

	const playButton = new Button('initGame', "1/2", "Play", "play", "primary", "button");

	return `
${await navbar(user)}
<div class="flex flex-col h-full w-full lg:flex-row space-y-4 justify-center items-center pt-10 mb-10">

	<div class="flex flex-col transition-all duration-300 ease-in-outlg:flex-row max-w-[1200px]">

		<div id="mainPanel" class="relative flex flex-col min-w-[350px] md:min-h-[350px] md:min-w-[700px] mx-4 p-4 space-y-4 dark:bg-gradient-to-b dark:from-purple-800 dark:via-dprimary dark:to-dsecondary bg-zinc-100 rounded-lg justify-center items-center drop-shadow-2xl transition-all ease-in-out duration-300">

			<div class="relative w-full">
				
				<img src="${user.preferences.banner ?? 'default.webp'}" alt="Banner" class="flex w-[1000px] h-[300px] object-cover rounded-lg shadow-lg group-hover:blur-sm" />
						
				<div id="dashboardScreen" class="absolute w-full flex inset-0 items-center justify-center">
					
					<img src="${user.preferences.avatar ?? 'default.webp'}" alt="Bienvenue" class="rounded-full w-50" />
				</div>
			</div>
		<div class="flex flex-col w-full justify-center items-center space-y-4 text-primary dark:text-dtertiary mb-10 ">
			<div class="flex flex-col w-full mb-10 max-w-[1000px] items-center justify-center pt-5">
				<!-- Badge de rang trop cool -->
				${await generateRankBadge(user, user.preferences.lang)}
			</div>
		</div>

		<div id="lastGamesContainer" class="w-full flex justify-center items-center pointer-events-none">
			<div id="lastGamesPanel" class="flex font-title w-full justify-center pointer-events-auto transform translate-x-0 opacity-100 transition-all duration-500">
				${await generateLastGames(user, user.preferences.lang)}
			</div>
		</div>
		<!-- Bouton voir les stats -->
		
		${gameTypes()}
		
		<!-- Bloc stats animé -->
		<div class="flex w-full justify-center items-center mb-10">
		${playButton.primaryButton()}
		</div>
		</div> <!--! Fermeture main Panel -->
		
		</div>
</div>
`
}

export function toggleGameStats() {
	const btn = document.getElementById('toggleStats');
	const panel = document.getElementById('lastGamesPanel');
	if (!btn || !panel) {
		return;
	}

	if (panel.classList.contains('translate-x-full')) {
		panel.classList.remove('translate-x-full', 'opacity-0', 'hidden');
		panel.classList.add('translate-x-0', 'opacity-100');
		btn.textContent = 'Voir les stats';
	}
	else {
		panel.classList.add('translate-x-full', 'opacity-0');
		panel.classList.remove('translate-x-0', 'opacity-100');
		btn.textContent = 'Cacher les stats';
	}
}


export default async function dashboardPage(user: IUserInfo) {

	const container = renderDashboard(user);
	return container as Promise<string>;
}
