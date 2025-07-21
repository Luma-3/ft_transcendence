import { FetchInterface } from "../../api/FetchInterface";
import { renderErrorPage } from "../../controllers/renderPage";
import { allUsersList } from "../../pages/Friends/Lists/allUsersList";
import { updateAllLists } from "../../pages/Friends/Lists/updatersList";

export async function refuseFriendInvitation(target: HTMLElement, type: "alert" | "page" = "page") {

	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return renderErrorPage('401');
	}
	const friendId = target.dataset.id;
	if (!friendId) {
		return;
	}

	const success = FetchInterface.removeFriendRequest(user, friendId)
	if (!success) {
		return;
	}

	if (type === "page") {
		setTimeout(async () => {
			await updateAllLists();
		}, 1000);
	} else {
		target.parentElement?.parentElement?.parentElement?.remove();
	}
}


export async function refuseGameInvitation(target: HTMLElement) {

	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return renderErrorPage('401');
	}

	const invitationId = target.dataset.id;
	if (!invitationId) {
		return;
	}

	const success = await FetchInterface.refuseGameInvitation(target);
	if (!success) {
		return;
	}
	target.parentElement?.parentElement?.parentElement?.remove();
}