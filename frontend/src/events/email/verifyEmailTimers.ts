// Gestionnaire des compteurs de la page de vérification d'email

import { endEmailCooldown } from '../../components/utils/sendEmail';

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
	
	// Démarrer le compteur principal
	const mainInterval = setInterval(updateMainTimer, 1000);
	updateMainTimer(); // Affichage initial
	
	// Petit compteur de 1 minute pour le bouton
	let resendTimeLeft = 0;
	let resendInterval: number | null = null;
	const resendTimerElement = document.getElementById('resend-timer');
	const sendEmailButton = document.getElementById('send-email') as HTMLButtonElement;
	
	function updateResendTimer() {
		if (!resendTimerElement) return;
		const minutes = Math.floor(resendTimeLeft / 60);
		const seconds = resendTimeLeft % 60;
		resendTimerElement.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
		
		if (resendTimeLeft <= 0) {
			// Réactiver le bouton
			endEmailCooldown();
			if (resendInterval) {
				clearInterval(resendInterval);
				resendInterval = null;
			}
			return;
		}
		
		resendTimeLeft--;
	}
	
	function startResendCooldown() {
		resendTimeLeft = 60; // 1 minute
		resendInterval = setInterval(updateResendTimer, 1000) as unknown as number;
		updateResendTimer(); // Affichage initial
	}
	
	// Écouter l'événement de démarrage du cooldown
	window.addEventListener('startResendCooldown', startResendCooldown);
	
	// Ajouter aussi un listener direct sur le bouton pour s'assurer qu'il fonctionne
	if (sendEmailButton) {
		sendEmailButton.addEventListener('click', function(e) {
			// Vérifier si le bouton est déjà désactivé pour éviter les double-clics
			if (sendEmailButton.disabled) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		});
	}
	
	// Nettoyage quand on quitte la page
	window.addEventListener('beforeunload', function() {
		clearInterval(mainInterval);
		if (resendInterval) {
			clearInterval(resendInterval);
		}
		window.removeEventListener('startResendCooldown', startResendCooldown);
	});
}
