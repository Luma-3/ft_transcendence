import Swal, { SweetAlertIcon } from "sweetalert2";
import { getCustomAlertTheme } from "./alertTheme";
import { loadTranslation } from "../../../controllers/Translate";

export async function alertTemporary(level: string, message: string, needUser = false) {

	const customTheme = await getCustomAlertTheme(needUser);
	if (!customTheme) {
		await alertTemporary(level, message, false);
		return;
	}

	const allowedIcons = ['success', 'error', 'warning', 'info', 'question'];
	if (!allowedIcons.includes(level)) {
		return;
	}

	const trad = await loadTranslation(customTheme.lang ?? 'en');
	message = trad[message] || message;

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