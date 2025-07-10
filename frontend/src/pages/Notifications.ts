import { alertTemporary } from "../components/ui/alert/alertTemporary";
import { getCustomAlertTheme } from "../components/ui/alert/alertTheme";
import { loadTranslation, translatePage } from "../controllers/Translate";
import Swal from "sweetalert2";
import { notificationList } from "./Friends/Lists/notificationsList";
import { friendRequest } from "../events/social/acceptInvitation";
import { cancelFriendInvitation } from "../events/social/cancelInvitation";
import { renderOtherProfilePage } from "../controllers/renderPage";
import { refuseFriendInvitation } from "../events/social/refusedInvitation";

export async function showNotificationDiv() {

		const customTheme = await getCustomAlertTheme();
		if (!customTheme) {
			alertTemporary("error", "Error while getting user theme", 'dark');
			return;
		}
		console.log("customTheme in notificationsDiv", customTheme);
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
			willClose: () => {
				window.location.reload();
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

		// Event listener pour voir le profil
		document.querySelectorAll('[name="otherProfile"]').forEach(button => {
				button.addEventListener('click', (e) => {
					renderOtherProfilePage(e.target as HTMLElement);
				});
		});
}