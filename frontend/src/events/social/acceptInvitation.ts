import { FetchInterface } from "../../api/FetchInterface";
import { renderErrorPage } from "../../controllers/renderPage";
import { updateAllLists, updateFriendsList, updateNotificationsList } from "../../pages/Friends/Lists/updatersList";

export async function friendRequest(target: HTMLElement, action: "send" | "accept", type: "alert" | "page" = "page") {

	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return renderErrorPage('401');
	}

	const targetId = target.dataset.id;
	if (!targetId) {
		return;
	}

	const success = await FetchInterface.acceptFriendRequest(targetId, action);
	if (!success) {
		return;
	}
	target.parentElement?.parentElement?.parentElement?.remove();
	setTimeout(async () => {
		if (type === "page") {
			await updateNotificationsList();
			await updateFriendsList();
			await updateAllLists();

		}
	}, 1000);
}

export async function acceptGameInvitation(target: HTMLElement) {

	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return;
	}

	const invitationId = target.dataset.id;
	if (!invitationId) {
		return;
	}

	const success = await FetchInterface.acceptGameInvitation(target);
	if (!success) {
		return;
	}

	target.parentElement?.parentElement?.parentElement?.remove();
	setTimeout(async () => {
		await updateNotificationsList();
		await updateFriendsList();
		await updateAllLists();
	}, 1000);
}