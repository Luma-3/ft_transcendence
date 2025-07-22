import Swal, { SweetAlertIcon } from "sweetalert2";

import { getCustomAlertTheme } from "./alertTheme";
import { loadTranslation } from "../../../controllers/Translate";
import { showNotificationDiv } from "../../../pages/Notifications";

export async function alertNotificationsFriends(level: string, message: string, duration = 4000) {
	const customTheme = await getCustomAlertTheme(true);
	if (!customTheme) {
		return;
	}
	const allowedIcons = ['success', 'error', 'warning', 'info', 'question'];
	if (!allowedIcons.includes(level)) {
		return;
	}

	const trad = await loadTranslation(customTheme.lang);

	return Swal.fire({
		position: "top-end",
		toast: true,
		icon: level as SweetAlertIcon,
		iconColor: customTheme.icon,
		background: customTheme.bg,
		color: customTheme.text,
		title: message,
		showConfirmButton: true,
		confirmButtonText: trad['see-notifications'],
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
