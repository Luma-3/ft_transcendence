export function toggleTruc() {
	const gameStat = document.getElementById('truc');
	if (!gameStat) {
		return;
	}

	if (gameStat.classList.contains('-translate-x-full')) {
		gameStat.classList.remove('opacity-0');
		gameStat.classList.add('opacity-100');
		gameStat.classList.remove('absolute');
		gameStat.classList.add('flex');
		gameStat.classList.remove('-translate-x-full');
		return;
	}
	// Laisse le temps au navigateur d’appliquer les classes avant d’enlever translate/opacity
	gameStat.classList.add('-translate-x-full');
	setTimeout(() => {
		gameStat.classList.remove('opacity-100');
		gameStat.classList.add('opacity-0');
		gameStat.classList.remove('flex');
		gameStat.classList.add('absolute');
	}, 300);
}