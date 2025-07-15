import { FetchInterface } from "../../api/FetchInterface";
import { initializeVerifyEmailTimers, stopMainTimer } from "../../events/email/verifyEmailTimers";

import { userRegisterInfo } from "../../pages/Register";
import { alertPublic } from "../ui/alert/alertPublic";
import { userNewEmail } from "../../pages/Profile/Profile";
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
	let newEmail = userRegisterInfo?.email;
	if (!newEmail) {
		newEmail = userNewEmail || "";
	}
	//TODO: Add GetUserInfo 
	const success = await FetchInterface.resendVerificationEmail(newEmail ?? "", 'en');
	if (!success) {
		return alertPublic("error", "email-already-sent");
	}
	endEmailCooldown();
	startEmailCooldown();
}

export function startEmailCooldown() {
	console.log("Starting email cooldown");
	emailState.isEmailCooldownActive = true;

	const sendEmailButton = document.getElementById('send-email') as HTMLButtonElement;

	if (sendEmailButton) {
		sendEmailButton.disabled = true;
		sendEmailButton.classList.add('opacity-0', 'hidden', 'cursor-not-allowed');
	}
	setTimeout(() => {
		initializeVerifyEmailTimers();
	}, 10);

	setTimeout(() => {
		endEmailCooldown();
	}, 60000);
}

export function endEmailCooldown() {
	stopMainTimer();
	console.log("Ending email cooldown");
	emailState.isEmailCooldownActive = false;

	const sendEmailButton = document.getElementById('send-email') as HTMLButtonElement;

	if (sendEmailButton) {
		sendEmailButton.disabled = false;
		sendEmailButton.classList.remove('opacity-0', 'cursor-not-allowed', 'hidden');
		sendEmailButton.classList.add('opacity-100');
		sendEmailButton.classList.replace('dark:bg-myblack', 'dark:bg-dprimary');
	}
}
