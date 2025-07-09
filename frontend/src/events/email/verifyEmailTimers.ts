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
	let resendTimeLeft = 60; // 1 minute
	const resendTimerElement = document.getElementById('resend-timer-container');
	const sendEmailButton = document.getElementById('send-email') as HTMLButtonElement;
	
	function updateResendTimer() {
		if (!resendTimerElement) return;
		const minutes = Math.floor(resendTimeLeft / 60);
		const seconds = resendTimeLeft % 60;
		resendTimerElement.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
		
		if (resendTimeLeft <= 0) {
			resendTimerElement.textContent = '0:00';
			// Réactiver le bouton
			endEmailCooldown();
			return;
		}
		
		resendTimeLeft--;
	}
	
	// Démarrer le compteur de resend dès le rendu de la page
	const resendInterval = setInterval(updateResendTimer, 1000);
	updateResendTimer(); // Affichage initial
	
	// Ajouter un listener sur le bouton pour ne permettre l'action que si le timer est à 0
	if (sendEmailButton) {
		sendEmailButton.addEventListener('click', function(e) {
			// Vérifier si le cooldown est encore actif
			if (resendTimeLeft > 0) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		});
	}
	
	// Nettoyage quand on quitte la page
	window.addEventListener('beforeunload', function() {
		clearInterval(mainInterval);
		clearInterval(resendInterval);
	});
}
