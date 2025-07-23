import { alert } from "../ui/alert/alert";

const regex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&/\\-])[A-Za-z\\d@$!%*?&/\\-]{8,}$';

/**
 * Verification des normes etablies pour le mot de passe
 * lors du register du user
 * 
 */
export function verifRegexPassword(password: string) {

	let regexExpression = new RegExp(regex);
	let match = regexExpression.test(password);
	if (!match) {
		alert("error", "password-must-include");
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

	let regexExpression = new RegExp(regex);
	let match = regexExpression.test(password);
	return match;
}