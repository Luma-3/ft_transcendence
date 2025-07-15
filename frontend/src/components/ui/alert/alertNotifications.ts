import Swal, { SweetAlertIcon } from "sweetalert2";

import { getCustomAlertTheme } from "./alertTheme";
import { loadTranslation } from "../../../controllers/Translate";
import { alertTemporary } from "./alertTemporary";
import { showNotificationDiv } from "../../../pages/Notifications";

export async function alertNotifications(level: string, message: string, theme: string, trad = false, duration = 4000) {
	const customTheme = await getCustomAlertTheme(true, theme);
	if (!customTheme) {
		return await alertTemporary("error", "Error while getting user alert theme", 'dark', false);
	}
	const allowedIcons = ['success', 'error', 'warning', 'info', 'question'];
	if (!allowedIcons.includes(level)) {
		return;
	}
	if (trad) {
		const trad = await loadTranslation(customTheme.lang);
		message = trad[message] || message;
	}

	return Swal.fire({
		position: "top-end",
		toast: true,
		icon: level as SweetAlertIcon,
		iconColor: customTheme.icon,
		background: customTheme.bg,
		color: customTheme.text,
		title: message,
		showConfirmButton: true,
		confirmButtonText: 'Voir notifications',
		confirmButtonColor: customTheme.confirmButtonColor || '#FF8904',
		timer: duration,
		timerProgressBar: true,
		showCloseButton: true,
		width: '350px',
		customClass: {
			popup: 'notification-alert',
			confirmButton: 'notification-button'
		},
		didRender: () => {
			const confirmButton = document.querySelector('.notification-button') as HTMLElement;
			if (confirmButton) {
				confirmButton.id = 'notifications';
			}
		},
			didOpen: () => {
				document.querySelectorAll('#notifications').forEach(button => {
				button.addEventListener('click', async (e) => {
					e.preventDefault();
					e.stopPropagation();
					showNotificationDiv();
				});
			});
			},
	});
}
