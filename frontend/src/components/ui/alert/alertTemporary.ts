import Swal, { SweetAlertIcon } from "sweetalert2";
import { getCustomAlertTheme } from "./alertTheme";
import { loadTranslation } from "../../../controllers/Translate";

export async function alertTemporary(level: string, message: string, theme: string, needUser = true, trad = false) {

	const customTheme = await getCustomAlertTheme(needUser, theme);
	if (!customTheme) {
		await alertTemporary(level, message, "dark", false, true);
		return;
	}
	const allowedIcons = ['success', 'error', 'warning', 'info', 'question'];
	if (!allowedIcons.includes(level)) {
		console.error(`Invalid alert level: ${level}. Allowed levels are: ${allowedIcons.join(', ')}`);
		return;
	}
	if (trad) {
		const trad = await loadTranslation(customTheme.lang);
		message = trad[message] || message;
	}

	return Swal.fire({
		position: "center-end",
		toast: true,
		icon: level as SweetAlertIcon,
		iconColor: customTheme.icon,
		background: customTheme.bg,
		color: customTheme.text,
		title: message,
		showConfirmButton: false,
		timer: 2000
		});
}