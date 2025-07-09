import { fetchApiWithNoError } from "../../api/fetch";
import { FetchInterface } from "../../api/FetchInterface";
import { MODULE_TWOFA } from "../../api/routes";
import { renderPublicPage } from "../../controllers/renderPage";

import { userRegisterInfo } from "../../pages/Register";
import { alertTemporary } from "../ui/alert/alertTemporary";

// Objet pour gérer le cooldown (référence partagée)
const emailState = {
	isEmailCooldownActive: false
};

export function getEmailCooldownState() {
	return emailState.isEmailCooldownActive;
}

export function setEmailCooldownState(value: boolean) {
	emailState.isEmailCooldownActive = value;
}

export async function sendEmail() {
	
	if (emailState.isEmailCooldownActive) {
		alertTemporary("warning", "Please wait before sending another email", "dark");
		return;
	}
	if (!userRegisterInfo || !userRegisterInfo.email || !userRegisterInfo.lang) {
		alertTemporary("error", "Email or language not set. Please redo the registration form.", "dark");
		return;
	}
	const success = await FetchInterface.resendVerificationEmail(userRegisterInfo.email, userRegisterInfo.lang);
	if (!success) {
		renderPublicPage('verifyEmail');
		return;
	}
	// Déclencher le cooldown après envoi réussi
	startEmailCooldown();
	renderPublicPage('verifyEmail');
}

export function startEmailCooldown() {
	console.log("Starting email cooldown...");
	emailState.isEmailCooldownActive = true;
	
	const sendEmailButton = document.getElementById('send-email') as HTMLButtonElement;
	
	if (sendEmailButton) {
		sendEmailButton.disabled = true;
		sendEmailButton.classList.add('opacity-50', 'cursor-not-allowed');
	}
	
	// Réactiver après 1 minute (60000ms)
	setTimeout(() => {
		endEmailCooldown();
	}, 60000);
}

export function endEmailCooldown() {
	emailState.isEmailCooldownActive = false;
	
	const sendEmailButton = document.getElementById('send-email') as HTMLButtonElement;
	
	if (sendEmailButton) {
		sendEmailButton.disabled = false;
		sendEmailButton.classList.remove('opacity-0', 'cursor-not-allowed', 'hidden');
		sendEmailButton.classList.add('opacity-100');
		sendEmailButton.classList.replace('dark:bg-myblack', 'dark:bg-dprimary');
	}
}
