import { fetchApi } from "../../api/fetch";
import { FetchInterface } from "../../api/FetchInterface";
import { API_GAME } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { loadTranslation } from "../../controllers/Translate";
import { IUserInfo } from "../../interfaces/IUser";


export async function generateLastGames(user: IUserInfo, myUserlang: string, userId: string = user.id) {

	const response = await fetchApi(API_GAME.GET_ALL_DATA + `/${userId}`, {
		method: 'GET'
	});
	if (!response || !response.data) {
		return alertTemporary("error", "error-game-data", true);
	}

	const games = response.data.rooms;
	const trad = await loadTranslation(myUserlang);

	if (games.length === 0) {
		return `<div class="w-full font-title max-w-[600px] h-64 bg-white/80 dark:bg-black/5 rounded-lg shadow-inner flex flex-col items-center justify-center mb-6 overflow-y-auto">
		<div class="text-gray-400 italic">${trad['no-recent-games']}</div>
	</div>`;
	}
	let container = `<div class="w-full max-w-[600px] h-64 bg-white/80 dark:bg-black/5 rounded-lg shadow-inner mb-6 overflow-y-auto p-4 flex flex-col">
		<h4 class="text-lg font-bold mb-2 text-gray-700 dark:text-dtertiary">${trad['last-games']}</h4>
		<ul class="flex flex-col gap-2">`;

	for (const game of games) {

		let win = false;
		let opponent = '';

		win = (game.winner === user.id) ? true : false;
		(game.player_1 === user.id) ? opponent = game.player_2 : opponent = game.player_1;
		switch (game.type) {
			case 'local':
				opponent = "Local";
				break;
			case 'ai':
				opponent = "IA";
				break;
			default: {
				const opponentInfo = await FetchInterface.getOtherUserInfo(opponent);
				if (opponentInfo) {
					opponent = opponentInfo.username;
				} else {
					opponent = "Unknown";
				}
			}
		}

		container += `
		<li class="flex items-center justify-between bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-md px-3 py-2 shadow-sm">
			<div class="flex flex-col">
				<span class="font-semibold text-primary dark:text-dsecondary">vs ${opponent}</span>
				</div>
				<div class="flex items-center gap-2">
				<span class="font-mono text-lg">${game.score_2}-${game.score_1}</span>
				<span class="px-2 py-1 rounded text-md font-bold ${win ? ' text-green-500' : ' text-red-700'}">
				${win ? trad['win'] : trad['lose']}
				</span>
				</div>
				</li>`;
	}

	container += `
		</ul>
	</div>
	`;
	return container;
}