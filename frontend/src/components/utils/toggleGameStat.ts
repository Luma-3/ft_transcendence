import { gameUserStat } from "../../pages/Dashboard/userStatDiv";

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