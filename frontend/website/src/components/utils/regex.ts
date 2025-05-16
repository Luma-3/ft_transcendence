import { alertPublic } from "../ui/alert/alertPublic";

/**
 * Verification des normes etablies pour le mot de passe
 * lors du register du user
 * 
 */
export function verifRegexPassword(password: string) {
	const regex =  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$';
	
	let regexExpression = new RegExp(regex);
	let match = regexExpression.test(password);
	if (!match) {
		alertPublic("password-must-include", "error");
		return false;
	}
	return true;
}

/**
 * Verification des normes etablies pour le mot de passe
 * mais cette fois ci pas besoin d'alert car elle est gerer directement par l'alert
 * qui l'apelle
 */
export function verifRegexNewPassword(password: string) {
	const regex =  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$';
	
	let regexExpression = new RegExp(regex);
	let match = regexExpression.test(password);
	if (!match) {
		return false;
	}
	return true;
}