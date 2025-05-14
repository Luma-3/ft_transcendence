import Swal, { SweetAlertIcon } from "sweetalert2";
import { getCustomAlertTheme } from "./alertTheme";

export async function alertTemporary(level: string, message: string, theme: string) {
	const customTheme = await getCustomAlertTheme(false, theme);
	if (!customTheme) {
		alertTemporary("error", "Error while getting user alert theme", 'dark');
		return;
	}
	const allowedIcons = ['success', 'error', 'warning', 'info', 'question'];
	if (!allowedIcons.includes(level)) {
		console.error(`Invalid alert level: ${level}. Allowed levels are: ${allowedIcons.join(', ')}`);
		return;
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