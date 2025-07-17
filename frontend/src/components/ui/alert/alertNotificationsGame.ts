import Swal, { SweetAlertIcon } from "sweetalert2";

import { getCustomAlertTheme } from "./alertTheme";
import { loadTranslation } from "../../../controllers/Translate";
import { alertTemporary } from "./alertTemporary";
import { showNotificationDiv } from "../../../pages/Notifications";
import { FetchInterface } from "../../../api/FetchInterface";
import { updateNotificationsList } from "../../../pages/Friends/Lists/updatersList";

export async function alertNotificationsGames(data: any) {
	console.log("alertNotificationsGames data:", data);
	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return alertTemporary("error", "error-while-getting-user-info", 'dark', false, false);
	}
	const customTheme = await getCustomAlertTheme(true, user.preferences.theme);
	if (!customTheme) {
		return await alertTemporary("error", "Error while getting user alert theme", 'dark', false);
	}
	await updateNotificationsList();
	
	const trad = await loadTranslation(customTheme.lang);
		// const message = trad[message] || message;
	//TODO: Traduction
	return Swal.fire({
		position: "top-end",
		toast: true,
		icon: "info",
		iconColor: customTheme.icon,
		background: customTheme.bg,
		color: customTheme.text,
		title: "Someone invited you to play a game!",
		showConfirmButton: true,
		confirmButtonText: 'Accept Invitation',
		confirmButtonColor: customTheme.confirmButtonColor || '#FF8904',
		timer: 3000,
		timerProgressBar: true,
		showCloseButton: true,
		width: '350px',
		customClass: {
			popup: 'notification-game--alert',
			confirmButton: 'accept-invitation-game'
		},
		didRender: () => {
			const confirmButton = document.querySelector('.accept-invitation-game') as HTMLElement;
			if (confirmButton) {
				confirmButton.id = 'Play';
			}
		},
			didOpen: () => {
				document.querySelectorAll('#Play').forEach(button => {
				button.addEventListener('click', async (e) => {
					e.preventDefault();
					e.stopPropagation();
					FetchInterface.acceptGameInvitation(undefined, data);
				});
			});
			},
	});
}
