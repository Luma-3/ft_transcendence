export function toggleChat() {
	
	const gameStat = document.getElementById('chat');
	if (!gameStat) {
		return;
	}

	if (gameStat.classList.contains('-translate-x-full')) {
		gameStat.classList.remove('-translate-x-full');
		gameStat.classList.replace('absolute', 'flex')
		gameStat.classList.replace('opacity-0', 'opacity-100')
		return;
	}
		gameStat.classList.replace('opacity-100', 'opacity-0')
		gameStat.classList.add('-translate-x-full');
	setTimeout(() => {
		gameStat.classList.replace('flex', 'absolute')
	}, 300);
}