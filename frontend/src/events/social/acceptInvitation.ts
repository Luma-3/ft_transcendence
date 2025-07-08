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
	
	const success = await FetchInterface.acceptFriendRequest(user, targetId, action);
	if (!success) {
		return;
	}
	if (type === "page") {
		await updateNotificationsList();
		await updateFriendsList();
		await updateAllLists();
	} else {
		target.parentElement?.parentElement?.parentElement?.remove();
	}

}