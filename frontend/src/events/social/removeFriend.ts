import { FetchInterface } from "../../api/FetchInterface";
import { renderErrorPage } from "../../controllers/renderPage";
import { updateAllLists } from "../../pages/Friends/Lists/updatersList";
// import { updateAllUserLists, updateFriendsList } from "../../pages/Friends/Lists/updatersList";

export async function unfriendUser(target: HTMLElement) {

	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return renderErrorPage('401');
	}
	const friendId = target.dataset.id;
	if (!friendId) {
		return;
	}

	const success = FetchInterface.removeFriend(user, friendId)
	if (!success) {
		return;
	}
	target.parentElement?.parentElement?.parentElement?.remove();
	setTimeout(async () => {
		await updateAllLists();
	}, 1000);
	// await updateFriendsList();
	// await updateAllUserLists();
}