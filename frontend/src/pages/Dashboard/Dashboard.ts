import { navbar } from "../../components/ui/navbar";
import { IUserInfo } from "../../interfaces/IUser";
import { gameTypes } from "./gameTypeButton";
import { Button } from "../../classes/Button";
import { fetchApi } from "../../api/fetch";
import { API_GAME } from "../../api/routes";
import { IGameData } from "../../interfaces/IGame";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";

async function renderDashboard(user: IUserInfo) {

	const playButton = new Button('initGame', "1/2", "Play", "play", "primary", "button" );

return `
${navbar(user)}
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
				${generateRankBadge(user)}
			</div>
		</div>

		<div id="lastGamesContainer" class="w-full flex justify-center items-center pointer-events-none">
			<div id="lastGamesPanel" class="flex font-title w-full justify-center pointer-events-auto transform translate-x-0 opacity-100 transition-all duration-500">
				${await generateLastGames(user)}
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

		// <div class="flex w-full justify-center mb-4">
		// 	<button id="toggleStats" class="px-4 py-2 rounded bg-dprimary text-white font-bold shadow hover:bg-dsecondary transition-colors duration-200">
		// 		Cacher les stats
		// 	</button>
		// </div>
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

// Affiche les dernières parties du joueur dans un div scrollable
export async function generateLastGames(user: IUserInfo, userId: string = user.id) {

	const response = await fetchApi(API_GAME.GET_ALL_DATA + `/${userId}`, {
		method: 'GET'
	});
	if (!response || !response.data) {
		//TODO: Traduction
		return alertTemporary("error", "no-game-data", user.preferences.theme, true, true);
	}
	console.log("Response from API_GAME.GET_ALL_DATA:", response.data);
  // Exemple de structure attendue :
  // const lastGames = [
	// { opponent: 'DuckMaster', score: '5-3', date: '2025-07-10', win: true },
  // //   ...
  // ]
  const games = response.data.rooms;
	if (!games) {
		//TODO: Traduction
		return alertTemporary("error", "no-game-data", user.preferences.theme, true, true);
	}
  if (games.length === 0) {
	return `<div class="w-full font-title max-w-[600px] h-64 bg-white/80 dark:bg-black/5 rounded-lg shadow-inner flex flex-col items-center justify-center mb-6 overflow-y-auto">
	  <span class="text-gray-400 italic">Aucune partie récente</span>
	</div>`;
  }
	let container = `<div class="w-full max-w-[600px] h-64 bg-white/80 dark:bg-black/5 rounded-lg shadow-inner mb-6 overflow-y-auto p-4 flex flex-col">
	  <h4 class="text-lg font-bold mb-2 text-gray-700 dark:text-dtertiary">Dernières parties</h4>
	  <ul class="flex flex-col gap-2">`;

	for (const game of games) {
		let win = false;
		let opponent = '';
		win = (game.winner === user.id) ? true : false;
		(game.player_1 === user.id) ? opponent = game.player_2 : opponent = game.player_1;
		if (opponent === "") {
			(game.type === "local") ? opponent = "Local" : opponent = "IA";
		}

		container += `
		<li class="flex items-center justify-between bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-md px-3 py-2 shadow-sm">
			<div class="flex flex-col">
				<span class="font-semibold text-primary dark:text-dsecondary">vs ${opponent}</span>
				</div>
				<div class="flex items-center gap-2">
				<span class="font-mono text-lg">${game.score_2}-${game.score_1}</span>
				<span class="px-2 py-1 rounded text-md font-bold ${win ? ' text-green-500' : ' text-red-700'}">
				${win ? 'Win' : 'Lose'}
				</span>
				</div>
				</li>`;
		}
			// <span class="text-xs text-gray-500">${game.date}</span>

	container += `
	  </ul>
	</div>
  `;
	return container;
}

	// 	  <li class="flex items-center justify-between bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-md px-3 py-2 shadow-sm">
	// 		<div class="flex flex-col">
	// 		  <span class="font-semibold text-primary dark:text-dsecondary">vs ${game.opponent}</span>
	// 		  <span class="text-xs text-gray-500">${game.date}</span>
	// 		</div>
	// 		<div class="flex items-center gap-2">
	// 		  <span class="font-mono text-lg">${game.score}</span>
	// 		  <span class="px-2 py-1 rounded text-md font-bold ${game.win ? ' text-green-500' : ' text-red-700'}">
	// 			${game.win ? 'Win' : 'Lose'}
	// 		  </span>
	// 		</div>
	// 	  </li>
	// 	}
	//   </ul>
	// </div>
  // `;
// }

export function generateRankBadge(_user: IUserInfo) {
	const wins = Math.floor(Math.random() * 50) + 5; // Données d'exemple
	const losses = Math.floor(Math.random() * 30) + 2; // Données d'exemple
	const totalGames = wins + losses;
	
	let rankInfo = {
		name: 'Petit Volatile',
		level: 1,
		image: 'petitVolatile2.png',
		colors: 'from-[#744FAC] via-[#8B5CF6] to-[#744FAC]', // violet principal
	   textColors: 'from-gray-800 via-gray-900 to-black dark:from-white dark:via-gray-200 dark:to-dtertiary',
		shadowColor: '[#744FAC]'
	};

	if (totalGames >= 50 && wins >= 30) {
		rankInfo = {
			name: 'Roi de la Mare',
			level: Math.floor(wins / 10),
			image: 'duckKing.png',
			colors: 'from-[#FF8904] via-yellow-400 to-[#744FAC]', // orange -> jaune -> violet
		   textColors: 'from-gray-800 via-gray-900 to-black dark:from-white dark:via-gray-200 dark:to-dtertiary',
			shadowColor: '[#FF8904]'
		};
	} else if (totalGames >= 30 && wins >= 20) {
		rankInfo = {
			name: 'Apprenti Canard',
			level: Math.floor(wins / 8),
			image: 'duckLearning2.png',
			colors: 'from-[#FF8904] via-[#744FAC] to-[#FF8904]', // orange -> violet -> orange
		   textColors: 'from-gray-800 via-gray-900 to-black dark:from-white dark:via-gray-200 dark:to-dtertiary',
			shadowColor: '[#FF8904]'
		};
	} else if (totalGames >= 20 && wins >= 12) {
		rankInfo = {
			name: 'Professeur Palmipède',
			level: Math.floor(wins / 5),
			image: 'duckProf.png',
			colors: 'from-[#744FAC] via-[#FF8904] to-yellow-400', // violet -> orange -> jaune
		   textColors: 'from-gray-800 via-gray-900 to-black dark:from-white dark:via-gray-200 dark:to-dtertiary',
			shadowColor: '[#FF8904]'
		};
	}
	
	return `
		<div class="flex flex-col items-center justify-center group">
			<div class="relative flex justify-center items-center">
				<!-- Cercle extérieur avec effet de lueur -->
				<div class="w-32 h-32 rounded-full bg-gradient-to-br ${rankInfo.colors} p-1 shadow-2xl transition-all duration-300 group-hover:scale-110">
					<!-- Cercle intérieur -->
					<div class="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black flex items-center justify-center border-2 border-white/20">
						<!-- Image du rang -->
						<img src="/images/${rankInfo.image}" alt="${rankInfo.name} Rank Badge" class="w-20 h-20 object-contain drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
						<!-- Effet de brillance -->
						<div class="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
					</div>
				</div>

			<!-- Nom du rang -->
			<div class="ml-4 mt-4 text-center">
				<h3 class="text-2xl font-bold bg-gradient-to-r ${rankInfo.textColors} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
					${rankInfo.name}
				</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
					Level ${rankInfo.level}
				</p>
				</div>
				</div>
				`;
			}

export default async function dashboardPage(user: IUserInfo) {

	const container = renderDashboard(user);
	return container as Promise<string>;
}
