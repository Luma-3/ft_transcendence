import Swal from "sweetalert2";

import { getCustomAlertTheme } from "./alertTheme";
import { loadTranslation } from "../../../controllers/Translate";
import { FetchInterface } from "../../../api/FetchInterface";
import { updateNotificationsList } from "../../../pages/Friends/Lists/updatersList";

export async function alertNotificationsGames(data: any) {
	const customTheme = await getCustomAlertTheme(true);
	if (!customTheme) {
		return;
	}

	await updateNotificationsList();
	const trad = await loadTranslation(customTheme.lang);

	return Swal.fire({
		position: "top-end",
		toast: true,
		icon: "info",
		iconColor: customTheme.icon,
		background: customTheme.bg,
		color: customTheme.text,
		title: trad["someone-invited-you-to-play-a-game"],
		showConfirmButton: true,
		confirmButtonText: trad['accept-invitation-game'],
		confirmButtonColor: customTheme.confirmButtonColor || '#FF8904',
		timer: 3000,
		timerProgressBar: true,
		showCloseButton: true,
		width: '350px',
		customClass: {
			popup: 'notification-game--alert',
			confirmButton: 'accept-invitation-game',
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
