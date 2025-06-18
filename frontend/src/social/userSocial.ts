import { fetchApi } from "../api/fetch";
import { fetchToken } from "../api/fetchToken";
import { getUserInfo } from "../api/getterUser(s)";
import { API_USER } from "../api/routes";
// import { API_PEOPLE } from "../api/routes";
import { alertTemporary } from "../components/ui/alert/alertTemporary";
import { allUsersList } from "../pages/Profile/allUsersList";
import { friendsList } from "../pages/Profile/friendsList";
import { blockList } from "../pages/Profile/blockList";
import { renderErrorPage } from "../controllers/renderPage";

export async function handleUnfriend(target: HTMLElement) {
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		renderErrorPage('401');
		return;
	}

	const response = await fetchApi(API_USER.SOCIAL.FRIENDS + `/${target.dataset.id}`, {
		method: "DELETE",
		body: JSON.stringify({})
	});
	if (response.status === "error") {
		return alertTemporary("error", "issues-with-friend-removal", user.data!.preferences!.theme, true);
	}
	alertTemporary("success", "friend-removed", user.data!.preferences!.theme, true);
	target.parentElement?.parentElement?.parentElement?.remove();
	document.getElementById("all-users-div")!.innerHTML = `${await allUsersList()}`;
}

export async function handleFriendRequest(target: HTMLElement, action: "send" | "accept") {

	const user = await getUserInfo();
	if (!user || user.status === "error") {
		renderErrorPage('401');
		return;
	}

	const targetId = target.dataset.id;
	const response = await fetchApi(API_USER.SOCIAL.PENDING + `${(action == "send" ? "" : "/accept")}/${targetId}`, {
		method: "POST",
		body: JSON.stringify({
			friendId: targetId,
		})
	});
	if (response.status === "error") {

		(action === "send") ? alertTemporary("error", "issues-with-friend-invitation", user.data!.preferences!.theme, true) : alertTemporary("error", "issues-with-friend-acceptance", user.data!.preferences!.theme, true);

		return;
	}
	(action === "send") ? alertTemporary("success", "friend-invitation-sent", user.data!.preferences!.theme, true) : alertTemporary("success", "friend-invitation-accepted", user.data!.preferences!.theme, true);
	target.parentElement?.remove();
}

export async function sendRefuseInvitation(target: HTMLElement) {
	
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		return window.location.href = "/login";
	}

	const targetId = target.dataset.id;
	const response = await fetchApi(API_USER.SOCIAL.PENDING + `/refuse/${targetId}`, {
		method: "DELETE",
		body: JSON.stringify({})
	});
	if (response.status === "error") {
		return alertTemporary("error", "issues-with-invitation-refused", user.data!.preferences!.theme, true);
	}
	alertTemporary("success", "friend-invitation-refused", user.data!.preferences!.theme, true);

	target.parentElement?.remove();
	document.getElementById("all-users-div")!.innerHTML = `${await allUsersList()}`;
}

export async function cancelFriendInvitation(target: HTMLElement) {
	const user = await getUserInfo();
	const response = await fetchApi(API_USER.SOCIAL.PENDING + `/${target.dataset.id}`, {
		method: "DELETE",
		body: JSON.stringify({})
	});
	if (response.status === "error") {
		return alertTemporary("error", "issues-with-invitation-cancelled", user.data!.preferences!.theme, true);
	}
	alertTemporary("success", "friend-invitation-cancelled", user.data!.preferences!.theme, true);
	target.parentElement?.remove();
}

export async function blockUser(target: HTMLElement, isBlocking: boolean) {
	
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		window.location.href = "/login";
		return;
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