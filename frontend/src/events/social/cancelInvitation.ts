import { FetchInterface } from "../../api/FetchInterface";

import { renderErrorPage } from "../../controllers/renderPage";
import { updateAllUserLists, updateNotificationAlert, updateNotificationsList } from "../../pages/Friends/Lists/updatersList";

export async function cancelFriendInvitation(target: HTMLElement, type: "alert" | "page" = "page") {
const user = await FetchInterface.getUserInfo();
if (!user) {
	return renderErrorPage('401');
}
const friendId = target.dataset.id;
if (!friendId) {
	return;
}

const success = FetchInterface.cancelFriendRequest(user, friendId)
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
