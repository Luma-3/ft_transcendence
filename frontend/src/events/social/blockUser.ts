import { FetchInterface } from "../../api/FetchInterface";
import { updateAllUserLists, updateBlockList, updateFriendsList } from "../../pages/Friends/Lists/updatersList";

export async function blockUser(target: HTMLElement, isBlocking: boolean) {
	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return;
	}

	const blockId = target.dataset.id;
	if (!blockId) {
		return;
	}

	const success = await FetchInterface.blockUser(blockId, isBlocking);
	if (!success) {
		return;
	}
	target.parentElement?.parentElement?.remove();
	await updateAllUserLists();
	await updateFriendsList();
	await updateBlockList();

}