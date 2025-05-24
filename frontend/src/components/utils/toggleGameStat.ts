export function toggleGameStat() {
	
	const gameStat = document.getElementById('gameStat');
	if (!gameStat) {
		return;
	}
	if (gameStat.classList.contains('-translate-x-full')) {
		
		gameStat.classList.remove('-translate-x-full');
		setTimeout(() => {
			gameStat.classList.remove('opacity-0');
			gameStat.classList.add('opacity-100');
		}, 100);

		return;
	}
	// Laisse le temps au navigateur d’appliquer les classes avant d’enlever translate/opacity
	gameStat.classList.add('-translate-x-full');
	setTimeout(() => {
		gameStat.classList.remove('opacity-100');
		gameStat.classList.add('opacity-0');
	}, 200);
}