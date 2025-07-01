import { fetchApi } from "../../api/fetch";
import { getUserInfo } from "../../api/getterUser(s)";
import { API_USER } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { renderErrorPage } from "../../controllers/renderPage";
import { allUsersList } from "../../pages/Friends/Lists/allUsersList";
import { blockList } from "../../pages/Friends/Lists/blockList";

export async function blockUser(target: HTMLElement, isBlocking: boolean) {
	
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		return renderErrorPage('401');
	}

	const blockId = target.dataset.id;
	const response = await fetchApi(API_USER.SOCIAL.BLOCKED + `/${blockId}`, {
		method: (isBlocking ? "DELETE" : "POST"),
		body: JSON.stringify({})
	});
	
	if (response.status === "error") {
		return alertTemporary("error", "issues-with-user-blocked", user.data!.preferences!.theme, true);
	}

	alertTemporary("success", (isBlocking ? "user-unblocked" : "user-blocked"), user.data!.preferences!.theme, true);

	const allUsersDiv = document.getElementById("all-users-div");
	if (allUsersDiv) {
		allUsersDiv.innerHTML = `${await allUsersList()}`;
	}

	const blockListDiv = document.getElementById("block-div");
	if (blockListDiv) {
		blockListDiv.innerHTML = `${await blockList()}`;
	}

}