let mainInterval: number | undefined = undefined;

export function initializeVerifyEmailTimers() {
	// Gros compteur de 10 minutes (600 secondes)
	let mainTimeLeft = 600;
	const mainTimerElement = document.getElementById('main-timer');

	function updateMainTimer() {
		if (!mainTimerElement) return;
		const minutes = Math.floor(mainTimeLeft / 60);
		const seconds = mainTimeLeft % 60;
		mainTimerElement.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

		if (mainTimeLeft <= 0) {
			mainTimerElement.textContent = '0:00';
			mainTimerElement.classList.add('text-red-500');
			return;
		}

		mainTimeLeft--;
	}

	mainInterval = setInterval(updateMainTimer, 1000);
	updateMainTimer();

	window.addEventListener('beforeunload', function () {
		clearInterval(mainInterval);
	});
}

export function stopMainTimer() {
	clearInterval(mainInterval);
}
