import { FetchInterface } from "../../api/FetchInterface";
import { renderErrorPage } from "../../controllers/renderPage";
import { allUsersList } from "../../pages/Friends/Lists/allUsersList";

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
		await allUsersList();
	} else {
		target.parentElement?.parentElement?.parentElement?.remove();
	}
}