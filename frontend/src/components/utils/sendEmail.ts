import { FetchInterface } from "../../api/FetchInterface";
import { initializeVerifyEmailTimers, stopMainTimer } from "./verifyEmailTimers";

import { userRegisterInfo } from "../../pages/Register";
import { userNewEmail } from "../../pages/Profile/Profile";
import { alertTemporary } from "../ui/alert/alertTemporary";

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
	const success = await FetchInterface.resendVerificationEmail(newEmail ?? "", 'en');
	if (!success) {
		return alertTemporary("error", "email-already-sent");
	}
	stopMainTimer();
	endEmailCooldown();
	startEmailCooldown();
}

export function startEmailCooldown() {
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
	emailState.isEmailCooldownActive = false;

	const sendEmailButton = document.getElementById('send-email') as HTMLButtonElement;

	if (sendEmailButton) {
		sendEmailButton.disabled = false;
		sendEmailButton.classList.remove('opacity-0', 'cursor-not-allowed', 'hidden');
		sendEmailButton.classList.add('opacity-100');
		sendEmailButton.classList.replace('dark:bg-myblack', 'dark:bg-dprimary');
	}
}
