import { FetchInterface } from "../../api/FetchInterface";
import { renderErrorPage } from "../../controllers/renderPage";
import { updateAllUserLists, updateBlockList, updateFriendsList } from "../../pages/Friends/Lists/updatersList";

export async function blockUser(target: HTMLElement, isBlocking: boolean) {
const user = await FetchInterface.getUserInfo();
if (!user) {
	return renderErrorPage('401');
}

const blockId = target.dataset.id;
if (!blockId) {
	return;
}

const success = await FetchInterface.blockUser(user, blockId, isBlocking);
if (!success) {
	return;
}
target.parentElement?.parentElement?.remove();
await updateAllUserLists();
await updateFriendsList();
await updateBlockList();

}