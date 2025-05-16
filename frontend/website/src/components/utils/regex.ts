import { alertPublic } from "../ui/alert/alertPublic";
import { alert } from "../ui/alert/alert";


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

export function verifRegexNewPassword(password: string) {
	const regex =  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$';
	let regexExpression = new RegExp(regex);
	let match = regexExpression.test(password);
	if (!match) {
		return false;
	}
	return true;
}