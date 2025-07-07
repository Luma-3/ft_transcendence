import { navbar } from "../../components/ui/navbar";
import { IUserInfo } from "../../interfaces/IUser";
import { gameTypes } from "./gameTypeButton";
import { Button } from "../../classes/Button";

async function renderDashboard(user: IUserInfo) {

	const playButton = new Button('initGame', "1/2", "Play", "play", "primary", "button" );

return `
${navbar(user)}
<div class="flex flex-col h-full w-full lg:flex-row space-y-4 justify-center items-center pt-10 mb-10">

	<div class="flex flex-col lg:flex-row max-w-[1200px]">

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

			

			<label for="player1-name" class="text-xl font-title dark:text-dtertiary mb-4" translate="">Choose your name for the next game
			</label>
				
			<input type="text" id="player1-name" class="w-1/2 p-2 font-title  dark:text-dtertiary border-2 border-zinc-300 rounded-lg" translate="username" placeholder="username" value=${user.username} />

				${gameTypes()}

				<div class="flex w-full justify-center items-center mb-10">
				
					${playButton.primaryButton()}
				
				</div>
			
			</div> <!--! Fermeture main Panel -->

		</div>
	</div>
</div>
	`
}

function generateRankBadge(_user: IUserInfo) {
	const wins = Math.floor(Math.random() * 50) + 5; // Données d'exemple
	const losses = Math.floor(Math.random() * 30) + 2; // Données d'exemple
	const totalGames = wins + losses;
	
	let rankInfo = {
		name: 'Petit Volatile',
		level: 1,
		image: 'petitVolatile.png',
		colors: 'from-purple-600 via-purple-700 to-purple-800',
		textColors: 'from-tertiary via-gray-800 to-tertiary dark:from-dtertiary dark:via-white dark:to-dtertiary',
		shadowColor: 'purple'
	};
	
	if (totalGames >= 50 && wins >= 30) {
		rankInfo = {
			name: 'Roi de la Mare',
			level: Math.floor(wins / 10),
			image: 'duckHappy.png',
			colors: 'from-yellow-400 via-yellow-500 to-yellow-600',
			textColors: 'from-dsecondary via-yellow-600 to-orange-700 dark:from-dsecondary dark:via-yellow-400 dark:to-yellow-600',
			shadowColor: 'yellow'
		};
	} else if (totalGames >= 30 && wins >= 20) {
		rankInfo = {
			name: 'Caneton',
			level: Math.floor(wins / 8),
			image: 'caneton.png',
			colors: 'from-gray-200 via-gray-300 to-gray-500',
			textColors: 'from-tertiary via-gray-700 to-gray-900 dark:from-gray-300 dark:via-gray-100 dark:to-dtertiary',
			shadowColor: 'gray'
		};
	} else if (totalGames >= 20 && wins >= 12) {
		rankInfo = {
			name: 'Canard',
			level: Math.floor(wins / 5),
			image: 'duckNormal.png',
			colors: 'from-yellow-400 via-orange-500 to-red-600',
			textColors: 'from-red-700 via-dsecondary to-red-800 dark:from-dsecondary dark:via-orange-400 dark:to-yellow-500',
			shadowColor: 'yellow'
		};
	}
	
	return `
		<div class="flex flex-col items-center justify-center group">
			<div class="relative flex justify-center items-center">
				<!-- Cercle extérieur avec effet de lueur -->
				<div class="w-32 h-32 rounded-full bg-gradient-to-br ${rankInfo.colors} p-1 shadow-2xl group-hover:shadow-${rankInfo.shadowColor}-500/50 transition-all duration-300 group-hover:scale-110">
					<!-- Cercle intérieur -->
					<div class="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black flex items-center justify-center border-2 border-${rankInfo.shadowColor}-400/30">
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
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1 group-hover:text-${rankInfo.shadowColor}-400 transition-colors duration-300">
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
