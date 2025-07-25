import { FetchInterface } from "../../api/FetchInterface";
import { loadTranslation } from "../../controllers/Translate";
import { IUserInfo } from "../../interfaces/IUser";

export interface IRankInfo {
  wins: number;
  losses: number;
  totalGames: number;
  rank: number;
}

export async function generateRankBadge(_user: IUserInfo, myUserLang: string = 'en') {

  const trad = await loadTranslation(myUserLang);

  const ranks = await FetchInterface.getRank(_user.id) as IRankInfo;

  let rankInfo = {
    name: trad['petit-volatile'],
    image: 'petitVolatile2.png',
    colors: 'from-[#744FAC] via-[#8B5CF6] to-[#744FAC]', // violet principal
    textColors: 'from-gray-800 via-gray-900 to-black dark:from-white dark:via-gray-200 dark:to-dtertiary',
    shadowColor: '[#744FAC]'
  };

  if (ranks) {
    if (ranks.rank > 0.25) {
      rankInfo = {
        name: trad['apprenti-canard'],
        image: 'duckLearning2.png',
        colors: 'from-[#FF8904] via-[#744FAC] to-[#FF8904]', // orange -> violet -> orange
        textColors: 'from-gray-800 via-gray-900 to-black dark:from-white dark:via-gray-200 dark:to-dtertiary',
        shadowColor: '[#FF8904]'
      };
    } else if (ranks.rank > 0.5) {
      rankInfo = {
        name: trad['professeur-palmipède'],
        image: 'duckProf.png',
        colors: 'from-[#744FAC] via-[#FF8904] to-yellow-400', // violet -> orange -> jaune
        textColors: 'from-gray-800 via-gray-900 to-black dark:from-white dark:via-gray-200 dark:to-dtertiary',
        shadowColor: '[#FF8904]'
      };
    } else if (ranks.rank > 0.75) {
      rankInfo = {
        name: trad['roi-de-la-mare'],
        image: 'duckKing.png',
        colors: 'from-[#FF8904] via-yellow-400 to-[#744FAC]', // orange -> jaune -> violet
        textColors: 'from-gray-800 via-gray-900 to-black dark:from-white dark:via-gray-200 dark:to-dtertiary',
        shadowColor: '[#FF8904]'
      };
    }
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
					<img src="/images/trophy.png" alt="Trophy Icon" class="inline-block invert w-4 h-4 mr-1" />
					${(ranks && ranks.wins) ? ranks.wins : 0}
          <span class="mx-1">/</span>
          <img src="/images/lose.png" alt="Defeat Icon" class="inline-block invert w-5 h-5 mr-1" />
          ${(ranks && ranks.losses) ? ranks.losses : 0}
				</p>
  </div>
  </div>
    `;
}
