import { gameUserStat } from "../../pages/Dashboard/userStatDiv";

// export function toggleGameStat() {
	
// 	const gameStat = document.getElementById('gameStat');
// 	if (!gameStat) {
// 		return;
// 	}
// 	if (gameStat.classList.contains('-translate-x-full')) {
		
// 		gameStat.classList.remove('-translate-x-full');
// 		setTimeout(() => {
// 			gameStat.classList.remove('opacity-0');
// 			gameStat.classList.add('opacity-100');
// 		}, 100);

// 		return;
// 	}
// 	// Laisse le temps au navigateur d’appliquer les classes avant d’enlever translate/opacity
// 	gameStat.classList.add('-translate-x-full');
// 	setTimeout(() => {
// 		gameStat.classList.remove('opacity-100');
// 		gameStat.classList.add('opacity-0');
// 	}, 200);
// }


export async function toggleGameStat() {
	let screen = document.getElementById('dashboardScreen');
	if (!screen) {
		screen = document.getElementById('gameStatScreen')
		if (!screen) {
			return;
		}
		screen.innerHTML = '';
		screen.innerHTML = `<img src="/images/dashboard.png" alt="Bienvenue" class="w-50 mb-8 drop-shadow-lg" />`
		screen.setAttribute("id", "dashboardScreen");
		return;
	}
	screen.innerHTML = '';
	screen.innerHTML = gameUserStat();
	screen.setAttribute("id", "gameStatScreen");

}