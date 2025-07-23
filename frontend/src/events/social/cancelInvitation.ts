import { FetchInterface } from "../../api/FetchInterface";

import { updateAllUserLists, updateNotificationAlert, updateNotificationsList } from "../../pages/Friends/Lists/updatersList";

export async function cancelFriendInvitation(target: HTMLElement, type: "alert" | "page" = "page") {
	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return;
	}
	const friendId = target.dataset.id;
	if (!friendId) {
		return;
	}

	const success = FetchInterface.cancelFriendRequest(friendId)
	if (!success) {
		return;
	}
	if (type === "page") {
		await updateNotificationAlert();
		await updateNotificationsList();
		await updateAllUserLists();
	} else {
		target.parentElement?.parentElement?.parentElement?.remove();
	}
}
