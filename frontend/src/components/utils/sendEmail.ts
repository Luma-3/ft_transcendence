import { fetchApiWithNoError } from "../../api/fetch";
import { MODULE_TWOFA } from "../../api/routes";

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
	console.log("Cooldown state:", emailState.isEmailCooldownActive);
	
	if (emailState.isEmailCooldownActive) {
		alertTemporary("warning", "Please wait before sending another email", "dark");
		return;
	}

	const response = await fetchApiWithNoError(MODULE_TWOFA.RESEND_EMAIL, {
		method: 'POST',
		body: JSON.stringify({ email: userRegisterInfo?.email, lang: userRegisterInfo?.lang ?? 'en' })
	})

	if (response.status === "error") {
		alertTemporary("error", "Email already sent", "dark");
		console.log(response.details);
		return;
	}

	alertTemporary("success", "Email sent succefully", "dark");
	
	// Déclencher le cooldown après envoi réussi
	startEmailCooldown();
}

export function startEmailCooldown() {
	console.log("Starting email cooldown...");
	emailState.isEmailCooldownActive = true;
	
	const sendEmailButton = document.getElementById('send-email') as HTMLButtonElement;
	
	if (sendEmailButton) {
		sendEmailButton.disabled = true;
		sendEmailButton.classList.add('opacity-50', 'cursor-not-allowed');
		console.log("Button disabled");
	}
	
	// Réactiver après 1 minute (60000ms)
	setTimeout(() => {
		endEmailCooldown();
	}, 60000);
}

export function endEmailCooldown() {
	console.log("Ending email cooldown...");
	emailState.isEmailCooldownActive = false;
	
	const sendEmailButton = document.getElementById('send-email') as HTMLButtonElement;
	
	if (sendEmailButton) {
		sendEmailButton.disabled = false;
		sendEmailButton.classList.remove('opacity-50', 'cursor-not-allowed');
		console.log("Button re-enabled");
	}
}
