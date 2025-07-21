import { alertTemporary } from "../components/ui/alert/alertTemporary";
import { getCustomAlertTheme } from "../components/ui/alert/alertTheme";
import { loadTranslation } from "../controllers/Translate";
import Swal from "sweetalert2";
import { notificationList } from "./Friends/Lists/notificationsList";
import { acceptGameInvitation, friendRequest } from "../events/social/acceptInvitation";
import { cancelFriendInvitation } from "../events/social/cancelInvitation";
import { renderOtherProfilePage } from "../controllers/renderPage";
import { refuseFriendInvitation, refuseGameInvitation } from "../events/social/refusedInvitation";
import { FetchInterface } from "../api/FetchInterface";
import { updateAllLists } from "./Friends/Lists/updatersList";

export async function showNotificationDiv() {

	const customTheme = await getCustomAlertTheme();
	if (!customTheme) {
		alertTemporary("error", "Error while getting user theme", 'dark');
		return;
	}
	const trad = await loadTranslation(customTheme.lang);

	Swal.fire({
		// title: "Your Notifications",
		position: "top",
		// icon: "info",
		background: customTheme.bg,
		color: customTheme.text,
		iconColor: customTheme.icon,
		cancelButtonAriaLabel: trad['cancel'],
		cancelButtonColor: customTheme.cancelButtonColor,
		showCloseButton: true,
		showConfirmButton: false,


		html: `
				<div id="notification-content" class="flex text-responsive-size justify-center items-center font-title m-4 mt-0 ">
					${await notificationList()}
				</div>
			`,
		didOpen: () => {
			attachNotificationEvents();
		},
		willClose: async () => {
			await updateAllLists();
		}
	});
}

function attachNotificationEvents() {
	// Event listener pour accepter une invitation
	document.querySelectorAll('#accept-friend').forEach(button => {
		button.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			friendRequest(e.target as HTMLElement, "accept", "alert");
		});
	});

	// Event listener pour refuser une invitation
	document.querySelectorAll('#refuse-invitation').forEach(button => {
		button.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			refuseFriendInvitation(e.target as HTMLElement, "alert");
		});
	});

	// Event listener pour annuler une invitation
	document.querySelectorAll('#cancel-invitation').forEach(button => {
		button.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			cancelFriendInvitation(e.target as HTMLElement, "alert");
		});
	});

	document.querySelectorAll('#cancel-invitation-game').forEach(button => {
		button.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await FetchInterface.cancelGameInvitation(e.target as HTMLElement);
		});
	});

	document.querySelectorAll('#refuse-invitation-game-notif').forEach(button => {
		button.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await refuseGameInvitation(e.target as HTMLElement);
		});
	});

	document.querySelectorAll('#accept-invitation-game-notif').forEach(button => {
		button.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await acceptGameInvitation(e.target as HTMLElement);
		});
	});

	// Event listener pour voir le profil
	document.querySelectorAll('[name="otherProfile"]').forEach(button => {
		button.addEventListener('click', (e) => {
			renderOtherProfilePage(e.target as HTMLElement);
		});
	});
}