import { FetchInterface } from "../../api/FetchInterface";
import { initializeVerifyEmailTimers } from "../../events/email/verifyEmailTimers";

import { userRegisterInfo } from "../../pages/Register";
import { alertPublic } from "../ui/alert/alertPublic";

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
	
	if (!userRegisterInfo || !userRegisterInfo.email || !userRegisterInfo.lang) {
		alertPublic("error", "Email or language not set. Please redo the registration form.");
		return;
	}
	const success = await FetchInterface.resendVerificationEmail(userRegisterInfo.email, userRegisterInfo.lang);
	console.log("Email sent successfully:", success);
	if (!success) {
		return alertPublic("error", "email-already-sent");
	}
	startEmailCooldown();
}

export function startEmailCooldown() {
	console.log("Starting email cooldown...");
	emailState.isEmailCooldownActive = true;
	
	const sendEmailButton = document.getElementById('send-email') as HTMLButtonElement;
	
	if (sendEmailButton) {
		sendEmailButton.disabled = true;
		sendEmailButton.classList.add('opacity-0','hidden','cursor-not-allowed');
	}
	setTimeout(() => {
		initializeVerifyEmailTimers();
	}, 100);

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
